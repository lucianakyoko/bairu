# CON-002 — Domain and Data Conventions

## 1. Objetivo

Este documento estabelece as convenções utilizadas para modelagem do domínio e dos dados persistidos pelo Bairu.

Seu objetivo é garantir consistência na definição de entidades, relacionamentos, identificadores, nomenclatura, auditoria, exclusão de registros, valores controlados e dados derivados.

Estas convenções devem ser consideradas na criação ou alteração de qualquer entidade persistente da plataforma.

---

## 2. Princípios de Modelagem

A modelagem de dados deve refletir os conceitos e regras reais do domínio.

Os seguintes princípios devem ser observados:

### 2.1. Domínio como fonte da modelagem

Entidades e relacionamentos devem representar conceitos relevantes para o negócio, e não apenas estruturas técnicas necessárias ao banco de dados.

### 2.2. Single Source of Truth

Cada informação deve possuir uma única fonte de verdade.

Dados duplicados ou derivados somente devem existir quando houver uma justificativa clara, principalmente relacionada a desempenho.

### 2.3. Responsabilidade única

Cada entidade deve representar um conceito bem definido.

Informações pertencentes a diferentes conceitos não devem ser agrupadas apenas por conveniência.

### 2.4. Integridade dos dados

Regras que podem ser garantidas pelo banco devem utilizar mecanismos de integridade apropriados, como:

- `NOT NULL`;
- `UNIQUE`;
- `FOREIGN KEY`;
- `CHECK`;
- índices;
- constraints.

Regras que dependem de contexto ou comportamento devem permanecer na camada de domínio.

### 2.5. Evolução incremental

A modelagem deve ser suficiente para atender às necessidades atuais sem antecipar estruturas que ainda não possuem uso concreto.

---

## 3. Convenções de Nomenclatura

### 3.1. Classes

Classes devem utilizar `PascalCase` e nomes no singular.

| Elemento   | Convenção                 | Exemplo              |
| ---------- | ------------------------- | -------------------- |
| Entidade   | PascalCase singular       | `CompanyCatalogItem` |
| DTO        | PascalCase + `Dto`        | `CreateCompanyDto`   |
| Controller | PascalCase + `Controller` | `CompanyController`  |
| Service    | PascalCase + `Service`    | `FeedService`        |
| Repository | PascalCase + `Repository` | `CompanyRepository`  |
| Enum       | PascalCase                | `CompanyStatus`      |

### 3.2. Banco de Dados

Objetos persistidos devem utilizar `snake_case`.

| Elemento          | Convenção                  | Exemplo                                |
| ----------------- | -------------------------- | -------------------------------------- |
| Tabela            | `snake_case` plural        | `company_catalog_items`                |
| Coluna            | `snake_case`               | `created_at`                           |
| Chave estrangeira | `<entity>_id`              | `company_id`                           |
| Índice            | `idx_<table>_<column>`     | `idx_company_catalog_items_company_id` |
| Foreign Key       | `fk_<table>_<column>`      | `fk_company_catalog_items_company_id`  |
| Unique Constraint | `uq_<table>_<column>`      | `uq_companies_slug`                    |
| Check Constraint  | `ck_<table>_<description>` | `ck_companies_rating_range`            |

As entidades da aplicação permanecem no singular, enquanto as tabelas do banco utilizam plural.

---

## 4. Identificadores

Todas as entidades persistentes devem utilizar UUID como identificador primário.

Exemplo:

```text
id UUID
```

O UUID foi adotado por:

- não expor diretamente a quantidade de registros;
- reduzir colisões em ambientes distribuídos;
- facilitar sincronizações;
- permitir geração de identificadores sem depender exclusivamente do banco;
- adequar-se à evolução futura da arquitetura.

O identificador primário não deve possuir significado de negócio.

Quando uma entidade possuir um identificador funcional, como slug ou código público, ele deve ser modelado separadamente.

---

## 5. Chaves Estrangeiras

Relacionamentos entre entidades devem ser representados por chaves estrangeiras.

Exemplo:

```text
company_id UUID
```

Quando o relacionamento for obrigatório, a chave estrangeira deverá ser `NOT NULL`.

Quando o relacionamento for opcional, sua nulabilidade deverá representar explicitamente essa regra.

Foreign Keys devem ser utilizadas para preservar a integridade referencial do banco.

---

## 6. Auditoria

Entidades persistentes devem possuir campos de auditoria quando fizer sentido para seu ciclo de vida.

