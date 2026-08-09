# CON-005 — Git Conventions

## 1. Objetivo

Este documento estabelece as convenções oficiais para utilização do Git no projeto Bairu.

Seu objetivo é garantir um histórico de versionamento limpo, consistente e rastreável, facilitando revisão de código, auditoria, manutenção, colaboração e evolução contínua da plataforma.

As convenções aqui descritas devem ser seguidas por todos os colaboradores do projeto.

---

## 2. Princípios de Versionamento

O uso do Git no Bairu deve seguir os seguintes princípios:

| Princípio                   | Descrição                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Histórico como documentação | O histórico deve registrar a evolução técnica e funcional do projeto.                                                  |
| Commits atômicos            | Cada commit deve representar uma alteração lógica e bem definida.                                                      |
| Pequenas entregas           | Alterações menores são mais fáceis de revisar, testar e reverter.                                                      |
| Branch principal estável    | A `main` deve permanecer em estado apto para build e deploy.                                                           |
| Rastreabilidade             | Toda alteração relevante deve poder ser relacionada ao seu contexto.                                                   |
| Reprodutibilidade           | O projeto deve poder ser configurado a partir do conteúdo versionado, sem depender de arquivos locais não versionados. |
| Segurança                   | Credenciais, segredos e informações sensíveis nunca devem ser versionados.                                             |

---

## 3. Estrutura de Branches

O desenvolvimento deverá ocorrer em branches específicas para cada alteração.

A branch principal do projeto é:

```text
main
```

Branches de desenvolvimento devem ser criadas a partir da `main` atualizada.

Exemplo:

```text
main
  ↓
feature/company-registration
```

A nomenclatura das branches deverá ser descritiva e utilizar inglês.

Exemplos:

```text
feature/company-registration
feature/review-module
fix/auth-refresh-token
refactor/feed-publication
docs/api-conventions
chore/update-dependencies
```

### 3.1. Tipos de Branch

| Prefixo     | Utilização                                   |
| ----------- | -------------------------------------------- |
| `feature/`  | Nova funcionalidade                          |
| `fix/`      | Correção de comportamento                    |
| `refactor/` | Refatoração sem alteração funcional          |
| `docs/`     | Alterações exclusivamente documentais        |
| `chore/`    | Manutenção técnica                           |
| `test/`     | Alterações relacionadas a testes             |
| `build/`    | Alterações relacionadas ao processo de build |
| `ci/`       | Alterações relacionadas à CI/CD              |

Novos tipos poderão ser adicionados conforme a necessidade do projeto.

---

## 4. Branch Principal

A branch `main` representa o estado oficial e estável do Bairu.

Ela deverá permanecer protegida.

As seguintes regras deverão ser aplicadas:

- push direto não permitido;
- alterações realizadas por Pull Request;
- force push desabilitado;
- exclusão da branch desabilitada;
- histórico preservado;
- checks obrigatórios configurados conforme evolução da CI.

A `main` deve permanecer em condição adequada para build e deploy.

---

## 5. Pull Requests

Toda alteração destinada à `main` deverá passar por Pull Request.

O Pull Request deverá:

- possuir descrição clara;
- informar o objetivo da alteração;
- apresentar os principais impactos;
- indicar alterações arquiteturais quando aplicável;
- possuir checks automatizados aprovados;
- passar por revisão de código quando houver mais de um colaborador.

Mesmo em uma equipe pequena, o Pull Request deverá ser utilizado como mecanismo de revisão e registro da alteração.

---

## 6. Fluxo de Desenvolvimento

O fluxo padrão será:

```text
Atualizar main
      ↓
Criar branch
      ↓
Desenvolvimento
      ↓
Testes e validações
      ↓
Commits incrementais
      ↓
Pull Request
      ↓
Code Review
      ↓
Squash and Merge
      ↓
main
```

Antes de iniciar uma nova tarefa:

```bash
git checkout main
git pull
```

Em seguida:

```bash
git checkout -b feature/nome-da-feature
```

O fluxo poderá ser adaptado conforme a ferramenta utilizada, mas a branch de trabalho deve sempre partir de uma versão atualizada da `main`.

---

## 7. Commits

Os commits devem ser:

