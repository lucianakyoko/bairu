# @bairu/config-typescript

Configurações compartilhadas do TypeScript utilizadas pelas aplicações e packages do monorepo Bairu.

---

## Objetivo

Este package centraliza todas as configurações TypeScript compartilhadas pelo projeto.

Seu objetivo é eliminar duplicação de configuração entre aplicações, garantir consistência durante o desenvolvimento e facilitar a evolução da plataforma à medida que novos serviços forem sendo adicionados.

---

## Responsabilidade

Este package é responsável exclusivamente pelas configurações do TypeScript.

Ele não contém código de aplicação nem lógica de negócio.

Exemplos de configurações que poderão existir neste package:

- configuração base (`base.json`);
- configurações específicas para frameworks;
- perfis especializados para diferentes tipos de aplicações.

---

## Estrutura

Atualmente, o package possui a seguinte organização:

```text
config-typescript/

├── package.json
├── README.md
```

Novos arquivos serão adicionados conforme a evolução do projeto.

Exemplo:

```text
config-typescript/

├── base.json
├── next.json
├── node.json
├── package.json
└── README.md
```

---

## Como utilizar

As aplicações do monorepo deverão estender as configurações disponibilizadas por este package.

Exemplo futuro:

```json
{
  "extends": "@bairu/config-typescript/base"
}
```

A interface pública do package é disponibilizada através dos exports definidos em seu package.json, permitindo que aplicações consumam apenas os presets necessários.

---

## Documentação relacionada

- ADR-001 — Adoção do Monorepo
- ADR-002 — Adoção do pnpm Workspaces
- ENG-001 — Organização de Packages
- ENG-002 — Estratégia de Compartilhamento de Configurações

---
