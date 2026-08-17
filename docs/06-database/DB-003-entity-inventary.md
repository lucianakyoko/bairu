# DB-003 — Entity Inventory

## 1. Objetivo

Este documento apresenta o inventário oficial das entidades persistentes do Bairu, organizadas de acordo com os Bounded Contexts definidos na arquitetura da plataforma.

Seu objetivo é estabelecer uma referência central para:

- identificar as entidades existentes;
- definir o contexto de domínio ao qual cada entidade pertence;
- evitar duplicação de conceitos;
- orientar a criação dos documentos detalhados de cada entidade;
- apoiar a evolução do modelo de dados e das migrations.

Este documento não define a estrutura completa das tabelas. Detalhes de atributos, relacionamentos, constraints, índices, lifecycle e estratégias de exclusão devem ser documentados nos respectivos documentos de entidade.

---

## 2. Bounded Contexts

O domínio do Bairu é organizado nos seguintes Bounded Contexts:

```text
Identity
Business
Catalog
Content
Feed
Community
Administration
```

Esses contextos representam limites conceituais do domínio e permanecem, no MVP, dentro de uma aplicação backend única.

---

# 3. Identity

Responsável por identidade, autenticação e relação entre usuários e negócios administrados.

### Entidades

| Entidade      | Responsabilidade                                           |
| ------------- | ---------------------------------------------------------- |
| `User`        | Representa um usuário da plataforma.                       |
| `UserCompany` | Representa a relação entre usuário e negócio administrado. |

### Relações principais

```text
User
 └── manages / owns ──> Company
```

Um usuário poderá possuir ou administrar um ou mais negócios.

O painel administrativo do Bairu possui, no MVP, acesso restrito ao usuário administrador definido para a operação da plataforma.

A existência de múltiplos administradores deverá ser tratada como evolução futura, caso necessária.

---

# 4. Business

Responsável pela representação dos negócios e suas informações institucionais.

Profissionais autônomos são representados pelo mesmo conceito de negócio utilizado para empresas.

### Entidades

| Entidade                    | Responsabilidade                                                        |
| --------------------------- | ----------------------------------------------------------------------- |
| `Company`                   | Representa uma empresa ou profissional autônomo presente na plataforma. |
| `CompanyExternalLink`       | Representa um perfil ou canal social associado ao negócio.              |
| `CompanyBusinessDay`        | Representa a configuração de dias de funcionamento do negócio.          |
| `CompanyBusinessHourPeriod` | Representa os períodos de funcionamento dentro de um dia.               |
| `CompanyScheduleOverride`   | Representa exceções ao horário normal de funcionamento.                 |

### Observação

Não será criada uma entidade separada para `Professional` no MVP.

O conceito de profissional autônomo será representado por `Company`, evitando duplicação entre modelos com comportamento semelhante.

---

# 5. Catalog

Responsável pela apresentação estruturada de produtos e itens oferecidos pelos negócios.

A separação do Catalog em um Bounded Context próprio permite manter suas regras independentes das informações institucionais de `Company` e das publicações do `Content`.

### Entidades

| Entidade             | Responsabilidade                                                    |
| -------------------- | ------------------------------------------------------------------- |
| `Category`           | Representa uma categoria utilizada para classificação e descoberta. |
| `CompanyCategory`    | Representa a associação entre um negócio e uma categoria.           |
| `CompanyCatalogItem` | Representa um item apresentado no catálogo de um negócio.           |

### Relações principais

```text
Company
   │
   ├── CompanyCategory ──> Category
   │
   └── CompanyCatalogItem
```

`CompanyCatalogItem` representa o item de catálogo propriamente dito.

Sua publicação ou distribuição no Feed, quando aplicável, pertence ao contexto responsável pela publicação e distribuição de conteúdo.

---

# 6. Content

Responsável pelos conteúdos publicados pelos negócios e pelas regras específicas de cada tipo de conteúdo.

### Entidades

