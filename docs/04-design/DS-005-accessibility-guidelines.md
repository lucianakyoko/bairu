# DS-005 — Accessibility Guidelines

## Objetivo

Este documento estabelece os padrões de acessibilidade adotados pelo Bairu.

Seu objetivo é garantir que toda a aplicação seja utilizável por qualquer pessoa, independentemente de limitações visuais, motoras, cognitivas ou do dispositivo utilizado.

Sempre que possível, seguimos as recomendações da **WCAG 2.2 nível AA**.

---

# Princípios

Toda interface do Bairu deve ser:

- Perceptível
- Operável
- Compreensível
- Robusta

Esses quatro princípios orientam todas as decisões de acessibilidade do projeto.

---

# Estrutura Semântica

Utilizar sempre elementos HTML semânticos.

## Estrutura básica

```html
<header>
  <nav>
    <main>
      <section>
        <footer></footer>
      </section>
    </main>
  </nav>
</header>
```

Evitar utilizar `<div>` quando existir um elemento semântico apropriado.

---

# Hierarquia de títulos

Cada página deve possuir apenas um `<h1>`.

A hierarquia deve ser lógica.

Exemplo:

```
h1

  h2

    h3

    h3

  h2

    h3
```

Nunca pular níveis.

Evitar:

```
h1

h3
```

---

# Navegação por teclado

Toda funcionalidade deve ser acessível utilizando apenas:

- Tab
- Shift + Tab
- Enter
- Espaço

O usuário nunca deve ficar preso em um componente.

---

# Foco visível

Todo elemento interativo deve possuir foco visível.

Utilizar o padrão:

```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-primary
focus-visible:ring-offset-2
```

Nunca remover o foco sem fornecer um substituto visual.

---

# Links

Todo link deve deixar claro seu destino.

Evitar:

- Clique aqui
- Saiba mais

Preferir:

- Conheça o Bairu
- Buscar negócios
- Cadastrar meu negócio

---

# Botões

Todo botão deve comunicar claramente sua ação.

Quando necessário, utilizar:

```tsx
aria-label=""
```

Exemplo:

```tsx
<Button aria-label="Cadastrar meu negócio">
```

---

# Imagens

Toda imagem informativa deve possuir texto alternativo.

Exemplo:

```tsx
alt = "Logo do Bairu";
```

Imagens decorativas:

```tsx
alt = "";
```

---

# Ícones

## Decorativos

Quando o ícone apenas complementa um texto:

```tsx
aria-hidden="true"
```

---

## Informativos

Quando o ícone representa informação importante, ele deve possuir descrição apropriada.

---

# SVGs

SVGs utilizados como ilustração devem possuir:

- role="img"
- título quando necessário

---

# Contraste

Todo texto deve respeitar contraste mínimo conforme WCAG AA.

Relações mínimas:

Texto normal

4.5:1

Texto grande

3:1

---

# Tamanho da área de toque

Todo elemento clicável deve possuir área mínima de:

44 × 44 px

Inclui:

- botões
- links
- menu mobile
- ícones clicáveis

---

# Formulários

Todo campo deve possuir:

- label
- mensagem de erro
- descrição quando necessário

Evitar utilizar apenas placeholder como identificação.

---

# Mensagens de erro

Mensagens devem:

- explicar o problema;
- orientar como corrigir.

Evitar:

```
Campo inválido.
```

Preferir:

```
Informe um endereço de e-mail válido.
```

---

# Estados

Todo componente interativo deve possuir estados claros.

- hover
- focus
- active
- disabled

---

# Animações

Respeitar:

```css
prefers-reduced-motion
```

Animações nunca devem impedir a utilização da interface.

---

# Menu Mobile

O menu deve:

- receber foco ao abrir;
- devolver foco ao botão ao fechar;
- permitir fechamento com ESC.

---

# Diálogos

Todo diálogo deve:

- capturar foco;
- impedir navegação atrás do modal;
- permitir fechamento via teclado.

---

# Leitores de tela

Sempre que necessário utilizar:

- aria-label
- aria-labelledby
- aria-describedby

Evitar uso excessivo de atributos ARIA quando HTML semântico resolver o problema.

---

# Componentes do Design System

Todo novo componente deve ser validado quanto a:

- navegação por teclado;
- foco;
- contraste;
- leitores de tela.

---

# Checklist

Antes de concluir uma tela verificar:

- Apenas um h1
- Hierarquia correta
- Navegação por teclado
- Foco visível
- Contraste adequado
- Labels em formulários
- Alt em imagens
- Links descritivos
- Botões acessíveis
- Área mínima de toque
- Menu mobile acessível
- Nenhum elemento inacessível ao teclado

---

# Ferramentas recomendadas

Durante o desenvolvimento utilizar:

## Lighthouse

Chrome DevTools
Accessibility

---

## WAVE Evaluation Tool

Revisão visual
Extensão para validação de acessibilidade.

---

## eslint-plugin-jsx-a11y

Durante desenvolvimento

---

## Playwright

Testes E2E

## Teste manual

Navegar utilizando apenas teclado.

---

# Definition of Done — Accessibility

Uma funcionalidade só é considerada concluída quando:

- [ ] Pode ser utilizada apenas com teclado.
- [ ] Não apresenta problemas críticos no Lighthouse.
- [ ] Não apresenta erros críticos no Axe DevTools.
- [ ] Mantém contraste adequado.
- [ ] Utiliza HTML semântico.
- [ ] Possui foco visível.
- [ ] Respeita as diretrizes deste documento.

---

# Decisões Arquiteturais

- Priorizar HTML semântico antes de utilizar ARIA.
- Todo componente do Design System deve nascer acessível.
- Acessibilidade faz parte da implementação, não é uma etapa posterior.
- Seguir WCAG 2.2 nível AA como referência do projeto.
- Toda nova funcionalidade deve ser validada quanto à acessibilidade antes da conclusão da Story.
