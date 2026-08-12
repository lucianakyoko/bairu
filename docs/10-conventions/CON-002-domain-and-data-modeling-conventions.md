# CON-002 — Domain and Data Modeling Conventions

## 1. Objetivo

Este documento estabelece as convenções utilizadas pelo Bairu para modelagem do domínio e dos dados persistidos pela plataforma.

Seu objetivo é garantir consistência na definição de:

- entidades;
- atributos;
- relacionamentos;
- identificadores;
- chaves estrangeiras;
- restrições de integridade;
- nomenclatura;
- dados derivados;
- valores controlados;
- referências a recursos externos;
- representação de conceitos temporais.

Estas convenções devem ser consideradas na criação ou alteração de qualquer entidade persistente da plataforma.

As regras gerais de arquitetura estão definidas em:

`CON-001-architecture-conventions.md`

As regras de ciclo de vida, retenção, exclusão e auditoria estão definidas em:

`CON-008-data-lifecycle-and-audit-standards.md`

As regras específicas para mídias estão definidas em:

`CON-007-media-architecture-and-lifecycle-standards.md`

A arquitetura física do banco de dados está definida em:

`DB-001-database-architecture.md`

---

# 2. Princípios de Modelagem

A modelagem de dados deve representar os conceitos e regras reais do domínio.

## 2.1. Domínio como fonte da modelagem

Entidades, atributos e relacionamentos devem representar conceitos relevantes para o negócio.

A estrutura do banco não deve ser definida exclusivamente a partir de conveniências técnicas do ORM ou da implementação.

Antes de criar uma entidade, deve ser possível responder:

> Qual conceito do domínio esta entidade representa?

---

## 2.2. Single Source of Truth

Cada informação deve possuir uma única fonte de verdade.

Dados duplicados ou derivados somente devem existir quando houver justificativa clara, principalmente relacionada a:

- desempenho;
- necessidade de consulta frequente;
- integração;
- requisitos operacionais.

Quando um dado for derivado, sua fonte de verdade deverá permanecer identificável e o valor deverá poder ser reconstruído quando necessário.

---

## 2.3. Responsabilidade única

Cada entidade deve representar um conceito bem definido.

Informações pertencentes a conceitos diferentes não devem ser agrupadas apenas por conveniência.

Por exemplo, informações relacionadas à empresa não devem ser utilizadas para representar diretamente regras pertencentes a avaliações, publicações ou favoritos.

---

## 2.4. Alta coesão

Atributos e regras relacionados ao mesmo conceito devem permanecer próximos.

Uma entidade deve concentrar informações que façam sentido dentro do mesmo contexto de domínio.

---

## 2.5. Baixo acoplamento

Entidades não devem incorporar diretamente detalhes de implementação de outros contextos.

Relacionamentos entre conceitos devem ser representados por referências e contratos apropriados.

---

## 2.6. Integridade em múltiplas camadas

A integridade dos dados deve ser protegida tanto pela aplicação quanto pelo banco de dados.

### Aplicação

Responsável por:

- regras de negócio;
- autorização;
- validações contextuais;
- transições de estado;
- regras que dependem de comportamento.

### Banco de dados

Responsável por:

- integridade referencial;
- unicidade;
- nulabilidade;
- tipos;
- constraints;
- integridade estrutural.

Uma camada não deve ser utilizada como substituta da outra.

---

## 2.7. Evolução incremental

A modelagem deve atender às necessidades reais do produto sem antecipar estruturas que ainda não possuem uso concreto.

Novas abstrações devem ser introduzidas quando houver necessidade de domínio, técnica ou produto.

---

# 3. Entidades de Domínio

Uma entidade persistente deve representar um conceito identificável do domínio.

Exemplos do Bairu incluem:

- `User`;
- `Company`;
- `Category`;
- `CompanyCatalogItem`;
- `FeedPublication`;
- `CompanyReview`;
- `Favorite`.

A entidade deve possuir identidade própria quando sua existência puder ser distinguida de outras instâncias do mesmo conceito.

---

## 3.1. Entidade versus atributo

Um conceito deve ser modelado como atributo quando:

- não possui identidade própria;
- não possui ciclo de vida independente;
- não precisa ser referenciado individualmente;
- não possui regras próprias relevantes.

Deve ser considerado como entidade quando:

