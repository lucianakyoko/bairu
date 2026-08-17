# CON-008 — Data Lifecycle & Audit Standards

## 1. Objetivo

Este documento estabelece as convenções transversais utilizadas pelo Bairu para gerenciamento do ciclo de vida dos dados, incluindo:

- criação;
- atualização;
- ativação e desativação;
- arquivamento;
- restauração;
- retenção;
- exclusão definitiva;
- anonimização;
- auditoria.

Seu objetivo é evitar que cada entidade ou módulo implemente regras próprias e inconsistentes para o ciclo de vida dos dados.

Estas convenções devem garantir:

- consistência entre os módulos;
- separação entre estado de negócio e existência física do registro;
- rastreabilidade de operações relevantes;
- preservação adequada de dados quando necessária;
- exclusão definitiva quando aplicável;
- tratamento adequado de dados pessoais;
- suporte aos princípios aplicáveis da LGPD;
- possibilidade de evolução das políticas de retenção e auditoria.

Este documento estabelece **convenções gerais**. Regras específicas de um domínio devem ser definidas na documentação correspondente quando possuírem semântica própria.

---

## 2. Escopo

Este documento se aplica às entidades persistentes e aos processos que alteram seu ciclo de vida.

Abrange principalmente:

- entidades de domínio;
- entidades de relacionamento;
- dados pessoais;
- registros administrativos;
- conteúdos publicados;
- dados arquivados;
- operações de exclusão;
- registros de auditoria.

O armazenamento e o ciclo de vida de arquivos físicos possuem regras específicas e devem seguir também:

`CON-007-media-architecture-and-lifecycle-standards.md`

As convenções estruturais de modelagem, nomenclatura, identificadores, constraints e relacionamentos permanecem definidas em:

`CON-002-domain-and-data-modeling-conventions.md`

---

## 3. Princípios

### 3.1. Estado de negócio não representa existência física

O estado de uma entidade não deve ser utilizado isoladamente para determinar se seus dados existem ou não no banco.

Uma entidade pode estar:

- ativa;
- inativa;
- arquivada;

e continuar persistida.

A existência física do registro e seu estado de negócio são conceitos diferentes.

Por exemplo:

```text
Company
    │
    ├── ACTIVE
    ├── INACTIVE
    └── ARCHIVED
```

Todos esses estados podem representar registros que continuam armazenados.

Hard Delete representa uma operação diferente:

```text
registro persistido
        │
        ▼
   HARD DELETE
        │
        ▼
registro removido
```

---

### 3.2. Arquivamento não é Soft Delete

Arquivamento representa uma mudança no estado de negócio.

O registro continua existindo e pode ser mantido para:

- histórico;
- auditoria;
- obrigações legais;
- análise operacional;
- recuperação quando permitida.

Arquivamento não deve ser tratado automaticamente como exclusão lógica.

---

### 3.3. Expiração não é exclusão

A expiração de uma entidade ou conteúdo representa o término de sua validade operacional.

Ela não implica automaticamente a remoção física do registro.

Por exemplo:

```text
Promotion
    │
    ├── ACTIVE
    │
    ▼
   EXPIRED
```

A promoção pode deixar de ser exibida publicamente e continuar armazenada para fins históricos, estatísticos ou administrativos.

A semântica específica de `starts_at`, `expires_at` e estados de publicação deve ser definida pelas convenções do respectivo domínio.

---

### 3.4. Hard Delete é uma operação definitiva

Hard Delete representa a remoção física do registro persistido.

Quando aplicável, a operação deve considerar também:

- registros dependentes;
- referências;
- mídias;
- caches;
- índices de busca;
- integrações externas;
- outros dados derivados.

A exclusão deve ser coordenada de acordo com as regras de integridade e retenção aplicáveis.

---

### 3.5. Retenção deve possuir finalidade

O Bairu não deve manter dados indefinidamente sem uma finalidade legítima.

A retenção deve possuir justificativa relacionada a:

- finalidade do tratamento;
- necessidade operacional;
- obrigação legal;
- segurança;
- auditoria;
- prevenção de fraude ou abuso;
- exercício regular de direitos;
- outra base legítima aplicável.

---

## 4. Estados de Ciclo de Vida

Entidades que possuem ciclo de vida próprio podem utilizar estados adequados ao seu domínio.

### 4.1. ACTIVE

A entidade está ativa e pode participar normalmente das operações previstas pelo domínio.

### 4.2. INACTIVE