### 6.1. Campos padrão

| Campo        | Utilização                                   |
| ------------ | -------------------------------------------- |
| `created_at` | Momento de criação                           |
| `updated_at` | Momento da última alteração                  |
| `deleted_at` | Momento da exclusão lógica, quando aplicável |

`created_at` e `updated_at` são recomendados para entidades persistentes que possuam ciclo de vida operacional.

`deleted_at` somente deve existir quando a entidade utilizar Soft Delete.

### 6.2. Auditoria de usuário

Campos como:

```text
created_by
updated_by
deleted_by
```

podem ser utilizados quando houver necessidade de rastreabilidade de ações realizadas por usuários.

Esses campos não devem ser adicionados automaticamente a todas as entidades.

A necessidade deve ser avaliada de acordo com o domínio e os requisitos de auditoria.

---

## 7. Estratégia de Exclusão

A estratégia de exclusão deve refletir o significado da entidade no domínio.

### 7.1. Hard Delete

Utilizar quando o registro não possuir valor histórico ou quando sua existência deixar de fazer sentido.

Exemplos:

- relacionamentos simples;
- dados temporários;
- exceções de agenda após seu período de validade.

### 7.2. Soft Delete

Utilizar quando o registro puder precisar ser recuperado ou possuir valor operacional ou histórico.

O Soft Delete não deve ser adotado automaticamente.

Uma entidade que utilize Soft Delete deve possuir uma justificativa clara.

### 7.3. Cascade Delete

Pode ser utilizado quando a remoção da entidade principal tornar os registros relacionados semanticamente inválidos.

Exemplo:

```text
Company
  └── CompanySocialLink
```

Se o relacionamento não possuir significado sem a empresa, a exclusão em cascata pode ser apropriada.

### 7.4. Restrict

Deve ser utilizado quando a exclusão da entidade principal puder comprometer a integridade ou o histórico do domínio.

### 7.5. Regra geral

Não utilizar Soft Delete por padrão.

A estratégia deve ser definida individualmente para cada entidade.

---

## 8. Entidades de Relacionamento

Uma relação entre entidades deve ser modelada como uma entidade própria quando possuir significado de negócio.

Exemplos:

- `CompanyCategory`;
- `CompanyReview`;
- `Favorite`.

Essas entidades não são apenas tabelas intermediárias técnicas.

Elas representam conceitos do domínio.

---

## 9. Quando Criar uma Entidade de Relacionamento

Uma entidade de relacionamento própria deve ser considerada quando pelo menos uma das condições abaixo for verdadeira:

- possui regras de negócio;
- possui atributos próprios;
- necessita de auditoria;
- possui ciclo de vida próprio;
- é consultada diretamente;
- poderá evoluir futuramente;
- precisa ser referenciada por outras partes do domínio.

Exemplo:

```text
User
  │
  ├── Favorite ── Company
  │
  └── CompanyReview ── Company
```

---

## 10. Quando Não Criar uma Entidade de Relacionamento

Uma relação simples pode utilizar uma associação técnica do ORM quando:

- não possui atributos próprios;
- não possui regras de negócio;
- não possui ciclo de vida próprio;
- não precisa ser consultada diretamente;
- não possui necessidade de auditoria;
- representa apenas uma associação estrutural.

A decisão deve considerar o domínio atual e a evolução razoavelmente previsível, evitando criar entidades artificiais sem necessidade.

---

## 11. Características das Entidades de Relacionamento

Quando uma entidade de relacionamento for criada, recomenda-se:

| Característica | Convenção                                                         |
| -------------- | ----------------------------------------------------------------- |
| Identificador  | UUID                                                              |
| Foreign Keys   | Obrigatórias quando o relacionamento for obrigatório              |
| Unique         | Utilizar quando impedir duplicidade fizer parte da regra          |
| Soft Delete    | Evitar                                                            |
| Hard Delete    | Preferencial                                                      |
| Cascade        | Utilizar quando o relacionamento perder seu significado com o pai |
| `created_at`   | Recomendado                                                       |
| `updated_at`   | Apenas se o relacionamento puder ser alterado                     |
| `deleted_at`   | Apenas se houver necessidade de histórico                         |

---

## 12. Unicidade

Constraints `UNIQUE` devem representar regras reais de negócio ou integridade.

Exemplos:

```text
UNIQUE (company_id, category_id)
```

para impedir que uma empresa seja associada duas vezes à mesma categoria.

