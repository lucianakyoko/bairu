# CON-004 — Frontend Conventions

## 1. Objetivo

Este documento estabelece as convenções arquiteturais e de desenvolvimento adotadas pelos frontends da plataforma Bairu.

Seu objetivo é garantir consistência entre aplicações, facilitar a manutenção do código, reduzir ambiguidades durante o desenvolvimento e estabelecer uma base comum para evolução do frontend público e do painel administrativo.

As convenções aqui descritas devem ser seguidas por novas funcionalidades, componentes, páginas e módulos frontend, salvo quando houver justificativa técnica documentada.

---

## 2. Aplicações Frontend

O Bairu possui duas aplicações frontend com objetivos distintos:

| Aplicação | Tecnologia | Objetivo                        |
| --------- | ---------- | ------------------------------- |
| `web`     | Next.js    | Interface pública da plataforma |
| `admin`   | React      | Painel administrativo           |

Embora compartilhem princípios, as aplicações possuem necessidades diferentes.

### Web

O frontend público deve priorizar:

- descoberta local;
- acessibilidade;
- SEO;
- performance;
- navegação simples;
- experiência mobile;
- apresentação dos conteúdos publicados pelas empresas.

### Admin

O painel administrativo deve priorizar:

- produtividade;
- navegação autenticada;
- formulários;
- tabelas;
- dashboards;
- gerenciamento de conteúdo;
- operações administrativas.

O painel administrativo não possui requisitos de SEO equivalentes ao frontend público.

---

## 3. Princípios

Todo desenvolvimento frontend deverá seguir os seguintes princípios.

### 3.1. Simplicidade

A interface deve resolver o problema do usuário com o menor número possível de interações.

### 3.2. Componentização

Interfaces devem ser construídas a partir de componentes reutilizáveis e independentes.

### 3.3. Responsabilidade Única

Cada componente, hook ou serviço deve possuir uma responsabilidade clara.

### 3.4. Composição

Preferir composição de componentes em vez de hierarquias complexas ou herança.

### 3.5. Reutilização

Lógica e componentes compartilhados não devem ser duplicados sem necessidade.

### 3.6. Acessibilidade

A interface deve seguir as boas práticas de acessibilidade e buscar conformidade com WCAG 2.2 AA sempre que aplicável.

### 3.7. Mobile First

As interfaces devem ser projetadas inicialmente para dispositivos menores e evoluídas para telas maiores.

### 3.8. Performance

O frontend deve evitar renderizações, downloads e processamento desnecessários.

### 3.9. SEO

O frontend público deve considerar indexação e performance como requisitos arquiteturais.

---

## 4. Organização do Frontend

O frontend público utilizando Next.js seguirá uma organização baseada em responsabilidades.

```text
src/
├── app/
├── components/
├── features/
├── hooks/
├── services/
├── lib/
├── providers/
├── styles/
├── types/
└── utils/
```

Cada diretório possui uma responsabilidade específica.

---

## 5. App

O diretório `app/` representa a camada de roteamento e composição das páginas do Next.js App Router.

Deve conter:

- rotas;
- layouts;
- páginas;
- loading states;
- error boundaries;
- metadata;
- arquivos relacionados ao roteamento.

Exemplo:

```text
app/
├── companies/
│   └── [slug]/
│       ├── page.tsx
│       └── loading.tsx
├── feed/
│   └── page.tsx
├── layout.tsx
└── page.tsx
```

### Regra

O diretório `app/` não deve conter regras de negócio complexas.

A página deve orquestrar a interface e delegar responsabilidades para componentes, features e services.

---

## 6. Components

O diretório `components/` contém componentes reutilizáveis que não pertencem exclusivamente a um domínio.

Exemplos:

```text
Button
Card
Badge
Avatar
Input
Dialog
Modal
```

Esses componentes devem permanecer independentes das regras específicas do Bairu.

### Regra

Um componente de UI genérico não deve conhecer entidades como `Company`, `Promotion` ou `Review`.

---

## 7. Features

O diretório `features/` concentra funcionalidades organizadas por domínio frontend.

Exemplo:

```text
features/
├── companies/
├── catalog/
├── promotions/
├── feed/
├── reviews/
├── favorites/
└── profile/
```

Cada feature poderá possuir sua própria estrutura:

```text
catalog/
├── components/
├── hooks/
├── services/
└── types/
```

### Exemplo

```text
catalog/
├── components/
│   ├── CatalogCard.tsx
│   ├── CatalogFilters.tsx
│   └── CatalogGrid.tsx
├── hooks/
│   └── useCatalogFilters.ts
├── services/
│   └── catalogService.ts
└── types/
    └── catalog.types.ts
```

### Regra

A feature representa o domínio da interface, mas não deve assumir responsabilidades pertencentes ao backend.

