# ADR-006 — Prisma Migration Strategy

**Status:** Accepted
**Date:** 2026-08-09
**Scope:** Backend / Database

---

## 1. Context

O Bairu utiliza PostgreSQL como banco de dados relacional e Prisma como ORM.

À medida que o domínio da plataforma evoluir, o schema do banco sofrerá alterações frequentes, incluindo:

- criação de tabelas;
- alteração de colunas;
- criação de índices;
- criação de constraints;
- alterações de relacionamentos;
- evolução de tipos controlados;
- remoção de estruturas obsoletas.

Essas alterações precisam ser versionadas juntamente com o código-fonte para garantir que o estado do banco possa ser reproduzido de forma consistente em diferentes ambientes.

Durante a configuração inicial do backend, o banco `bairu_development` foi validado e encontra-se vazio, sem tabelas existentes e sem histórico de migrations.

---

## 2. Decision

O Bairu adotará **Prisma Migrate** como mecanismo oficial de versionamento e evolução do schema PostgreSQL.

As migrations serão armazenadas no repositório Git juntamente com o código-fonte da aplicação.

A estratégia será:

- `prisma migrate dev` para desenvolvimento;
- `prisma migrate deploy` para ambientes compartilhados e de execução;
- migrations versionadas e imutáveis após aplicação;
- schema do Prisma como representação declarativa do modelo de persistência;
- histórico de migrations como registro oficial da evolução do banco.

---

## 3. Migration Lifecycle

O fluxo principal de evolução do banco será:

```text
Alteração do schema
        │
        ▼
schema.prisma
        │
        ▼
prisma migrate dev
        │
        ├── cria migration
        ├── aplica migration
        └── atualiza Prisma Client
        │
        ▼
prisma/migrations/
        │
        ▼
Git
        │
        ├── development
        ├── test
        ├── staging
        └── production
```

Cada alteração estrutural do banco deverá ser representada por uma migration versionada.

---

## 4. Development Environment

Durante o desenvolvimento local será utilizado:

```bash
prisma migrate dev
```

Esse comando será utilizado para:

- detectar alterações no schema;
- criar novas migrations;
- aplicar migrations no banco de desenvolvimento;
- manter o histórico local consistente;
- atualizar o Prisma Client quando necessário.

O banco de desenvolvimento poderá ser recriado quando necessário, desde que isso não seja utilizado como substituto para o versionamento das migrations.

---

## 5. Shared and Deployment Environments

Ambientes compartilhados, como staging e produção, não deverão criar migrations automaticamente.

Nesses ambientes será utilizado:

```bash
prisma migrate deploy
```

Esse comando deverá aplicar somente migrations já existentes e versionadas no repositório.

O fluxo esperado será:

```text
Developer
    │
    ▼
schema.prisma
    │
    ▼
migration
    │
    ▼
Git
    │
    ▼
CI/CD
    │
    ▼
staging / production
```

Essa separação evita que ambientes compartilhados produzam alterações de schema não rastreadas pelo repositório.

---

## 6. Migration Immutability

Uma migration que já tenha sido aplicada a um ambiente compartilhado deverá ser considerada **imutável**.

Não será permitido editar retroativamente o conteúdo de uma migration já aplicada.

Caso seja necessário corrigir ou alterar uma estrutura criada anteriormente, uma nova migration deverá ser criada.

Exemplo:

```text
migration 001
    ↓
migration 002 — correction
```

Em vez de:

```text
migration 001
    ↓
editar migration 001
```

Essa regra preserva a rastreabilidade do histórico do banco.

---

## 7. Migration Naming

As migrations serão geradas pelo Prisma utilizando o padrão de timestamp e descrição.

Exemplo:

```text
20260809120000_initial_schema
```

ou:

```text
20260810143000_add_company_indexes
```

A descrição deverá representar de forma objetiva a alteração realizada.

---

## 8. Repository Structure

As migrations permanecerão dentro da aplicação responsável pelo backend:

```text
apps/
└── api/
    └── prisma/
        ├── schema.prisma
        ├── migrations/
        │   ├── <timestamp>_<description>/
        │   │   └── migration.sql
        │   └── ...
        └── ...
```

As migrations fazem parte do código-fonte versionado e deverão ser incluídas nos Pull Requests que alterarem o schema do banco.

---

## 9. Schema and Migration Responsibilities

O arquivo `schema.prisma` representa o **estado desejado do modelo de persistência**.

As migrations representam a **evolução histórica necessária para chegar a esse estado**.

Portanto:

```text
schema.prisma
    = estado atual desejado

migrations/
    = histórico de evolução
```

Nenhum dos dois substitui o outro.

---

## 10. Database Environment Separation

Cada ambiente deverá utilizar seu próprio banco de dados.

A configuração da conexão será fornecida por variável de ambiente:

```env
DATABASE_URL=...
```

A aplicação não deverá armazenar credenciais ou URLs reais de bancos no repositório.

O arquivo `.env.example` deverá documentar apenas as variáveis necessárias para configurar o ambiente.

---

## 11. Initial Migration

A primeira migration do projeto **não será criada enquanto o schema não possuir modelos persistentes reais**.

No estado atual:

```text
schema.prisma
    └── nenhum model

bairu_development
    └── nenhuma tabela

prisma/migrations
    └── vazia
```

Essa situação é considerada válida.

