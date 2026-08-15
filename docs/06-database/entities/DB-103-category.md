# CATEGORY — Entity Specification

## 1. Objetivo

Definir a estrutura e as regras específicas da entidade `Catalog` no banco de dados do Bairu.

A entidade pertence ao Bounded Context **Discovery** e representa uma categoria utilizada para organizar e facilitar a descoberta de negócios, produtos e serviços na plataforma.

Este documento descreve as características específicas de `Category`. As convenções gerais de arquitetura, modelagem, lifecycle, auditoria e persistência são definidas nos documentos correspondentes.

---

## 2. Responsabilidade

`Category` representa uma classificação disponível na plataforma.

Sua principal responsabilidade é fornecer uma estrutura consistente para organizar os negócios existentes no Bairu e facilitar sua descoberta pela comunidade.

A entidade deve:

- representar uma categoria de negócio;
- permitir organização hierárquica;
- possuir identificação estável;
- permitir associação com outras entidades do domínio;
- evitar duplicação de categorias semanticamente equivalentes.

A entidade não deve armazenar diretamente os negócios associados a ela.

Essa associação será representada pela entidade de relacionamento `CompanyCategory`.

---

## 3. Campos

| Campo         | Tipo        | Obrigatório | Regra / finalidade                                           |
| ------------- | ----------- | ----------: | ------------------------------------------------------------ |
| `id`          | UUID        |         Sim | Identificador único da categoria                             |
| `name`        | VARCHAR     |         Sim | Nome da categoria                                            |
| `slug`        | VARCHAR     |         Sim | Identificador textual utilizado em URLs e consultas públicas |
| `description` | TEXT        |         Não | Descrição da categoria                                       |
| `parent_id`   | UUID        |         Não | Referência à categoria pai                                   |
| `status`      | ENUM        |         Sim | Estado da categoria                                          |
| `created_at`  | TIMESTAMPTZ |         Sim | Momento de criação                                           |
| `updated_at`  | TIMESTAMPTZ |         Sim | Momento da última alteração                                  |

---

## 4. Campos de Identificação

### 4.1. `id`

Identificador primário da entidade.

Deve utilizar UUID conforme definido em `CON-002`.

O identificador não possui significado de negócio.

---

### 4.2. `name`

Nome público da categoria.

Exemplos conceituais:

```text
Alimentação
Construção
Beleza
Tecnologia
Educação
```

O nome deve ser suficientemente claro para que usuários compreendam o tipo de negócio ou serviço representado.

O campo não deve ser utilizado como identificador técnico.

---

### 4.3. `slug`

Identificador textual utilizado em URLs e mecanismos de descoberta.

Exemplo:

```text
alimentacao
construcao
beleza
```

O `slug` deve ser único.

Alterações de slug devem ser tratadas com cuidado quando a categoria já estiver sendo utilizada em URLs públicas ou mecanismos de descoberta.

---

### 4.4. `description`

Descrição opcional da categoria.

Pode ser utilizada para explicar:

- o significado da categoria;
- quais tipos de negócios pertencem a ela;
- limites conceituais da classificação.

A descrição não deve armazenar informações específicas de uma empresa.

---

## 5. Hierarquia

`Category` pode possuir uma categoria pai por meio de `parent_id`.

Exemplo:

```text
Alimentação
├── Restaurantes
├── Padarias
└── Confeitarias
```

Nesse exemplo:

```text
Alimentação
   └── parent_id = NULL

Restaurantes
   └── parent_id = Alimentação.id
```

A hierarquia permite que o Bairu organize categorias em diferentes níveis sem criar estruturas específicas para cada profundidade.

---

## 6. `parent_id`

Referência opcional à categoria pai.

Quando `parent_id` for `NULL`, a categoria representa uma categoria de nível superior.

Quando preenchido, deve apontar para outra `Category`.

Uma categoria não deve possuir a si própria como pai.

Também não devem ser permitidos ciclos na hierarquia.

Exemplo inválido:

```text
A
└── B
    └── A
```

A validação de ciclos deve ocorrer na camada de aplicação, pois essa regra depende da estrutura completa da árvore.

---

## 7. Status

O campo `status` representa o estado operacional da categoria.

Valores iniciais:

```text
ACTIVE
INACTIVE
```

### `ACTIVE`

A categoria está disponível para utilização normal na plataforma.

Pode ser utilizada:

- na classificação de empresas;
- em filtros;
- em mecanismos de descoberta;
- em interfaces públicas.

### `INACTIVE`

A categoria permanece armazenada, mas não deve ser utilizada para novas associações ou apresentada normalmente como opção disponível.

