# DB-002 — Core Domain Data Model

## 1. Objetivo

Este documento define o modelo conceitual de dados do Bairu para o MVP.

Seu objetivo é consolidar as principais entidades persistentes da plataforma, seus relacionamentos, responsabilidades e limites de domínio, servindo como referência para a implementação do modelo relacional em PostgreSQL e sua representação através do Prisma.

Este documento não substitui as convenções gerais de arquitetura e modelagem.

As regras gerais de modelagem devem ser consultadas em:

- `CON-001-architecture-conventions.md`;
- `CON-002-domain-and-data-modeling-conventions.md`;
- `CON-007-media-architecture-and-lifecycle-standards.md`;
- `CON-008-data-lifecycle-and-audit-standards.md`.

O objetivo deste documento é responder principalmente:

> **Quais são os dados que o Bairu precisa persistir e como eles se relacionam?**

---

## 2. Escopo

O modelo contempla os principais dados necessários para o MVP da plataforma:

- identidade e usuários;
- empresas e profissionais;
- categorias;
- catálogo;
- conteúdo;
- Feed;
- favoritos;
- avaliações;
- denúncias;
- mídias;
- horários de funcionamento;
- exceções de agenda;
- limites e informações necessárias para operação do produto.

O modelo deverá permanecer simples o suficiente para o MVP, preservando limites claros entre os contextos de domínio.

Não fazem parte deste documento detalhes de:

- implementação de controllers;
- contratos HTTP;
- componentes de frontend;
- infraestrutura de deployment;
- implementação interna do Prisma;
- implementação específica do Cloudinary.

---

# 3. Princípios do Modelo

O modelo de dados segue os seguintes princípios:

### 3.1. Domínio como fonte da modelagem

As entidades devem representar conceitos reais do Bairu.

### 3.2. Fonte única da verdade

Cada informação deve possuir uma fonte de verdade claramente definida.

### 3.3. Ownership explícito

Toda entidade deve possuir uma relação clara com o contexto que é responsável por seu ciclo de vida.

### 3.4. Baixo acoplamento

Relacionamentos entre contextos devem representar dependências reais do domínio e não detalhes de implementação.

### 3.5. Evolução incremental

O modelo deve atender às necessidades atuais sem antecipar estruturas que ainda não possuem uso concreto.

### 3.6. Integridade no banco

Regras estruturais devem ser protegidas por constraints sempre que possível.

---

# 4. Bounded Contexts

O modelo de dados está organizado conceitualmente nos seguintes contextos:

| Contexto       | Responsabilidade                                     |
| -------------- | ---------------------------------------------------- |
| Identity       | Usuários, autenticação e identidade                  |
| Business       | Empresas, profissionais e informações institucionais |
| Discovery      | Categorias, catálogo e descoberta                    |
| Content        | Conteúdos publicados pelas empresas                  |
| Feed           | Distribuição e agregação de conteúdo                 |
| Community      | Favoritos, avaliações e denúncias                    |
| Media          | Mídias e armazenamento externo                       |
| Administration | Administração, auditoria e operações internas        |

Esses contextos são limites conceituais.

No MVP, permanecem dentro de uma única aplicação backend e de um único banco PostgreSQL.

---

# 5. Visão Geral das Entidades

O modelo principal do MVP é composto pelas seguintes entidades:

```text
Identity
├── User

Business
├── Company
├── CompanySocialLink
├── CompanyBusinessDay
├── CompanyBusinessHourPeriod
└── CompanyScheduleOverride

Discovery
├── Category
├── CompanyCategory
└── CompanyCatalogItem

Content
├── FeedPublication
├── CompanyPromotion
├── CompanyNews
├── CompanyJobVacancy
├── CompanyEvent
└── CompanyCoupon

Feed
└── FeedPublication

Community
├── Favorite
├── CompanyReview
└── Report

Media
└── Media

Administration
└── AuditLog
```

A estrutura exata dos modelos poderá ser refinada durante a implementação do schema Prisma, desde que as decisões de domínio documentadas neste documento sejam preservadas.

---

# 6. Identity Context

## 6.1. User

Representa uma identidade autenticada da plataforma.

Responsabilidades:

- identificação do usuário;
- autenticação;
- associação com ações realizadas na plataforma;
- ownership de operações que exigem usuário autenticado.

O usuário poderá participar de diferentes contextos, como:

- favoritos;
- avaliações;
- denúncias;
- ações administrativas, quando autorizado.

### Relacionamentos principais

```text
User
├── Favorite
├── CompanyReview
├── Report
└── AuditLog
```

A identidade do usuário deve permanecer separada das entidades de negócio.

---

# 7. Business Context

## 7.1. Company

Representa uma empresa ou profissional apresentado na plataforma.

A entidade `Company` é uma das principais entidades do domínio do Bairu.

Responsabilidades:

- identificação pública;
- informações institucionais;
- informações de contato;
- presença digital;
- horários de funcionamento;
- associação com categorias;
- associação com catálogo;
- publicação de conteúdo;
- recebimento de avaliações;
- recebimento de favoritos;
- associação com mídias.

### Relacionamentos

```text
Company
├── CompanySocialLink
├── CompanyBusinessDay
├── CompanyBusinessHourPeriod
├── CompanyScheduleOverride
├── CompanyCategory
├── CompanyCatalogItem
├── FeedPublication
├── Favorite
├── CompanyReview
└── Media
```

### Mídias

No MVP, `Company` possui dois papéis específicos de mídia:

```text
profile_media_id
cover_media_id
```

Essas referências representam conceitos distintos e não devem ser substituídas por uma coleção genérica de mídias no MVP.

---

## 7.2. CompanySocialLink

Representa um vínculo entre uma empresa e uma presença em rede ou plataforma externa.

Exemplos:

- Instagram;
- Facebook;
- LinkedIn;
- website;
- outras plataformas suportadas.

A entidade existe porque o vínculo possui significado próprio para a apresentação pública da empresa.

### Relacionamento

```text
Company
   │
   └── CompanySocialLink
```

A remoção da empresa deve considerar a remoção de seus vínculos sociais conforme a estratégia de exclusão definida para o relacionamento.

---

## 7.3. CompanyBusinessDay

Representa a configuração de funcionamento de uma empresa para determinado dia da semana.

Responsabilidades:

- indicar se a empresa funciona naquele dia;
- manter configuração de funcionamento;
- associar períodos de horário ao dia.

### Relacionamento

```text
Company
   │
   └── CompanyBusinessDay
             │
             └── CompanyBusinessHourPeriod
```

---

## 7.4. CompanyBusinessHourPeriod

Representa um período de funcionamento dentro de um dia.

Uma empresa pode possuir múltiplos períodos no mesmo dia.

Exemplo:

```text
Segunda-feira

08:00 ───── 12:00
14:00 ───── 18:00
```

A entidade deve permitir representar intervalos separados.

Possui campo de observação quando houver necessidade de registrar informação contextual sobre o período.

---

## 7.5. CompanyScheduleOverride

Representa uma exceção ao horário normal de funcionamento.

Exemplos:

- feriados;
- fechamento excepcional;
- abertura excepcional;
- alteração temporária de horário.

A exceção deve prevalecer sobre a programação normal quando houver conflito.

O objetivo é evitar modificar permanentemente o horário recorrente para representar situações temporárias.

---

# 8. Discovery Context

## 8.1. Category

Representa uma categoria utilizada para organizar e facilitar a descoberta de empresas e conteúdos.

As categorias são hierárquicas.

Exemplo:

```text
Alimentação
├── Restaurantes
│   ├── Pizzarias
│   └── Hamburguerias
└── Padarias
```

Uma categoria pode possuir uma categoria pai.

A hierarquia deve permanecer simples no MVP.

---

## 8.2. CompanyCategory

Representa a associação entre uma empresa e uma categoria.

Essa entidade possui significado de domínio porque a associação participa diretamente da descoberta da empresa.

### Relacionamento

```text
Company ─── CompanyCategory ─── Category
```

A mesma empresa não deve ser associada duas vezes à mesma categoria.

Essa regra deve ser garantida por constraint de unicidade.

---

## 8.3. CompanyCatalogItem

Representa um produto ou item apresentado no catálogo de uma empresa.

Responsabilidades:

