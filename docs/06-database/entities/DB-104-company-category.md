# DB-104 — Company Category

## 1. Objetivo

Definir a entidade de relacionamento entre `Company` e `Category`.

`CompanyCategory` representa a associação entre uma empresa e as categorias que descrevem seus produtos, serviços ou atividades.

A entidade existe como relacionamento de domínio, e não apenas como uma tabela técnica de associação.

---

## 2. Contexto

A entidade pertence ao relacionamento entre os contextos **Business** e **Catalog**.

```text
Company ──── N:N ──── Category
              │
              ▼
       CompanyCategory
```

Uma empresa pode estar associada a várias categorias, e uma categoria pode ser utilizada por várias empresas.

---

## 3. Regras de Negócio

### 3.1. Múltiplas categorias

Uma `Company` pode possuir uma ou mais categorias.

O modelo não estabelece uma quantidade máxima de categorias no nível da entidade.

Limites de quantidade, caso necessários, devem ser definidos por regras de produto ou plano.

### 3.2. Categorias possuem o mesmo peso

No MVP, não existe conceito de categoria principal.

Todas as associações `CompanyCategory` possuem o mesmo peso semântico.

Exemplo:

```text
Company
├── Padaria
├── Cafeteria
└── Confeitaria
```

Nenhuma dessas categorias é considerada automaticamente mais importante que as demais.

### 3.3. Categoria principal

O MVP não possui:

```text
primary_category_id
```

nem:

```text
is_primary
```

Essa possibilidade poderá ser avaliada futuramente caso exista uma necessidade real de produto.

### 3.4. Duplicidade

Uma empresa não pode possuir a mesma categoria mais de uma vez.

A combinação:

```text
(company_id, category_id)
```

deve ser única.

---

## 4. Estrutura

| Campo         | Tipo        | Obrigatório | Descrição                        |
| ------------- | ----------- | ----------: | -------------------------------- |
| `id`          | UUID        |         Sim | Identificador da associação      |
| `company_id`  | UUID        |         Sim | Empresa associada                |
| `category_id` | UUID        |         Sim | Categoria associada              |
| `created_at`  | TIMESTAMPTZ |         Sim | Momento da criação da associação |

`updated_at` não é necessário no MVP, pois o relacionamento não possui estado mutável próprio.

---

## 5. Relacionamentos

```text
Company
   │
   └──< CompanyCategory >──┐
                           │
                        Category
```

### Company

Uma empresa pode possuir várias associações em `CompanyCategory`.

### Category

Uma categoria pode estar associada a várias empresas.

### CompanyCategory

Cada registro representa uma única associação entre uma empresa e uma categoria.

---

## 6. Integridade e Constraints

A tabela deve possuir:

- Primary Key em `id`;
- Foreign Key para `Company`;
- Foreign Key para `Category`;
- `NOT NULL` em `company_id`;
- `NOT NULL` em `category_id`;
- `UNIQUE (company_id, category_id)`.

A integridade referencial deve ser garantida pelo banco de dados.

---

## 7. Índices

A constraint de unicidade em:

```text
(company_id, category_id)
```

também fornece suporte para consultas que utilizem essa combinação.

Índices adicionais devem ser avaliados conforme os padrões reais de consulta.

Caso a busca de empresas por categoria seja frequente, deve existir suporte eficiente para:

```text
category_id → companies
```

O índice necessário deve ser definido durante a implementação da migration e validado conforme as consultas da aplicação.

---

## 8. Estratégia de Exclusão

`CompanyCategory` utiliza **Hard Delete**.

A remoção da associação não implica exclusão de:

- `Company`;
- `Category`.

A exclusão de uma `Company` ou `Category` deverá considerar a integridade de seus relacionamentos.

Quando a associação perder seu significado devido à exclusão da entidade principal, `CASCADE DELETE` poderá ser utilizado conforme definido na migration.

Soft Delete não é necessário.

---

## 9. Dados Derivados

`CompanyCategory` não possui dados derivados.

A associação é uma fonte direta de informação sobre a relação entre empresas e categorias.

Indicadores derivados, como quantidade de empresas por categoria, deverão ser calculados ou armazenados separadamente quando houver necessidade real de performance.

---

## 10. Evolução Futura

O modelo poderá evoluir caso surja uma necessidade concreta de representar informações adicionais sobre a associação.

Possíveis evoluções:

- categoria principal;
- ordem de exibição;
- prioridade;
- relevância específica;
- metadados da associação.

Esses atributos não fazem parte do MVP.

A inclusão de qualquer um deles deve ser acompanhada de uma justificativa de domínio ou produto.

---

## 11. Decisões Consolidadas

| Decisão                                            | Justificativa                                     |
| -------------------------------------------------- | ------------------------------------------------- |
| `CompanyCategory` é uma entidade de relacionamento | A associação representa um conceito do domínio    |
| Relação N:N                                        | Empresas podem atuar em múltiplas categorias      |
| Sem categoria principal no MVP                     | Evita hierarquia artificial entre atividades      |
| Todas as categorias possuem o mesmo peso           | Favorece descoberta local e flexibilidade         |
| `company_id + category_id` é único                 | Impede associações duplicadas                     |
| Hard Delete                                        | A associação não precisa de histórico próprio     |
| Sem `updated_at`                                   | O relacionamento não possui estado mutável no MVP |
| Sem atributos de prioridade                        | Evita complexidade prematura                      |

---

## 12. Referências

Este documento deve ser utilizado em conjunto com:

- `DB-001-database-architecture.md`;
- `DB-003-entity-inventory.md`;
- `DB-102-company.md`;
- `DB-103-category.md`;
- `CON-001-architecture-conventions.md`;
- `CON-002-domain-and-data-modeling-conventions.md`.

As regras gerais de nomenclatura, identificadores, constraints, índices e exclusão permanecem definidas nas convenções correspondentes.
