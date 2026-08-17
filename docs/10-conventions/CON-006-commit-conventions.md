# CON-006 — Convenções de Commits

## 1. Objetivo

Este documento estabelece o padrão oficial para criação de commits no projeto Bairu.

Seu objetivo é manter um histórico de versionamento claro, consistente e rastreável, permitindo compreender a evolução do projeto e facilitando revisão, auditoria, manutenção e automação.

Cada commit deve representar uma alteração lógica e possuir uma mensagem que descreva objetivamente a intenção da mudança.

---

## 2. Escopo

Esta convenção se aplica a todos os commits realizados no monorepo Bairu.

As regras deste documento complementam as convenções gerais de Git definidas em `CON-005-git-conventions.md`.

Enquanto o `CON-005` define o fluxo de versionamento e colaboração, este documento define especificamente **como os commits devem ser estruturados e nomeados**.

---

## 3. Princípios

Os commits do projeto devem seguir os seguintes princípios:

- serem pequenos;
- serem atômicos;
- possuírem responsabilidade única;
- serem objetivos;
- serem facilmente compreendidos;
- serem facilmente revertidos;
- refletirem uma alteração lógica do sistema.

Um commit deve representar uma **decisão de engenharia ou uma etapa coerente da implementação**.

Evita-se agrupar em um único commit alterações sem relação direta, como:

- funcionalidades;
- correções;
- refatorações;
- documentação;
- alterações de infraestrutura.

---

## 4. Padrão de Commit

O Bairu adota oficialmente o padrão **Conventional Commits**.

A estrutura utilizada é:

```text
<tipo>(<escopo>): <descrição>
```

Exemplo:

```text
feat(company): add review module
```

O escopo é obrigatório sempre que houver um contexto claro para a alteração.

---

## 5. Tipo

O tipo identifica a natureza principal da alteração.

| Tipo       | Utilização                                               |
| ---------- | -------------------------------------------------------- |
| `feat`     | Nova funcionalidade                                      |
| `fix`      | Correção de bug                                          |
| `refactor` | Refatoração sem alteração intencional de comportamento   |
| `docs`     | Alteração de documentação                                |
| `style`    | Alteração de formatação sem impacto funcional            |
| `test`     | Inclusão ou alteração de testes                          |
| `chore`    | Manutenção técnica                                       |
| `build`    | Alterações relacionadas ao processo de build             |
| `ci`       | Alterações relacionadas à integração ou entrega contínua |
| `perf`     | Melhoria de desempenho                                   |
| `revert`   | Reversão de uma alteração anterior                       |

### 5.1. `feat`

Utilizado quando uma nova capacidade funcional é adicionada ao sistema.

```text
feat(company): add company registration
```

### 5.2. `fix`

Utilizado para corrigir um comportamento incorreto existente.

```text
fix(auth): validate refresh token expiration
```

### 5.3. `refactor`

Utilizado quando o código é reorganizado sem alteração intencional de comportamento.

```text
refactor(media): simplify upload service
```

### 5.4. `docs`

Utilizado exclusivamente para alterações de documentação.

```text
docs(api): document pagination standard
```

### 5.5. `test`

Utilizado para criação ou alteração de testes.

```text
test(company): add repository tests
```

### 5.6. `chore`

Utilizado para manutenção técnica que não representa diretamente uma funcionalidade ou correção.

```text
chore(deps): update nestjs dependencies
```

---

## 6. Escopo

O escopo identifica o contexto afetado pela alteração.

Exemplos de escopos previstos:

```text
auth
company
catalog
promotion
coupon
event
job
feed
media
favorite
review
api
web
admin
database
docs
infra
config
```

Novos escopos podem ser introduzidos conforme a arquitetura evoluir.

O escopo deve ser:

- curto;
- escrito em inglês;
- consistente com a nomenclatura do projeto;
- suficientemente específico para identificar o contexto afetado.

Exemplo:

```text
feat(review): add review repository
```

Em alterações que abrangem explicitamente mais de um contexto, deve-se avaliar se a mudança pode ser dividida em commits menores.

---

## 7. Descrição

A descrição deve:

- ser escrita em inglês;
- utilizar verbo no imperativo;
- ser objetiva;
- descrever o resultado da alteração;
- evitar detalhes desnecessários.

Exemplos de verbos adequados:

```text
add
create
update
remove
fix
validate
implement
refactor
simplify
configure
document
```

Exemplos:

```text
feat(api): add health endpoint
fix(auth): validate access token
docs(api): document error responses
build(api): configure production build
```

Evitar descrições vagas como:

```text
update
changes
fixes
adjustments
work
final
misc
```

---

## 8. Idioma

O idioma oficial dos commits é **inglês**.

Devem ser escritos em inglês:

- tipos;
- escopos;
- descrições.

Exemplo:

```text
feat(company): create company module
```

Não utilizar:

```text
feat(company): criar módulo de empresas
```

Essa decisão aproxima o projeto dos padrões utilizados internacionalmente e facilita colaboração futura.

