# ENG-005 — SEO Architecture

## Objetivo

Definir os padrões de Search Engine Optimization (SEO) utilizados pelo Bairu.

Este documento estabelece diretrizes para metadata, compartilhamento em redes sociais, dados estruturados e indexação, garantindo consistência entre todas as páginas da aplicação.

---

## Escopo

Este documento cobre:

- Metadata
- Open Graph
- Twitter Cards
- Canonical URL
- JSON-LD
- Sitemap
- Robots

---

## Objetivos do SEO

O SEO do Bairu busca:

- melhorar indexação no Google;
- melhorar compartilhamento em redes sociais;
- aumentar CTR nos resultados de busca;
- facilitar descoberta dos negócios cadastrados;
- manter consistência entre todas as páginas.

---

## Metadata

Toda página pública deverá possuir:

- title
- description

Quando necessário:

- keywords
- authors
- creator

Utilizar exclusivamente a Metadata API do Next.js para definição dos metadados da aplicação.

Exemplo:

`Home

Title

Bairu — Encontre negócios locais em São Miguel Arcanjo

Description

Conectando pessoas aos negócios locais da cidade.`

---

## Open Graph

Todas as páginas públicas deverão possuir:

- og:title
- og:description
- og:image
- og:url
- og:type

Imagem padrão:`/public/og-image.png`

As imagens utilizadas deverão possuir resolução mínima de 1200 × 630 pixels.

---

## Twitter Cards

Utilizar:

summary_large_image

Campos:

- title
- description
- image

---

## JSON-LD

Sempre que aplicável utilizar Schema.org.

Exemplos futuros:

- Organization
- LocalBusiness
- Person
- Product
- Breadcrumb
- SearchAction

Cada página deverá possuir apenas os schemas necessários.
Os schemas deverão ser gerados utilizando JSON-LD e inseridos no <head> da página.

---

## Canonical

Toda página indexável deverá possuir URL canônica.

Exemplo:

https://bairu.com.br/

https://bairu.com.br/negocios

---

## Sitemap

A aplicação deverá gerar sitemap automaticamente utilizando os recursos do App Router.

Inicialmente incluir:

- Home
- Páginas institucionais

No futuro:

- Perfis públicos
- Categorias
- Cidades

Será utilizada a geração automática do App Router através do arquivo:

`app/sitemap.ts`

---

## Robots

Permitir indexação apenas das páginas públicas.

Bloquear:

- login
- dashboard
- páginas administrativas

Será utilizado: `app/robots.ts`

---

## Responsabilidades

### layout.tsx

Responsável pelos metadados globais.

- metadata global
- Open Graph padrão
- Twitter padrão

### page.tsx

Responsável pelos metadados específicos da página.

- metadata específica
- canonical
- JSON-LD quando necessário

### lib/seo

Responsável pela geração dos objetos reutilizáveis de SEO.

- geração de schemas
- reutilização de objetos de metadata
- helpers de SEO

---

## Boas práticas

- títulos únicos
- descriptions únicas
- URLs limpas
- headings hierárquicos
- imagens com alt
- carregamento otimizado
- evitar conteúdo duplicado;
- utilizar uma única tag <h1> por página.

---

## Evoluções futuras

- SearchAction
- LocalBusiness
- páginas dinâmicas
- metadados automáticos para empresas cadastradas
- OG Images dinâmicas
- geração dinâmica de sitemap;
- geração dinâmica de Open Graph Images;
- metadata por categoria;
- metadata por empresa.

---

## Revisão

Sempre que novas páginas públicas forem adicionadas, este documento deverá ser revisado.
