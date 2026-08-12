# DB-110 — Promotion

## 1. Objetivo

`Promotion` representa uma promoção publicada por uma `Company` para divulgação à comunidade.

A entidade pertence ao Bounded Context **Content**.

Uma promoção possui lifecycle próprio e pode ser distribuída pelo contexto `Feed` através de `FeedPublication`.

O Bairu atua como vitrine digital local. A entidade não representa uma transação comercial ou mecanismo de venda.

---

## 2. Responsabilidade

`Promotion` é responsável por representar:

- a promoção oferecida pelo negócio;
- seu conteúdo de apresentação;
- seu período de disponibilidade;
- sua imagem, quando aplicável;
- sua relação com a empresa responsável pela publicação.

A entidade não é responsável por:

- processar pagamentos;
- controlar pedidos;
- realizar resgates;
- processar transações;
- distribuir diretamente o conteúdo no Feed.

---

## 3. Campos

| Campo         | Tipo        | Obrigatório | Descrição                         |
| ------------- | ----------- | ----------: | --------------------------------- |
| `id`          | UUID        |         Sim | Identificador único da promoção   |
| `company_id`  | UUID        |         Sim | Empresa responsável pela promoção |
| `title`       | VARCHAR     |         Sim | Título da promoção                |
| `description` | TEXT        |         Não | Descrição da promoção             |
| `media_id`    | UUID        |         Não | Imagem associada à promoção       |
| `starts_at`   | TIMESTAMPTZ |         Sim | Início da disponibilidade         |
| `expires_at`  | TIMESTAMPTZ |         Sim | Momento de expiração              |
| `created_at`  | TIMESTAMPTZ |         Sim | Momento de criação                |
| `updated_at`  | TIMESTAMPTZ |         Sim | Momento da última alteração       |

`starts_at` e `expires_at` representam instantes no tempo e seguem a semântica temporal definida pelas convenções do módulo de Content.

---

## 4. Relacionamentos

### Company

Cada promoção pertence obrigatoriamente a uma `Company`.

```text
Company
   │
   └──< Promotion
```

Uma empresa pode possuir múltiplas promoções ao longo de seu ciclo de vida, respeitando os limites definidos para o plano e para o MVP.

### Media

Uma promoção pode possuir uma imagem.

```text
Promotion
   │
   └── 0..1 Media
```

No MVP, a promoção utiliza no máximo uma imagem.

O lifecycle da mídia segue:

`CON-007-media-architecture-and-lifecycle-standards.md`

### Feed

Uma promoção pode ser distribuída pelo Feed.

```text
Promotion
   │
   ▼
FeedPublication
```

A distribuição pertence ao contexto `Feed`.

---

## 5. Constraints

### Primary Key

```text
PRIMARY KEY (id)
```

### Foreign Keys

```text
company_id → companies.id
media_id   → media.id
```

`company_id` é obrigatório.

`media_id` é opcional.

### Regras estruturais

- `title` deve ser obrigatório;
- `starts_at` deve ser anterior a `expires_at`;
- `company_id` deve referenciar uma empresa existente;
- `media_id`, quando informado, deve referenciar uma mídia válida;
- uma promoção não deve possuir mais de uma mídia no MVP.

A regra de período inválido deve ser validada na aplicação e, quando aplicável, protegida também por constraint do banco.

---

## 6. Índices

O principal padrão de consulta esperado é a recuperação das promoções de uma empresa.

Índice recomendado:

```text
idx_promotions_company_id
```

Consultas relacionadas ao lifecycle também podem exigir índice envolvendo `starts_at` e `expires_at` conforme os padrões reais de consulta.

Índices adicionais não devem ser criados antecipadamente sem necessidade identificada.

---

## 7. Lifecycle

A promoção possui um lifecycle temporal.

Conceitualmente:

```text
        starts_at
            │
            ▼
       ┌─────────┐
       │  Active │
       └────┬────┘
            │
        expires_at
            │
            ▼
       ┌─────────┐
       │ Expired │
       └─────────┘
```

A promoção não precisa necessariamente armazenar um `status` derivado de seu período.

Seu estado de disponibilidade pode ser determinado a partir de:

```text
starts_at
expires_at
```

Quando necessário, estados adicionais deverão ser introduzidos somente se representarem regras reais de negócio.

---

## 8. Limites do MVP

No MVP, uma empresa poderá possuir:

**1 promoção ativa por vez.**

A promoção poderá permanecer disponível por até:

**7 dias.**

Esses limites representam regras de produto e não devem ser utilizados como constraints estruturais que impeçam futuras mudanças de plano ou configuração.

