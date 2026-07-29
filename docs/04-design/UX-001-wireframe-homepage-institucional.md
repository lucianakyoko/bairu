# UX-001 — Wireframe da Homepage Institucional do Bairu

**Status:** Em desenvolvimento
**Versão:** 1.0
**Data:** 2026-07-28
**Responsável:** Equipe Bairu

---

# 1. Contexto

A homepage institucional do Bairu representa o primeiro contato de usuários e negócios locais com a plataforma.

Sua responsabilidade não é apenas apresentar funcionalidades, mas comunicar claramente:

- o problema que o Bairu resolve;
- o valor entregue aos negócios locais;
- como a plataforma ajuda empresas a serem encontradas;
- quais próximos passos o visitante pode realizar.

Este documento descreve a organização da experiência, a hierarquia das informações e as decisões de UX utilizadas para construção da primeira página institucional.

---

# 2. Objetivo da experiência

A homepage deve conduzir o visitante a compreender rapidamente:

> O Bairu ajuda negócios locais a criarem uma presença digital simples para serem encontrados por novos clientes.

A experiência deve responder três perguntas principais:

## Para negócios

"Por que eu deveria cadastrar meu negócio?"

Resposta esperada:

> Porque meu negócio poderá ser encontrado por mais pessoas.

---

## Para consumidores

"Por que eu deveria usar o Bairu?"

Resposta esperada:

> Porque posso encontrar negócios e serviços locais de forma organizada.

---

## Para novos visitantes

"O que é o Bairu?"

Resposta esperada:

> Uma plataforma que conecta pessoas aos negócios da sua região.

---

# 3. Princípios de UX

## 3.1 Clareza antes de complexidade

A homepage deve explicar o valor do produto antes de apresentar detalhes.

O visitante não deve precisar entender:

- tecnologia;
- marketing digital;
- SEO;
- inteligência artificial.

A comunicação deve partir da dor e do benefício.

---

## 3.2 Conversão orientada ao negócio local

Como definido no ADR-003 — Estratégia de Adoção Inicial do Bairu, o primeiro objetivo da plataforma é construir uma base de negócios cadastrados.

Por esse motivo, o fluxo principal da homepage será direcionado para:

> Criar presença digital no Bairu.

---

## 3.3 Linguagem acessível

O público inicial possui diferentes níveis de familiaridade digital.

A experiência deve utilizar:

- linguagem simples;
- frases curtas;
- exemplos próximos da realidade local;
- redução de termos técnicos.

---

## 3.4 Demonstrar transformação

A homepage deve comunicar mudança:

Antes:

- negócio conhecido apenas localmente;
- informações espalhadas;
- dependência de redes sociais.

Depois:

- página organizada;
- informações completas;
- maior capacidade de descoberta.

---

# 4. Estrutura geral da página

A homepage será organizada nas seguintes seções:

```
Homepage

├── Header
├── Hero Section
├── Problema
├── Solução
├── Benefícios
├── Como funciona
├── Público-alvo
├── Propósito do Bairu
├── CTA Final
└── Footer
```

---

# 5. Wireframe das seções

---

# 5.1 Header

## Objetivo

Disponibilizar navegação essencial sem competir com a mensagem principal.

## Estrutura

```
------------------------------------------------
Bairu              Buscar negócios
                  Para negócios
                  Entrar
------------------------------------------------
```

## Decisões

O menu inicial deve ser reduzido.

Não incluir inicialmente:

- blog;
- recursos;
- preços;
- páginas institucionais secundárias.

A prioridade é direcionar o visitante para entendimento e ação.

---

# 5.2 Hero Section

## Objetivo

Comunicar o valor do Bairu nos primeiros segundos de interação.

## Mensagem principal

> Seu negócio existe. Agora ele precisa ser encontrado.

## Estrutura

```
------------------------------------------------

Seu negócio existe.
Agora ele precisa ser encontrado.

Crie uma presença digital simples
e conecte-se com pessoas da sua região.

[ Quero cadastrar meu negócio ]

[ Encontrar negócios locais ]


                    +----------------+
                    | Perfil Bairu   |
                    |                |
                    | Maria Costura  |
                    | Costureira     |
                    | São Miguel     |
                    | WhatsApp       |
                    +----------------+

------------------------------------------------
```

