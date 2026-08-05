# Animation Components

Componentes reutilizáveis de animação utilizados na interface do Bairu.

---

## Objetivo

Centralizar todas as animações da aplicação em componentes reutilizáveis, garantindo consistência visual, facilidade de manutenção e evitando repetição de configurações do Motion.

Os componentes deste diretório encapsulam comportamentos comuns de entrada em tela (entrance animations), permitindo que as páginas utilizem animações de forma padronizada.

---

## Responsabilidades

Este módulo é responsável por:

- encapsular configurações do Motion;
- fornecer componentes reutilizáveis para animações;
- manter consistência entre todas as páginas;
- facilitar futuras alterações globais nas animações.

Este módulo **não** deve conter lógica de negócio.

---

## Componentes disponíveis

### FadeIn

Exibe o conteúdo utilizando apenas uma transição de opacidade.

**Quando utilizar**

- pequenos elementos de interface;
- imagens;
- badges;
- componentes que não precisam de deslocamento.

**Exemplo**

```tsx
<FadeIn>
  <Badge />
</FadeIn>
```

---

### FadeUp

Exibe o conteúdo com um pequeno deslocamento vertical.

**Quando utilizar**

É o componente padrão do projeto.

Ideal para:

- títulos;
- seções;
- blocos de conteúdo;
- cards isolados;
- chamadas para ação.

**Exemplo**

```tsx
<FadeUp>
  <HeroHeading />
</FadeUp>
```

---

### Stagger

Aplica entrada sequencial aos elementos filhos.

**Quando utilizar**

- grids;
- listas;
- cards;
- timelines.

**Exemplo**

```tsx
<Stagger className="grid gap-6 md:grid-cols-3">
  {items.map((item) => (
    <BenefitCard key={item.id} />
  ))}
</Stagger>
```

---

## Boas práticas

- Utilize animações apenas para reforçar a hierarquia visual.
- Evite animar todos os elementos da página.
- Prefira `FadeUp` como animação padrão.
- Utilize `Stagger` apenas quando houver múltiplos elementos relacionados.
- Não aumente a duração das animações sem necessidade.
- As animações devem transmitir fluidez, nunca lentidão.

---

## Princípios adotados

Todas as animações seguem os princípios definidos no documento:

- DS-006 — Interaction Guidelines

---

## Estrutura

```text
components/
└── animation/
    ├── FadeIn.tsx
    ├── FadeUp.tsx
    ├── Stagger.tsx
    ├── index.ts
    └── README.md
```

---

## Evolução futura

Conforme o projeto evoluir, este módulo poderá receber novos componentes, como:

- ScaleIn
- SlideIn
- AnimatedSection
- AnimatedCounter
- HoverCard
- AnimatedModal
- AnimatedDrawer

Novos componentes devem seguir os mesmos princípios de consistência e reutilização definidos neste documento.