- possui identidade própria;
- possui ciclo de vida;
- possui relacionamentos;
- possui regras de negócio;
- precisa ser consultado ou referenciado individualmente;
- poderá evoluir independentemente.

A decisão deve ser orientada pelo domínio e não apenas pela estrutura atual da interface.

---

# 4. Identidade das Entidades

Todas as entidades persistentes que possuam identidade própria devem utilizar um identificador primário.

No Bairu, o padrão é UUID.

Exemplo:

```text
id UUID
```

O identificador primário:

- não deve possuir significado de negócio;
- não deve ser utilizado para representar códigos funcionais;
- deve permanecer estável durante o ciclo de vida da entidade.

---

## 4.1. Justificativa para UUID

UUID foi adotado por:

- reduzir exposição de informações sobre cardinalidade;
- reduzir colisões em ambientes distribuídos;
- facilitar geração de identificadores;
- facilitar sincronizações;
- permitir evolução futura da arquitetura;
- evitar dependência de sequenciamento global do banco.

UUID não substitui identificadores funcionais.

Quando uma entidade possuir um identificador de negócio, este deve ser modelado separadamente.

---

# 5. Identificadores Funcionais

Identificadores com significado de negócio devem ser separados do identificador técnico.

Exemplos:

```text
id
slug
code
```

O `id` representa a identidade técnica.

Um `slug`, código ou identificador público representa uma necessidade específica do domínio ou da apresentação.

Esses campos podem possuir suas próprias constraints de unicidade.

Exemplo:

```text
Company
├── id
└── slug
```

O `slug` não substitui o UUID como identificador primário.

---

# 6. Convenções de Nomenclatura

## 6.1. Código da aplicação

Classes, interfaces, tipos e enums devem utilizar `PascalCase`.

Atributos e propriedades devem utilizar `camelCase`.

Exemplos:

```text
Company
CompanyCatalogItem
CompanyRepository
CompanyStatus

companyId
createdAt
publishedAt
```

---

## 6.2. Classes

| Elemento   | Convenção                 | Exemplo             |
| ---------- | ------------------------- | ------------------- |
| Entidade   | PascalCase singular       | `Company`           |
| DTO        | PascalCase + `Dto`        | `CreateCompanyDto`  |
| Controller | PascalCase + `Controller` | `CompanyController` |
| Service    | PascalCase + `Service`    | `CompanyService`    |
| Repository | PascalCase + `Repository` | `CompanyRepository` |
| Enum       | PascalCase                | `CompanyStatus`     |

---

## 6.3. Banco de Dados

Objetos persistidos devem utilizar `snake_case`.

| Elemento               | Convenção                  | Exemplo                                |
| ---------------------- | -------------------------- | -------------------------------------- |
| Tabela                 | `snake_case` plural        | `company_catalog_items`                |
| Coluna                 | `snake_case`               | `created_at`                           |
| Foreign Key            | `<entity>_id`              | `company_id`                           |
| Índice                 | `idx_<table>_<column>`     | `idx_company_catalog_items_company_id` |
| Foreign Key Constraint | `fk_<table>_<column>`      | `fk_company_catalog_items_company_id`  |
| Unique Constraint      | `uq_<table>_<column>`      | `uq_companies_slug`                    |
| Check Constraint       | `ck_<table>_<description>` | `ck_companies_rating_range`            |

As entidades da aplicação permanecem no singular.

As tabelas do banco utilizam plural.

---

# 7. Atributos

Cada atributo deve possuir significado claro dentro da entidade.

Atributos não devem ser criados apenas para facilitar uma implementação específica.

Antes de adicionar um campo, deve-se avaliar:

- qual conceito ele representa;
- se é fonte da verdade;
- se é derivado;
- se pode ser nulo;
- qual é sua semântica temporal, quando aplicável;
- se precisa de índice;
- se possui regra de unicidade;
- se deve ser persistido ou calculado.

---

# 8. Nulabilidade

A nulabilidade deve representar uma regra real do domínio.

Um campo deve ser `NOT NULL` quando sua ausência representar um estado inválido para aquela entidade.

Um campo pode ser nullable quando:

- a informação é opcional;
- o dado ainda não existe;
- a relação é opcional;
- a informação somente se torna obrigatória em determinada condição.