---

## 8. Separação dos Componentes

Os componentes frontend são classificados em três grupos principais.

### 8.1. UI Components

Componentes genéricos e reutilizáveis.

Exemplos:

```text
Button
Card
Badge
Input
Dialog
```

Não devem possuir regras de negócio.

### 8.2. Domain Components

Componentes que conhecem conceitos específicos do domínio.

Exemplos:

```text
CatalogCard
PromotionCard
CompanyHero
FeedCard
ReviewCard
```

Esses componentes podem utilizar tipos e comportamentos relacionados à sua feature.

### 8.3. Layout Components

Componentes responsáveis pela estrutura visual da aplicação.

Exemplos:

```text
Navbar
Header
Footer
Sidebar
BottomNavigation
```

---

## 9. Convenções de Nomenclatura

| Elemento                | Convenção                                   | Exemplo           |
| ----------------------- | ------------------------------------------- | ----------------- |
| Componentes             | PascalCase                                  | `CompanyCard`     |
| Arquivos de componentes | PascalCase                                  | `CompanyCard.tsx` |
| Hooks                   | `use` + PascalCase                          | `usePagination`   |
| Providers               | PascalCase + `Provider`                     | `AuthProvider`    |
| Contexts                | PascalCase + `Context`                      | `AuthContext`     |
| Services                | camelCase + `Service`                       | `companyService`  |
| Utils                   | camelCase                                   | `formatCurrency`  |
| Tipos                   | camelCase ou PascalCase conforme exportação | `CompanySummary`  |

---

## 10. Services

A comunicação com a API deve ser centralizada na camada de services.

Exemplo:

```text
features/
└── catalog/
    └── services/
        └── catalogService.ts
```

A responsabilidade do service é abstrair a comunicação HTTP e fornecer uma interface adequada para a aplicação.

### Correto

```text
Page
 ↓
Feature
 ↓
Service
 ↓
API
```

### Evitar

```text
Page
 ↓
fetch()
```

Componentes e páginas não devem implementar diretamente chamadas HTTP espalhadas pelo código.

---

## 11. Hooks

Hooks devem encapsular comportamentos reutilizáveis relacionados à interface.

Exemplos:

```text
usePagination
useDebounce
useInfiniteScroll
useFavorite
```

Hooks não devem ser utilizados para esconder arbitrariamente regras de negócio que pertencem ao backend.

---

## 12. Lib

O diretório `lib/` contém configurações e integrações técnicas compartilhadas.

Exemplos:

```text
axios.ts
query-client.ts
auth.ts
zod.ts
```

Esse diretório deve concentrar infraestrutura frontend reutilizável, e não funcionalidades específicas de domínio.

---

## 13. Providers

Providers são responsáveis por disponibilizar contextos ou infraestrutura global para a aplicação.

Exemplos:

```text
ThemeProvider
AuthProvider
QueryProvider
```

Providers devem ser utilizados apenas quando houver necessidade real de compartilhar estado ou infraestrutura entre diferentes partes da árvore de componentes.

---

## 14. Estado da Aplicação

O estado deve ser classificado conforme sua natureza.

| Tipo                 | Tecnologia      |
| -------------------- | --------------- |
| Estado do servidor   | TanStack Query  |
| Estado local         | `useState`      |
| Estado compartilhado | Context API     |
| Formulários          | React Hook Form |
| Validação            | Zod             |

### Princípio

Dados provenientes da API pertencem ao estado do servidor e devem ser gerenciados pelo TanStack Query.

Não duplicar desnecessariamente dados do servidor em `useState` ou Context API.

---

## 15. Comunicação com a API

Toda comunicação com o backend deverá utilizar a camada de services.

Fluxo recomendado:

```text
Page
 ↓
Feature
 ↓
Service
 ↓
API
```

A camada frontend não deve depender diretamente da estrutura interna do banco de dados.

Os contratos públicos da API devem ser representados por tipos e DTOs apropriados no frontend.

---

## 16. Estratégia de Renderização

O frontend público utiliza Next.js App Router.

A estratégia de renderização deve ser escolhida conscientemente conforme a necessidade da página.

| Estratégia        | Uso                                                            |
| ----------------- | -------------------------------------------------------------- |
| SSR               | Páginas públicas dinâmicas que dependem de dados atualizados   |
| SSG               | Conteúdo praticamente estático                                 |
| CSR               | Áreas autenticadas e interfaces altamente interativas          |
| Server Components | Padrão sempre que possível                                     |
| Client Components | Apenas quando interação ou APIs do navegador forem necessárias |

### Princípio

Server Components devem ser utilizados por padrão.

O uso de:

```text
"use client"
```

deve ocorrer somente quando houver necessidade real de:

- estado local;
- eventos de interação;
- hooks de cliente;
- APIs do navegador;
- bibliotecas incompatíveis com Server Components.

---

## 17. Formulários

Todos os formulários da aplicação deverão utilizar:

- React Hook Form;
- Zod;
- componentes do Design System.

Fluxo:

```text
Input
 ↓
React Hook Form
 ↓
Zod
 ↓
Service
 ↓
API
```

A validação frontend melhora a experiência do usuário, mas não substitui a validação realizada pelo backend.

---

## 18. Design System

Todo componente visual deverá utilizar o Design System da aplicação.

Tecnologias adotadas:

- Tailwind CSS;
- shadcn/ui;
- Radix UI;
- Lucide Icons.

Componentes existentes no Design System devem ser reutilizados antes da criação de novas implementações equivalentes.

CSS isolado deve ser evitado sempre que possível.

Quando uma exceção for necessária, sua justificativa deve ser clara.

---

## 19. Estilos

| Elemento       | Convenção                  |
| -------------- | -------------------------- |
| Classes        | Tailwind CSS               |
| CSS global     | Tokens e estilos globais   |
| Componentes    | Sem CSS Modules por padrão |
| Tema           | Light e Dark Mode          |
| Responsividade | Mobile First               |

A aplicação deve evitar estilos espalhados e inconsistentes.

---

## 20. Acessibilidade

Toda interface deve considerar acessibilidade desde sua implementação.

Devem ser observados:

- HTML semântico;
- labels associados aos campos;
- navegação por teclado;
- foco visível;
- contraste adequado;
- suporte a leitores de tela;
- uso apropriado de atributos ARIA;
- estados de erro compreensíveis;
- mensagens de feedback acessíveis.

ARIA não deve ser utilizada para compensar HTML semântico inadequado quando elementos HTML nativos forem suficientes.

---

## 21. Performance

As seguintes práticas devem ser consideradas quando aplicáveis:

- lazy loading;
- dynamic imports;
- otimização de imagens com `next/image`;
- skeletons para carregamentos;
- prefetch de rotas relevantes;
- virtualização para listas grandes;
- redução de JavaScript enviado ao cliente;
- utilização de Server Components;
- evitar dependências desnecessárias.

Performance deve ser tratada como uma característica do produto, especialmente porque o Bairu atende usuários em diferentes condições de conectividade e dispositivos.

---

## 22. SEO

SEO aplica-se principalmente ao frontend público.

As páginas públicas relevantes devem considerar:

- Metadata API;
- Open Graph;
- JSON-LD quando aplicável;
- sitemap;
- robots;
- URLs amigáveis;
- canonical URLs;
- conteúdo semanticamente estruturado.

Páginas administrativas não possuem como requisito a indexação por mecanismos de busca.

---

## 23. Internacionalização

O idioma inicial da plataforma será:

```text
pt-BR
```

A arquitetura deve permitir internacionalização futura.

Strings de interface não devem ser excessivamente espalhadas de forma que dificultem uma futura migração para arquivos de tradução.

Quando a internacionalização for introduzida, textos de interface deverão ser centralizados em recursos de tradução.

---

## 24. Filosofia da Interface

A interface do Bairu deve transmitir três características principais:

### Simplicidade

Qualquer pessoa deve conseguir utilizar a plataforma sem treinamento específico.

### Rapidez

Ações importantes, como:

- buscar uma empresa;
- encontrar um serviço;
- visualizar uma promoção;
- consultar um catálogo;

devem exigir o menor número possível de interações.

### Confiança

A interface deve transmitir organização, credibilidade e proximidade com a comunidade local.

O design deve valorizar os negócios e profissionais cadastrados sem competir visualmente com o conteúdo apresentado.

---

## 25. Diretrizes Visuais

A filosofia da interface implica as seguintes diretrizes:

- priorizar legibilidade em vez de efeitos visuais;
- evitar excesso de animações;
- utilizar feedbacks claros;
- manter consistência visual;
- preservar hierarquia visual;
- destacar o conteúdo das empresas;
- evitar elementos que dificultem a descoberta de informações;
- priorizar clareza em interfaces complexas.

A interface da plataforma deve funcionar como suporte para a descoberta local, e não como protagonista.

---

## 26. Arquitetura do Painel Administrativo

O painel administrativo compartilha princípios com o frontend público, mas possui necessidades próprias.

Deve priorizar:

- produtividade;
- clareza das informações;
- formulários eficientes;
- tabelas;
- filtros;
- dashboards;
- ações administrativas;
- feedback rápido.

Por não possuir foco em SEO, a aplicação administrativa poderá utilizar estratégias predominantemente client-side quando isso simplificar a implementação e melhorar a experiência de uso.

---

## 27. Regras de Dependência

