# DS-002 — Tokens Fundamentais do Design System

## Objetivo

Este documento define os tokens fundamentais do Design System do Bairu.

Os tokens representam os valores visuais compartilhados da plataforma e constituem a única fonte de verdade para cores, superfícies, estados semânticos, bordas e demais elementos visuais utilizados pelas aplicações do monorepo.

Seu principal objetivo é garantir consistência visual, reduzir duplicação de estilos e permitir que mudanças na identidade visual sejam realizadas de forma centralizada.

---

## Princípios

### Semântica antes de aparência

Os componentes nunca devem depender diretamente de valores visuais, como códigos hexadecimais, nomes de cores ou utilitários específicos do Tailwind.

Sempre que possível, os componentes devem consumir tokens semânticos.

**Evite:**

```css
background: #0d9488;
color: #ffffff;
```

**Prefira:**

```css
background: var(--color-primary);
color: var(--color-primary-foreground);
```

Dessa forma, a identidade visual pode evoluir sem necessidade de alterar componentes.

---

### Componentes desconhecem a identidade visual

Os componentes devem conhecer apenas o significado do token que utilizam.

Por exemplo, um botão primário não sabe que a cor institucional é verde.

Ele conhece apenas:

- Primary
- Primary Foreground

A implementação visual desses tokens pertence exclusivamente ao Design System.

---

### Fonte única de verdade

Todos os tokens compartilhados são definidos no package:

```text
packages/config-tailwind/theme.css
```

Nenhuma aplicação deve redefinir esses tokens localmente.

---

## Categorias de Tokens

### Brand

Representam a identidade visual da plataforma.

| Token                | Responsabilidade              |
| -------------------- | ----------------------------- |
| Primary              | Cor principal da marca        |
| Primary Foreground   | Cor utilizada sobre Primary   |
| Secondary            | Cor secundária da interface   |
| Secondary Foreground | Cor utilizada sobre Secondary |

---

### Surface

Representam as superfícies utilizadas pela interface.

| Token      | Responsabilidade            |
| ---------- | --------------------------- |
| Background | Plano de fundo principal    |
| Surface    | Superfície padrão           |
| Card       | Cartões                     |
| Popover    | Menus, dropdowns e popovers |

---

### Text

Representam os níveis de informação textual.

| Token      | Responsabilidade         |
| ---------- | ------------------------ |
| Text       | Texto principal          |
| Text Muted | Texto secundário         |
| Foreground | Cor padrão para conteúdo |

---

### Border

Representam elementos estruturais da interface.

| Token  | Responsabilidade  |
| ------ | ----------------- |
| Border | Bordas padrão     |
| Input  | Campos de entrada |
| Ring   | Indicador de foco |

---

### Feedback

Representam estados semânticos.

| Token   | Responsabilidade               |
| ------- | ------------------------------ |
| Success | Operação realizada com sucesso |
| Warning | Situação que exige atenção     |
| Danger  | Erros e ações destrutivas      |
| Info    | Informações complementares     |

---

### Interaction

Representam estados de interação do usuário.

| Token             | Responsabilidade             |
| ----------------- | ---------------------------- |
| Accent            | Hover e destaque             |
| Accent Foreground | Texto sobre Accent           |
| Muted             | Áreas discretas da interface |
| Muted Foreground  | Texto sobre Muted            |

---

### Radius

Define os raios de borda utilizados pelos componentes.

| Token |
| ----- |
| sm    |
| md    |
| lg    |
| xl    |
| full  |

Todos os componentes devem utilizar exclusivamente esses tokens.

---

## Compatibilidade com Shadcn UI

O Design System do Bairu fornece os tokens esperados pelos componentes gerados pelo Shadcn UI.

Essa compatibilidade permite utilizar os componentes da biblioteca sem necessidade de customizações individuais.

| Token       | Exemplos de utilização      |
| ----------- | --------------------------- |
| Primary     | Button, Badge               |
| Accent      | Hover                       |
| Border      | Input, Card                 |
| Ring        | Focus Visible               |
| Background  | Layout                      |
| Card        | Card                        |
| Popover     | Dropdowns                   |
| Muted       | Skeleton, áreas secundárias |
| Destructive | Alertas e ações destrutivas |

---

## Convenções

### Utilize sempre tokens semânticos

Prefira:

```css
text-primary
bg-background
border-border
rounded-md
```

Evite:

```css
text-teal-600
bg-slate-50
border-gray-200
rounded-lg
```

Os componentes nunca devem depender de valores específicos de cor.

---

### Componentes não definem identidade visual

Os componentes são responsáveis apenas por comportamento e estrutura.

Toda decisão visual pertence ao Design System.

---

## Evolução

Os tokens definidos neste documento representam a camada fundamental do Design System.

Novas categorias poderão ser adicionadas conforme a evolução da plataforma, incluindo:

- Escala tipográfica
- Escala de espaçamentos
- Elevação (Shadows)
- Motion Tokens
- Dark Theme
- Tokens específicos para componentes

Todas as novas categorias deverão manter compatibilidade com a arquitetura compartilhada do monorepo e preservar o princípio da separação entre comportamento e identidade visual.