A entidade permanece cadastrada, mas não está disponível para determinadas operações ou exibição pública.

`INACTIVE` não implica exclusão dos dados.

### 4.3. ARCHIVED

A entidade não participa mais do fluxo operacional normal, mas seus dados permanecem armazenados para uma finalidade definida.

Uma entidade arquivada normalmente:

- não aparece em buscas públicas;
- não aparece no feed;
- não recebe novas interações;
- não participa de recomendações;
- permanece disponível para operações administrativas autorizadas, quando aplicável.

### 4.4. Outros estados

Domínios podem possuir estados adicionais quando eles representarem conceitos reais do negócio.

Exemplos:

- `PENDING`;
- `SUSPENDED`;
- `EXPIRED`;
- `DRAFT`;
- `PUBLISHED`.

Esses estados não devem ser criados apenas para representar operações técnicas de persistência.

---

## 5. Exclusão Física e Exclusão Lógica

O Bairu não adota Soft Delete como padrão global.

Cada entidade deve definir explicitamente sua estratégia de exclusão.

### 5.1. Hard Delete

Hard Delete deve ser utilizado quando não houver necessidade legítima de retenção do registro.

A operação remove fisicamente o registro do banco.

Antes da execução, devem ser avaliados:

1. requisitos de retenção;
2. dados dependentes;
3. integridade referencial;
4. dados pessoais;
5. dados armazenados em serviços externos;
6. dados derivados;
7. necessidade de auditoria.

### 5.2. Soft Delete

Soft Delete pode ser utilizado quando a entidade precisar representar explicitamente uma exclusão lógica e continuar disponível para determinadas operações internas.

Quando utilizado, o mecanismo deve possuir justificativa clara e documentação específica.

O campo `deleted_at` não deve ser adicionado automaticamente a todas as entidades.

### 5.3. Estado de negócio como alternativa

Quando o domínio precisar apenas impedir que uma entidade continue ativa ou pública, deve-se preferir um estado de negócio adequado, como:

```text
INACTIVE
ARCHIVED
SUSPENDED
```

em vez de introduzir Soft Delete sem necessidade.

---

## 6. Arquivamento

O arquivamento deve ser utilizado quando o registro precisar continuar existindo, mas deixar de participar do funcionamento operacional normal.

Exemplos:

- empresa encerrada no Bairu;
- conteúdo mantido para histórico;
- registros administrativos;
- dados cuja exclusão imediata não seja apropriada.

Uma entidade arquivada deve permanecer fora das experiências públicas que dependam de entidades ativas.

O acesso administrativo a registros arquivados deve respeitar as permissões do contexto.

### 6.1. Restauração

Quando o domínio permitir restauração, a operação deve:

- validar se a restauração é permitida;
- verificar se as condições necessárias continuam válidas;
- registrar a operação quando auditável;
- retornar a entidade a um estado válido do domínio.

A restauração não deve simplesmente remover um marcador técnico de arquivamento sem validar as regras atuais.

---

## 7. Dados Pessoais e LGPD

O tratamento de dados pessoais deve observar os princípios aplicáveis da LGPD, incluindo:

- finalidade;
- adequação;
- necessidade;
- livre acesso e transparência;
- segurança;
- prevenção;
- responsabilização.

O Bairu não deve manter dados pessoais indefinidamente apenas porque existe capacidade técnica para armazená-los.

A retenção deve considerar a finalidade original do tratamento e eventuais motivos legítimos para sua conservação.

### 7.1. Solicitações de titulares

Quando um titular solicitar a exclusão de seus dados, o sistema deve avaliar individualmente:

- quais dados podem ser removidos;
- quais dados precisam permanecer;
- se existem obrigações legais de retenção;
- se existem necessidades legítimas de segurança ou auditoria;
- se determinados dados podem ser anonimizados;
- quais sistemas externos também precisam ser considerados.

A exclusão de um usuário não deve ser implementada como uma operação genérica de cascata sem avaliar os efeitos sobre o restante do domínio.

---

## 8. Retenção

Não deve existir uma política global de "manter tudo" ou "apagar tudo".

Cada categoria de dado deve possuir uma estratégia de retenção compatível com sua finalidade e requisitos aplicáveis.

A política de retenção deve considerar:

- finalidade do dado;
- necessidade operacional;
- requisitos legais;
- segurança;
- auditoria;
- solicitações de titulares;
- dependências;
- custo de armazenamento.

Quando o período de retenção terminar, o dado deve ser:

- excluído; ou
- anonimizado;

