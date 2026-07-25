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
## Objetivo

Centralizar as regras de qualidade de código utilizadas por todas as aplicações e packages do monorepo.

## Filosofia

O ESLint é responsável por validar a qualidade do código, identificar más práticas e garantir consistência semântica entre os projetos.

Ele não é responsável pela formatação do código, função que pertence exclusivamente ao Prettier.

## Estratégia
- utilizar o formato moderno Flat Config (eslint.config.mjs);
- manter uma configuração base pequena e reutilizável;
- criar especializações para frameworks quando necessário (Next.js, NestJS, etc.);
- evitar configurações excessivamente grandes ou copiadas de terceiros;
- reutilizar a configuração por meio de packages compartilhados.

## Separação de responsabilidades
| Ferramenta | Responsabilidade          |
| ---------- | ------------------------- |
| TypeScript | Segurança de tipos        |
| ESLint     | Qualidade e boas práticas |
| Prettier   | Formatação                |

## Evolução
A configuração deverá evoluir seguindo a mesma arquitetura adotada para o TypeScript:
```
config-eslint/

base
↓
next
↓
nest
```

---

# 8. Estratégia para Prettier
## Objetivo
Centralizar as configurações de formatação de código utilizadas por todas as aplicações e packages do monorepo Bairu.
O objetivo é garantir que todo o projeto siga um único padrão visual, reduzindo discussões sobre estilo de código e mantendo o histórico do Git mais limpo e consistente.

## Filosofia
O Prettier é responsável exclusivamente pela formatação automática do código.
Sua função é eliminar decisões subjetivas relacionadas ao estilo de escrita, permitindo que a equipe concentre seu tempo na arquitetura, lógica de negócio e qualidade do software.
No Bairu, a configuração do Prettier será compartilhada entre todas as aplicações e packages, garantindo uma experiência consistente durante todo o desenvolvimento.
A configuração deverá permanecer simples, utilizando o mínimo possível de opções customizadas e priorizando o comportamento padrão da ferramenta sempre que possível.

## Estratégia
A configuração compartilhada será disponibilizada através do package:

```
packages/
└── config-prettier
```

Esse package será responsável por fornecer uma única configuração reutilizável para todo o monorepo.
Todas as aplicações e packages deverão consumir essa configuração, evitando duplicação de arquivos e divergências entre projetos.

## Separação de responsabilidades
Cada ferramenta possui uma responsabilidade bem definida dentro do fluxo de desenvolvimento do Bairu.
| Ferramenta | Responsabilidade                                       |
| ---------- | ------------------------------------------------------ |
| TypeScript | Segurança de tipos e validação durante a compilação    |
| ESLint     | Qualidade do código e boas práticas de desenvolvimento |
| Prettier   | Formatação automática e padronização visual do código  |

O Prettier não será utilizado para validar regras de qualidade, assim como o ESLint não será utilizado para definir regras de formatação.

Essa separação mantém as responsabilidades bem definidas e reduz conflitos entre ferramentas.

## Formatação automática
O fluxo de desenvolvimento do projeto deverá privilegiar a formatação automática do código.
Sempre que possível, os editores utilizados pela equipe deverão executar o Prettier automaticamente ao salvar um arquivo.
Dessa forma, todos os desenvolvedores trabalham sobre um código visualmente consistente, independentemente de preferências pessoais de formatação.

## Evolução
A configuração deverá evoluir conforme o crescimento do monorepo, mantendo uma única fonte de verdade para todas as regras de formatação.

A estrutura prevista é:

```
config-prettier/

├── package.json
├── prettier.config.mjs
└── README.md
```

Novas configurações somente serão adicionadas quando houver necessidade real identificada durante o desenvolvimento do projeto, evitando customizações desnecessárias e preservando a simplicidade da ferramenta.

---

# 9. Estratégia para Tailwind CSS

## Objetivo
Centralizar a configuração do Tailwind CSS utilizada por todas as aplicações do monorepo Bairu, garantindo consistência visual, reutilização de configurações e evolução controlada do Design System.

O objetivo não é apenas compartilhar uma configuração do Tailwind, mas estabelecer uma única fonte de verdade para a identidade visual da plataforma.

## Filosofia
O Tailwind CSS será utilizado como a camada técnica responsável por implementar o Design System do Bairu.

As decisões relacionadas à aparência da plataforma deverão ser centralizadas na configuração compartilhada, evitando que aplicações definam cores, tipografia, espaçamentos ou outros aspectos visuais de forma independente.

O Design System representa decisões de produto, e não preferências individuais de desenvolvimento.

Sempre que possível, componentes deverão utilizar tokens semânticos em vez de valores específicos.

## Estratégia
A configuração compartilhada será disponibilizada através do package:

```
packages/
└── config-tailwind
```

Esse package será responsável por concentrar toda a configuração compartilhada do Tailwind utilizada pelo monorepo.

Entre os elementos previstos para essa configuração estão:

- tema compartilhado;
- tokens de cores;
- tipografia;
- espaçamentos;
- raios de borda;
- sombras;
- breakpoints;
- extensões futuras do Design System.

Todas as aplicações deverão reutilizar essa configuração.

## Separação de responsabilidades
Cada ferramenta do monorepo possui uma responsabilidade específica.
| Ferramenta   | Responsabilidade                |
| ------------ | ------------------------------- |
| TypeScript   | Segurança de tipos e compilação |
| ESLint       | Qualidade de código             |
| Prettier     | Formatação automática           |
| Tailwind CSS | Implementação do Design System  |

O Tailwind não define regras de negócio nem componentes reutilizáveis.

Sua responsabilidade é disponibilizar a infraestrutura visual sobre a qual os componentes serão construídos.


## Princípios
A configuração compartilhada seguirá os seguintes princípios:

- utilizar tokens semânticos em vez de valores específicos;
- centralizar toda a identidade visual da plataforma;
- evitar duplicação de configurações entre aplicações;
- permitir evolução do Design System sem alterações distribuídas pelo código;
- priorizar consistência visual em todo o monorepo.

## Evolução
Inicialmente, o package será responsável apenas pela configuração compartilhada do Tailwind.

Estrutura prevista:
```
config-tailwind/

├── package.json
├── tailwind.config.ts
└── README.md
```

Conforme o crescimento do projeto, essa configuração servirá como base para os componentes reutilizáveis do Design System.

No futuro, o package @bairu/ui consumirá essa configuração para construir componentes compartilhados, mantendo toda a identidade visual da plataforma centralizada em uma única fonte de verdade.

## Diretriz arquitetural
Sempre que uma decisão visual puder ser centralizada no Design System, ela deverá ser implementada na configuração compartilhada do Tailwind, e não diretamente nas aplicações consumidoras.

Qs aplicações consomem o Design System, elas não o definem.

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
