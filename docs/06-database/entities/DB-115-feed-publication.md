# DB-115 — FeedPublication

## 1. Objetivo

`FeedPublication` representa a publicação de um conteúdo no Feed do Bairu.

A entidade funciona como uma camada de distribuição entre os conteúdos do módulo `Content` e a experiência do Feed.

Ela não substitui nem duplica o conteúdo original.

---

## 2. Responsabilidade

`FeedPublication` é responsável por:

- registrar que um conteúdo foi publicado no Feed;
- identificar o conteúdo publicado;
- associar a publicação à empresa responsável;
- registrar o momento da publicação;
- controlar a disponibilidade da publicação no Feed;
- representar o estado da publicação;
- permitir que o Feed agregue diferentes tipos de conteúdo.

As regras e os dados específicos do conteúdo permanecem sob responsabilidade da entidade de origem.

---

## 3. Conteúdos Publicáveis

No MVP, os seguintes tipos de conteúdo podem gerar uma `FeedPublication`:

- `CompanyPromotion`;
- `CompanyNews`;
- `CompanyCoupon`;
- `CompanyJob`;
- `CompanyEvent`.

`CompanyCatalogItem` não gera `FeedPublication` no MVP.

### Motivo

Itens de catálogo representam a oferta permanente da empresa e podem existir em grande quantidade.

Publicar cada item individualmente no Feed poderia gerar concentrações excessivas de publicações de uma mesma empresa e prejudicar a experiência de descoberta.

O catálogo permanece disponível no perfil público da empresa.

---

## 4. Estrutura

Campos previstos para o MVP:

| Campo          | Tipo        | Obrigatório | Padrão              | Descrição                                              |
| -------------- | ----------- | ----------: | ------------------- | ------------------------------------------------------ |
| `id`           | UUID        |         Sim | `gen_random_uuid()` | Identificador da publicação.                           |
| `company_id`   | UUID        |         Sim | —                   | Empresa responsável pela publicação.                   |
| `content_type` | ENUM        |         Sim | —                   | Tipo do conteúdo publicado.                            |
| `content_id`   | UUID        |         Sim | —                   | Identificador do conteúdo de origem.                   |
| `published_at` | TIMESTAMPTZ |         Sim | `NOW()`             | Momento em que o conteúdo foi publicado no Feed.       |
| `expires_at`   | TIMESTAMPTZ |         Não | `NULL`              | Momento em que a publicação deixa de estar disponível. |
| `status`       | ENUM        |         Sim | `ACTIVE`            | Estado atual da publicação.                            |
| `created_at`   | TIMESTAMPTZ |         Sim | `NOW()`             | Momento de criação do registro.                        |
| `updated_at`   | TIMESTAMPTZ |         Sim | `NOW()`             | Momento da última alteração.                           |

### `content_type`

Representa o tipo da entidade de conteúdo referenciada.

Valores previstos no MVP:

```text
PROMOTION
NEWS
COUPON
EVENT
JOB
```

Novos tipos poderão ser adicionados conforme novos conteúdos forem incorporados à plataforma.

---

## 5. Enums

### 5.1. FeedContentType

enum FeedContentType {
PROMOTION
NEWS
COUPON
EVENT
JOB
}

### 5.2. FeedPublicationStatus

```
enum FeedPublicationStatus {
  ACTIVE
  ARCHIVED
  EXPIRED
}
```

---

## 6. Relacionamento com Company

Toda FeedPublication pertence a uma única Company.

```
Company
   │
   │ 1:N
   ▼
FeedPublication
```

company_id deve possuir uma Foreign Key para Company.id.

A empresa associada à publicação deve ser a mesma empresa responsável pelo conteúdo de origem.

A consistência entre company_id e a empresa proprietária do conteúdo deve ser validada pela camada de domínio.

---

## 7. Relacionamento com Content

FeedPublication referencia uma entidade pertencente ao Bounded Context Content.

O relacionamento é polimórfico através de:

```
content_type
content_id
```

Exemplo:

```
FeedPublication
├── content_type = NEWS
└── content_id = <News UUID>
```

ou:

```
FeedPublication
├── content_type = EVENT
└── content_id = <Event UUID>
```