- nome;
- descrição;
- informações comerciais apresentadas;
- imagem;
- ordenação quando aplicável;
- associação à empresa.

Cada item pertence a uma única empresa.

### Mídia

No MVP:

```text
CompanyCatalogItem
└── media_id
```

Cada item possui uma única imagem.

### Limite do MVP

Empresas do plano gratuito podem possuir até 50 itens de catálogo.

Esse limite é uma regra de negócio e não deve ser tratado como constraint estrutural do banco.

---

# 9. Content Context

O contexto de conteúdo representa informações publicadas pelas empresas.

Os conteúdos possuem lifecycle próprio e seguem as convenções compartilhadas definidas para o módulo de conteúdo.

## 9.1. FeedPublication

`FeedPublication` representa a publicação distribuível no Feed.

O Feed não deve assumir as regras internas específicas de cada tipo de conteúdo.

Os conteúdos permanecem responsáveis por suas próprias regras de negócio.

Conceitualmente:

```text
Content
   │
   ├── Promotion
   ├── News
   ├── Job Vacancy
   ├── Event
   └── Coupon
          │
          ▼
   FeedPublication
```

A implementação concreta da relação entre conteúdo e `FeedPublication` deverá preservar esse desacoplamento.

---

## 9.2. CompanyPromotion

Representa uma promoção publicada por uma empresa.

No MVP:

- uma empresa pode possuir no máximo uma promoção ativa simultaneamente;
- uma promoção possui lifecycle;
- a promoção possui mídia;
- a promoção possui período de validade.

O limite e a validade são regras de negócio.

---

## 9.3. CompanyNews

Representa uma notícia ou atualização publicada por uma empresa.

No MVP:

- uma empresa pode possuir até três notícias dentro da janela operacional definida;
- notícias possuem lifecycle;
- notícias podem possuir mídia quando aplicável.

As regras exatas de publicação e expiração pertencem ao contexto de conteúdo.

---

## 9.4. CompanyJobVacancy

Representa uma oportunidade de trabalho publicada por uma empresa.

Responsabilidades:

- apresentar a oportunidade;
- informar dados relevantes da vaga;
- possuir lifecycle próprio;
- estar associada à empresa responsável pela publicação.

---

## 9.5. CompanyEvent

Representa um evento divulgado por uma empresa.

Responsabilidades:

- informações do evento;
- data e horário;
- informações de localização ou instruções;
- lifecycle;
- mídia quando aplicável.

Eventos podem possuir semântica temporal própria, diferente da simples publicação de uma notícia.

---

## 9.6. CompanyCoupon

Representa um cupom ou benefício divulgado por uma empresa.

No MVP, o cupom pode ser representado por:

- imagem;
- código.

O MVP não implementa mecanismo de resgate ou contabilização de utilização.

Portanto, o banco não deve introduzir estruturas de redemption ou coupon usage antes que essa capacidade faça parte do produto.

---

# 10. Feed Context

## 10.1. Responsabilidade

O Feed é responsável por distribuir e agregar conteúdos disponíveis para descoberta.

Ele não deve duplicar as regras de negócio dos conteúdos.

Exemplo:

```text
CompanyPromotion
       │
       ▼
FeedPublication
       │
       ▼
Feed
```

O mesmo princípio se aplica aos demais tipos de conteúdo.

---

## 10.2. Separação entre conteúdo e distribuição

O conteúdo é a fonte da verdade sobre sua própria regra de negócio.

O Feed representa a capacidade de distribuição.

Isso permite:

- adicionar novos tipos de conteúdo;
- alterar regras de distribuição;
- implementar diferentes estratégias de ordenação;
- evoluir o Feed sem mover regras de negócio dos conteúdos.

---

# 11. Community Context

## 11.1. Favorite

Representa a associação entre um usuário e uma empresa que ele deseja acompanhar ou acessar posteriormente.

### Relacionamento

```text
User ─── Favorite ─── Company
```

Um usuário não deve possuir mais de um favorito para a mesma empresa.

Essa regra deve ser garantida por constraint de unicidade:

```text
UNIQUE(user_id, company_id)
```

No MVP, o relacionamento possui lifecycle simples e deve utilizar Hard Delete.

---

