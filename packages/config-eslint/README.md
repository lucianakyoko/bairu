# @bairu/config-eslint

Configurações compartilhadas do ESLint utilizadas pelas aplicações e packages do monorepo Bairu.

---

## Objetivo

Este package centraliza todas as configurações compartilhadas do ESLint utilizadas pelo projeto.

Seu objetivo é garantir qualidade de código, consistência entre aplicações e facilitar a evolução das regras de lint à medida que o monorepo cresce.

---

## Responsabilidade

Este package é responsável exclusivamente pelas configurações do ESLint.

Ele não contém código de aplicação nem lógica de negócio.

Exemplos de configurações que poderão existir neste package:

- configuração base de lint;
- configurações específicas para frameworks;
- regras compartilhadas entre aplicações.

---

## Estrutura

Atualmente, o package possui a seguinte organização:

```text
config-eslint/

├── package.json
├── README.md
```

Novos arquivos serão adicionados conforme a evolução do projeto.

Exemplo:

```text
config-eslint/

├── eslint.config.mjs
├── next.mjs
├── node.mjs
└── README.md
```

---

## Como utilizar

As aplicações do monorepo deverão reutilizar as configurações disponibilizadas por este package.

A interface pública será definida conforme novas configurações forem sendo implementadas.

---

## Documentação relacionada

- ADR-001 — Adoção do Monorepo
- ADR-002 — Adoção do pnpm Workspaces
- ENG-001 — Organização de Packages
- ENG-002 — Estratégia de Compartilhamento de Configurações

---