Outro exemplo:

```text
UNIQUE (user_id, company_id)
```

para impedir múltiplos favoritos do mesmo usuário para a mesma empresa.

A unicidade deve ser garantida no banco sempre que possível, mesmo quando também houver validação na aplicação.

Isso evita inconsistências causadas por condições de corrida.

---

## 13. Índices

Índices devem ser criados para consultas relevantes e relacionamentos frequentemente utilizados.

Casos comuns:

- foreign keys utilizadas em filtros;
- campos utilizados em buscas;
- campos utilizados em ordenação;
- combinações de colunas utilizadas frequentemente;
- constraints de unicidade.

Exemplo:

```text
idx_company_catalog_items_company_id
```

Índices não devem ser adicionados indiscriminadamente.

Cada índice possui custo de armazenamento e pode aumentar o custo de operações de escrita.

A necessidade de novos índices deve ser avaliada conforme os padrões de consulta da aplicação.

---

## 14. ENUMs

Durante o MVP, conjuntos de valores pequenos, estáveis e controlados devem utilizar ENUMs nativos do PostgreSQL quando apropriado.

Exemplo conceitual:

```text
CompanyStatus
├── ACTIVE
├── INACTIVE
└── SUSPENDED
```

### 14.1. Quando utilizar ENUM

ENUMs são apropriados quando:

- o conjunto de valores é pequeno;
- os valores são estáveis;
- os valores não precisam ser cadastrados por usuários;
- não existe necessidade de metadados adicionais;
- a internacionalização não exige armazenamento adicional.

### 14.2. Evolução para Reference Tables

Caso um conjunto de valores passe a exigir:

- cadastro administrativo;
- customização;
- metadados;
- ordenação configurável;
- internacionalização;
- ativação/desativação dinâmica;

ele deve ser avaliado para migração para uma tabela de domínio.

Essa mudança representa uma alteração na persistência, e não necessariamente uma mudança na regra de negócio.

---

## 15. Dados Derivados

Dados derivados são informações calculadas a partir de outras entidades e armazenadas para otimizar leituras.

Exemplo:

```text
CompanyReview
      │
      ▼
ReviewService
      │
      ├── calcula média
      └── calcula quantidade
             │
             ▼
          Company
```

A entidade de origem continua sendo a fonte da verdade.

---

## 16. Regras para Dados Derivados

Dados derivados devem obedecer às seguintes regras:

1. Não são a fonte da verdade.
2. Não devem ser editados diretamente por usuários.
3. Não devem ser expostos como campos editáveis em APIs administrativas.
4. Devem ser atualizados pela camada de domínio.
5. Sempre que possível, devem ser atualizados na mesma transação que altera a origem.
6. Devem poder ser recalculados a partir da fonte da verdade.

Essa última característica é fundamental.

Se um valor derivado estiver inconsistente, deve ser possível reconstruí-lo.

---

## 17. Quando Utilizar Dados Derivados

Dados derivados devem ser utilizados somente quando houver benefício significativo de leitura.

São candidatos quando:

- são consultados frequentemente;
- exigem agregações custosas;
- aparecem em listagens ou buscas de alta frequência;
- reduzem significativamente a carga do banco.

Quando o custo da agregação for pequeno, deve-se preferir consultar a fonte da verdade diretamente.

---

## 18. Exemplos de Dados Derivados

| Fonte da verdade     | Entidade  | Dados derivados                  |
| -------------------- | --------- | -------------------------------- |
| `CompanyReview`      | `Company` | `rating_average`, `rating_count` |
| `Favorite`           | `Company` | `favorites_count`                |
| `CompanyCatalogItem` | `Company` | `catalog_items_count`            |
| `CompanyPromotion`   | `Company` | `active_promotions_count`        |
| `CompanyEvent`       | `Company` | `upcoming_events_count`          |

Esses exemplos não significam que todos os campos devam existir desde o MVP.

A adoção deve ser baseada na necessidade real de leitura e desempenho.

---

## 19. Atualização de Dados Derivados

A atualização deve ocorrer na camada de domínio responsável pela operação.

Exemplo:

```text
CompanyReview
      │
      ▼
ReviewService
      │
      ├── persiste avaliação
      ├── recalcula indicadores
      └── atualiza Company
```

Sempre que possível, essas operações devem fazer parte da mesma transação.

Eventos assíncronos poderão ser utilizados futuramente quando houver necessidade de desacoplamento ou processamento distribuído.

