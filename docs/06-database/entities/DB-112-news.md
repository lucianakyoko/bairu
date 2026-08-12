# DB-112 — News

## 1. Objetivo

Representar uma publicação informativa criada por uma empresa para divulgar novidades, comunicados ou informações relevantes à comunidade.

`News` pertence ao **Content Context**. O Feed pode distribuir a publicação, mas não é responsável pelas regras de negócio da notícia.

---

## 2. Estrutura

| Campo        | Tipo         | Obrigatório | Observação                          |
| ------------ | ------------ | ----------: | ----------------------------------- |
| `id`         | UUID         |         Sim | Identificador da notícia            |
| `company_id` | UUID         |         Sim | Empresa responsável pela publicação |
| `title`      | VARCHAR      |         Sim | Título da notícia                   |
| `content`    | TEXT         |         Sim | Conteúdo da publicação              |
| `media_id`   | UUID         |         Não | Imagem associada                    |
| `status`     | `NewsStatus` |         Sim | Estado da publicação                |
| `starts_at`  | TIMESTAMPTZ  |         Não | Início da disponibilidade           |
| `expires_at` | TIMESTAMPTZ  |         Não | Fim da disponibilidade              |
| `created_at` | TIMESTAMPTZ  |         Sim | Data de criação                     |
| `updated_at` | TIMESTAMPTZ  |         Sim | Última alteração                    |

### 2.1. Enum `NewsStatus`

```text
DRAFT
PUBLISHED
ARCHIVED
```

`EXPIRED` não é necessário como estado persistido. A expiração pode ser determinada pela combinação de `status`, `starts_at` e `expires_at`.

---

## 3. Relacionamentos

```text
Company
   │
   └── News

News
   │
   └── Media (opcional)

News
   │
   └── FeedPublication (quando publicada no Feed)
```

### Company

Uma notícia pertence a uma única empresa.

Uma empresa pode possuir várias notícias.

### Media

Uma notícia pode possuir uma imagem.

A mídia é gerenciada pelo **Media Module** e armazenada externamente.

### FeedPublication

A notícia pode possuir uma representação no Feed para distribuição aos usuários.

O Feed não deve armazenar ou reproduzir as regras próprias de `News`.

---

## 4. Regras de Negócio

- Uma notícia deve pertencer a uma empresa.
- Apenas usuários autorizados pela empresa podem criar ou alterar suas notícias.
- Notícias em `DRAFT` não devem aparecer publicamente.
- Notícias `PUBLISHED` podem ser distribuídas pelo Feed.
- Notícias arquivadas não devem aparecer nas experiências públicas.
- `starts_at`, quando informado, define quando a notícia poderá ser disponibilizada.
- `expires_at`, quando informado, define o término de sua disponibilidade.
- `expires_at` deve ser posterior a `starts_at`, quando ambos estiverem definidos.
- A notícia pode possuir no máximo uma mídia no MVP.
- O limite de notícias por empresa pertence à regra comercial do Content Module e não à estrutura da entidade.

---

## 5. Constraints

### 5.1. Foreign Keys

```text
company_id → companies.id
media_id   → media.id
```

`company_id` é obrigatório.

`media_id` é opcional.

### 5.2. Check Constraints

Quando aplicável:

```text
expires_at > starts_at
```

A regra deve ser aplicada no banco sempre que puder ser representada de forma consistente.

### 5.3. Exclusão

A estratégia de exclusão deve respeitar o lifecycle definido para conteúdos.

A remoção de uma `Company` deve considerar suas notícias e respectivas mídias conforme as regras de lifecycle e retenção da plataforma.

---

## 6. Índices

Índices recomendados:

```text
idx_news_company_id
idx_news_status
idx_news_starts_at
idx_news_expires_at
```

Índices compostos poderão ser adicionados posteriormente conforme os padrões reais de consulta.

---

## 7. Lifecycle

O lifecycle esperado é:

```text
DRAFT
  ↓
PUBLISHED
  ↓
ARCHIVED
```

Uma notícia pode permanecer publicada durante seu período de disponibilidade.

A expiração temporal não exige necessariamente uma alteração física do registro.

Após deixar de ser exibida publicamente, a notícia poderá permanecer armazenada conforme a política de retenção definida pelo domínio.

---

## 8. Decisões

- `News` é uma entidade própria do **Content Context**.
- O Feed não é a fonte de verdade da notícia.
- A empresa é a proprietária da notícia.
- Uma notícia possui no máximo uma imagem no MVP.
- `Media` permanece desacoplada da entidade e é gerenciada pelo Media Module.
- O lifecycle utiliza `status` em conjunto com `starts_at` e `expires_at`.
- A expiração não exige um estado persistido separado.
- Limites de quantidade e duração são regras do Content Module, não constraints estruturais da entidade.
- A entidade deve permanecer simples para permitir evolução futura do módulo de conteúdo.

---

## 9. Referências

- `DB-003-entity-inventory.md`
- `CON-001-architecture-conventions.md`
- `CON-002-domain-and-data-modeling-conventions.md`
- `CON-007-media-architecture-and-lifecycle-standards.md`
- `CON-008-data-lifecycle-and-audit-standards.md`