---

## 9. Commits Atômicos

Cada commit deve representar uma alteração lógica completa.

Exemplo de implementação de um módulo:

```text
feat(review): add review repository
```

seguido por:

```text
feat(review): implement review service
```

e posteriormente:

```text
feat(review): expose review endpoints
```

Essa granularidade facilita:

- revisão;
- depuração;
- identificação de regressões;
- reversão;
- compreensão da evolução da implementação.

Evitar:

```text
feat(review): create review module and fix login and update documentation
```

Esse commit possui responsabilidades não relacionadas.

---

## 10. Relação com Pull Requests

Durante o desenvolvimento de uma funcionalidade, uma Pull Request pode conter diversos commits.

Esses commits devem permanecer pequenos e atômicos.

A integração com a branch `main` será realizada utilizando **Squash and Merge**, conforme definido em `CON-005-git-conventions.md`.

Dessa forma:

```text
Feature branch
│
├── commit 1
├── commit 2
├── commit 3
└── commit 4
        │
        ▼
   Squash and Merge
        │
        ▼
      main
```

A branch principal receberá um commit consolidado representando a alteração integrada.

---

## 11. Exemplos

### 11.1. Exemplos corretos

```text
feat(company): create company module
feat(review): implement review service
fix(auth): validate refresh token
refactor(media): simplify upload service
docs(api): document pagination standard
test(company): add repository tests
ci(github): configure pull request workflow
build(api): update docker configuration
chore(deps): update prisma version
perf(feed): optimize publication query
```

### 11.2. Exemplos incorretos

```text
ajustes
teste
correções
update
mudanças
final
agora vai
versão nova
coisas
```

Também são incorretos commits que misturam responsabilidades:

```text
feat(company): add company module and update documentation
```

Quando as alterações forem independentes, devem ser separadas.

---

## 12. Breaking Changes

Alterações incompatíveis com o contrato existente devem ser explicitamente identificadas.

Quando aplicável, utilizar o indicador `!`:

```text
feat(api)!: change company response format
```

Alterações incompatíveis também devem ser documentadas no corpo do commit ou no Pull Request quando necessário.

Breaking changes devem ser tratadas com atenção especial porque podem afetar consumidores existentes da API ou outros módulos do sistema.

---

## 13. Validação Automática

A convenção de commits será validada automaticamente utilizando **Commitlint**.

O hook `commit-msg`, configurado através do **Husky**, deverá impedir commits que não estejam de acordo com o padrão estabelecido.

Fluxo:

```text
git commit
    │
    ▼
Husky
    │
    ▼
commit-msg
    │
    ▼
Commitlint
    │
    ├── válido ──────► commit criado
    │
    └── inválido ────► commit rejeitado
```

A validação automática reduz a dependência de disciplina manual e mantém a consistência do histórico.

---

## 14. Guia Rápido

| Situação                                 | Tipo       |
| ---------------------------------------- | ---------- |
| Nova funcionalidade                      | `feat`     |
| Correção de bug                          | `fix`      |
| Refatoração sem mudança de comportamento | `refactor` |
| Documentação                             | `docs`     |
| Formatação                               | `style`    |
| Testes                                   | `test`     |
| Manutenção técnica                       | `chore`    |
| Build                                    | `build`    |
| CI/CD                                    | `ci`       |
| Performance                              | `perf`     |
| Reversão                                 | `revert`   |

Exemplo:

```text
feat(api): add health endpoint
```

Pode ser interpretado como:

```text
tipo   → feat
escopo → api
ação   → add
objeto → health endpoint
```

---

## 15. Decisões Arquiteturais

### 15.1. Conventional Commits

O projeto adota Conventional Commits por ser um padrão amplamente utilizado, facilitar automações e proporcionar um histórico consistente.

### 15.2. Inglês como idioma oficial

Todas as mensagens de commit serão escritas em inglês para facilitar colaboração internacional e manter o projeto alinhado às convenções da comunidade de software.

### 15.3. Commits atômicos

Cada commit deve representar uma única alteração lógica, reduzindo o custo de revisão, depuração e reversão.

### 15.4. Squash and Merge

A branch `main` receberá alterações consolidadas por Squash and Merge, preservando um histórico principal limpo sem impedir commits granulares durante o desenvolvimento.

### 15.5. Validação automática

O Commitlint será utilizado para validar automaticamente as mensagens por meio do hook `commit-msg` do Husky.

---

## 16. Evoluções Futuras

A estratégia de commits poderá evoluir para suportar:

- geração automática de changelogs;
- versionamento semântico automatizado;
- integração com ferramentas de release;
- associação automática entre commits e Issues;
- geração automatizada de release notes;
- automações adicionais baseadas nos tipos de commit.

---

## 17. Referências

- `CON-005-git-conventions.md` — Convenções gerais de Git e fluxo de versionamento.
- Configuração do Commitlint — validação das mensagens de commit.
- Configuração do Husky — execução dos hooks do Git.