A primeira migration será criada quando o primeiro conjunto de entidades persistentes do domínio for introduzido.

Isso evita a criação de uma migration vazia ou sem significado arquitetural.

---

## 12. Database Reset in Development

O reset do banco poderá ser utilizado em desenvolvimento quando necessário para reconstruir o banco a partir do histórico de migrations.

Esse procedimento não deverá ser utilizado em ambientes compartilhados ou de produção.

Operações destrutivas deverão ser executadas conscientemente e somente em ambientes nos quais a perda dos dados seja aceitável.

---

## 13. Baseline and Existing Databases

O Bairu não utilizará baseline para o banco inicial de desenvolvimento, pois o banco foi criado vazio e não possui schema legado.

Caso futuramente o projeto precise incorporar um banco já existente, uma estratégia específica de baseline deverá ser definida antes de qualquer migration destrutiva.

Essa decisão deverá ser documentada separadamente.

---

## 14. Testing Strategy

O ambiente de testes deverá possuir banco separado do ambiente de desenvolvimento.

As migrations versionadas deverão ser utilizadas para preparar o schema do banco de testes.

O banco de testes nunca deverá compartilhar dados persistentes com o banco de desenvolvimento.

O fluxo esperado será:

```text
Migrations
    │
    ├── Development DB
    │
    └── Test DB
```

A estratégia detalhada de provisionamento e limpeza do banco de testes será definida juntamente com a arquitetura de testes do backend.

---

## 15. CI/CD

Como evolução da infraestrutura do projeto, o pipeline de CI/CD deverá validar a aplicação das migrations em um ambiente controlado antes da promoção para ambientes superiores.

O pipeline poderá executar verificações como:

- aplicação das migrations;
- geração do Prisma Client;
- typecheck;
- testes;
- build da aplicação.

A execução automatizada de migrations em produção deverá fazer parte de um processo controlado de deployment.

---

## 16. Operational Rules

As seguintes regras são adotadas:

1. Toda alteração persistente de schema deve possuir migration.
2. Migrations devem ser versionadas no Git.
3. Migrations aplicadas não devem ser editadas retroativamente.
4. Desenvolvimento utiliza `prisma migrate dev`.
5. Ambientes compartilhados utilizam `prisma migrate deploy`.
6. Cada ambiente utiliza seu próprio banco.
7. Credenciais de banco nunca são versionadas.
8. O schema de testes deve ser separado do schema de desenvolvimento.
9. Alterações destrutivas devem ser avaliadas antes da aplicação.
10. Alterações de schema devem ser revisadas através de Pull Request.

---

## 17. Consequences

### Positive

A adoção do Prisma Migrate proporciona:

- histórico versionado da evolução do banco;
- maior reprodutibilidade dos ambientes;
- integração natural com Git e Pull Requests;
- rastreabilidade das alterações;
- menor risco de divergência entre ambientes;
- facilidade para reconstrução de bancos de desenvolvimento e testes;
- integração futura com CI/CD.

### Trade-offs

A estratégia também introduz algumas responsabilidades:

- migrations precisam ser tratadas como código;
- migrations aplicadas não podem ser alteradas arbitrariamente;
- alterações complexas exigem planejamento;
- mudanças incompatíveis podem exigir migrations intermediárias;
- operações destrutivas exigem maior cuidado.

Esses custos são considerados aceitáveis diante da necessidade de manter o schema do Bairu reproduzível e rastreável.

---

## 18. Alternatives Considered

### `prisma db push`

Não será utilizado como mecanismo oficial de evolução do schema.

`db push` é útil para prototipação e exploração inicial, mas não mantém o histórico de alterações necessário para ambientes versionados.

### Alterações manuais no banco

Não serão utilizadas como estratégia oficial.

Alterações manuais dificultam rastreabilidade, reprodução do ambiente e integração com CI/CD.

### Ferramenta externa de migrations

Não foi adotada neste momento.

Como o projeto já utiliza Prisma como ORM e o Prisma Migrate atende às necessidades atuais, a adoção de outra ferramenta adicionaria complexidade sem benefício proporcional.

---

## 19. Current State

No momento desta decisão:

- PostgreSQL está configurado para o backend;
- Prisma está configurado;
- `prisma.config.ts` está configurado;
- `DATABASE_URL` está documentada no `.env.example`;
- o banco `bairu_development` está vazio;
- nenhuma migration foi criada;
- nenhum modelo persistente foi definido no `schema.prisma`.

A ausência de migrations neste momento é intencional.

A primeira migration será criada quando o primeiro modelo persistente do domínio for implementado.

---

## 20. Related Documentation

- `CON-001` — Architectural Conventions
- `CON-002` — API Conventions
- `CON-003` — Database Conventions
- `CON-004` — Frontend Conventions
- `CON-005` — Git Conventions
- `CON-006` — Commit Conventions

---

## 21. Decision Summary

O Bairu adotará **Prisma Migrate como mecanismo oficial de versionamento do schema PostgreSQL**.

O desenvolvimento utilizará `prisma migrate dev`, enquanto ambientes compartilhados utilizarão `prisma migrate deploy`.

Migrations serão versionadas no Git, tratadas como artefatos imutáveis após aplicação e utilizadas como histórico oficial da evolução do banco.

A primeira migration será criada somente quando existir um schema persistente real a ser versionado.