## 11.2. CompanyReview

Representa uma avaliação realizada por um usuário sobre uma empresa.

### Relacionamento

```text
User ─── CompanyReview ─── Company
```

A avaliação possui significado próprio no domínio e não deve ser tratada como simples tabela intermediária.

Ela poderá participar do cálculo de indicadores derivados da empresa.

Exemplos:

```text
CompanyReview
      │
      ├── rating
      └── ...
             │
             ▼
Company
├── rating_average
└── rating_count
```

Os indicadores derivados não são fonte da verdade.

---

## 11.3. Report

Representa uma denúncia ou sinalização de conteúdo ou comportamento inadequado.

A entidade deve possuir contexto suficiente para que a plataforma consiga:

- identificar o alvo da denúncia;
- identificar o usuário responsável;
- registrar o motivo;
- acompanhar o tratamento administrativo.

O modelo exato do alvo da denúncia deverá evitar acoplamento desnecessário com todas as entidades denunciáveis.

---

# 12. Media Context

## 12.1. Media

Representa os metadados de um arquivo armazenado externamente.

O arquivo físico não é armazenado no PostgreSQL.

A entidade deve permitir:

- identificar a mídia;
- localizar o recurso no storage;
- conhecer suas características;
- controlar seu lifecycle;
- remover o recurso quando necessário.

### Relacionamentos

No MVP:

```text
Company
   ├── profile_media_id
   └── cover_media_id

CompanyCatalogItem
   └── media_id

CompanyPromotion
   └── media_id

CompanyNews
   └── media_id

CompanyCoupon
   └── media_id

CompanyEvent
   └── media_id
```

Uma mesma `Media` não deve ser compartilhada entre entidades no MVP.

As regras completas estão definidas em:

`CON-007-media-architecture-and-lifecycle-standards.md`

---

# 13. Administration Context

## 13.1. AuditLog

Representa um evento de auditoria da plataforma.

Não é uma entidade de negócio.

Sua finalidade é registrar operações relevantes que necessitam de rastreabilidade.

Exemplos:

- alteração administrativa;
- alteração de permissões;
- arquivamento;
- restauração;
- exclusão definitiva;
- operações relacionadas à privacidade.

O `AuditLog` não deve armazenar cópias completas das entidades.

As regras completas estão definidas em:

`CON-008-data-lifecycle-and-audit-standards.md`.

---

# 14. Relacionamentos Principais

A visão consolidada dos principais relacionamentos é:

```text
User
 │
 ├──────── Favorite ──────── Company
 │                              │
 ├──────── CompanyReview ───────┤
 │                              │
 └──────── Report               │
                                │
                    ┌───────────┼─────────────┐
                    │           │             │
                    ▼           ▼             ▼
                Category     Catalog       Content
                    │           │             │
                    │           │             ▼
                    │           │       FeedPublication
                    │           │
                    ▼           ▼
              CompanyCategory  Media
```

Uma visão mais detalhada:

```text
                           ┌──────────────┐
                           │     User     │
                           └──────┬───────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
             Favorite         Review            Report
                 │                │
                 └───────┬────────┘
                         ▼
                    ┌─────────┐
                    │ Company │
                    └────┬────┘
                         │
       ┌─────────────────┼───────────────────┐
       │                 │                   │
       ▼                 ▼                   ▼
   Categories         Catalog             Content
       │                 │                   │
       ▼                 ▼                   ▼
 CompanyCategory      Media           FeedPublication
       │
       ▼
   Category
```

---

# 15. Cardinalidades

As principais cardinalidades do MVP são:

| Relação                                        | Cardinalidade          |
| ---------------------------------------------- | ---------------------- |
| User → Favorite                                | 1:N                    |
| Company → Favorite                             | 1:N                    |
| User → CompanyReview                           | 1:N                    |
| Company → CompanyReview                        | 1:N                    |
| Company → CompanySocialLink                    | 1:N                    |
| Company → CompanyBusinessDay                   | 1:N                    |
| CompanyBusinessDay → CompanyBusinessHourPeriod | 1:N                    |
| Company → CompanyScheduleOverride              | 1:N                    |
| Company → CompanyCategory                      | 1:N                    |
| Category → CompanyCategory                     | 1:N                    |
| Company → CompanyCatalogItem                   | 1:N                    |
| Company → Content                              | 1:N                    |
| Company → Media                                | 1:N por papel de mídia |
| User → Report                                  | 1:N                    |
| Company → Report                               | quando aplicável       |

