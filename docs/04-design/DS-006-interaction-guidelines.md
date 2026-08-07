# DS-006 — Interaction Guidelines

---

## Objetivo

Este documento define os padrões de interação utilizados na interface do Bairu.

Seu objetivo é garantir consistência visual, previsibilidade e uma experiência agradável para todos os usuários, independentemente da página acessada.

As interações devem transmitir rapidez, clareza e confiança, evitando animações excessivas ou distrações desnecessárias.

---

## Princípios

As interações do Bairu seguem cinco princípios.

### Clareza

Cada interação deve comunicar uma mudança de estado.

O usuário nunca deve precisar "adivinhar" se um botão foi clicado ou se uma ação foi executada.

### Rapidez

As animações devem reforçar a experiência, nunca atrasá-la.

Sempre priorizar transições curtas.

### Consistência

Elementos semelhantes devem responder da mesma maneira.

Um botão principal deve se comportar igual em toda a aplicação.

### Acessibilidade

Toda interação baseada em hover deve possuir comportamento equivalente para teclado.

Nenhuma informação importante pode depender exclusivamente de animações.

### Discrição

O usuário deve perceber a interface fluida, não perceber as animações.

O foco está no conteúdo, não nos efeitos visuais.

---

## Duração das animações

| Tipo                |   Duração |
| ------------------- | --------: |
| Hover               |     150ms |
| Focus               |     150ms |
| Botões              | 150–200ms |
| Cards               |     200ms |
| Modal               |     250ms |
| Drawer              |     250ms |
| Toast               |     250ms |
| Skeleton → Conteúdo |     300ms |

Nunca utilizar animações superiores a 400ms.

---

## Curva de animação

Utilizar sempre easing suave.

Padrão: `ease-out` ou `cubic-bezier(0.16, 1, 0.3, 1)`

Evitar:

- linear
- bounce
- elastic
- overshoot

---

## Hover

Componentes interativos devem responder ao hover.

Exemplos:

### Botões

- leve aumento de brilho
- leve alteração da cor

### Cards

- pequena elevação
- sombra mais evidente

### Links

- alteração de cor
- underline quando fizer sentido

Nunca mover elementos mais que 2px.

---

## Active (Click)

Ao clicar:

- pequena redução de escala: `scale(0.98)` ou pequeno escurecimento.
  Evitar efeitos exagerados.

---

## Focus

Todos os componentes interativos devem possuir:

- focus visível
- outline consistente

Padrão:

- cor Primary
  -espessura 2px

Nunca remover o outline sem substituí-lo.

---

## Estados de botão

Todo botão deve possuir:

- Default
- Hover
- Active
- Focus
- Disabled
- Loading

---

## Estados de formulário

Campos devem comunicar claramente:

- Default
- Hover
- Focus
- Erro
- Sucesso
- Disabled

---

## Loading

Sempre que possível utilizar Skeleton.

Evitar:

- spinners ocupando toda a tela

Preferir:

- skeleton
- placeholders

---

## Feedback de sucesso

Ações importantes devem possuir feedback.

Exemplos:

- Toast
- Badge temporária
- Alteração visual

---

## Mensagens de erro devem:

- explicar o problema;
- indicar como resolver.

Nunca utilizar apenas: `Erro.`

---

## Microinterações permitidas

✔ Hover em botões
✔ Hover em cards
✔ Fade
✔ Scale até 1.02
✔ Shadow
✔ Skeleton
✔ Progress
✔ Toast
✔ Drawer
✔ Modal

---

## Microinterações proibidas

✖ Bounce
✖ Shake contínuo
✖ Rotações desnecessárias
✖ Parallax exagerado
✖ Auto-scroll
✖ Animações infinitas
✖ Elementos piscando

---

## Motion reduzido

A aplicação deve respeitar: `prefers-reduced-motion`

Quando ativado:

- remover animações decorativas;
- manter apenas transições essenciais.

---

## Componentes contemplados

Estas diretrizes aplicam-se a:

- Buttons
- Inputs
- Links
- Cards
- Dialog
- Drawer
- Dropdown
- Tooltip
- Toast
- Navigation
- Accordion
- Tabs
- Switch
- Checkbox
- Radio
- Skeleton
- Progress

---

## Tecnologias

As interações deverão utilizar prioritariamente:

- Tailwind CSS
- CSS Transitions
- Framer Motion (quando necessário)

Evitar bibliotecas adicionais para animações simples.

---

## Decisão arquitetural

O Bairu adota uma abordagem motion-first, but subtle. As animações existem para reforçar a compreensão da interface e fornecer feedback ao usuário, nunca para chamar atenção para si mesmas. Sempre que houver dúvida entre uma interação mais chamativa e uma mais discreta, a opção mais discreta deve ser escolhida. Isso mantém a experiência consistente, acessível e alinhada ao objetivo da plataforma: facilitar a descoberta de negócios locais.

---

## Evolução

Novas interações deverão seguir estas diretrizes antes de serem incorporadas ao Design System.
