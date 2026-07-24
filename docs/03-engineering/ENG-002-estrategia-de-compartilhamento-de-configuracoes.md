# ENG-002 — Estratégia de Compartilhamento de Configurações

## Status

Aprovado

## Versão

1.0

## Última atualização

24/07/2026

---

# 1. Objetivo

Este documento define a estratégia adotada para o compartilhamento de configurações no monorepo Bairu.

Seu objetivo é garantir que todas as ferramentas utilizadas pelo projeto compartilhem configurações de forma consistente, reutilizável e escalável, reduzindo duplicação e facilitando a manutenção ao longo da evolução da plataforma.

As estratégias descritas neste documento deverão ser utilizadas sempre que uma nova configuração compartilhada for introduzida no projeto.

---

# 2. Filosofia

No Bairu, configurações são tratadas como ativos de engenharia.

Em vez de duplicar arquivos de configuração em cada aplicação, o projeto centraliza essas definições em packages compartilhados, permitindo que toda a plataforma evolua de forma consistente.

Cada configuração compartilhada deve responder à seguinte pergunta:

> **"Esta configuração representa um padrão que deverá ser reutilizado por mais de uma aplicação?"**

Se a resposta for positiva, essa configuração deverá ser compartilhada.

---

# 3. Princípios

Toda configuração compartilhada deve respeitar os seguintes princípios.

## Fonte Única de Verdade

Cada configuração deve existir em apenas um local.

Aplicações não devem duplicar configurações que possam ser compartilhadas.

---

## Responsabilidade Única

Cada package de configuração possui apenas uma responsabilidade.

Exemplos:

```
config-typescript
config-eslint
config-prettier
config-tailwind
```

Misturar configurações de ferramentas diferentes em um mesmo package não é permitido.

---

## Evolução Incremental

Novas configurações especializadas somente deverão ser criadas quando existir um consumidor real.

O projeto evita engenharia especulativa.

---

## Especialização

Toda configuração compartilhada deverá possuir uma configuração base e, quando necessário, especializações por contexto.

Essa estratégia reduz duplicação sem comprometer flexibilidade.

---

## Baixo Acoplamento

Aplicações devem conhecer apenas a configuração que consomem.

Elas nunca devem depender da estrutura interna do package de configuração.

---

# 4. Estrutura dos Packages de Configuração

Todo package de configuração deverá seguir uma estrutura simples e previsível.

Exemplo:

```
packages/

└── config-typescript/
    ├── package.json
    ├── README.md
    ├── base.json
    └── next.json
```

Cada package deve conter apenas os arquivos necessários para cumprir sua responsabilidade.

---

# 5. Estratégia de Evolução

Configurações compartilhadas evoluem conforme novas necessidades surgem.

Nenhuma configuração especializada deverá ser criada antes de existir um caso real de utilização.

Por exemplo:

Durante a criação da aplicação Web será necessário apenas:

```
config-typescript/

base.json

next.json
```

Quando uma API NestJS for criada, o projeto poderá evoluir para:

```
config-typescript/

base.json

next.json

nest.json
```

O mesmo princípio será aplicado para todas as demais ferramentas.

---

# 6. Estratégia para TypeScript

## Motivação

Todas as aplicações do Bairu utilizarão TypeScript.

Embora compartilhem diversas configurações, cada tipo de aplicação possui necessidades específicas.

Por esse motivo, o projeto adota uma estratégia baseada em herança de configurações.

---

## Estrutura

A configuração será organizada em camadas.

```
base.json
       ▲
       │
next.json
       ▲
       │
apps/web/tsconfig.json
```

Futuramente:

```
base.json
       ▲
       │
nest.json
       ▲
       │
apps/api/tsconfig.json
```

---

## Responsabilidade do base.json

O arquivo `base.json` deverá conter apenas configurações universais, aplicáveis a qualquer projeto TypeScript.

Exemplos:

- modo `strict`;
- verificações de tipo;
- boas práticas;
- regras independentes de framework.

Nenhuma configuração específica de Next.js, NestJS ou qualquer outra ferramenta deverá existir neste arquivo.

---

## Responsabilidade dos Perfis Especializados

Arquivos como:

```
next.json
nest.json
library.json
```

existem apenas para complementar a configuração base.

Cada perfil adiciona exclusivamente configurações específicas do seu contexto.

---

## Configuração das Aplicações

Cada aplicação deverá estender apenas o perfil correspondente ao seu tipo.

Exemplo:

```
apps/web

↓

next.json

↓

base.json
```

Essa estratégia garante que melhorias realizadas na configuração base sejam automaticamente herdadas por todas as aplicações.

---

# 7. Estratégia para ESLint

**Status:** Planejado

Será documentado quando a configuração compartilhada do ESLint for implementada.

---

# 8. Estratégia para Prettier

**Status:** Planejado

Será documentado quando a configuração compartilhada do Prettier for implementada.

---

# 9. Estratégia para Tailwind CSS

**Status:** Planejado

Será documentado quando a configuração compartilhada do Tailwind CSS for implementada.

---

# 10. Referências

- ADR-001 — Adoção do Monorepo
- ADR-002 — Adoção do pnpm Workspaces
- ENG-000 — Convenções de Documentação
- ENG-001 — Organização de Packages

---

# Notas de Engenharia

Uma boa estratégia de compartilhamento de configurações não busca eliminar diferenças entre aplicações, mas centralizar aquilo que realmente é comum entre elas.

No Bairu, novas configurações especializadas surgem apenas quando existe um caso concreto de utilização. Dessa forma, preservamos a simplicidade do projeto enquanto mantemos uma arquitetura preparada para crescer.