As dependências entre camadas devem seguir uma direção clara.

Componentes genéricos não devem depender de features específicas.

Exemplo:

```text
components/
    ↓
não conhece
    ↓
features/
```

Features podem utilizar componentes compartilhados:

```text
features/
    ↓
components/
```

Da mesma forma, páginas podem compor features e componentes:

```text
app/
 ↓
features/
 ↓
components/
```

Essa organização reduz acoplamento e facilita a reutilização.

---

## 28. Regras para Client Components

Client Components devem ser utilizados de forma consciente.

Antes de adicionar `"use client"`, deve-se verificar se a necessidade pode ser resolvida mantendo o componente no servidor.

São justificativas comuns:

- `useState`;
- `useEffect`;
- event handlers;
- Context API;
- APIs do navegador;
- bibliotecas que exigem execução no cliente.

Não utilizar Client Components apenas por conveniência.

---

## 29. Regras para Dados do Servidor

Dados provenientes da API devem possuir uma fonte clara.

Evitar:

- duplicação de dados;
- múltiplas chamadas para a mesma informação;
- estados locais que reproduzam o cache do servidor;
- transformação de dados espalhada entre componentes.

Transformações recorrentes devem ser centralizadas em services, hooks ou utilitários apropriados.

---

## 30. Testes

A estratégia de testes frontend deverá utilizar:

| Tipo        | Ferramenta               |
| ----------- | ------------------------ |
| Unitários   | Vitest                   |
| Componentes | Vitest                   |
| Integração  | Vitest / Testing Library |
| E2E         | Playwright               |

Novas funcionalidades devem priorizar testes para comportamentos relevantes ao usuário.

Componentes puramente visuais e triviais não precisam necessariamente possuir testes individuais quando o custo não for justificado.

---

## 31. Decisões Arquiteturais

### 31.1. Next.js App Router

O frontend público utiliza Next.js App Router para aproveitar Server Components, estratégias híbridas de renderização, SEO e recursos modernos do ecossistema React.

### 31.2. Server Components como padrão

Server Components reduzem JavaScript enviado ao cliente e permitem que o frontend público mantenha foco em performance.

### 31.3. Services para comunicação com API

A comunicação centralizada evita que detalhes HTTP sejam espalhados pela aplicação e reduz o acoplamento entre componentes e backend.

### 31.4. TanStack Query para estado do servidor

O estado proveniente da API é tratado como estado do servidor, evitando a duplicação desse estado em mecanismos locais.

### 31.5. Design System compartilhado

Tailwind CSS, shadcn/ui, Radix UI e Lucide Icons fornecem uma base consistente para a construção das interfaces.

### 31.6. Mobile First

A plataforma deve considerar desde o início usuários utilizando dispositivos móveis e diferentes condições de conectividade.

---

## 32. Checklist para Novas Funcionalidades

Antes de concluir uma funcionalidade frontend, verificar:

- [ ] A responsabilidade da funcionalidade está claramente definida?
- [ ] O código está localizado na camada correta?
- [ ] Componentes genéricos estão separados de componentes de domínio?
- [ ] A comunicação com a API está centralizada em um service?
- [ ] O estado do servidor está sendo tratado pelo TanStack Query?
- [ ] O uso de `"use client"` é realmente necessário?
- [ ] O formulário utiliza React Hook Form e Zod?
- [ ] Os componentes utilizam o Design System?
- [ ] A interface funciona em dispositivos móveis?
- [ ] Acessibilidade básica foi considerada?
- [ ] Estados de loading, erro e vazio foram tratados?
- [ ] A estratégia de renderização foi escolhida conscientemente?
- [ ] SEO foi considerado quando aplicável?
- [ ] Testes foram adicionados quando necessários?
- [ ] A implementação evita duplicação de lógica?

---

## 33. Evolução das Convenções

Estas convenções representam o estado atual da arquitetura frontend do Bairu.

Novas tecnologias ou padrões poderão ser adotados conforme as necessidades do produto.

Uma nova tecnologia não deve ser introduzida apenas por preferência pessoal ou tendência do mercado.

A adoção deve considerar:

- problema que resolve;
- complexidade introduzida;
- impacto na manutenção;
- compatibilidade com a arquitetura existente;
- impacto na experiência do usuário;
- custo de migração;
- benefício para o produto.

Alterações significativas nestas convenções devem ser documentadas e, quando necessário, acompanhadas de uma decisão arquitetural.

---

## 34. Referências

Documentos relacionados:

- `CON-001` — Architectural Conventions
- `CON-002` — API Conventions
- `CON-003` — Git Conventions
- `CON-005` — Commit Conventions
- `ENG-*` — Engineering Architecture
- `ADR-*` — Architecture Decision Records
- `DS-*` — Design System e decisões de design