Nullable não deve ser utilizado apenas para facilitar o desenvolvimento.

---

# 9. Chaves Estrangeiras

Relacionamentos entre entidades persistentes devem ser representados por Foreign Keys.

Exemplo:

```text
company_id UUID
```

Quando o relacionamento for obrigatório:

```text
company_id NOT NULL
```

Quando o relacionamento for opcional:

```text
company_id NULL
```

A nulabilidade deve refletir a regra de domínio.

Foreign Keys devem ser utilizadas para preservar a integridade referencial do banco.

---

# 10. Cardinalidade

A cardinalidade deve representar explicitamente a relação entre os conceitos.

Exemplos:

```text
Company
  └── CompanyCatalogItem
      1 ─── N
```

ou:

```text
Company
  └── profile_media
      1 ─── 0..1
```

A cardinalidade deve ser definida antes da implementação da relação no ORM.

---

## 10.1. Cardinalidade obrigatória

Quando uma entidade não puder existir sem sua relação, a associação deve ser obrigatória.

Exemplo:

```text
CompanyCatalogItem
    └── company_id NOT NULL
```

---

## 10.2. Cardinalidade opcional

Quando a relação puder não existir, a associação deve ser nullable.

Exemplo:

```text
Company
    └── cover_media_id NULL
```

A nulabilidade representa a possibilidade de ausência da relação.

---

# 11. Entidades de Relacionamento

Uma relação entre entidades deve ser modelada como uma entidade própria quando possuir significado de negócio.

Exemplos:

- `CompanyCategory`;
- `CompanyReview`;
- `Favorite`.

Essas entidades não devem ser consideradas apenas tabelas intermediárias técnicas quando representarem conceitos relevantes do domínio.

---

# 12. Quando Criar uma Entidade de Relacionamento

Uma entidade de relacionamento própria deve ser considerada quando pelo menos uma das condições abaixo for verdadeira:

- possui regras de negócio;
- possui atributos próprios;
- possui ciclo de vida;
- necessita de auditoria;
- é consultada diretamente;
- poderá evoluir;
- precisa ser referenciada por outras partes do domínio.

Exemplo:

```text
User
  │
  ├── Favorite ───── Company
  │
  └── CompanyReview ─ Company
```

---

# 13. Quando Não Criar uma Entidade de Relacionamento

Uma relação simples pode utilizar uma associação técnica do ORM quando:

- não possui atributos próprios;
- não possui regras de negócio;
- não possui ciclo de vida;
- não precisa ser consultada diretamente;
- não possui necessidade de auditoria;
- representa somente uma associação estrutural.

A decisão deve considerar a necessidade atual e a evolução razoavelmente previsível.

Não devem ser criadas entidades artificiais sem significado no domínio.

---

# 14. Características das Entidades de Relacionamento

Quando uma entidade de relacionamento for criada, recomenda-se:

| Característica | Convenção                                               |
| -------------- | ------------------------------------------------------- |
| Identificador  | UUID                                                    |
| Foreign Keys   | Obrigatórias quando aplicável                           |
| Unique         | Utilizar quando impedir duplicidade for regra           |
| Soft Delete    | Não utilizar por padrão                                 |
| Hard Delete    | Preferencial quando não houver necessidade de histórico |
| Cascade        | Utilizar quando semanticamente apropriado               |
| `created_at`   | Recomendado                                             |
| `updated_at`   | Quando houver alteração do relacionamento               |
| `deleted_at`   | Somente quando explicitamente necessário                |

As decisões de lifecycle devem seguir `CON-008`.

---

# 15. Unicidade

Constraints `UNIQUE` devem representar regras reais de negócio ou integridade.

Exemplo:

```text
UNIQUE (company_id, category_id)
```

impede que uma empresa seja associada duas vezes à mesma categoria.

Outro exemplo:

```text
UNIQUE (user_id, company_id)
```

pode impedir múltiplos favoritos do mesmo usuário para a mesma empresa.

A unicidade deve ser garantida no banco sempre que possível.

A validação na aplicação não substitui a constraint do banco.

Isso é especialmente importante em cenários de concorrência.

---

# 16. Índices

Índices devem existir quando houver benefício concreto para consultas ou integridade.

Casos comuns:

- Foreign Keys frequentemente utilizadas em filtros;
- campos utilizados em buscas;
- campos utilizados em ordenação;
- combinações de colunas frequentemente consultadas;
- constraints de unicidade;
- consultas utilizadas por processos críticos.

Exemplo:

```text
idx_company_catalog_items_company_id
```

Índices não devem ser adicionados indiscriminadamente.

Cada índice possui custo de:

- armazenamento;
- escrita;
- manutenção;
- complexidade operacional.

Novos índices devem ser avaliados conforme os padrões reais de consulta.

---

# 17. ENUMs

Durante o MVP, conjuntos pequenos e estáveis de valores controlados podem utilizar ENUMs nativos do PostgreSQL quando apropriado.

Exemplo:

```text
CompanyStatus
├── ACTIVE
├── INACTIVE
└── SUSPENDED
```

---

## 17.1. Quando utilizar ENUM

ENUM é apropriado quando:

- o conjunto de valores é pequeno;
- os valores são estáveis;
- os valores não precisam ser cadastrados pelos usuários;
- não existe necessidade de metadados adicionais;
- a alteração da lista é pouco frequente.

---

## 17.2. Quando utilizar tabela de referência

Um conjunto de valores deve ser avaliado para migração para uma tabela quando passar a exigir:

- cadastro administrativo;
- customização;
- metadados;
- ordenação configurável;
- internacionalização;
- ativação ou desativação dinâmica;
- relacionamentos adicionais.

Essa decisão deve considerar a natureza do domínio, e não somente a preferência técnica.

---

# 18. Estados de Negócio

Estados representam condições relevantes do domínio.

Exemplo:

```text
CompanyStatus
├── ACTIVE
├── INACTIVE
└── SUSPENDED
```

Um estado de negócio não deve ser utilizado para representar automaticamente:

- existência física do registro;
- arquivamento técnico;
- exclusão física;
- retenção.

Essas preocupações pertencem ao ciclo de vida definido em `CON-008`.

Uma entidade pode permanecer persistida independentemente de seu estado de negócio.

---

# 19. Datas e Horários

Datas devem possuir semântica explícita.

Quando representarem um instante no tempo, devem ser armazenadas em UTC.

Exemplos:

```text
created_at
updated_at
published_at
archived_at
```

Datas relacionadas a calendário local devem preservar a semântica definida pelo domínio.

Não se deve converter automaticamente uma data de calendário para UTC quando isso alterar seu significado.

---

## 19.1. Convenções de nomenclatura temporal

Campos temporais devem utilizar nomes que expressem claramente sua semântica.

Exemplos:

```text
created_at
updated_at
published_at
starts_at
expires_at
archived_at
```

Evitar campos ambíguos como:

```text
date
time
value
```

quando o significado puder ser explicitado.

As regras específicas de lifecycle temporal de conteúdos devem permanecer nas convenções do módulo de conteúdo.

---

# 20. Campos de Auditoria Operacional

Entidades persistentes podem utilizar campos operacionais comuns quando fizer sentido.

Os campos mais comuns são:

```text
created_at
updated_at
```

Eles representam:

- momento de criação;
- momento da última alteração persistida.

Campos como:

```text
created_by
updated_by
```

podem ser utilizados quando houver necessidade de rastrear o responsável pela operação.

Esses campos não devem ser adicionados indiscriminadamente.

A auditoria de operações relevantes é tratada em `CON-008`.

---

# 21. Lifecycle e Exclusão

A modelagem da entidade deve permitir representar seu ciclo de vida quando isso fizer parte do domínio.

Entretanto, este documento não define a política geral de:

- Soft Delete;
- Hard Delete;
- arquivamento;
- retenção;
- anonimização;
- auditoria.

Essas regras são definidas em:

`CON-008-data-lifecycle-and-audit-standards.md`

A entidade deve apenas possuir os campos necessários para representar o comportamento definido pelo seu domínio.

Por exemplo, uma entidade que realmente necessite de Soft Delete poderá possuir:

```text
deleted_at
```

Mas `deleted_at` não deve ser adicionado automaticamente a todas as entidades.

---

# 22. Dados Derivados

Dados derivados são informações calculadas a partir de outras fontes de verdade.

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

Exemplos:

```text
rating_average
rating_count
favorites_count
catalog_items_count
```

A entidade de origem permanece como fonte da verdade.

---

# 23. Regras para Dados Derivados