A aplicação deve ser responsável por validar os limites vigentes.

Planos pagos poderão futuramente possuir limites ou períodos de disponibilidade diferentes.

---

## 9. Exclusão

A estratégia de exclusão deve seguir o lifecycle geral de Content.

Uma promoção expirada não deve ser interpretada automaticamente como registro inexistente.

O registro poderá permanecer armazenado quando houver necessidade operacional, histórica ou de auditoria.

Quando a retenção deixar de ser necessária, a entidade poderá ser removida conforme as regras do `CON-008`.

A exclusão de uma promoção deve considerar também sua eventual `FeedPublication` e mídia associada.

---

## 10. Dados Derivados

`Promotion` não possui dados derivados definidos para o MVP.

Indicadores como:

```text
active_promotions_count
```

podem futuramente ser mantidos em `Company` caso exista necessidade comprovada de performance.

Nesse caso, o valor deverá ser tratado como dado derivado, tendo `Promotion` como fonte da verdade.

---

## 11. Imagem

Uma promoção pode possuir uma imagem associada.

No MVP:

```text
Promotion
   │
   └── 0..1 Media
```

A imagem é armazenada no storage externo e a entidade mantém somente a referência necessária à `Media`.

Múltiplas imagens ou galerias não fazem parte do MVP.

---

## 12. Feed

A promoção pertence ao contexto `Content`.

Quando precisar ser apresentada no Feed, sua distribuição será representada por `FeedPublication`.

```text
Content
   │
   └── Promotion
          │
          ▼
        Feed
          │
          └── FeedPublication
```

O `Feed` não deve assumir as regras internas da promoção.

Regras como validade, limite, conteúdo e expiração permanecem no contexto `Content`.

---

## 13. Regras de Negócio

As principais regras da entidade são:

1. Uma promoção pertence a uma única `Company`.
2. A promoção possui período de disponibilidade definido por `starts_at` e `expires_at`.
3. `starts_at` deve ser anterior a `expires_at`.
4. Uma empresa pode possuir no máximo uma promoção ativa no MVP.
5. A duração máxima de uma promoção no MVP é de 7 dias.
6. Uma promoção pode possuir uma imagem.
7. A promoção pode ser distribuída pelo Feed.
8. Expiração não implica automaticamente Hard Delete.
9. A promoção não representa uma transação comercial.

---

## 14. Decisões Importantes

| Decisão                        | Justificativa                                                   |
| ------------------------------ | --------------------------------------------------------------- |
| Entidade própria               | Promoções possuem regras e lifecycle próprios                   |
| Pertence ao `Content`          | O significado e lifecycle do conteúdo permanecem nesse contexto |
| `starts_at` / `expires_at`     | Permitem representar o período de disponibilidade               |
| Uma imagem no MVP              | Mantém o gerenciamento de mídia simples                         |
| Uma promoção ativa por empresa | Limite definido para o MVP                                      |
| Máximo de 7 dias               | Evita promoções indefinidamente ativas no MVP                   |
| Sem `status` derivado          | O estado temporal pode ser determinado pelos campos de período  |
| Feed desacoplado               | Distribuição não deve assumir regras internas do Content        |
| Sem transações                 | O Bairu funciona como vitrine, não marketplace                  |

---

## 15. Relação com Outras Entidades

```text
Company
   │
   └──< Promotion
           │
           ├── Media
           │
           └── FeedPublication
```

A `Company` é responsável pelo conteúdo publicado.

`Media` representa o recurso visual associado.

`FeedPublication` representa sua distribuição no Feed.

Cada entidade mantém sua própria responsabilidade.

---

## 16. Documentação Relacionada

Este documento deve ser utilizado em conjunto com:

- `DB-102-company.md` — negócio;
- `DB-109-company-catalog-item.md` — item de catálogo;
- `DB-001-database-architecture.md` — arquitetura do banco;
- `CON-001-architecture-conventions.md` — convenções arquiteturais;
- `CON-002-domain-and-data-modeling-conventions.md` — convenções de domínio e dados;
- `CON-007-media-architecture-and-lifecycle-standards.md` — arquitetura e lifecycle de mídias;
- `CON-008-data-lifecycle-and-audit-standards.md` — lifecycle, retenção e auditoria;
- documentação de `FeedPublication`.

---

## 17. Manutenção

Este documento deve ser atualizado quando houver alteração relevante nas regras de promoção, incluindo:

- limites;
- duração;
- lifecycle;
- mídia;
- distribuição no Feed;
- regras relacionadas a planos.

Alterações que representem mudanças significativas no domínio devem ser avaliadas como decisões arquiteturais e, quando necessário, registradas como ADR.
