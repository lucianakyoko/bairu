# DS-001 — Fundamentos do Design System

## Objetivo
Definir os princípios que orientam a identidade visual do Bairu e estabelecer uma base consistente para a construção de interfaces ao longo da evolução da plataforma.

Este documento representa a visão de longo prazo do Design System e serve como referência para decisões relacionadas à experiência visual do produto.

---

## O que é o Design System do Bairu?
O Design System do Bairu é o conjunto de princípios, decisões e padrões que orientam a construção da interface da plataforma.

Seu objetivo é garantir consistência visual, facilitar a evolução do produto e proporcionar uma experiência previsível para usuários e desenvolvedores.

Mais do que uma coleção de componentes, o Design System representa decisões compartilhadas sobre como a plataforma deve comunicar sua identidade.

---

## Filosofia
O Design System do Bairu será guiado pelos seguintes valores:

**Simplicidade**: A interface deve ser intuitiva, limpa e objetiva, evitando complexidade desnecessária.

**Proximidade**: O produto deve transmitir acolhimento e incentivar a conexão entre pessoas, profissionais e negócios locais.

**Confiança**: A consistência visual deve transmitir segurança e credibilidade durante toda a navegação.

**Consistência**: Elementos semelhantes devem possuir comportamento e aparência semelhantes em toda a plataforma.

**Evolução centralizada**: Mudanças na identidade visual deverão ser realizadas por meio do Design System, evitando alterações distribuídas pelas aplicações.

---

## Responsabilidades
O Design System é responsável por definir:

- identidade visual da plataforma;
- linguagem visual;
- sistema de cores;
- tipografia;
- componentes reutilizáveis;
- padrões de interação;
- tokens de design.

O Design System não é responsável por:

- regras de negócio;
- arquitetura da aplicação;
- decisões de infraestrutura;
- lógica de domínio.

---

## Tokens fundamentais
A primeira versão do Design System será construída sobre cinco grupos principais de tokens.

#### Cores
Representam o significado visual dos elementos da interface.

Os componentes deverão utilizar tokens semânticos, evitando referências diretas a valores de cor.
Exemplos:

- Primary
- Secondary
- Success
- Warning
- Danger
- Info
- Background
- Surface
- Text
- Text Muted
- Border

#### Tipografia
Define os papéis utilizados para comunicação textual.

Exemplos:

- Display
- Heading
- Title
- Body
- Caption
- Label

#### Espaçamento
Utilizar preferencialmente a escala oficial do Tailwind CSS, evitando valores arbitrários.

#### Raios de borda
Os componentes deverão utilizar uma escala consistente de arredondamento.

#### Sombras
Os níveis de profundidade deverão ser limitados a uma pequena quantidade de sombras reutilizáveis.

---

## Princípios de implementação
O Design System seguirá algumas regras fundamentais.

- Utilizar tokens semânticos em vez de valores fixos.
- Centralizar decisões visuais.
- Evitar duplicação de estilos.
- Priorizar reutilização.
- Manter consistência acima de preferências individuais.
- Evoluir de forma incremental conforme novas necessidades surgirem.

---

## Relação com Tailwind CSS
O Tailwind CSS é a tecnologia escolhida para implementar o Design System do Bairu.

A configuração compartilhada do Tailwind representa a implementação técnica das decisões documentadas neste Design System.

Sempre que possível, alterações visuais deverão ser realizadas na configuração compartilhada, e não diretamente nas aplicações consumidoras.

---

## Estratégia de cores
O Design System do Bairu utiliza as escalas oficiais disponibilizadas pelo Tailwind CSS como base para construção da identidade visual da plataforma.

Essa decisão reduz a complexidade de manutenção, aproveita escalas amplamente testadas pela comunidade e mantém flexibilidade para futuras evoluções do Design System.

As aplicações nunca deverão consumir diretamente essas escalas. Toda utilização de cores deverá ocorrer por meio dos tokens semânticos definidos pelo Design System.

---

## Estratégia de Tipografia
A tipografia do Bairu será organizada por papéis semânticos, e não por tamanhos de fonte.

O objetivo é permitir que componentes expressem a função do conteúdo, enquanto o Design System define sua representação visual.

Os componentes não deverão escolher diretamente tamanhos (text-xl, text-2xl, etc.), mas utilizar tokens tipográficos que representem sua função na interface.

A primeira versão do Design System define os seguintes papéis:

Display
Heading
Title
Subtitle
Body
Body Small
Caption
Label
Button

Os tamanhos, pesos, alturas de linha e famílias tipográficas serão definidos em uma etapa posterior da evolução do Design System.

---

### Estratégia de espaçamento
Utilizar a escala oficial do Tailwind.

---

## Estratégia de Border Radius
O Design System do Bairu utiliza uma escala controlada de arredondamento para manter consistência visual entre os componentes da plataforma.

Os componentes não devem definir valores arbitrários de border-radius.

A escolha do nível de arredondamento deve considerar a função do elemento na interface.

A primeira versão define os seguintes níveis:

sm: elementos discretos, como inputs e pequenos componentes;
md: componentes gerais da interface;
lg: cards e superfícies de maior destaque;
xl: elementos promocionais ou áreas de destaque;
full: elementos completamente arredondados, como badges e avatares.

O objetivo é equilibrar uma identidade visual acolhedora com uma interface profissional e consistente.

---

## Estratégia de Sombras
As sombras do Design System do Bairu são utilizadas exclusivamente para comunicar profundidade e hierarquia entre elementos da interface.

Sombras não devem ser utilizadas apenas como recurso decorativo.

A primeira versão do Design System define três níveis de elevação:

sm: pequena elevação;
md: elevação padrão;
lg: elementos de maior destaque.

Novos níveis somente deverão ser adicionados quando houver uma necessidade concreta de diferenciação visual.

O objetivo é manter a interface limpa, consistente e de fácil manutenção.

---

## Evolução
Este documento será expandido conforme o crescimento do projeto.

Versões futuras poderão incluir:

- biblioteca de componentes;
- guidelines de acessibilidade;
- sistema de ícones;
- animações e motion design;
- padrões de formulários;
- padrões de navegação;
- guidelines para experiência do usuário.
