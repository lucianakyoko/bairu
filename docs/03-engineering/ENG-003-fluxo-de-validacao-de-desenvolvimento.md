# ENG-003 — Fluxo de Validação de Desenvolvimento

## Status

Adotado.

---

## Contexto

À medida que o monorepo Bairu evolui, torna-se necessário garantir que alterações incorporadas ao repositório mantenham um padrão mínimo de qualidade, consistência e rastreabilidade.

Processos manuais de validação dependem da disciplina individual dos desenvolvedores e podem permitir que problemas simples sejam introduzidos no código.

Para reduzir esses riscos, o projeto adota um fluxo automatizado de validações integrado ao ciclo de commits.

---

# Decisão

O Bairu utilizará validações automatizadas durante o fluxo de desenvolvimento utilizando Git Hooks.

As validações serão executadas em momentos específicos do ciclo Git, respeitando a responsabilidade de cada etapa.

O fluxo será dividido em:

- validação de código antes do commit;
- validação da mensagem de commit;
- futuras validações antes do envio ao repositório remoto.

---

# Arquitetura do fluxo

O fluxo atual:

```
git commit
↓
pre-commit
↓
Validações de código
↓
commit-msg
↓
Validação da mensagem
↓
Commit criado
```

---

# Ferramentas adotadas

## Husky

Responsável pelo gerenciamento dos Git Hooks utilizados pelo projeto.

O Husky permite executar comandos automaticamente durante eventos do Git, garantindo que validações importantes sejam executadas antes da criação dos commits.

Responsabilidades:

- configurar hooks compartilhados do repositório;
- executar comandos de validação;
- impedir commits que violem regras definidas pelo projeto.

---

## Commitlint

Responsável pela validação das mensagens de commit.

O projeto utiliza o padrão Conventional Commits como convenção para mensagens.

Responsabilidades:

- validar estrutura das mensagens;
- garantir consistência do histórico do repositório;
- facilitar rastreabilidade das alterações.

Exemplos válidos:

```
feat(web): add authentication page

fix(api): handle invalid request

docs: update engineering documentation

chore(config): update tooling
```

Exemplos inválidos:

```
arrumei umas coisas

mudanças

teste
```

---

# Hooks configurados

## pre-commit

Responsável por validar qualidade do código antes da criação do commit.

Validações atuais:

- formatação através do Prettier;
- análise estática através do ESLint.

Fluxo:

```
pre-commit
↓
pnpm format
↓
pnpm lint
```

---

## commit-msg

Responsável por validar a mensagem utilizada no commit.

Fluxo:

```
commit-msg
↓
pnpm commitlint --edit $1
```

---

# Integração com Turborepo

As validações são executadas através dos scripts definidos na raiz do monorepo.

Exemplo:

```
pnpm lint
↓
turbo run lint
```

Cada aplicação ou package que possuir código executável será responsável por definir sua própria implementação dos comandos.

Packages exclusivamente de configuração não precisam implementar scripts próprios enquanto não possuírem código que necessite de validação.

---

# Princípios adotados

## Qualidade antes da integração

Alterações devem passar pelas validações mínimas antes de serem incorporadas ao histórico do projeto.

## Automação acima de processos manuais

Validações repetitivas devem ser executadas automaticamente para reduzir dependência de ações humanas.

## Responsabilidade única

Cada ferramenta possui uma responsabilidade específica:

| Ferramenta | Responsabilidade             |
| ---------- | ---------------------------- |
| Husky      | Executar hooks Git           |
| ESLint     | Qualidade e análise estática |
| Prettier   | Padronização de código       |
| Commitlint | Padronização das mensagens   |

---

# Evoluções futuras

O fluxo poderá ser expandido com novas validações:

- execução de testes automatizados;
- validação de build;
- análise de segurança;
- hooks de pre-push;
- integração com pipelines CI/CD.

Novas validações devem ser adicionadas conforme necessidade real do projeto, evitando aumentar o tempo do fluxo de desenvolvimento sem benefício proporcional.

---

# Documentação relacionada

- ADR-001 — Adoção do Monorepo
- ADR-002 — Adoção do pnpm Workspaces
- ENG-001 — Organização de Packages
- ENG-002 — Estratégia de Compartilhamento de Configurações
