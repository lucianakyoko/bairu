# DB-109 — Company Catalog Item

## 1. Objetivo

`CompanyCatalogItem` representa um produto, serviço ou item apresentado no catálogo de uma `Company`.

A entidade pertence ao Bounded Context **Catalog** e tem como objetivo permitir que negócios apresentem de forma estruturada aquilo que oferecem à comunidade.

O catálogo não representa uma transação de compra. O Bairu funciona como uma vitrine digital local.

---

## 2. Responsabilidade

`CompanyCatalogItem` é responsável por representar:

- o item oferecido pelo negócio;
- suas informações de apresentação;
- seu preço, quando aplicável;
- sua disponibilidade para exibição;
- sua imagem associada.

A entidade não é responsável por:

- realizar vendas;
- processar pagamentos;
- controlar pedidos;
- representar estoque;
- realizar checkout.

Essas funcionalidades não fazem parte do MVP.

---

## 3. Estrutura

| Campo         | Tipo        | Obrigatório | Descrição                           |
| ------------- | ----------- | ----------: | ----------------------------------- |
| `id`          | UUID        |         Sim | Identificador único do item         |
| `company_id`  | UUID        |         Sim | Empresa proprietária do item        |
| `name`        | VARCHAR     |         Sim | Nome do item                        |
| `description` | TEXT        |         Não | Descrição do item                   |
| `price`       | DECIMAL     |         Não | Preço apresentado, quando aplicável |
| `media_id`    | UUID        |         Não | Imagem associada ao item            |
| `created_at`  | TIMESTAMPTZ |         Sim | Momento de criação                  |
| `updated_at`  | TIMESTAMPTZ |         Sim | Momento da última alteração         |

Os limites de quantidade e tamanho dos campos textuais devem ser definidos pela aplicação de acordo com as necessidades da interface.

`price` deve utilizar um tipo decimal apropriado para valores monetários, evitando tipos de ponto flutuante.

A precisão e escala definitivas devem seguir a convenção financeira adotada pelo banco.

---

## 4. Relacionamentos

### Company

Cada item pertence obrigatoriamente a uma `Company`.

```text
Company
   │
   └──< CompanyCatalogItem
```

Uma empresa pode possuir vários itens de catálogo.

### Media

Um item pode possuir uma mídia associada.

```text
CompanyCatalogItem
        │
        └── Media
```

No MVP, cada item possui no máximo uma imagem.

A arquitetura de mídia e seu lifecycle são definidos em:

`CON-007-media-architecture-and-lifecycle-standards.md`

---

## 5. Constraints

### Primary Key

```text
PRIMARY KEY (id)
```

### Foreign Key

```text
company_id → companies.id
```

O relacionamento com `Company` é obrigatório.

Quando `media_id` estiver presente:

```text
media_id → media.id
```

A referência à mídia é opcional.

### Regras estruturais

- `name` deve ser obrigatório;
- `company_id` deve ser obrigatório;
- `price`, quando informado, não deve possuir valor negativo;
- `media_id` deve referenciar uma mídia válida;
- um item não deve possuir mais de uma mídia associada no MVP.

Não é necessária uma constraint `UNIQUE` para o nome do item, pois uma empresa pode possuir itens diferentes com o mesmo nome em contextos distintos.

---

## 6. Índices

O principal índice é:

```text
idx_company_catalog_items_company_id
```

Esse índice permite recuperar rapidamente os itens pertencentes a uma empresa.

Caso a aplicação passe a realizar buscas frequentes por nome, outros índices poderão ser avaliados conforme os padrões reais de consulta.

Não devem ser criados índices antecipadamente sem necessidade identificada.

---

## 7. Preço

`price` representa o valor apresentado ao usuário quando o item possui preço definido.

O campo é opcional porque determinados serviços ou produtos podem exigir:

- orçamento;
- consulta prévia;
- preço variável;
- negociação direta.

O Bairu não deve assumir que todo item possui um preço fixo.

O armazenamento deve utilizar tipo numérico apropriado para valores monetários.

---

## 8. Lifecycle

O lifecycle do item é simples:

```text
Criação
   ↓
Disponível no catálogo
   ↓
Atualização
   ↓
Remoção
```

O MVP não exige um estado complexo de publicação para o item.

Caso futuramente seja necessário diferenciar itens:

- ativos;
- inativos;
- temporariamente indisponíveis;
- arquivados;

essa necessidade deverá ser avaliada antes da introdução de novos estados.