---

# 16. Ownership

Cada entidade deve possuir um contexto responsável por seu lifecycle.

| Entidade                  | Contexto responsável       |
| ------------------------- | -------------------------- |
| User                      | Identity                   |
| Company                   | Business                   |
| CompanySocialLink         | Business                   |
| CompanyBusinessDay        | Business                   |
| CompanyBusinessHourPeriod | Business                   |
| CompanyScheduleOverride   | Business                   |
| Category                  | Discovery                  |
| CompanyCategory           | Discovery                  |
| CompanyCatalogItem        | Discovery                  |
| FeedPublication           | Feed                       |
| CompanyPromotion          | Content                    |
| CompanyNews               | Content                    |
| CompanyJobVacancy         | Content                    |
| CompanyEvent              | Content                    |
| CompanyCoupon             | Content                    |
| Favorite                  | Community                  |
| CompanyReview             | Community                  |
| Report                    | Community / Administration |
| Media                     | Media                      |
| AuditLog                  | Administration             |

Ownership não significa necessariamente que o contexto seja o único que pode consultar a entidade.

Significa que suas regras e lifecycle devem permanecer sob responsabilidade do contexto correspondente.

---

# 17. Estratégia de Exclusão

A estratégia de exclusão deve seguir as convenções definidas em `CON-002` e `CON-008`.

Como regra geral:

```text
Estado de negócio
       │
       ├── Inactive
       ├── Archived
       │
       └── Hard Delete
```

Não deve ser criado `deleted_at` em todas as entidades.

Cada entidade deve possuir uma estratégia definida de acordo com seu significado no domínio.

### Entidades de relacionamento

Relacionamentos simples, como:

```text
Favorite
CompanyCategory
```

tendem a utilizar Hard Delete.

### Mídias

`Media` utiliza Hard Delete no MVP, juntamente com a remoção do arquivo físico.

### Conteúdo

Conteúdos possuem lifecycle próprio e podem ser expirados ou arquivados conforme suas regras.

---

# 18. Dados Derivados

Dados derivados não são fonte da verdade.

Possíveis indicadores derivados incluem:

```text
Company
├── rating_average
├── rating_count
├── favorites_count
└── catalog_items_count
```

A necessidade de persistir esses campos deve ser avaliada conforme os padrões reais de consulta.

O MVP não deve criar campos derivados apenas por antecipação.

Quando utilizados, devem:

- ser atualizados de forma consistente;
- poder ser recalculados;
- não ser editáveis diretamente pelo usuário.

---

# 19. Temporalidade

Entidades podem possuir diferentes tipos de datas.

### Auditoria técnica

```text
created_at
updated_at
```

Representam instantes no tempo.

### Lifecycle

```text
starts_at
expires_at
archived_at
```

Representam eventos ou limites temporais do ciclo de vida.

### Domínio

Eventos e horários de funcionamento podem possuir semântica própria.

Datas devem ser modeladas de acordo com seu significado de negócio.

As convenções gerais de temporalidade estão definidas em `CON-002` e nas convenções específicas do contexto de conteúdo.

---

# 20. Mídias e Ownership

O relacionamento entre entidade e mídia deve representar ownership claro.

No MVP:

```text
Company ── profile_media_id ── Media
Company ── cover_media_id ─── Media

CatalogItem ── media_id ───── Media
Promotion ──── media_id ───── Media
```

A mesma mídia não deve ser referenciada por duas entidades diferentes.

Isso permite que o lifecycle da mídia seja determinado de forma previsível.

---

# 21. Regras de Integridade Importantes

As seguintes regras devem ser refletidas no banco sempre que possível.

### 21.1. Favorite

```text
UNIQUE(user_id, company_id)
```

### 21.2. CompanyCategory

```text
UNIQUE(company_id, category_id)
```

### 21.3. Foreign Keys

Relacionamentos obrigatórios devem utilizar `NOT NULL`.

