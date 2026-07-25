# ENG-004 — Estratégia da Aplicação Web

## Status

Adotado.

---

# Contexto

O Bairu será uma plataforma digital que conecta pessoas, empresas locais e oportunidades.

A aplicação web será o principal ponto de interação dos usuários com a plataforma, sendo responsável pela experiência pública, navegação, apresentação de informações e futuras funcionalidades relacionadas ao ecossistema Bairu.

Como parte da arquitetura de monorepo, a aplicação web deve consumir configurações e padrões compartilhados definidos nos packages internos do projeto.

---

# Decisão

A aplicação web do Bairu será desenvolvida utilizando:

- Next.js;
- React;
- TypeScript;
- Tailwind CSS;
- shadcn/ui;
- Lucide Icons;
- configurações compartilhadas do monorepo.

A aplicação seguirá uma arquitetura baseada no App Router do Next.js.

---

# Stack adotada
## Framework
### Next.js
O Bairu utilizará Next.js como framework principal da aplicação web.

Motivos:

- suporte nativo a renderização no servidor;
- otimizações de performance;
- estrutura baseada em rotas;
- ecossistema consolidado;
- suporte a aplicações escaláveis.

## Biblioteca de interface
### React
React será utilizado como biblioteca de construção da interface.

Responsabilidades:

- criação de componentes reutilizáveis;
- gerenciamento da composição visual;
- implementação das interações da aplicação.

## Linguagem
### TypeScript
A aplicação utilizará TypeScript como linguagem principal.

Objetivos:

- segurança de tipos;
- melhor experiência de desenvolvimento;
- redução de erros em tempo de execução;
- padronização com o restante do monorepo.

A configuração será herdada do package:

```@bairu/config-typescript```

---

# Arquitetura de renderização
A aplicação utilizará os recursos de Server Components do Next.js através do App Router.

A estratégia inicial será:

- priorizar Server Components;
- utilizar Client Components apenas quando houver necessidade de interação no navegador;
- evitar uso desnecessário de estado no cliente.

Motivos:

- melhor performance inicial;
- menor quantidade de JavaScript enviado ao navegador;
- melhor aproveitamento de recursos do framework.

---

# Estrutura de diretórios
A aplicação seguirá inicialmente:

```
apps/web/
app/
components/
lib/
hooks/
styles/
public/
```


Responsabilidades:
- **app**: Responsável pelas rotas e composição das páginas.
- **components**: Componentes reutilizáveis específicos da aplicação.
- **lib**: Funções auxiliares, integrações e configurações internas.
- **hooks**: Hooks React compartilhados pela aplicação.
- **styles**: Arquivos relacionados a estilos globais.

---

# Integração com packages compartilhados
A aplicação deverá consumir as configurações centralizadas:

## TypeScript
```@bairu/config-typescript```

Responsável por:
- regras do compilador;
- padrões de linguagem.


## ESLint
```@bairu/config-eslint```

Responsável por:

- qualidade de código;
- análise estática.


## Prettier
```@bairu/config-prettier```

Responsável por:

- formatação automática;
- consistência visual do código.

## Tailwind CSS
```@bairu/config-tailwind```

Responsável por:

- tokens visuais;
- identidade do Design System;
- padrões de estilo.

---

# Estratégia de estilos
A aplicação utilizará Tailwind CSS como solução principal de estilização.

A abordagem seguirá:

- uso de tokens definidos pelo Design System;
- evitar valores arbitrários espalhados;
- priorizar componentes reutilizáveis.

A identidade visual deverá evoluir centralizada no package: ```@bairu/config-tailwind```

---

# Biblioteca de componentes
## shadcn/ui
O Bairu utilizará shadcn/ui como base para construção dos componentes de interface.

A biblioteca será utilizada como uma coleção de componentes reutilizáveis baseados em:

- React;
- Tailwind CSS;
- Radix UI.

Diferente de bibliotecas tradicionais de componentes, os componentes do shadcn/ui serão adicionados diretamente ao código da aplicação, permitindo maior controle sobre:

- comportamento;
- acessibilidade;
- estilos;
- evolução visual.

## Estratégia de uso

Os componentes do shadcn/ui deverão:

- seguir os tokens definidos pelo Design System;
- evitar duplicação de componentes similares;
- ser adaptados conforme as necessidades do produto.

Inicialmente, os componentes serão mantidos dentro da aplicação web.

Exemplo:
```
apps/web/

components/
└── ui/
├── button.tsx
├── input.tsx
└── card.tsx
```

A extração para um package compartilhado de UI será considerada futuramente quando houver necessidade real de reutilização entre aplicações.
```
packages/
└── ui
```

## Princípios adotados
O projeto evitará criar componentes próprios quando uma solução existente do shadcn/ui atender ao requisito.

Novos componentes deverão ser criados quando:

- houver necessidade específica do produto;
- o comportamento não existir nos componentes disponíveis;
- houver ganho real de reutilização.

---

# Biblioteca de ícones
## Lucide Icons
O Bairu utilizará Lucide Icons como biblioteca oficial de ícones da aplicação web.

Motivos:

- integração nativa com React;
- consistência visual;
- grande variedade de ícones;
- facilidade de customização via propriedades.

## Estratégia de uso

Os ícones deverão ser utilizados preferencialmente através do package oficial:

lucide-react

A aplicação deverá evitar:

- criação manual de SVGs sem necessidade;
- utilização de múltiplas bibliotecas de ícones;
- ícones inconsistentes entre telas.


## Padronização

Tamanho, espessura e cores dos ícones deverão seguir os padrões definidos pelos componentes e tokens visuais do Design System.

---

# Responsabilidades da aplicação web
A aplicação web será responsável por:

- experiência dos usuários;
- apresentação de informações;
- navegação;
- consumo de APIs;
- integração com funcionalidades da plataforma.

A aplicação não será responsável por:

- regras de negócio críticas;
- persistência de dados;
- autenticação centralizada;
- processamento assíncrono.

Essas responsabilidades pertencem ao backend.

---

# Estratégias futuras
A aplicação poderá evoluir com:

- sistema de componentes compartilhados;
- biblioteca interna de UI;
- internacionalização;
- autenticação;
- gerenciamento avançado de estado;
- testes automatizados;
- observabilidade.

Essas decisões serão introduzidas conforme necessidade real do produto.

---

# Documentação relacionada

- ADR-001 — Adoção do Monorepo
- ADR-002 — Adoção do pnpm Workspaces
- ENG-001 — Organização de Packages
- ENG-002 — Estratégia de Compartilhamento de Configurações
- ENG-003 — Fluxo de Validação de Desenvolvimento