O banco não utiliza uma Foreign Key única para content_id, pois o identificador pode apontar para diferentes entidades conforme o valor de content_type.

A integridade dessa referência deve ser garantida pela camada de aplicação.

A resolução deve ocorrer exclusivamente no backend.

---

## 8. Fonte da Verdade

FeedPublication não é a fonte da verdade do conteúdo publicado.
A fonte da verdade permanece na entidade de origem:

```
CompanyPromotion
CompanyNews
CompanyCoupon
CompanyJob
CompanyEvent
```

FeedPublication representa somente a distribuição desse conteúdo no Feed.

Não devem ser duplicados na publicação campos pertencentes ao conteúdo original, como:

- título;
- descrição;
- preço;
- regras;
- localização;
- horários;
- código de cupom;
- requisitos de vaga.

O conteúdo original continua sendo responsável por seus próprios dados e regras de negócio.

---

## 9. Criação

A publicação deve ser criada como consequência da publicação de um conteúdo elegível para o Feed.

Fluxo conceitual:

```
Content
   ↓
Conteúdo validado e persistido
   ↓
FeedPublication criada
   ↓
Conteúdo disponível no Feed
```

No MVP, a criação da publicação deve ocorrer de forma controlada pelo backend.

Não deve existir uma operação genérica que permita ao cliente publicar arbitrariamente qualquer entidade no Feed.

A utilização de eventos de domínio para desacoplar esse fluxo poderá ser introduzida futuramente.

---

## 10. Disponibilidade no Feed

A existência de uma FeedPublication não significa, isoladamente, que o conteúdo deve ser exibido.

A disponibilidade depende da combinação entre:

estado da FeedPublication;
estado do conteúdo de origem;
período de publicação;
published_at;
expires_at, quando aplicável.

Conceitualmente:

```
FeedPublication ativa
        +
Content elegível
        +
Content dentro do período válido
        ↓
Disponível no Feed
```

Conteúdos inativos, arquivados ou expirados não devem aparecer no Feed público.

As regras específicas de lifecycle do conteúdo permanecem sob responsabilidade da entidade de origem e das convenções do módulo Content.

---

## 11. Ordenação

No MVP, o Feed utilizará published_at como referência para ordenação.

A ordenação padrão será cronológica, priorizando conteúdos publicados mais recentemente.

Não fazem parte do MVP:

ranking personalizado;
algoritmo de recomendação;
pontuação de relevância;
personalização por usuário;
múltiplos feeds especializados.

Esses mecanismos poderão ser avaliados futuramente caso exista necessidade concreta.

---

## 12. Exclusão

FeedPublication possui lifecycle dependente do conteúdo de origem.

Quando o conteúdo deixar de existir ou deixar de ser elegível para publicação, sua FeedPublication correspondente deverá deixar de estar disponível no Feed.

A exclusão da publicação não deve apagar o conteúdo de origem.

Exemplo:

```
CompanyNews
     ↓
FeedPublication
```

A remoção da FeedPublication remove sua distribuição no Feed, mas não remove o conteúdo.

Quando o conteúdo de origem for excluído, a publicação correspondente também deverá ser tratada conforme o fluxo de exclusão definido pelo domínio.

---

## 13. Hard Delete

FeedPublication utilizará Hard Delete no MVP.

A entidade representa uma relação operacional de distribuição e não possui, inicialmente, necessidade de retenção histórica independente do conteúdo.

Quando a publicação deixar de ser necessária:

```
FeedPublication
       ↓
Hard Delete
```

Caso a operação esteja sujeita à auditoria, o fato da exclusão poderá ser registrado conforme as convenções gerais de auditoria da plataforma.

O lifecycle e a retenção de registros de auditoria não fazem parte da responsabilidade desta entidade.

---

## 14. Constraints

A entidade deve possuir:

- `id` como chave primária UUID;
- `company_id` obrigatório;
- `content_type` obrigatório;
- `content_id` obrigatório;
- `published_at` obrigatório;
- `status` obrigatório;
- `created_at` obrigatório;
- `updated_at` obrigatório.

`expires_at` é opcional.

### Foreign Key

`company_id → Company.id`

### Unicidade

A combinação: `(content_type, content_id)`

deve ser única no MVP.

