# ENG-006 — Performance Architecture

## Objetivo

Definir as diretrizes de performance utilizadas no projeto Bairu.

Este documento estabelece padrões para otimização de carregamento, renderização, processamento e consumo de recursos em todas as camadas da aplicação, garantindo uma experiência rápida para os usuários e uma arquitetura preparada para crescimento.

---

# Escopo

Este documento cobre:

- Front-end
- Back-end
- Banco de dados
- Mobile
- Infraestrutura
- Monitoramento de performance

---

# Objetivos de Performance

O projeto Bairu busca:

- reduzir o tempo de carregamento inicial das páginas;
- oferecer navegação fluida em dispositivos móveis e desktop;
- minimizar consumo de banda e processamento;
- garantir escalabilidade conforme o número de usuários crescer;
- estabelecer padrões consistentes para futuras funcionalidades.

---

# Como medimos performance

As otimizações deverão sempre ser orientadas por métricas.

Ferramentas utilizadas:

- Lighthouse
- Chrome DevTools
- Core Web Vitals
- Bundle Analyzer (quando necessário)

No futuro poderão ser utilizados:

- Google Search Console
- WebPageTest
- Vercel Analytics
- Speed Insights

---

# Front-end

## Objetivos

- carregamento rápido;
- menor quantidade possível de JavaScript;
- renderização progressiva;
- excelente experiência em dispositivos móveis.

---

## Estratégias

### Server Components

Utilizar Server Components sempre que possível.

Client Components deverão existir apenas quando houver necessidade de:

- estado;
- eventos;
- efeitos colaterais;
- APIs do navegador.

---

### Imagens

Utilizar sempre:

- next/image
- lazy loading
- dimensões explícitas
- formatos modernos
- priority apenas para imagens críticas (Hero)

---

### Fontes

Utilizar:

- next/font
- preload automático
- subsets mínimos
- evitar carregamento de fontes externas

---

### JavaScript

Buscar sempre:

- menor bundle possível;
- tree shaking;
- code splitting;
- carregamento sob demanda.

---

### Componentes

Evitar:

- renderizações desnecessárias;
- estados duplicados;
- lógica pesada em componentes.

Preferir composição de componentes.

---

### Animações

As animações deverão:

- iniciar apenas quando visíveis;
- possuir curta duração;
- respeitar usuários com preferência por redução de movimento (`prefers-reduced-motion`);
- nunca prejudicar a experiência de navegação.

---

# Back-end

Esta seção será expandida conforme o desenvolvimento da API.

Diretrizes futuras:

- cache;
- paginação;
- compressão;
- filas;
- processamento assíncrono;
- monitoramento.

---

# Banco de Dados

Diretrizes futuras:

- índices;
- consultas otimizadas;
- paginação;
- análise de planos de execução;
- evitar consultas N+1.

---

# Mobile

Diretrizes futuras:

- virtualização de listas;
- cache local;
- carregamento progressivo;
- otimização de imagens;
- suporte offline.

---

# Infraestrutura

Diretrizes futuras:

- CDN;
- cache HTTP;
- compressão Brotli;
- HTTP/2 ou superior;
- Edge Network.

---

# Monitoramento

A performance deverá ser acompanhada continuamente.

Principais métricas:

## Lighthouse

- Performance
- Accessibility
- Best Practices
- SEO

---

## Core Web Vitals

### Largest Contentful Paint (LCP)

Tempo necessário para renderizar o maior elemento visível da página.

Objetivo:

Até 2,5 segundos.

---

### Interaction to Next Paint (INP)

Tempo de resposta às interações do usuário.

Objetivo:

Até 200 ms.

---

### Cumulative Layout Shift (CLS)

Quantidade de movimentação inesperada da interface durante o carregamento.

Objetivo:

Menor que 0,1.

---

# Processo de otimização

Antes de qualquer otimização:

1. medir;
2. identificar o gargalo;
3. implementar a melhoria;
4. medir novamente;
5. documentar o impacto.

Nenhuma otimização deverá ser realizada baseada apenas em percepção.

---

# Boas práticas

- medir antes de otimizar;
- evitar otimizações prematuras;
- priorizar experiência do usuário;
- manter simplicidade da arquitetura;
- documentar decisões importantes.

---

# Evoluções futuras

- Redis
- CDN
- Edge Cache
- Partial Prerendering
- Incremental Static Regeneration
- otimização automática de imagens
- monitoramento em produção
- dashboards de métricas

---

# Revisão

Este documento deverá ser revisado sempre que novas camadas da arquitetura forem incorporadas ao projeto ou quando forem adotadas novas estratégias de otimização de performance.