conforme a finalidade e as regras aplicáveis.

### 8.1. Retenção não implica disponibilidade pública

Um dado pode precisar permanecer armazenado sem continuar disponível para usuários finais.

Por exemplo:

```text
dado retido
    │
    ├── não aparece em buscas públicas
    ├── não participa do feed
    └── disponível apenas para contexto autorizado
```

---

## 9. Anonimização

Quando determinado registro precisar permanecer por uma finalidade legítima, mas os dados pessoais não forem mais necessários, pode ser considerada a anonimização.

A anonimização deve reduzir adequadamente a possibilidade de identificação do titular a partir dos dados mantidos.

Anonimização não deve ser utilizada apenas para evitar uma exclusão que deveria ocorrer.

Quando houver possibilidade razoável de identificação, o tratamento deve continuar sujeito às regras aplicáveis a dados pessoais.

---

## 10. Auditoria

Operações relevantes sobre dados devem possuir rastreabilidade adequada ao risco e à finalidade da operação.

Quando aplicável, a auditoria deve permitir identificar:

- qual entidade foi afetada;
- qual operação ocorreu;
- quando ocorreu;
- qual ator realizou a operação;
- se a operação foi manual ou automática;
- qual contexto originou a operação;
- informações adicionais necessárias para investigação.

Operações potencialmente auditáveis incluem:

- criação;
- alterações administrativas relevantes;
- alteração de status;
- arquivamento;
- restauração;
- exclusão definitiva;
- alterações de permissões;
- alterações de propriedade;
- operações relacionadas à privacidade;
- ações administrativas críticas.

Nem toda alteração de baixo risco precisa gerar um registro detalhado de auditoria.

---

## 11. Audit Log

A auditoria deve ser implementada separadamente das entidades de negócio.

As entidades não devem acumular campos destinados a armazenar todo o histórico de suas alterações.

O sistema pode utilizar uma entidade central, por exemplo:

`AuditLog`

Estrutura inicial sugerida:

| Campo           | Tipo           | Descrição                            |
| --------------- | -------------- | ------------------------------------ |
| `id`            | UUID           | Identificador do evento              |
| `actor_user_id` | UUID nullable  | Usuário responsável pela ação        |
| `actor_type`    | ENUM           | Tipo de ator que realizou a operação |
| `action`        | ENUM           | Tipo da operação                     |
| `entity_type`   | VARCHAR        | Tipo da entidade afetada             |
| `entity_id`     | UUID nullable  | Identificador da entidade afetada    |
| `metadata`      | JSONB nullable | Informações adicionais necessárias   |
| `created_at`    | TIMESTAMPTZ    | Momento da operação                  |

`actor_user_id` pode ser nulo quando a operação for realizada por processo automático.

`entity_id` pode ser nulo quando a operação não estiver relacionada a uma entidade específica.

A estrutura definitiva do `AuditLog` deve ser definida durante a implementação do módulo de administração/auditoria.

---

## 12. Tipos de Atores

As operações auditáveis podem ser executadas por diferentes tipos de atores.

Exemplos:

```text
USER
ADMIN
SYSTEM
JOB
```

O mecanismo de auditoria deve distinguir operações humanas de operações automatizadas quando isso for relevante para rastreabilidade.

Uma operação automatizada pode possuir:

```text
actor_user_id = NULL
actor_type = SYSTEM
```

---

## 13. Conteúdo da Auditoria

O AuditLog deve armazenar somente as informações necessárias para rastreabilidade.

Não deve ser utilizado como mecanismo indiscriminado para copiar todas as informações das entidades.

Informações pessoais, sensíveis ou desnecessárias não devem ser armazenadas no log.

Quando houver necessidade de registrar alterações, deve-se avaliar se é suficiente armazenar:

- campos alterados;
- identificadores envolvidos;
- contexto da operação;
- valores relevantes para investigação.

Não é necessário armazenar automaticamente o estado completo anterior e posterior de todas as entidades.

---

## 14. Auditoria de Operações Críticas

Operações críticas devem possuir rastreabilidade explícita.

Exemplos:

- alteração de proprietário de uma empresa;
- alteração de permissões;
- suspensão;
- arquivamento;
- restauração;
- exclusão definitiva;
- alterações administrativas;
- operações relacionadas a privacidade;
- alterações de configurações sensíveis.

Operações comuns podem utilizar apenas os mecanismos padrão da entidade, como:

```text
created_at
updated_at
```

e, quando necessário:

```text
created_by
updated_by
```

A adoção desses campos deve seguir as convenções do `CON-002`.

---

## 15. Auditoria e Hard Delete

Hard Delete apresenta uma particularidade importante: após a remoção, o registro principal deixa de existir.

Quando a exclusão precisar ser auditável, o evento da operação deve permanecer registrado no mecanismo de auditoria.

Exemplo:

```text
ENTITY_HARD_DELETED
    entity_type: Company
    entity_id: <uuid>
    actor_user_id: <uuid>
    created_at: ...
```

O AuditLog não deve funcionar como cópia dos dados excluídos.

A auditoria deve demonstrar que a operação ocorreu e preservar somente as informações necessárias para essa finalidade.

---

## 16. Auditoria e Privacidade

A existência de um registro de auditoria não cria autorização para armazenar dados pessoais desnecessários.

Antes de registrar uma informação no AuditLog, deve-se avaliar:

1. ela é necessária para rastreabilidade?
2. existe alternativa menos invasiva?
3. contém dado pessoal?
4. pode ser minimizada?
5. possui prazo de retenção definido?

A auditoria também está sujeita às regras de segurança, acesso e retenção aplicáveis.

---

## 17. Entidades Dependentes

A exclusão ou arquivamento de uma entidade deve considerar seus relacionamentos.

Cada entidade deve documentar sua estratégia para dependências relevantes.

As estratégias possíveis incluem:

- `CASCADE DELETE`;
- remoção explícita;
- anonimização;
- preservação;
- arquivamento;
- bloqueio da exclusão.

Exemplo:

```text
Company
 ├── CompanyReview
 ├── Favorite
 ├── FeedPublication
 └── Media
```

A exclusão de `Company` não deve ser implementada sem avaliar o ciclo de vida de cada dependência.

A existência de uma Foreign Key não determina, por si só, que `CASCADE DELETE` seja a estratégia correta.

---

## 18. Dados Derivados

Dados derivados devem ser considerados durante operações de arquivamento e exclusão.

Exemplo:

```text
CompanyReview
      │
      ▼
Company.rating_average
Company.rating_count
```

Quando a fonte da verdade for alterada ou removida, os dados derivados devem:

- ser atualizados;
- ser recalculados;
- ou deixar de existir,

conforme as regras do domínio.

Dados derivados não devem impedir uma exclusão legítima nem permanecer apontando para entidades inexistentes.

As convenções gerais para dados derivados permanecem definidas no `CON-002`.

---

## 19. Mídias

Mídias possuem ciclo de vida próprio porque o conteúdo físico permanece fora do banco de dados.

As regras específicas de:

- upload;
- validação;
- armazenamento;
- substituição;
- remoção;
- tratamento de falhas;
- arquivos órfãos;

estão definidas em:

`CON-007-media-architecture-and-lifecycle-standards.md`

Quando uma entidade for arquivada, a necessidade de manter suas mídias deve ser avaliada conforme a finalidade da retenção.

Quando uma mídia deixar de possuir finalidade e puder ser removida, o arquivo físico e seu registro `Media` devem seguir o ciclo de exclusão definido pelo módulo de mídia.

---

## 20. Dados Públicos e Dados Arquivados

O fato de um dado continuar armazenado não significa que ele deva continuar público.

Dados arquivados devem permanecer fora das experiências públicas quando o domínio assim determinar.

O acesso a dados arquivados deve depender das permissões do contexto.

Possíveis níveis de acesso incluem:

- usuário;
- proprietário;
- administrador;
- processo interno.

As regras de exposição pública devem ser determinadas pelo domínio e pela camada de autorização.

---

## 21. Operações Automatizadas

O sistema poderá possuir processos automatizados responsáveis por:

- expiração de conteúdos;
- limpeza de registros;
- remoção de mídias órfãs;
- aplicação de políticas de retenção;
- anonimização;
- manutenção de dados arquivados;
- tarefas de consistência.

Operações automatizadas relevantes devem ser auditáveis.

Quando não houver usuário responsável:

```text
actor_user_id = NULL
actor_type = SYSTEM
```

O sistema deve registrar contexto suficiente para identificar o processo responsável quando necessário.

---

## 22. Transações e Consistência

Operações que alteram simultaneamente múltiplos registros relacionados devem utilizar transações quando a consistência exigir atomicidade.

Exemplo:

```text
Archive Company
      │
      ├── atualizar Company
      ├── atualizar dependências necessárias
      └── registrar operação de auditoria
```