Essa constraint impede que o mesmo conteúdo possua múltiplas FeedPublication.
`UNIQUE(content_type, content_id)`

A integridade entre content_type e content_id, por outro lado, permanece responsabilidade da camada de domínio.

---

## 15. Índices

Índices previstos:
`idx_feed_publications_company_id`

para consultas por empresa.
`idx_feed_publications_published_at`

para ordenação cronológica do Feed.
`idx_feed_publications_status`

para filtragem por estado da publicação.
`idx_feed_publications_content_type`

para filtragem por tipo de conteúdo.
`idx_feed_publications_expires_at`

para identificação de publicações expiradas.
A combinação: `(content_type, content_id)` deve possuir índice único para garantir a regra de unicidade.

O desenho definitivo dos índices deverá ser validado conforme as consultas reais implementadas pelo Feed.

---

## 16. Lifecycle da Publicação

O lifecycle da FeedPublication é:

```
                  ┌─────────────┐
                  │   Created   │
                  └──────┬──────┘
                         ↓
                  ┌─────────────┐
                  │   ACTIVE    │
                  └──────┬──────┘
                         │
                ┌────────┴────────┐
                ↓                 ↓
          ┌───────────┐     ┌───────────┐
          │  EXPIRED  │     │  ARCHIVED │
          └─────┬─────┘     └─────┬─────┘
                │                 │
                └────────┬────────┘
                         ↓
                    Hard Delete
```

Os estados da publicação não substituem o lifecycle do conteúdo de origem.

---

## 17. Relacionamentos

```
Company
   │
   │ 1:N
   ▼
FeedPublication
   │
   │ content_type + content_id
   ▼
Content Entity
```

Um conteúdo elegível possui, no máximo, uma FeedPublication no MVP.

A entidade não deve possuir relacionamentos físicos separados com cada tipo de conteúdo através de múltiplas Foreign Keys.

---

## 18. Decisões Importantes

| Decisão                                                | Justificativa                                                  |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| `FeedPublication` é separada das entidades de conteúdo | Separa criação de conteúdo de sua distribuição.                |
| Conteúdo continua sendo a fonte da verdade             | Evita duplicação e inconsistência de dados.                    |
| `content_type` + `content_id`                          | Permite que o Feed agregue diferentes tipos de conteúdo.       |
| Associação de conteúdo resolvida no backend            | Mantém a flexibilidade do relacionamento polimórfico.          |
| Uma publicação por conteúdo no MVP                     | Evita duplicidade e mantém o modelo simples.                   |
| `company_id` como FK real                              | Garante a associação da publicação com uma empresa existente.  |
| `published_at`                                         | Permite ordenação cronológica.                                 |
| `expires_at`                                           | Permite controlar a disponibilidade temporal da publicação.    |
| `status`                                               | Permite distinguir publicações ativas, expiradas e arquivadas. |
| `CompanyCatalogItem` fora do Feed                      | Evita que grandes catálogos dominem a experiência do Feed.     |
| Hard Delete                                            | Publicações não precisam de histórico próprio no MVP.          |
| Sem algoritmo de ranking                               | Evita complexidade prematura.                                  |
| Sem múltiplos feeds                                    | Não existe necessidade concreta no MVP.                        |

---

## 19. Relação com Outras Convenções

Este documento deve ser utilizado em conjunto com:

- CON-001-architecture-conventions.md;
- CON-002-domain-and-data-modeling-conventions.md;
- CON-008-data-lifecycle-and-audit-standards.md;
- CON-010-content-module-standards.md, quando aplicável;
- convenções específicas das entidades de conteúdo.

As regras gerais de lifecycle, auditoria, exclusão e persistência não devem ser duplicadas neste documento.

---

## 20. Manutenção

Este documento deve ser atualizado quando houver alteração relevante no modelo de publicação ou distribuição de conteúdos no Feed.

A introdução de:

- novos tipos de conteúdo;
- múltiplas publicações por conteúdo;
- ranking;
- personalização;
- agendamento;
- destaque ou fixação;
- novos mecanismos de distribuição;

deverá ser avaliada antes de alterar o modelo.

Mudanças arquiteturais relevantes devem ser registradas também como ADR.