## Decisão visual

A representação visual deve mostrar o produto.

Evitar imagens genéricas.

Preferência:

- mockup de perfil Bairu;
- exemplo de empresa cadastrada;
- demonstração da página pública.

---

# 5.3 Seção do problema

## Objetivo

Criar identificação com o público empreendedor.

## Mensagem

Muitos negócios existem, mas poucos são encontrados.

## Estrutura

Apresentar dificuldades comuns:

- informações espalhadas;
- clientes dependentes de indicação;
- redes sociais sem estrutura de busca;
- ausência de presença digital própria.

---

# 5.4 Seção da solução

## Objetivo

Apresentar o Bairu como resposta ao problema.

Mensagem:

> O Bairu organiza sua presença digital em um único lugar.

## Demonstração:

Antes:

```
Instagram
WhatsApp
Indicações
Informações dispersas
```

Depois:

```
Nome
Categoria
Serviços
Produtos
Horários
Localização
Contato
```

---

# 5.5 Seção de benefícios

## Objetivo

Mostrar valor prático.

Formato:

Cards utilizando componentes do Design System.

Benefícios:

## Seja encontrado

Permita que novos clientes descubram seu negócio.

---

## Mostre seus produtos e serviços

Apresente aquilo que você oferece.

---

## Organize suas informações

Centralize dados importantes.

---

## Facilite o contato

Aproxime clientes e negócios.

---

# 5.6 Como funciona

## Objetivo

Reduzir insegurança.

A jornada deve parecer simples.

Fluxo:

```
1. Cadastre seu negócio

↓

2. Adicione suas informações

↓

3. Seja encontrado
```

---

# 5.7 Público-alvo

## Objetivo

Demonstrar inclusão.

A plataforma deve comunicar que atende diferentes tipos de negócios.

Exemplos:

```
Comércios locais

Prestadores de serviço

Profissionais autônomos
```

---

# 5.8 Propósito do Bairu

## Objetivo

Construir conexão emocional.

Mensagem:

> Fortalecendo negócios e comunidades locais.

O Bairu deve transmitir proximidade e valorização da economia local.

---

# 5.9 CTA Final

## Objetivo

Reforçar a principal ação.

Mensagem:

> Seu negócio merece ser encontrado.

CTA:

```
Criar meu perfil Bairu
```

---

# 6. Jornadas principais

## Jornada do empreendedor

```
Homepage

↓

Entende o problema

↓

Identifica valor

↓

Cadastra negócio

↓

Cria presença digital
```

---

## Jornada do consumidor

```
Homepage

↓

Conhece o Bairu

↓

Busca negócios

↓

Encontra empresa

↓

Realiza contato
```

---

# 7. Responsividade

A experiência deve ser projetada considerando:

## Desktop

Priorizar:

- mensagem principal;
- demonstração visual;
- leitura em blocos.

---

## Mobile

Priorizar:

- CTA acessível;
- leitura vertical;
- navegação simples.

O público empreendedor pode acessar principalmente através do celular.

---

# 8. Acessibilidade

A homepage deverá seguir:

- HTML semântico;
- contraste adequado;
- navegação por teclado;
- textos alternativos em imagens;
- componentes acessíveis do shadcn/ui.

---

# 9. Relação com Design System

A implementação deve utilizar:

- tokens definidos no DS-002;
- componentes compartilhados;
- padrões visuais consistentes.

Componentes esperados:

- Button;
- Card;
- Badge;
- Separator;
- Typography.

---

# 10. Decisões futuras

Este wireframe poderá evoluir conforme a validação do produto.

Possíveis evoluções:

- depoimentos de negócios;
- casos reais;
- negócios em destaque;
- páginas específicas por cidade;
- conteúdos educativos para empreendedores.

---

# Documentos relacionados

- ADR-003 — Estratégia de Adoção Inicial do Bairu
- PRD-001 — Homepage Institucional do Bairu
- DS-001 — Fundamentos do Design System
- DS-002 — Tokens Fundamentais do Design System

---

# Resultado esperado

A homepage institucional deve transformar um visitante desconhecido em um usuário interessado, comunicando de forma simples que o Bairu existe para resolver um problema real:

> Bons negócios locais existem, mas precisam ser encontrados.