Associações históricas existentes devem ser avaliadas conforme as regras do domínio.

A alteração de status não representa exclusão física da categoria.

---

## 8. Relacionamentos

### 8.1. Category → Parent Category

Uma categoria pode possuir uma categoria pai.

```text
Category
   │
   └── parent_id ── Category
```

A relação é opcional.

Uma categoria de nível superior possui:

```text
parent_id = NULL
```

---

### 8.2. Category → Child Categories

Uma categoria pode possuir várias categorias filhas.

```text
Category
   │
   ├── Child Category
   ├── Child Category
   └── Child Category
```

A relação é representada pela própria entidade `Category`, através de `parent_id`.

---

### 8.3. Category → Company

Uma categoria pode estar associada a várias empresas.

A relação é muitos-para-muitos:

```text
Company
   │
   └── CompanyCategory ── Category
```

A relação não será representada por uma Foreign Key diretamente em
Category ou Company.

A associação será persistida exclusivamente através de CompanyCategory.

`Category` não deve armazenar uma lista de empresas em um campo próprio.

---

## 9. Regras de Negócio

### 9.1. Identidade da categoria

Cada categoria deve representar um conceito de classificação distinto.

Não devem existir categorias duplicadas que representem semanticamente o mesmo conceito sem uma justificativa de negócio.

---

### 9.2. Hierarquia

A hierarquia deve representar uma relação semântica real entre categorias.

Categorias não devem ser aninhadas apenas para criar uma estrutura visual.

---

### 9.3. Profundidade

A arquitetura não deve criar colunas específicas para cada nível da hierarquia.

Exemplo a evitar:

```text
category_level_1
category_level_2
category_level_3
```

A relação `parent_id` permite evolução da profundidade sem alteração estrutural da tabela.

A profundidade máxima da árvore, caso seja necessária, deve ser definida como regra de negócio e não como limitação artificial do schema.

---

### 9.4. Categorias inativas

Uma categoria `INACTIVE` não deve ser disponibilizada para novas associações.

A existência de empresas anteriormente associadas à categoria não implica que essas associações devam ser removidas automaticamente.

A estratégia deve preservar a integridade e o histórico conforme o contexto.

---

### 9.5. Exclusão de categoria

A exclusão de uma categoria deve considerar:

- categorias filhas;
- associações com empresas;
- outras entidades que possam utilizar a categoria;
- necessidade de preservar histórico.

Uma categoria não deve ser removida enquanto existirem dependências incompatíveis com sua exclusão.

---

## 10. Constraints

A entidade deve possuir, no mínimo:

### Primary Key

```text
PRIMARY KEY (id)
```

### Foreign Key

```text
FOREIGN KEY (parent_id)
REFERENCES categories(id)
```

### Unique

O `slug` deve ser único:

```text
UNIQUE (slug)
```

A possibilidade de utilizar unicidade composta para `name` ou `slug` dentro de determinados níveis da hierarquia deverá ser avaliada conforme a regra final de URLs e taxonomia.

Para o MVP, a abordagem mais simples é manter o `slug` globalmente único.

---

## 11. Índices

Devem ser considerados índices para:

- `parent_id`;
- `slug`

O índice de `slug` deve ser garantido pela constraint de unicidade.

O índice de `parent_id` é importante para consultas de categorias filhas e construção da árvore.

Um índice adicional em `status` não é obrigatório no MVP e deverá
ser adicionado caso os padrões reais de consulta justifiquem sua
utilização.

Índices adicionais devem ser definidos conforme os padrões reais de consulta.

---

## 12. Lifecycle

O lifecycle básico de `Category` é:

```text
Created
   ↓
ACTIVE
   │
   └── INACTIVE
```

A categoria permanece persistida quando estiver `INACTIVE`.

A alteração de status não representa Hard Delete.

A estratégia geral de lifecycle segue as convenções definidas em `CON-008-data-lifecycle-and-audit-standards.md`.

---

## 13. Exclusão

`Category` não deve utilizar Soft Delete automaticamente.

A exclusão definitiva deve considerar suas dependências.

Antes de realizar Hard Delete, devem ser avaliados:

- categorias filhas;
- `CompanyCategory`;
- outras referências existentes;
- necessidade de preservação histórica.

Quando a categoria possuir dependências que não possam ser removidas ou transferidas com segurança, a exclusão deve ser bloqueada.

Uma alternativa futura poderá ser arquivar ou inativar a categoria em vez de removê-la.

### Hierarquia

Uma categoria que possua categorias filhas não pode ser removida
automaticamente.