Dados derivados devem obedecer às seguintes regras:

1. Não são a fonte da verdade.
2. Não devem ser editados diretamente por usuários.
3. Não devem ser tratados como dados primários.
4. Devem possuir uma fonte de verdade identificável.
5. Devem poder ser recalculados.
6. Devem ser atualizados de maneira consistente com sua origem.
7. Sua existência deve ser justificada por necessidade real.

Sempre que o custo de calcular o valor for pequeno, deve-se preferir derivá-lo sob demanda.

---

# 24. Quando Utilizar Dados Derivados

Dados derivados podem ser utilizados quando:

- são consultados frequentemente;
- exigem agregações custosas;
- aparecem em listagens de alta frequência;
- reduzem significativamente a carga do banco;
- melhoram uma operação crítica de leitura.

Não devem ser criados antecipadamente apenas por previsão de escala.

---

# 25. Atualização de Dados Derivados

Quando possível, dados derivados críticos devem ser atualizados na mesma transação que altera sua fonte de verdade.

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

Quando a atualização síncrona não for adequada, processos assíncronos poderão ser utilizados.

Nesse caso, a arquitetura deverá considerar:

- consistência eventual;
- reprocessamento;
- idempotência;
- recuperação de falhas.

No MVP, consistência transacional deve ser priorizada para indicadores críticos sempre que possível.

---

# 26. Referências a Recursos Externos

Entidades de domínio não devem armazenar diretamente conteúdos pertencentes a sistemas externos.

Isso inclui, por exemplo:

- arquivos;
- credenciais;
- objetos de SDK;
- conexões;
- tokens de infraestrutura.

Quando uma entidade precisar referenciar um recurso externo, deve armazenar uma referência adequada.

No caso de mídias, a referência deve seguir as regras de:

`CON-007-media-architecture-and-lifecycle-standards.md`

---

# 27. Valores Monetários

Valores monetários devem possuir representação que evite problemas de precisão associados a números de ponto flutuante.

No banco de dados, valores monetários devem utilizar tipo decimal/numeric com precisão definida de acordo com o domínio.

Exemplo conceitual:

```text
price NUMERIC(12,2)
```

A precisão e escala definitivas devem ser definidas de acordo com o caso de uso.

Operações financeiras não devem utilizar `float` ou `double` como fonte de verdade.

---

# 28. Dados Sensíveis

Dados sensíveis ou pessoais devem ser persistidos somente quando houver necessidade legítima para o funcionamento do domínio.

Antes de adicionar um campo que contenha dados pessoais, deve-se avaliar:

- finalidade;
- necessidade;
- acesso;
- retenção;
- exposição;
- segurança;
- possibilidade de minimização.

As regras gerais relacionadas a retenção, anonimização, exclusão e auditoria estão definidas em `CON-008`.

---

# 29. Integridade entre Domínio e Banco

Regras estruturais devem ser reforçadas pelo banco sempre que possível.

Exemplo:

```text
Aplicação
   ↓
validação de regra
   ↓
Database
   ↓
UNIQUE / FK / CHECK / NOT NULL
```

A aplicação deve fornecer feedback adequado ao usuário.

O banco deve atuar como última camada de proteção da integridade estrutural.

---

# 30. Regras de Negócio e Persistência

O modelo persistente não deve se tornar o local indiscriminado de todas as regras de negócio.

Regras devem permanecer na camada de domínio ou aplicação apropriada.

Por exemplo:

```text
ReviewService
    ├── valida autorização
    ├── verifica regras de avaliação
    ├── cria avaliação
    └── atualiza indicadores
```

Enquanto a persistência é responsável por armazenar e proteger a integridade estrutural dos dados.

---

# 31. Separação entre Modelo de Domínio e Modelo de Persistência

A representação utilizada pelo banco não precisa ser idêntica à representação conceitual do domínio.

O sistema poderá utilizar modelos específicos de persistência quando isso trouxer benefícios de:

- desempenho;
- integridade;
- consultas;
- compatibilidade com o ORM;
- evolução da infraestrutura.

Entretanto, a estrutura do banco não deve alterar o significado do conceito de domínio.

Quando houver divergência relevante entre domínio e persistência, essa decisão deve ser documentada quando necessário.

---

# 32. Estratégia para Relacionamentos