---

## 9. Exclusão

`CompanyCatalogItem` utiliza **Hard Delete** no MVP.

O item representa uma informação de apresentação pertencente à empresa e não possui, inicialmente, necessidade de histórico próprio.

Quando uma empresa for removida, seus itens de catálogo poderão ser removidos em cascata.

A referência opcional à `Media` deve ser removida quando o `CompanyCatalogItem` for excluído, sem excluir automaticamente a entidade `Media`.

O lifecycle e a eventual remoção física da mídia devem seguir as regras definidas pelo Media Module.

A exclusão do item não deve deixar referências inválidas no banco.

---

## 10. Dados Derivados

`CompanyCatalogItem` não possui dados derivados definidos para o MVP.

Indicadores como quantidade de itens de catálogo da empresa poderão ser calculados ou posteriormente armazenados como dados derivados caso exista necessidade de performance.

Caso sejam persistidos, deverão seguir as regras do `CON-002`.

---

## 11. Imagem

Cada `CompanyCatalogItem` pode possuir uma imagem.

No MVP:

```text
CompanyCatalogItem
        │
        └── 0..1 Media
```

A imagem não é armazenada no PostgreSQL.

O banco mantém apenas a referência necessária à `Media`, enquanto o arquivo físico permanece no storage externo.

Não são permitidas múltiplas imagens por item no MVP.

Galerias e múltiplas mídias permanecem como evolução futura.

---

## 12. Relação com Category

A classificação do item não deve ser confundida com a classificação da empresa.

`CompanyCategory` classifica o negócio dentro da plataforma:

```text
Company
   └── CompanyCategory
          └── Category
```

`CompanyCatalogItem` representa aquilo que o negócio oferece.

Uma categorização própria dos itens poderá ser considerada futuramente caso exista necessidade concreta.

No MVP, não deve ser criada uma nova entidade de categoria para itens sem requisito definido.

---

## 13. Feed

Um `CompanyCatalogItem` pode futuramente ser utilizado como origem de uma publicação no Feed.

Conceitualmente:

```text
CompanyCatalogItem
        │
        ▼
FeedPublication
```

O `CompanyCatalogItem` permanece pertencente ao contexto `Catalog`.

As regras de distribuição e publicação pertencem ao contexto `Feed`.

Essa separação segue a arquitetura definida para o Feed.

---

## 14. Decisões Importantes

| Decisão                  | Justificativa                                                         |
| ------------------------ | --------------------------------------------------------------------- |
| Entidade própria         | Representa um item apresentado pelo negócio                           |
| Pertence ao `Catalog`    | Mantém separadas as regras de catálogo das informações institucionais |
| `company_id` obrigatório | Todo item pertence a um negócio                                       |
| Uma imagem no MVP        | Reduz complexidade de gerenciamento de mídias                         |
| Preço opcional           | Nem todo produto ou serviço possui preço fixo                         |
| Sem controle de estoque  | Não faz parte da proposta de vitrine do MVP                           |
| Sem transação de venda   | Bairu não é marketplace                                               |
| Hard Delete              | O item não possui histórico próprio necessário no MVP                 |
| Feed desacoplado         | A distribuição não deve alterar a responsabilidade do Catalog         |

---

## 15. Relação com Outras Entidades

```text
Company
   │
   ├── CompanyCategory ──> Category
   │
   └── CompanyCatalogItem
            │
            └── Media
```

Quando aplicável:

```text
CompanyCatalogItem
        │
        ▼
FeedPublication
```

O item pertence ao catálogo, enquanto sua eventual distribuição pertence ao Feed.

---

## 16. Documentação Relacionada

Este documento deve ser utilizado em conjunto com:

- `DB-102-company.md` — negócio;
- `DB-103-category.md` — categorias;
- `DB-104-company-category.md` — classificação do negócio;
- `DB-105-company-external-link.md` — links externos do negócio;
- `CON-002-domain-and-data-modeling-conventions.md`;
- `CON-007-media-architecture-and-lifecycle-standards.md`;
- `CON-008-data-lifecycle-and-audit-standards.md`;
- `DB-001-database-architecture.md`.

---

## 17. Manutenção

Este documento deve ser atualizado quando houver alteração relevante no modelo de catálogo.

Mudanças como múltiplas imagens, categorização própria de itens, disponibilidade, estoque, variantes ou transações devem ser avaliadas como novas decisões de domínio antes de alterar a estrutura da entidade.