- pequenos;
- atômicos;
- objetivos;
- frequentes;
- facilmente compreensíveis;
- facilmente reversíveis.

Cada commit deve possuir uma única responsabilidade lógica.

Não é recomendado misturar no mesmo commit:

- funcionalidades;
- correções não relacionadas;
- refatorações;
- alterações de documentação;
- mudanças de infraestrutura sem relação direta.

A convenção detalhada para mensagens de commit está definida em:

```text
CON-006-commit-conventions.md
```

---

## 8. Commits Durante o Desenvolvimento

Durante o desenvolvimento de uma funcionalidade, commits intermediários são permitidos.

Exemplo:

```text
feat(review): add review repository
feat(review): implement review service
test(review): add review service tests
feat(review): expose review endpoints
```

Esses commits ajudam a preservar a evolução da implementação e facilitam recuperação ou revisão durante o desenvolvimento.

Antes da integração na `main`, o histórico poderá ser consolidado por meio de Squash and Merge.

---

## 9. Squash and Merge

O Bairu adotará **Squash and Merge** como estratégia preferencial de integração.

Dessa forma:

```text
Branch de feature

commit A
commit B
commit C
commit D
    ↓
Squash and Merge
    ↓
main

commit consolidado
```

O objetivo é manter a `main` com um histórico limpo, no qual cada alteração integrada represente uma unidade funcional ou técnica significativa.

Os commits intermediários continuam disponíveis na branch de desenvolvimento enquanto o Pull Request estiver aberto.

---

## 10. Arquivos Versionados

O repositório deverá conter apenas arquivos necessários para construção, execução, documentação ou manutenção do projeto.

Devem ser versionados:

- código-fonte;
- documentação;
- arquivos de configuração compartilhados;
- scripts;
- migrations;
- seeds;
- arquivos de infraestrutura;
- configurações de CI/CD;
- arquivos necessários para reprodução do ambiente.

Não devem ser versionados:

- dependências instaladas;
- arquivos temporários;
- caches;
- builds locais;
- logs;
- arquivos de ambiente com informações sensíveis;
- credenciais;
- chaves privadas;
- artefatos gerados automaticamente que não façam parte do processo oficial do projeto.

---

## 11. `.gitignore`

O arquivo `.gitignore` deverá permanecer centralizado na raiz do monorepo.

Exemplos de itens que não devem ser versionados:

```text
node_modules/
dist/
.next/
coverage/
.env
.env.*
*.log
```

Arquivos gerados por ferramentas também devem ser avaliados antes de serem adicionados ao repositório.

No caso de artefatos gerados automaticamente pelo Prisma ou outras ferramentas, deve-se distinguir entre:

- arquivos necessários para reprodução do projeto;
- arquivos temporários ou específicos do ambiente local.

Somente os primeiros devem ser versionados.

Alterações relevantes no `.gitignore` devem ser revisadas juntamente com a alteração que as motivou.

---

## 12. Variáveis de Ambiente

Arquivos contendo credenciais ou informações específicas do ambiente não devem ser versionados.

Exemplo:

```text
.env
.env.local
.env.development.local
```

O repositório poderá conter arquivos de exemplo, desde que não contenham segredos reais.

Exemplo:

```text
.env.example
```

O arquivo de exemplo deve documentar as variáveis necessárias para executar a aplicação.

Exemplo:

```env
DATABASE_URL=
JWT_SECRET=
```

Valores reais devem ser fornecidos exclusivamente pelo ambiente de execução ou por mecanismos seguros de gerenciamento de secrets.

---

## 13. Segurança do Repositório

Nunca devem ser commitados:

- senhas;
- tokens;
- API keys;
- chaves privadas;
- certificados privados;
- credenciais de banco;
- arquivos `.env`;
- secrets de serviços externos.

Caso uma credencial seja publicada acidentalmente, ela deve ser considerada comprometida.

O procedimento deve ser:

```text
Identificar exposição
        ↓
Revogar credencial
        ↓
Gerar nova credencial
        ↓
Atualizar ambientes
        ↓
Investigar histórico
```

A simples remoção do arquivo em um commit posterior não é suficiente para considerar o segredo seguro.

---

## 14. Git LFS

O Git LFS não será utilizado inicialmente.

Arquivos grandes relacionados ao funcionamento da plataforma deverão permanecer em serviços especializados.