| Entidade     | Responsabilidade                                                     |
| ------------ | -------------------------------------------------------------------- |
| `Promotion`  | Representa uma promoção publicada por um negócio.                    |
| `News`       | Representa uma novidade ou informação publicada por um negócio.      |
| `JobVacancy` | Representa uma oportunidade de trabalho publicada por um negócio.    |
| `Event`      | Representa um evento publicado por um negócio.                       |
| `Coupon`     | Representa um cupom ou benefício promocional associado a um negócio. |

As regras de lifecycle, publicação, expiração e limites desses conteúdos devem seguir as convenções compartilhadas do módulo de Content.

### Observação

Os conteúdos possuem regras próprias de domínio, mesmo quando posteriormente distribuídos através do Feed.

O Content é responsável pelo significado e lifecycle do conteúdo.

---

# 7. Feed

Responsável pela distribuição e agregação de conteúdos que podem ser apresentados no feed da plataforma.

### Entidades

| Entidade          | Responsabilidade                                                                    |
| ----------------- | ----------------------------------------------------------------------------------- |
| `FeedPublication` | Representa a publicação utilizada pelo Feed para distribuir conteúdo na plataforma. |

### Princípio

O Feed não deve assumir as regras internas dos diferentes tipos de conteúdo.

Conceitualmente:

```text
Promotion
News
JobVacancy
Event
Coupon
Catalog Item
     │
     ▼
FeedPublication
     │
     ▼
    Feed
```

A entidade `FeedPublication` pertence ao contexto `Feed`, enquanto as regras específicas do conteúdo permanecem nos respectivos contextos de origem.

Isso permite adicionar novos tipos de conteúdo sem transformar o Feed em dependente das regras internas de cada domínio.

---

# 8. Community

Responsável pelas interações dos usuários com os negócios e conteúdos da plataforma.

### Entidades

| Entidade        | Responsabilidade                                                    |
| --------------- | ------------------------------------------------------------------- |
| `Favorite`      | Representa uma empresa salva por um usuário.                        |
| `CompanyReview` | Representa uma avaliação realizada por um usuário sobre um negócio. |

### Evolução futura

A entidade `Report` não faz parte do MVP.

O conceito de denúncia deverá ser adicionado em uma versão futura, após definição específica de suas regras de negócio, fluxo de moderação, estados e requisitos de auditoria.

```text
Future:

User
 └── Report ──> Company / Content / User / ...
```

O inventário registra essa intenção para evitar que o conceito seja esquecido durante a evolução do domínio.

---

# 9. Administration

Responsável pelas operações administrativas da plataforma.

### Entidades

| Entidade   | Responsabilidade                                                |
| ---------- | --------------------------------------------------------------- |
| `AuditLog` | Registra operações relevantes para rastreabilidade e auditoria. |

O contexto de Administration poderá receber novas entidades conforme surgirem necessidades administrativas concretas.

No MVP, não devem ser criadas entidades administrativas antecipadamente sem requisitos definidos.

---

# 10. Media

Mídias possuem arquitetura e lifecycle próprios, documentados em:

`CON-007-media-architecture-and-lifecycle-standards.md`

A entidade `Media` é uma entidade técnica compartilhada pela plataforma e não representa um Bounded Context de negócio independente no MVP.

Ela funciona como abstração entre as entidades de domínio e o provedor externo de armazenamento.

### Entidade

| Entidade | Responsabilidade                                                              |
| -------- | ----------------------------------------------------------------------------- |
| `Media`  | Representa os metadados e a referência de um arquivo armazenado externamente. |

### Relação conceitual

```text
Business / Catalog / Content
          │
          ▼
        Media
          │
          ▼
    Storage Provider
```

No MVP, uma mesma `Media` não deve ser compartilhada por múltiplas entidades de domínio.

---

# 11. Inventário Consolidado

| Bounded Context           | Entidades                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Identity**              | `User`, `UserCompany`                                                                                          |
| **Business**              | `Company`, `CompanyExternalLink`, `CompanyBusinessDay`, `CompanyBusinessHourPeriod`, `CompanyScheduleOverride` |
| **Catalog**               | `Category`, `CompanyCategory`, `CompanyCatalogItem`                                                            |
| **Content**               | `Promotion`, `News`, `JobVacancy`, `Event`, `Coupon`                                                           |
| **Feed**                  | `FeedPublication`                                                                                              |
| **Community**             | `Favorite`, `CompanyReview`                                                                                    |
| **Administration**        | `AuditLog`                                                                                                     |
| **Shared Infrastructure** | `Media`                                                                                                        |

