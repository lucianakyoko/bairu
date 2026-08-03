# DS-004 — Responsive Guidelines

## Objetivo

Este documento define os padrões de responsividade adotados no Bairu.

Seu objetivo é garantir consistência entre todas as páginas da aplicação, estabelecendo regras para layout, espaçamento, grids, tipografia e comportamento dos componentes em diferentes tamanhos de tela.

---

# Breakpoints

O projeto utiliza os breakpoints padrão do Tailwind CSS.

| Breakpoint | Largura mínima | Dispositivo de referência |
| ---------- | -------------: | ------------------------- |
| Mobile     |            0px | Smartphones               |
| sm         |          640px | Smartphones grandes       |
| md         |          768px | Tablets                   |
| lg         |         1024px | Notebooks                 |
| xl         |         1280px | Desktop                   |
| 2xl        |         1536px | Monitores grandes         |

---

# Container

Todas as páginas devem utilizar um container centralizado.

## Regras

- Utilizar largura máxima consistente.
- Centralizar o conteúdo horizontalmente.
- Aplicar padding horizontal em todos os breakpoints.

Exemplo:

```tsx
<div className="container mx-auto px-6">
```

---

# Espaçamento

Os espaçamentos devem seguir a escala definida pelo Design System.

## Espaçamento entre seções

Desktop

- 96px

Tablet

- 80px

Mobile

- 64px

Evitar definir espaçamentos arbitrários.

---

# Grids

## Desktop

Sempre priorizar múltiplas colunas.

Exemplo

```text
4 colunas

3 colunas

2 colunas
```

---

## Tablet

Sempre avaliar redução para duas colunas.

Exemplo

```
4 → 2

3 → 2
```

---

## Mobile

Sempre utilizar uma única coluna.

Evitar:

- cards muito estreitos;
- textos lado a lado;
- imagens comprimidas.

---

# Tipografia

A hierarquia visual deve permanecer consistente em todos os dispositivos.

## Regras

- Reduzir tamanho apenas quando necessário.
- Nunca comprometer legibilidade.
- Evitar linhas excessivamente longas.

---

# Botões

## Desktop

Os botões podem ser exibidos lado a lado.

```
[Entrar] [Cadastrar]
```

---

## Mobile

Priorizar largura total quando necessário.

```
[Entrar]

[Cadastrar]
```

Área mínima de toque:

- 44 × 44 px

---

# Cards

Os cards devem manter:

- padding interno consistente;
- largura confortável;
- altura determinada pelo conteúdo.

Evitar alturas fixas quando possível.

---

# Ícones

Todos os ícones devem utilizar Lucide React ou o componente BrandIcon.

Tamanho padrão

Desktop

- 24px
- 32px

Mobile

- 20px
- 24px

---

# Imagens

As imagens devem:

- manter proporção;
- evitar cortes inesperados;
- utilizar largura responsiva.

---

# Header

Desktop

Logo

Navegação

Ações

---

Mobile

Logo

Menu hambúrguer

A navegação deve ser exibida através de um Sheet.

---

# Footer

Desktop

Distribuição em colunas.

Mobile

Empilhamento vertical.

---

# Seções

Todas as seções da homepage devem respeitar:

- padding vertical consistente;
- alinhamento central;
- largura máxima do conteúdo.

---

# Overflow

Nenhuma página deve gerar scroll horizontal.

Todo conteúdo deve permanecer visível entre 320px e 1920px.

---

# Checklist de Responsividade

Antes de considerar uma tela concluída, validar:

- Container centralizado
- Nenhum overflow horizontal
- Tipografia legível
- Espaçamentos consistentes
- Grid adaptado
- Botões acessíveis
- Navegação funcional
- Footer organizado
- Cards proporcionais

---

# Dispositivos de validação

Durante o desenvolvimento, validar nos seguintes tamanhos:

| Largura | Referência      |
| ------: | --------------- |
|   320px | Mobile pequeno  |
|   375px | iPhone          |
|   390px | Android moderno |
|   430px | iPhone Plus     |
|   768px | Tablet          |
|  1024px | Notebook        |
|  1280px | Desktop         |
|  1440px | Desktop grande  |
|  1920px | Full HD         |

---

# Decisões Arquiteturais

- Utilizar os breakpoints padrão do Tailwind CSS.
- Priorizar layouts fluidos em vez de larguras fixas.
- Componentes devem ser responsivos por padrão.
- A responsividade faz parte da implementação do componente, não deve ser tratada como comportamento isolado de uma página.
- Toda nova tela deve seguir este guia.
