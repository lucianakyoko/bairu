# @bairu/config-prettier

Configuração compartilhada do Prettier utilizada pelas aplicações e packages do monorepo Bairu.

---

## Objetivo

Este package centraliza as configurações de formatação de código utilizadas pelo projeto.

Seu objetivo é garantir consistência visual entre aplicações e packages, reduzindo discussões relacionadas a estilo de código e mantendo um histórico de alterações mais limpo no Git.

---

## Responsabilidade

Este package é responsável exclusivamente pelas configurações do Prettier.

Ele não contém código de aplicação nem lógica de negócio.

Exemplos de configurações que poderão existir neste package:

- regras de formatação compartilhadas;
- padrões de estilo visual;
- configurações utilizadas por diferentes aplicações do monorepo.

---

## Estrutura

Atualmente, o package possui a seguinte organização:

```text
config-prettier/

├── package.json
├── README.md
```

A configuração será adicionada conforme a evolução do projeto.

Exemplo:

```text
config-prettier/

├── package.json
├── prettier.config.mjs
└── README.md
```

---

## Como utilizar

As aplicações e packages do monorepo deverão reutilizar a configuração disponibilizada por este package.

A configuração compartilhada será a única fonte de verdade para regras de formatação do projeto.

---

## Princípios

A configuração seguirá os seguintes princípios:

- utilizar o mínimo possível de customizações;
- evitar discussões manuais sobre estilo de código;
- priorizar automação de formatação;
- manter consistência entre todos os projetos do monorepo.

---

## Documentação relacionada

- ADR-001 — Adoção do Monorepo
- ADR-002 — Adoção do pnpm Workspaces
- ENG-001 — Organização de Packages
- ENG-002 — Estratégia de Compartilhamento de Configurações

---