Ao criar um relacionamento, deve-se definir explicitamente:

- entidades envolvidas;
- cardinalidade;
- obrigatoriedade;
- Foreign Keys;
- unicidade;
- estratégia de exclusão;
- necessidade de entidade de relacionamento;
- necessidade de índices.

Exemplo:

```text
Company
   │
   └── CompanyCatalogItem
          │
          └── company_id NOT NULL
```

A estratégia de exclusão deverá ser definida em conjunto com o lifecycle da entidade conforme `CON-008`.

---

# 33. Checklist para Novas Entidades

Antes de criar uma nova entidade persistente, deve-se responder:

### Domínio

- Qual conceito de domínio ela representa?
- Por que esse conceito precisa existir como entidade?
- Qual é sua responsabilidade?
- Qual contexto de domínio possui essa responsabilidade?

### Identidade

- A entidade possui identidade própria?
- O identificador será UUID?
- Existe algum identificador funcional adicional?

### Atributos

- Quais são os atributos obrigatórios?
- Quais são opcionais?
- Algum atributo é derivado?
- Algum atributo contém dado pessoal?
- Existe algum valor monetário?
- Existem datas ou horários?

### Relacionamentos

- Quais entidades estão relacionadas?
- Qual é a cardinalidade?
- A relação é obrigatória?
- Precisa de entidade própria?
- Existe regra de unicidade?

### Integridade

- Quais `NOT NULL` são necessários?
- Quais `UNIQUE` são necessários?
- Quais `CHECK` são necessários?
- Quais Foreign Keys são necessárias?
- Quais índices são necessários?

### Lifecycle

- A entidade possui estado de negócio?
- Precisa de arquivamento?
- Precisa de Soft Delete?
- Qual é sua estratégia de exclusão?

As respostas relacionadas a lifecycle devem seguir `CON-008`.

### Recursos externos

- A entidade referencia arquivos ou outros recursos externos?
- Existe necessidade de mídia?
- A integração está desacoplada da infraestrutura?

As regras de mídia devem seguir `CON-007`.

---

# 34. Exemplos de Modelagem

## 34.1. Empresa

Conceitualmente:

```text
Company
├── id
├── name
├── slug
├── description
├── status
├── profile_media_id
├── cover_media_id
├── created_at
└── updated_at
```

A entidade representa a empresa como conceito central do domínio.

As mídias possuem lifecycle próprio conforme `CON-007`.

---

## 34.2. Item de catálogo

```text
CompanyCatalogItem
├── id
├── company_id
├── name
├── description
├── price
├── media_id
├── created_at
└── updated_at
```

O item pertence a uma empresa.

A relação:

```text
Company 1 ─── N CompanyCatalogItem
```

deve ser obrigatória no lado do item.

---

## 34.3. Favorito

```text
Favorite
├── id
├── user_id
├── company_id
└── created_at
```

A regra:

```text
UNIQUE (user_id, company_id)
```

impede duplicidade do mesmo favorito.

`Favorite` possui significado próprio no domínio e, portanto, não deve ser tratado apenas como uma associação técnica.

---

## 34.4. Avaliação

```text
CompanyReview
├── id
├── company_id
├── user_id
├── rating
├── comment
├── created_at
└── updated_at
```

A avaliação representa uma entidade de domínio porque possui:

- identidade;
- regras;
- conteúdo próprio;
- relacionamento com usuário;
- relacionamento com empresa;
- potencial necessidade de moderação e auditoria.

---

# 35. Relação com Dados Derivados

Quando uma entidade possuir indicadores derivados, a documentação deve identificar explicitamente sua fonte da verdade.

Exemplo:

```text
CompanyReview
      │
      ├── rating
      └── ...
             │
             ▼
        fonte da verdade
             │
             ▼
         Company
         ├── rating_average
         └── rating_count
```

Os campos derivados não devem substituir a entidade de origem.

Se houver inconsistência, os valores devem poder ser recalculados.

---

# 36. Relação com Lifecycle

A modelagem deve permitir que uma entidade represente seu estado de negócio sem confundir esse estado com sua existência física.

Exemplo:

```text
Company
status = INACTIVE
```

não significa:

```text
Company não existe no banco
```

Da mesma forma:

```text
Company
status = ARCHIVED
```

não significa necessariamente:

```text
Hard Delete
```

Estados, arquivamento, exclusão e retenção são conceitos diferentes.

A política geral está definida em:

`CON-008-data-lifecycle-and-audit-standards.md`

---

# 37. Relação com Auditoria

O modelo de uma entidade não deve incorporar mecanismos próprios de auditoria histórica sem necessidade.

Campos como:

```text
created_at
updated_at
```

representam informações operacionais da própria entidade.

O histórico de operações relevantes deve utilizar o mecanismo de auditoria definido em `CON-008`.

Essa separação evita que cada entidade implemente seu próprio modelo de histórico.

---

# 38. Relação com Mídias

Mídias não devem ser tratadas como conteúdo binário dentro das entidades.

Uma entidade deve possuir apenas a referência necessária para utilizar uma mídia.

Exemplo:

```text
Company
├── profile_media_id
└── cover_media_id
```

O armazenamento físico, upload, substituição e remoção são responsabilidades do Media Module.

As regras completas estão em:

`CON-007-media-architecture-and-lifecycle-standards.md`

---

# 39. Decisões de Modelagem Consolidadas

As seguintes convenções fazem parte do padrão atual do Bairu:

| Decisão                                          | Justificativa                                    |
| ------------------------------------------------ | ------------------------------------------------ |
| UUID para entidades persistentes                 | Identidade técnica estável e adequada à evolução |
| Entidades representam conceitos de domínio       | Evita modelagem orientada somente ao banco       |
| Tabelas em `snake_case` plural                   | Consistência de persistência                     |
| Entidades da aplicação no singular               | Clareza semântica                                |
| Foreign Keys no banco                            | Integridade referencial                          |
| UNIQUE para regras de unicidade                  | Proteção contra inconsistências e concorrência   |
| Índices orientados a consultas                   | Evita otimização indiscriminada                  |
| ENUM para conjuntos pequenos e estáveis          | Simplicidade no MVP                              |
| Reference tables quando valores forem dinâmicos  | Permite evolução e metadados                     |
| Dados derivados não são fonte da verdade         | Preserva consistência conceitual                 |
| Dados derivados devem ser recalculáveis          | Facilita recuperação de inconsistências          |
| `created_at` e `updated_at` quando aplicáveis    | Rastreabilidade operacional                      |
| `deleted_at` não é padrão global                 | Lifecycle é definido por entidade                |
| Lifecycle centralizado em CON-008                | Evita duplicação de regras                       |
| Mídias referenciadas, não armazenadas no domínio | Desacoplamento da infraestrutura                 |
| Regras de mídia centralizadas em CON-007         | Evita duplicação entre módulos                   |
| Integridade dividida entre aplicação e banco     | Defesa em múltiplas camadas                      |

---

# 40. Relação com Outras Convenções

Este documento deve ser utilizado em conjunto com:

- `CON-001-architecture-conventions.md` — princípios e organização arquitetural;
- `CON-003-rest-api-conventions.md` — APIs REST;
- `CON-004-frontend-conventions.md` — frontend;
- `CON-005-git-conventions.md` — Git;
- `CON-006-commit-conventions.md` — commits;
- `CON-007-media-architecture-and-lifecycle-standards.md` — mídias;
- `CON-008-data-lifecycle-and-audit-standards.md` — lifecycle, retenção e auditoria;
- `DB-001-database-architecture.md` — arquitetura do banco de dados.

Quando houver conflito entre documentos, a regra mais específica deve ser considerada em conjunto com os princípios arquiteturais gerais.

Decisões relevantes que alterem a arquitetura devem ser registradas como ADR quando apropriado.

---

# 41. Manutenção

Este documento deve ser atualizado quando uma convenção geral de modelagem de domínio ou dados for alterada.

Decisões específicas de uma entidade não precisam necessariamente alterar este documento.

Quando uma decisão representar uma mudança arquitetural significativa, deverá ser avaliada a necessidade de criação ou atualização de uma ADR.

As convenções devem refletir o estado real do projeto e não apenas uma arquitetura desejada para o futuro.

O documento deve permanecer focado em **como o Bairu modela seus conceitos e dados**, evitando duplicar regras específicas de:

- arquitetura geral;
- APIs;
- frontend;
- mídias;
- lifecycle;
- auditoria;
- infraestrutura física do banco.