---

# 12. Entidades Fora do MVP

Os seguintes conceitos foram identificados, mas não fazem parte do modelo inicial:

| Conceito                      | Status | Contexto previsto         |
| ----------------------------- | ------ | ------------------------- |
| `Report`                      | Futuro | Community                 |
| Vídeo                         | Futuro | Media                     |
| Documento/PDF                 | Futuro | Media                     |
| Múltiplas mídias por entidade | Futuro | Media                     |
| Compartilhamento de mídia     | Futuro | Media                     |
| Administração multiusuário    | Futuro | Administration / Identity |

Esses conceitos não devem gerar tabelas ou estruturas no banco enquanto não houver necessidade concreta.

---

# 13. Regras de Organização

As seguintes regras devem ser observadas durante a evolução do modelo:

1. Cada entidade deve possuir um Bounded Context claramente definido.
2. Um conceito de domínio não deve ser duplicado em diferentes contextos sem justificativa.
3. Entidades técnicas compartilhadas não devem ser transformadas automaticamente em novos Bounded Contexts.
4. Relações que possuem significado de negócio devem ser modeladas como entidades próprias quando apropriado.
5. O inventário deve ser atualizado antes da introdução de novas entidades relevantes.
6. Entidades futuras devem permanecer apenas documentadas enquanto não houver necessidade de implementação.
7. O inventário não substitui a documentação detalhada de cada entidade.

---

# 14. Próximos Documentos

Cada entidade persistente relevante deverá possuir documentação própria quando sua modelagem for definida.

Exemplo:

```text
docs/06-database/entities/

├── identity/
│   ├── DB-101-user.md
│   └── DB-102-user-company.md
│
├── business/
│   ├── DB-201-company.md
│   ├── DB-202-company-social-link.md
│   ├── DB-203-company-business-day.md
│   ├── DB-204-company-business-hour-period.md
│   └── DB-205-company-schedule-override.md
│
├── catalog/
│   ├── DB-301-category.md
│   ├── DB-302-company-category.md
│   └── DB-303-company-catalog-item.md
│
├── content/
│   ├── DB-401-promotion.md
│   ├── DB-402-news.md
│   ├── DB-403-job-vacancy.md
│   ├── DB-404-event.md
│   └── DB-405-coupon.md
│
├── feed/
│   └── DB-501-feed-publication.md
│
├── community/
│   ├── DB-601-favorite.md
│   └── DB-602-company-review.md
│
├── administration/
│   └── DB-701-audit-log.md
│
└── shared/
    └── DB-801-media.md
```

A numeração acima é apenas uma proposta de organização e poderá ser ajustada antes da criação dos documentos individuais.

---

# 15. Relação com Outros Documentos

Este documento deve ser utilizado em conjunto com:

- `DB-001-database-architecture.md` — arquitetura do banco de dados;
- `CON-001-architecture-conventions.md` — convenções arquiteturais;
- `CON-002-domain-and-data-modeling-conventions.md` — convenções de domínio e modelagem;
- `CON-007-media-architecture-and-lifecycle-standards.md` — arquitetura e lifecycle de mídias;
- `CON-008-data-lifecycle-and-audit-standards.md` — lifecycle, retenção e auditoria;
- documentos individuais das entidades.

Quando uma decisão sobre uma entidade representar uma alteração arquitetural significativa, a decisão deverá também ser registrada como ADR.

---

# 16. Manutenção

Este inventário deve ser atualizado sempre que:

- uma nova entidade for introduzida;
- uma entidade for removida;
- uma entidade mudar de Bounded Context;
- uma relação passar a representar um conceito próprio;
- uma decisão de domínio alterar significativamente o modelo.

O inventário deve representar o estado real do modelo de dados e não conceitos planejados que ainda não possuem implementação ou decisão consolidada.
