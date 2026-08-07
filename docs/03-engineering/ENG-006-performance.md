# ENG-006 — Performance Architecture

## Objetivo

Definir as diretrizes de performance utilizadas no projeto Bairu.

Este documento estabelece padrões para otimização de carregamento, renderização, processamento e consumo de recursos em todas as camadas da aplicação, garantindo uma experiência rápida para os usuários e uma arquitetura preparada para crescimento.

---

# Filosofia

Performance não é uma etapa do desenvolvimento.

Performance faz parte da arquitetura.

Toda decisão técnica deve considerar:

- experiência do usuário;
- simplicidade da solução;
- escalabilidade;
- consumo de recursos.

Antes de otimizar, sempre medir.

---

# Escopo

Este documento cobre:

- Front-end
- Back-end
- Banco de Dados
- Mobile
- Infraestrutura
- Monitoramento de Performance

---

# Responsabilidades por camada

## Front-end

Responsável por:

- renderização;
- carregamento;
- assets;
- experiência do usuário;
- animações.

---

## Back-end

Responsável por:

- processamento;
- regras de negócio;
- autenticação;
- cache;
- filas;
- APIs.

---

## Banco de Dados

Responsável por:

- consultas;
- índices;
- armazenamento;
- consistência dos dados.

---

## Mobile

Responsável por:

- renderização;
- consumo de APIs;
- cache local;
- experiência offline.

---

## Infraestrutura

Responsável por:

- CDN;
- cache HTTP;
- compressão;
- disponibilidade;
- distribuição global.

---

# Objetivos de Performance

O projeto Bairu busca:

- reduzir o tempo de carregamento inicial;
- oferecer navegação fluida em dispositivos móveis e desktop;
- minimizar consumo de banda;
- reduzir processamento desnecessário;
- garantir escalabilidade conforme o crescimento da plataforma.

---

# Como medimos Performance

As otimizações deverão sempre ser orientadas por métricas.

## Durante o desenvolvimento

- Lighthouse
- Chrome DevTools
- React DevTools
- Core Web Vitals

## Em produção

Futuramente poderão ser utilizados:

- Vercel Analytics
- Speed Insights
- Google Search Console
- WebPageTest

---

# Front-end

## Objetivos

- carregamento rápido;
- menor quantidade possível de JavaScript;
- renderização progressiva;
- excelente experiência em dispositivos móveis.

---

## Server Components

Utilizar Server Components sempre que possível.

Client Components deverão existir apenas quando houver necessidade de:

- estado;
- eventos;
- efeitos colaterais;
- APIs do navegador.

---

## Imagens

Utilizar sempre `next/image`.

Benefícios:

- lazy loading automático;
- otimização de formatos;
- carregamento responsivo;
- prevenção de Layout Shift (CLS);
- melhor Largest Contentful Paint (LCP).

Diretrizes:

- utilizar dimensões explícitas;
- utilizar formatos modernos;
- utilizar `priority` apenas para imagens críticas (Hero).

---

## Fontes

Utilizar `next/font`.

Benefícios:

- elimina requisições externas;
- reduz Layout Shift;
- melhora o Largest Contentful Paint;
- realiza preload automático.

Diretrizes:

- utilizar apenas subsets necessários;
- evitar carregamento externo de fontes.

---

## JavaScript

Buscar sempre:

- menor bundle possível;
- tree shaking;
- code splitting;
- carregamento sob demanda;
- evitar bibliotecas desnecessárias.

---

## Componentes

Evitar:

- renderizações desnecessárias;
- estados duplicados;
- lógica pesada na interface.

Priorizar:

- composição;
- reutilização;
- componentes pequenos.

---

## Animações

As animações deverão:

- iniciar apenas quando visíveis;
- possuir curta duração;
- respeitar `prefers-reduced-motion`;
- nunca prejudicar a experiência de navegação.

---

# Back-end

Esta seção será expandida conforme o desenvolvimento da API.

Estratégias futuras:

- cache;
- paginação;
- compressão;
- processamento assíncrono;
- filas;
- monitoramento.

---

# Banco de Dados

Estratégias futuras:

- índices;
- consultas otimizadas;
- paginação;
- análise de planos de execução;
- evitar consultas N+1.

---

# Mobile

Estratégias futuras:

- virtualização de listas;
- cache local;
- carregamento progressivo;
- otimização de imagens;
- suporte offline.

---

# Infraestrutura

Estratégias futuras:

- CDN;
- Edge Cache;
- compressão Brotli;
- HTTP/2 ou superior;
- distribuição global.

---

# Monitoramento

A performance deverá ser acompanhada continuamente.

## Lighthouse

Monitorar:

- Performance
- Accessibility
- Best Practices
- SEO

---

## Core Web Vitals

### Largest Contentful Paint (LCP)

Tempo necessário para renderizar o maior elemento visível da página.

Objetivo:

≤ 2,5 segundos

---

### Interaction to Next Paint (INP)

Tempo de resposta às interações do usuário.

Objetivo:

≤ 200 ms

---

### Cumulative Layout Shift (CLS)

Quantidade de movimentação inesperada da interface durante o carregamento.

Objetivo:

≤ 0,1

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

# O que evitar

Evitar:

- otimizações prematuras;
- adicionar dependências apenas por micro ganhos;
- sacrificar legibilidade do código;
- aumentar complexidade sem necessidade.

Sempre priorizar simplicidade.

---

# Checklist para novas funcionalidades

Antes de concluir uma funcionalidade verificar:

- utiliza Server Components quando possível?
- adicionou JavaScript desnecessário?
- imagens utilizam `next/image`?
- existe lazy loading onde faz sentido?
- existe paginação?
- a consulta possui índice?
- houve impacto negativo no Lighthouse?

---

# Histórico de otimizações

## Landing Page

Primeiras otimizações implementadas:

- Metadata API
- Open Graph
- Twitter Cards
- JSON-LD
- Canonical URL
- robots.txt
- sitemap.xml
- next/image
- next/font
- Motion com animações em viewport
- Lighthouse Performance 100
- Lighthouse Accessibility 100
- Lighthouse SEO 100

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