A relação entre categoria pai e categorias filhas deve utilizar
comportamento equivalente a RESTRICT.

A remoção de uma categoria pai somente poderá ocorrer após suas
dependências hierárquicas terem sido tratadas explicitamente.

---

## 14. Auditoria

Operações relevantes sobre categorias podem exigir auditoria.

Exemplos:

- criação;
- alteração de nome;
- alteração de slug;
- alteração de hierarquia;
- alteração de status;
- exclusão;
- ações administrativas.

O histórico completo não deve ser armazenado diretamente em `Category`.

Quando necessário, a rastreabilidade deve utilizar o mecanismo central definido em `CON-008`.

---

## 15. Segurança e Administração

No MVP, a criação e manutenção das categorias devem ser tratadas como operações administrativas.

Usuários comuns não devem alterar livremente a taxonomia oficial da plataforma.

Alterações administrativas devem exigir autorização apropriada.

Essa separação evita que a taxonomia utilizada para descoberta seja fragmentada por alterações arbitrárias de usuários.

---

## 16. Dados que não pertencem a `Category`

As seguintes informações não devem ser armazenadas diretamente na entidade:

- empresas associadas;
- dados cadastrais de empresas;
- produtos;
- serviços;
- publicações;
- imagens específicas de empresas;
- informações de usuários;
- regras específicas de um negócio.

Essas informações pertencem às respectivas entidades do domínio.

---

## 17. Dados Derivados

`Category` não deve armazenar contagens ou indicadores derivados no MVP sem necessidade comprovada.

Exemplos que **não devem ser adicionados automaticamente**:

```text
company_count
active_company_count
```

Esses valores podem ser obtidos a partir das relações existentes.

Caso o volume de consultas justifique sua materialização futuramente, os campos deverão seguir as convenções de dados derivados de `CON-002`.

---

## 18. Estrutura Conceitual

```text
Category
├── id
├── name
├── slug
├── description
├── parent_id
├── status
├── created_at
└── updated_at
```

Hierarquia:

```text
Category
   │
   ├── parent_id
   │
   └── child categories
```

Relacionamento com empresas:

```text
Company
   │
   └── CompanyCategory
           │
           └── Category
```

---

## 19. Decisões Consolidadas

| Decisão                | Definição                             |
| ---------------------- | ------------------------------------- |
| Contexto               | Discovery                             |
| Identificador          | UUID                                  |
| Função                 | Classificação para descoberta local   |
| Hierarquia             | Suportada                             |
| Relação hierárquica    | `parent_id`                           |
| Categorias raiz        | `parent_id = NULL`                    |
| Relação com Company    | N:N                                   |
| Entidade intermediária | `CompanyCategory`                     |
| Slug                   | Único globalmente no MVP              |
| Status                 | `ACTIVE`, `INACTIVE`                  |
| Alteração por usuários | Não permitida                         |
| Administração          | Controlada pelo painel administrativo |
| Soft Delete            | Não adotado como padrão               |
| Hard Delete            | Condicionado às dependências          |
| Dados derivados        | Não necessários no MVP                |

---

## 20. Pontos a Consolidar Posteriormente

As seguintes decisões podem ser refinadas quando avançarmos na implementação:

- profundidade máxima da hierarquia, caso venha a ser necessária;
- possibilidade de uma empresa possuir uma categoria principal além das categorias secundárias;
- regras de ordenação das categorias;
- necessidade de ícone ou imagem para categorias;
- regras de SEO específicas para páginas de categoria;
- estratégia de migração quando uma categoria for descontinuada;
- necessidade de internacionalização futura.

Esses pontos não devem ser incorporados ao schema enquanto não houver necessidade concreta.

---

## 21. Documentos Relacionados

- `DB-001-database-architecture.md` — arquitetura do banco de dados;
- `DB-003-entity-inventory.md` — inventário oficial das entidades;
- `DB-102-company.md` — entidade `Company`;
- `CON-001-architecture-conventions.md` — convenções arquiteturais;
- `CON-002-domain-and-data-modeling-conventions.md` — convenções de domínio e dados;
- `CON-008-data-lifecycle-and-audit-standards.md` — lifecycle, retenção e auditoria.

---

## 22. Manutenção

Este documento deve ser atualizado quando a estrutura ou as regras específicas de `Category` forem alteradas.

Alterações relevantes na taxonomia, hierarquia ou estratégia de classificação devem ser avaliadas também sob a perspectiva do contexto `Discovery` e, quando representarem decisões arquiteturais significativas, registradas como ADR.