### 21.4. Identificadores

Entidades persistentes devem utilizar UUID.

### 21.5. Auditoria

Entidades relevantes devem possuir:

```text
created_at
updated_at
```

quando aplicável.

### 21.6. Integridade de status

Valores controlados devem utilizar ENUM ou mecanismo equivalente conforme `CON-002`.

---

# 22. Limites do MVP

O modelo não deve antecipar funcionalidades que ainda não fazem parte do produto.

Estão explicitamente fora do escopo inicial:

- compartilhamento de mídias;
- galerias de imagens;
- vídeos;
- documentos;
- mecanismo de resgate de cupons;
- histórico completo de alterações de todas as entidades;
- retenção configurável por usuário;
- múltiplos provedores de storage simultâneos;
- arquitetura distribuída;
- microserviços;
- banco separado por contexto;
- processamento assíncrono obrigatório para mídias;
- sistema completo de recomendação;
- marketplace transacional.

Esses itens podem ser introduzidos posteriormente mediante necessidade real e documentação apropriada.

---

# 23. Relação com o Prisma

O `schema.prisma` deverá implementar o modelo definido neste documento.

Cada model do Prisma deve possuir correspondência clara com uma entidade documentada.

Exemplo:

```text
Company
CompanySocialLink
CompanyBusinessDay
CompanyBusinessHourPeriod
CompanyScheduleOverride

Category
CompanyCategory
CompanyCatalogItem

FeedPublication

CompanyPromotion
CompanyNews
CompanyJobVacancy
CompanyEvent
CompanyCoupon

Favorite
CompanyReview
Report

Media
AuditLog
```

A implementação poderá utilizar nomes técnicos diferentes para tabelas ou campos quando necessário para respeitar as convenções do banco.

As tabelas PostgreSQL devem seguir `snake_case`, conforme `CON-002`.

---

# 24. Regras para a Migration Inicial

A primeira migration do domínio deve:

1. criar as extensões necessárias;
2. criar os tipos controlados necessários;
3. criar as tabelas na ordem compatível com suas dependências;
4. criar Primary Keys;
5. criar Foreign Keys;
6. criar constraints de unicidade;
7. criar índices necessários;
8. criar defaults apropriados;
9. respeitar nulabilidade;
10. respeitar as estratégias de exclusão;
11. evitar estruturas que não estejam justificadas neste documento.

A migration inicial não deve incluir funcionalidades futuras apenas porque estão previstas na arquitetura.

---

# 25. Critérios de Validação do Modelo

Antes de considerar o modelo pronto para implementação, deve ser possível responder:

- Qual contexto é responsável por cada entidade?
- Qual é a fonte da verdade de cada informação?
- Qual é o owner de cada relacionamento?
- Quais entidades possuem lifecycle próprio?
- Quais entidades podem ser excluídas fisicamente?
- Quais entidades possuem dados derivados?
- Quais relacionamentos possuem unicidade?
- Quais mídias pertencem a cada entidade?
- Quais entidades possuem datas de lifecycle?
- Quais regras devem ser garantidas pelo banco?
- Quais regras permanecem exclusivamente na camada de domínio?
- Quais entidades fazem parte do MVP?
- Quais funcionalidades foram explicitamente deixadas para o futuro?

Se essas perguntas não puderem ser respondidas, o modelo ainda não deve ser considerado pronto para migration.

---

# 26. Próxima Etapa

Após a aprovação deste modelo, a implementação deverá seguir:

```text
DB-002
Core Domain Data Model
        │
        ▼
Revisão das entidades
        │
        ▼
Prisma Schema
        │
        ▼
Validação do Schema
        │
        ▼
Migration
        │
        ▼
Testes de persistência
```

Qualquer alteração estrutural significativa identificada durante a implementação deverá ser refletida neste documento antes da criação da migration correspondente.

---

# 27. Manutenção

Este documento deve ser atualizado sempre que uma entidade, relacionamento ou regra estrutural do modelo de dados for alterada.

Mudanças que representem decisões arquiteturais relevantes devem ser acompanhadas de ADR quando aplicável.

O documento deve refletir o modelo efetivamente adotado pelo Bairu e não uma arquitetura hipotética para versões futuras.