No MVP, a consistência transacional deve ser priorizada para indicadores críticos.

---

## 20. Ciclo de Vida das Entidades de Relacionamento

Entidades de relacionamento normalmente possuem ciclo de vida simples:

```text
Relacionamento inexistente
        ↓
Criação
        ↓
Relacionamento ativo
        ↓
Remoção
```

Por esse motivo, Hard Delete é geralmente preferível.

Soft Delete deve ser adotado somente quando houver necessidade explícita de preservar histórico ou recuperar o relacionamento.

---

## 21. Relacionamentos e Dados Derivados

Entidades de relacionamento frequentemente servem como fonte para indicadores derivados.

Exemplo:

```text
CompanyReview
      ↓
ReviewService
      ↓
Company.rating_average
Company.rating_count
```

Outro exemplo:

```text
Favorite
      ↓
FavoriteService
      ↓
Company.favorites_count
```

Nesses casos:

- a entidade de relacionamento é a fonte da verdade;
- o indicador armazenado na entidade principal é apenas uma otimização;
- o indicador deve poder ser recalculado.

---

## 22. Datas e Horários

Datas persistidas devem possuir semântica clara.

Quando representarem um instante no tempo, devem ser armazenadas em UTC.

Exemplos:

- `created_at`;
- `updated_at`;
- `published_at`;
- `starts_at`;
- `expires_at`.

Datas relacionadas a regras de calendário local devem ser tratadas de acordo com sua semântica de negócio e não devem ser convertidas automaticamente para UTC quando isso alterar o significado da informação.

A definição detalhada do ciclo de vida de conteúdos, incluindo `starts_at` e `expires_at`, deve permanecer nas convenções específicas do módulo de conteúdo.

---

## 23. Referências a Arquivos

Entidades de domínio não devem armazenar o conteúdo binário dos arquivos.

Devem armazenar apenas uma referência.

Exemplo:

```text
media_id
```

ou uma chave de armazenamento quando apropriado.

A abstração de armazenamento deve permitir substituir o provedor sem modificar as regras do domínio.

---

## 24. Integridade entre Domínio e Banco

A integridade dos dados deve ser protegida em diferentes níveis.

### Aplicação

Responsável por:

- regras de negócio;
- autorização;
- validações contextuais;
- transições de estado.

### Banco de dados

Responsável por:

- integridade referencial;
- unicidade;
- nulabilidade;
- constraints;
- tipos;
- integridade estrutural.

Nenhuma das camadas deve ser considerada substituta da outra.

---

## 25. Regras de Negócio e Entidades

Entidades e modelos de persistência não devem ser utilizados como local indiscriminado para regras de negócio.

As regras devem permanecer na camada de domínio apropriada.

Por exemplo:

```text
ReviewService
    ├── valida permissão
    ├── verifica duplicidade
    ├── cria avaliação
    └── atualiza indicadores
```

Enquanto a persistência permanece responsável por armazenar os dados.

---

## 26. Checklist para Novas Entidades

Antes de criar uma nova entidade persistente, deve-se avaliar:

- Qual conceito de domínio ela representa?
- Qual é sua fonte de verdade?
- Qual é seu ciclo de vida?
- Qual é sua estratégia de exclusão?
- Precisa de UUID?
- Quais campos de auditoria são necessários?
- Existem relacionamentos?
- Algum relacionamento merece entidade própria?
- Existem regras de unicidade?
- Quais índices serão necessários?
- Algum campo é derivado?
- Existe necessidade de ENUM?
- O dado possui semântica temporal?
- Existe necessidade de armazenamento de arquivos?
- Quais regras pertencem ao domínio?
- Quais restrições devem ser garantidas pelo banco?

---

## 27. Convenções Relacionadas

Este documento deve ser utilizado em conjunto com:

- `CON-001-architecture-conventions.md` — princípios e organização arquitetural;
- `CON-003-rest-api-conventions.md` — contratos HTTP e APIs REST;
- `CON-004-frontend-conventions.md` — convenções do frontend;
- `CON-005-git-conventions.md` — versionamento;
- `CON-006-commit-conventions.md` — mensagens de commit.

---

## 28. Manutenção

Este documento deve ser atualizado sempre que uma convenção geral de modelagem ou persistência for alterada.

Decisões específicas de uma entidade não precisam necessariamente alterar este documento.

Quando uma decisão representar uma mudança arquitetural significativa, deve ser registrada também como ADR.
