# DB-114 — Coupon

## 1. Objetivo

A entidade `Coupon` representa um cupom ou benefício divulgado por um negócio no Bairu.

A entidade pertence ao Bounded Context `Content`.

No MVP, o cupom funciona como uma informação promocional que pode ser apresentada à comunidade. O Bairu não realiza o controle de resgate do cupom nesta primeira versão.

---

## 2. Responsabilidade

`Coupon` é responsável por representar as informações próprias do cupom.

Compete à entidade:

- identificar o negócio responsável;
- descrever o benefício oferecido;
- disponibilizar as informações necessárias para utilização do cupom;
- controlar seu período de validade;
- controlar seu lifecycle.

O controle de resgate não faz parte da responsabilidade da entidade no MVP.

---

## 3. Estrutura

Campos previstos para o MVP:

| Campo         | Tipo        | Obrigatório | Descrição                                       |
| ------------- | ----------- | ----------: | ----------------------------------------------- |
| `id`          | UUID        |         Sim | Identificador do cupom                          |
| `company_id`  | UUID        |         Sim | Negócio responsável pelo cupom                  |
| `title`       | VARCHAR     |         Sim | Nome do cupom                                   |
| `description` | TEXT        |         Não | Descrição do benefício                          |
| `code`        | VARCHAR     |         Não | Código utilizado pelo cliente, quando aplicável |
| `media_id`    | UUID        |         Não | Imagem associada ao cupom                       |
| `starts_at`   | TIMESTAMPTZ |         Sim | Início da validade                              |
| `expires_at`  | TIMESTAMPTZ |         Sim | Término da validade                             |
| `status`      | ENUM        |         Sim | Estado do cupom                                 |
| `created_at`  | TIMESTAMPTZ |         Sim | Momento de criação                              |
| `updated_at`  | TIMESTAMPTZ |         Sim | Momento da última alteração                     |

O cupom poderá utilizar **imagem ou código** como forma de apresentação do benefício.

A utilização de `code` é opcional porque nem todo cupom precisa possuir um código textual.

---

## 4. Relacionamentos

### Company

Cada cupom pertence a um único negócio.

```text
Company
   │
   └── Coupon
```

Um negócio pode possuir vários cupons, respeitando os limites definidos pelas regras do produto e dos planos.

### Media

Um cupom pode possuir uma imagem.

```text
Coupon
   │
   └── Media
```

A mídia é gerenciada pelo Media Module e armazenada externamente.

### FeedPublication

Um cupom poderá ser distribuído pelo Feed.

```text
Coupon
   │
   ▼
FeedPublication
```

O `Feed` não se torna responsável pelas regras do cupom.

---

## 5. Regras de Negócio

No MVP:

- um cupom pertence a um único `Company`;
- um `Company` pode possuir vários cupons, respeitando os limites aplicáveis;
- o cupom deve possuir um título;
- o cupom deve possuir um período de validade;
- `expires_at` deve ser posterior a `starts_at`;
- o cupom pode possuir uma imagem;
- o cupom pode possuir um código;
- o cupom pode utilizar imagem ou código para apresentar o benefício;
- o Bairu não controla o resgate do cupom;
- a validação ou aplicação do benefício ocorre fora da plataforma;
- cupons fora do período de validade não devem ser apresentados como ativos;
- cupons podem ser distribuídos pelo Feed quando publicados.

Regras específicas de quantidade, duração e disponibilidade devem permanecer nas regras do módulo `Content` e dos planos aplicáveis.

---

## 6. Lifecycle

O lifecycle do cupom segue as convenções gerais de conteúdo.

Conceitualmente:

```text
DRAFT
  ↓
PUBLISHED
  ↓
ACTIVE
  ↓
EXPIRED / ARCHIVED
```

A validade temporal é determinada por:

```text
starts_at
expires_at
```

A expiração do cupom não implica automaticamente Hard Delete.

O registro poderá permanecer armazenado para histórico, auditoria ou outras finalidades legítimas.

---

## 7. Constraints

Devem ser aplicadas:

- `PRIMARY KEY` em `id`;
- `FOREIGN KEY` em `company_id`;
- `FOREIGN KEY` em `media_id`, quando utilizado;
- `NOT NULL` nos campos obrigatórios;
- valores controlados para `status`;
- `expires_at > starts_at`.

Caso `code` possua uma regra de unicidade, ela deverá ser definida de acordo com o escopo da regra.

Por exemplo, caso o código precise ser único apenas dentro de um negócio:

```text
UNIQUE (company_id, code)
```

A necessidade dessa constraint deve ser definida conforme a regra real de negócio.

---

## 8. Índices

Índices candidatos:

```text
idx_coupons_company_id
idx_coupons_status
idx_coupons_starts_at
idx_coupons_expires_at
```

Caso códigos sejam utilizados frequentemente para consulta, um índice ou constraint de unicidade poderá ser adicionado conforme a regra definida.

Índices adicionais devem ser introduzidos conforme os padrões reais de consulta.

---

## 9. Exclusão

A estratégia de exclusão deve seguir:

- `CON-002-domain-and-data-modeling-conventions.md`;
- `CON-008-data-lifecycle-and-audit-standards.md`.

Um cupom expirado não deve ser automaticamente excluído.

Quando houver necessidade de preservar histórico, o registro poderá permanecer armazenado.

Hard Delete poderá ser utilizado quando não houver necessidade legítima de retenção.

A exclusão também deve considerar eventual mídia associada.

---

## 10. Decisões Importantes

### 10.1. Coupon pertence ao Content

`Coupon` representa o conteúdo promocional e suas regras de negócio.

O Feed é responsável somente por sua distribuição e agregação.

### 10.2. Sem controle de resgate no MVP

O Bairu não controla:

- quantidade de resgates;
- quem utilizou o cupom;
- momento do resgate;
- validação do código;
- limite de utilizações.

Essas funcionalidades poderão ser avaliadas futuramente caso o produto necessite desse nível de controle.

### 10.3. Código é opcional

Nem todo cupom precisa utilizar código.

O benefício também poderá ser apresentado por meio de uma imagem ou outras informações fornecidas pelo negócio, conforme as capacidades do MVP.

### 10.4. Validade pertence ao cupom

`starts_at` e `expires_at` representam o período em que o benefício é válido.

A validade do cupom não deve ser confundida com o lifecycle de distribuição do Feed.

### 10.5. Uma mídia no MVP

Um cupom poderá possuir uma única imagem.

Suporte a múltiplas imagens poderá ser avaliado futuramente caso exista necessidade concreta.

---

## 11. Relação com Outras Convenções

Este documento deve ser utilizado em conjunto com:

- `CON-001-architecture-conventions.md`;
- `CON-002-domain-and-data-modeling-conventions.md`;
- `CON-007-media-architecture-and-lifecycle-standards.md`;
- `CON-008-data-lifecycle-and-audit-standards.md`;
- documentação de `Company`;
- documentação de `FeedPublication`;
- convenções compartilhadas do módulo `Content`.

---

## 12. Manutenção

Este documento deve ser atualizado quando houver alteração relevante na estrutura ou nas regras de negócio de `Coupon`.

Novos recursos, como controle de resgate, limite de utilizações, usuários participantes ou integração com sistemas externos, devem ser avaliados separadamente antes de serem incorporados ao modelo.

Mudanças estruturais relevantes devem ser refletidas nas migrations e, quando representarem uma decisão arquitetural significativa, registradas também como ADR.