Entretanto, operações que envolvam sistemas externos não podem depender exclusivamente de uma transação PostgreSQL.

Por exemplo:

```text
Database
    +
Cloudinary
    +
External Service
```

podem exigir estratégias próprias de compensação, retry ou processamento assíncrono.

Essas estratégias devem ser definidas pelo módulo responsável pela integração.

---

## 23. Campos de Ciclo de Vida

Entidades devem possuir somente os campos de ciclo de vida necessários ao seu domínio.

Campos comuns incluem:

```text
created_at
updated_at
```

Quando houver necessidade real:

```text
status
archived_at
inactivated_at
```

Campos como:

```text
deleted_at
```

somente devem existir quando a entidade utilizar Soft Delete ou outra estratégia que necessite representar uma exclusão lógica.

Não deve existir um conjunto obrigatório de campos de ciclo de vida aplicado indiscriminadamente a todas as entidades.

---

## 24. Responsabilidade por Decisões de Ciclo de Vida

Cada entidade persistente deve possuir uma estratégia de ciclo de vida conhecida.

Ao criar ou alterar uma entidade, deve-se definir:

1. quais são seus estados;
2. quando pode ser arquivada;
3. quando pode ser restaurada;
4. se pode ser excluída;
5. se utiliza Hard Delete ou Soft Delete;
6. quais dados dependentes são afetados;
7. se possui requisitos de retenção;
8. quais operações precisam ser auditadas;
9. se possui dados pessoais;
10. se possui mídias ou referências externas.

Essa definição deve permanecer próxima da documentação do domínio quando possuir regras específicas.

---

## 25. Regra Geral de Ciclo de Vida

O padrão preferencial do Bairu é:

```text
Estado de negócio
        +
Arquivamento quando necessário
        +
Hard Delete quando a retenção não for necessária
```

Soft Delete não deve ser adotado por padrão.

A estratégia de cada entidade deve ser determinada pela natureza do dado e por seu ciclo de vida real.

---

## 26. Checklist de Ciclo de Vida

Antes de definir ou alterar o ciclo de vida de uma entidade, deve-se avaliar:

- Qual é a finalidade do dado?
- Quais estados de negócio existem?
- Existe diferença entre inativo e arquivado?
- O registro precisa continuar existindo após deixar de ser operacional?
- Existe necessidade de restauração?
- Existe requisito de retenção?
- O dado contém informações pessoais?
- Existe possibilidade de anonimização?
- A entidade pode sofrer Hard Delete?
- Soft Delete é realmente necessário?
- Quais dependências são afetadas?
- Existem mídias associadas?
- Existem dados derivados?
- Quais operações precisam ser auditadas?
- Existem integrações externas?
- Existem processos automatizados envolvidos?
- A operação precisa ser transacional?
- O dado continuará público após ser arquivado?

---

## 27. Relação com Outras Convenções

Este documento deve ser utilizado em conjunto com:

- `CON-001-architecture-conventions.md` — princípios e organização arquitetural;
- `CON-002-domain-and-data-modeling-conventions.md` — modelagem e persistência;
- `CON-003-rest-api-conventions.md` — APIs REST;
- `CON-007-media-architecture-and-lifecycle-standards.md` — mídias e armazenamento de arquivos.

Quando uma regra específica de domínio entrar em conflito com uma convenção geral, a regra deve ser analisada e, quando representar uma decisão arquitetural relevante, documentada em uma ADR.

---

## 28. Evolução Futura

Este padrão poderá evoluir para suportar:

- histórico completo de alterações;
- trilhas de auditoria administrativas;
- políticas de retenção configuráveis;
- automação de solicitações de titulares;
- anonimização automatizada;
- exportação de dados pessoais;
- mecanismos de Data Subject Request (DSR);
- políticas de retenção por categoria de dado;
- trilhas de conformidade;
- integração com ferramentas de observabilidade e segurança.

Essas capacidades não fazem parte obrigatoriamente do MVP.

Devem ser introduzidas conforme necessidades reais de produto, operação, segurança ou conformidade.

---

## 29. Manutenção deste Documento

Este documento deve ser atualizado quando uma convenção transversal de ciclo de vida, auditoria, retenção ou exclusão for alterada.

Decisões específicas de uma entidade não precisam necessariamente modificar este documento.

Mudanças significativas na política de dados, privacidade, auditoria ou retenção devem ser acompanhadas de documentação apropriada e, quando representarem uma decisão arquitetural relevante, de uma ADR.
