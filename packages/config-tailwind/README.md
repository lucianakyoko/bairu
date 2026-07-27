# @bairu/config-tailwind

Configurações compartilhadas do Tailwind CSS utilizadas pelas aplicações e packages do monorepo Bairu.

---

## Objetivo

Este package centraliza todas as configurações do Tailwind CSS compartilhadas pelo projeto.

Seu objetivo é eliminar duplicação de configuração entre aplicações, garantir consistência na interface, padronizar o sistema de design e facilitar a evolução da plataforma à medida que novos serviços forem sendo adicionados.

---

## Responsabilidade

Este package é responsável exclusivamente pelas configurações do Tailwind CSS.

Ele não contém componentes, código de aplicação nem lógica de negócio.

Exemplos de configurações que poderão existir neste package:

- configuração base do tema;
- tokens de design (cores, tipografia, espaçamentos, sombras, etc.);
- presets compartilhados;
- plugins utilizados em comum pelas aplicações.

---

## Estrutura

Atualmente, o package possui a seguinte organização:

```
config-tailwind/

├── package.json
├── README.md
```

Novos arquivos serão adicionados conforme a evolução do projeto.

Exemplo:

```
config-tailwind/

├── package.json
├── base.ts
├── preset.ts
├── theme.ts
└── README.md
```

---

## Como utilizar

As aplicações do monorepo deverão reutilizar as configurações disponibilizadas por este package.

Exemplo futuro:

```
import preset from "@bairu/config-tailwind/preset";

export default {
  presets: [preset],
};
```

A interface pública será definida conforme novas configurações forem sendo implementadas.
---

## Documentação relacionada

- ADR-001 — Adoção do Monorepo
- ADR-002 — Adoção do pnpm Workspaces
- ENG-001 — Organização de Packages
- ENG-002 — Estratégia de Compartilhamento de Configurações

---
