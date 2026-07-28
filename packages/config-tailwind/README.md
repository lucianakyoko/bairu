# @bairu/config-tailwind

Configuração compartilhada do Tailwind CSS utilizada pelas aplicações do monorepo Bairu.

---

## Objetivo

Este package centraliza os tokens visuais compartilhados do Design System do Bairu.

Seu objetivo é garantir consistência visual entre aplicações, eliminar duplicação de definições de tema e facilitar a evolução da identidade visual da plataforma à medida que novos produtos e serviços forem sendo adicionados.

---

## Responsabilidade

Este package é responsável exclusivamente pela definição do tema compartilhado do Tailwind CSS.

Ele não contém componentes, lógica de negócio nem código de aplicação.

Sua responsabilidade é disponibilizar uma fonte única de verdade para os tokens de design utilizados em todo o monorepo.

Exemplos de elementos definidos neste package:

- cores semânticas;
- raios de borda;
- tipografia;
- espaçamentos;
- sombras;
- demais tokens visuais do Design System.

---

## Arquitetura

O projeto utiliza a abordagem **CSS-first** introduzida no Tailwind CSS v4.

Os tokens de design são definidos em arquivos CSS utilizando a diretiva `@theme`, permitindo que qualquer aplicação do monorepo compartilhe exatamente a mesma identidade visual.

Essa estratégia reduz duplicação de configuração, simplifica a manutenção e mantém os tokens independentes de frameworks específicos.

---

## Estrutura

Atualmente, o package possui a seguinte organização:

```text
config-tailwind/

├── index.css
├── theme.css
├── package.json
└── README.md
```

À medida que o Design System evoluir, novos arquivos poderão ser adicionados.

Exemplo:

```text
config-tailwind/

├── index.css
├── theme.css
├── utilities.css
├── animations.css
├── package.json
└── README.md
```

---

## Como utilizar

As aplicações do monorepo deverão importar este package para compartilhar os mesmos tokens visuais.

Exemplo:

```css
@import "tailwindcss";
@import "@bairu/config-tailwind";
```

A aplicação passa automaticamente a utilizar o tema compartilhado definido pelo Design System do Bairu.

---

## Princípios

O package segue os seguintes princípios:

- utilizar CSS como fonte de verdade para os tokens do Design System;
- manter apenas uma definição para cada token visual;
- desacoplar os tokens de qualquer framework específico;
- permitir reutilização por qualquer aplicação do monorepo;
- facilitar a evolução incremental do Design System.

---

## Documentação relacionada

- ADR-001 — Adoção do Monorepo
- ADR-002 — Adoção do pnpm Workspaces
- ENG-001 — Organização de Packages
- ENG-002 — Estratégia de Compartilhamento de Configurações
- DS-001 — Fundamentos do Design System

---

## Status

🚧 Em evolução.

A primeira versão do tema compartilhado está sendo construída durante a Sprint 2 e servirá como base para todos os componentes do Design System do Bairu.