Exemplos:

- Cloudinary;
- object storage;
- serviços de mídia;
- CDN.

Caso o projeto futuramente necessite versionar arquivos grandes diretamente no Git, a adoção do Git LFS deverá ser avaliada separadamente.

---

## 15. Hooks do Git

O projeto utiliza Husky para automatizar validações relacionadas ao Git.

### 15.1. `pre-commit`

O hook `pre-commit` deverá executar validações rápidas relacionadas à qualidade do código.

Exemplos:

```text
ESLint
Prettier
```

O objetivo é impedir que alterações claramente inválidas sejam registradas no histórico.

### 15.2. `commit-msg`

O hook `commit-msg` deverá validar as mensagens utilizando Commitlint.

A mensagem deverá seguir a convenção definida em:

```text
CON-006-commit-conventions.md
```

### 15.3. `pre-push`

Um hook `pre-push` poderá ser adotado futuramente para executar validações adicionais, como:

- testes rápidos;
- typecheck;
- validações críticas.

As verificações executadas nesse hook devem permanecer rápidas o suficiente para não prejudicar significativamente o fluxo de desenvolvimento.

---

## 16. Qualidade Antes do Commit

Antes de realizar um commit, o desenvolvedor deverá revisar:

```text
git status
git diff
```

Também deverá executar as validações aplicáveis à alteração.

Exemplos:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Nem todas as validações precisam necessariamente ser executadas para toda alteração, mas funcionalidades que alterem código devem ser verificadas adequadamente.

---

## 17. Revisão das Alterações

Antes de criar um Pull Request, deve-se verificar:

- arquivos modificados;
- arquivos novos;
- arquivos removidos;
- alterações acidentais;
- secrets ou dados sensíveis;
- arquivos gerados indevidamente;
- documentação necessária;
- impacto em outras aplicações ou packages;
- impacto arquitetural.

Comandos úteis:

```bash
git status
git diff
git diff --cached
```

---

## 18. Histórico como Documentação

O histórico do Git deve ser tratado como documentação técnica permanente.

Ao analisar o histórico, um desenvolvedor deve conseguir compreender:

- o que foi alterado;
- quando foi alterado;
- em qual contexto;
- qual problema motivou a alteração;
- qual decisão de engenharia foi introduzida.

Por esse motivo, mensagens genéricas e alterações sem contexto devem ser evitadas.

---

## 19. Alterações Arquiteturais

Alterações que modificam decisões estruturais do sistema devem ser identificadas durante o Pull Request.

Quando uma mudança representar uma decisão arquitetural significativa, ela deverá ser documentada utilizando um ADR.

Exemplos:

- mudança de estratégia de persistência;
- introdução de uma nova infraestrutura;
- alteração significativa da arquitetura;
- mudança de padrão de comunicação entre módulos;
- adoção ou remoção de uma tecnologia.

O commit e o Pull Request devem permitir rastrear a relação entre implementação e decisão arquitetural.

---

## 20. Documentação

Alterações de comportamento, arquitetura ou convenções devem ser acompanhadas da documentação correspondente quando necessário.

A documentação do projeto possui identificadores próprios e deve permanecer organizada de acordo com o tipo de documento.

Exemplos:

```text
ENG-xxx
CON-xxx
API-xxx
DS-xxx
ADR-xxx
```

Documentação não deve ser adicionada automaticamente ao mesmo commit de uma funcionalidade apenas por conveniência.

Quando representar uma alteração lógica independente, deverá possuir seu próprio commit.

---

## 21. Rebase e Sincronização

Branches de desenvolvimento devem ser mantidas razoavelmente atualizadas em relação à `main`.

Quando necessário, poderá ser utilizado:

```bash
git fetch origin
git rebase origin/main
```

O rebase deve ser utilizado com cuidado em branches compartilhadas.

Branches que já foram publicadas e utilizadas por outras pessoas não devem sofrer reescrita de histórico sem coordenação.

---

## 22. Force Push

Force push não deve ser realizado na `main`.

Em branches pessoais de desenvolvimento, seu uso poderá ser necessário após operações como rebase ou reorganização de commits.

Quando utilizado, deve-se preferir:

```bash
git push --force-with-lease
```

em vez de:

```bash
git push --force
```

`--force-with-lease` oferece uma proteção adicional contra sobrescrever alterações remotas desconhecidas.

---

## 23. Exclusão de Branches

Após a integração de um Pull Request, branches de feature deverão ser removidas quando não forem mais necessárias.

Exemplo:

```text
feature/company-registration
        ↓
Pull Request
        ↓
Squash and Merge
        ↓
main
        ↓
branch removida
```

Branches antigas não devem permanecer indefinidamente sem propósito.

---

## 24. Repositório Reprodutível

O projeto deve permanecer reproduzível a partir dos arquivos versionados.

Isso significa que um novo desenvolvedor deve conseguir:

1. clonar o repositório;
2. instalar as dependências;
3. configurar as variáveis de ambiente;
4. executar as ferramentas necessárias;
5. iniciar o projeto.

Arquivos locais essenciais para o funcionamento não devem ser tratados como dependências ocultas.

Quando uma configuração for necessária para executar o projeto, ela deve ser documentada ou disponibilizada através de um arquivo de exemplo.

---

## 25. Decisões Arquiteturais Consolidadas

| Decisão                          | Justificativa                                                                      |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| GitHub como plataforma oficial   | Centraliza versionamento, revisão e colaboração.                                   |
| `main` protegida                 | Preserva a estabilidade da versão oficial.                                         |
| Pull Requests obrigatórios       | Promove revisão e rastreabilidade.                                                 |
| Squash and Merge                 | Mantém o histórico principal conciso e legível.                                    |
| Commits atômicos                 | Facilita revisão, entendimento e reversão.                                         |
| Conventional Commits             | Padroniza o histórico e permite automações futuras.                                |
| Husky                            | Automatiza validações locais.                                                      |
| Commitlint                       | Garante consistência das mensagens de commit.                                      |
| `.gitignore` centralizado        | Evita divergência de regras entre aplicações do monorepo.                          |
| Secrets fora do Git              | Reduz risco de exposição de credenciais.                                           |
| Git LFS não adotado inicialmente | Evita complexidade enquanto arquivos grandes não forem uma necessidade do projeto. |

---

## 26. Evolução Futura

O fluxo de versionamento poderá evoluir para incorporar:

- CI obrigatória em Pull Requests;
- análise automática de qualidade;
- geração automática de changelog;
- versionamento semântico;
- automação de releases;
- assinatura de commits;
- dependabot ou ferramenta equivalente;
- políticas automatizadas de segurança;
- CODEOWNERS;
- checks obrigatórios por área do monorepo.

Essas evoluções deverão ser introduzidas conforme a complexidade e o tamanho da equipe justificarem.

---

## 27. Referências Internas

Este documento deve ser utilizado em conjunto com:

- `CON-006-commit-conventions.md` — Convenções de mensagens de commit.
- `ENG-001-...` — Documentação de engenharia relacionada ao fluxo de desenvolvimento.
- `ADR-xxx-...` — Decisões arquiteturais relevantes.
- documentação de CI/CD — Quando disponível.

---

## 28. Checklist de Git

Antes de abrir um Pull Request:

- [ ] A branch foi criada a partir da `main` atualizada.
- [ ] Os commits possuem responsabilidade clara.
- [ ] As mensagens seguem Conventional Commits.
- [ ] Não existem secrets no histórico da alteração.
- [ ] Arquivos gerados ou temporários não foram adicionados.
- [ ] O código foi formatado.
- [ ] O lint foi executado quando aplicável.
- [ ] O typecheck foi executado quando aplicável.
- [ ] Os testes foram executados quando aplicável.
- [ ] A documentação foi atualizada quando necessário.
- [ ] O diff foi revisado manualmente.
- [ ] O Pull Request descreve adequadamente a alteração.

---

## 29. Princípio Final

O Git não deve ser tratado apenas como uma ferramenta para armazenar código.

No Bairu, o histórico de versionamento faz parte da documentação técnica da plataforma.

Cada branch representa uma linha de desenvolvimento.

Cada commit representa uma alteração lógica.

Cada Pull Request representa uma unidade de revisão.

E cada merge na `main` representa uma evolução consolidada do produto.

A qualidade desse histórico deve acompanhar a qualidade do código que ele registra.
