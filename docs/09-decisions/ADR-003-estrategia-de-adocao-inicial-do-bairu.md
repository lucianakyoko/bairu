# ADR-003 — Estratégia de Adoção Inicial do Bairu

**Status:** Aceito
**Data:** 2026-07-28

---

# Contexto

O Bairu tem como objetivo conectar pessoas a negócios, serviços e oportunidades locais, criando uma camada digital de descoberta para comunidades e pequenos empreendedores.

Durante a análise inicial do mercado local, identificou-se um cenário recorrente:

- muitos negócios locais possuem pouca ou nenhuma presença digital estruturada;
- uma parcela significativa depende exclusivamente de redes sociais como Instagram, Facebook e WhatsApp;
- muitos empreendedores possuem dificuldade ou pouca familiaridade com ferramentas digitais;
- mesmo negócios ativos e conhecidos localmente possuem baixa capacidade de serem encontrados por pessoas que ainda não conhecem a empresa.

Embora redes sociais sejam importantes canais de relacionamento, elas apresentam limitações como mecanismo de descoberta:

- conteúdos possuem baixa persistência;
- informações importantes ficam desestruturadas;
- a descoberta depende de algoritmos das plataformas;
- dados como localização, categoria, serviços, horários e formas de contato não são apresentados de maneira padronizada.

Como consequência, muitos negócios existem fisicamente, mas possuem baixa representação digital.

---

# Problema

O principal desafio inicial do Bairu não é apenas atrair usuários consumidores.

Existe um desafio anterior:

> Como criar valor para uma plataforma de descoberta local se ainda não existem negócios cadastrados?

Uma plataforma de busca depende de oferta inicial.

Sem empresas cadastradas:

- usuários não encontram valor ao acessar o Bairu;
- a experiência de busca fica limitada;
- a adoção orgânica se torna difícil.

Portanto, a estratégia inicial precisa priorizar a criação da base de negócios locais.

---

# Decisão

O Bairu adotará inicialmente uma estratégia **business-first**, priorizando a aquisição e digitalização de negócios locais antes da expansão da base de consumidores.

A proposta central será:

> Transformar pequenos negócios locais em negócios encontrados digitalmente.

O Bairu não será posicionado como substituto de redes sociais ou ferramentas existentes.

Ele será uma camada complementar de presença digital estruturada.

O negócio poderá continuar utilizando seus canais atuais, enquanto o Bairu será responsável por:

- criar uma presença pública organizada;
- facilitar a descoberta por pessoas próximas;
- disponibilizar informações estruturadas sobre produtos e serviços;
- aumentar a capacidade de indexação por mecanismos de busca;
- preparar informações para futuras experiências de busca baseadas em inteligência artificial.

---

# Proposta de valor inicial

Para negócios:

> "Seu negócio existe. Agora ele precisa ser encontrado."

O Bairu permitirá que empresas e profissionais locais tenham uma página pública contendo informações essenciais:

- nome do negócio;
- categoria;
- localização;
- descrição;
- serviços oferecidos;
- produtos;
- horários de funcionamento;
- formas de contato;
- redes sociais.

---

# Estratégia de aquisição inicial

O primeiro ciclo de adoção será direcionado aos negócios locais.

A jornada esperada:

1. O empreendedor descobre o Bairu.
2. Cria ou reivindica sua presença digital.
3. Preenche informações básicas sobre seu negócio.
4. O Bairu gera uma página pública otimizada para descoberta.
5. Pessoas próximas encontram esse negócio através de buscas.

A experiência inicial deverá minimizar barreiras técnicas.

O cadastro não deve exigir conhecimento de marketing digital, SEO ou tecnologia.

O empreendedor deve perceber o processo como:

> "Criar uma vitrine digital para meu negócio."

E não como:

> "Configurar uma ferramenta de marketing."

---

# Impactos na arquitetura do produto

Esta decisão influencia diretamente algumas decisões técnicas.

## Páginas públicas como requisito central

Cada negócio deverá possuir uma representação pública acessível por mecanismos externos.

Exemplo:

```
/empresa/maria-costuras
```

Essas páginas devem ser:

- indexáveis;
- semanticamente estruturadas;
- otimizadas para SEO;
- preparadas para dados estruturados.

---

## Dados estruturados como prioridade

As informações dos negócios devem ser modeladas de forma consistente.

Exemplos:

- categoria;
- localização;
- horários;
- serviços;
- produtos;
- contatos.

Essas informações poderão futuramente alimentar:

- mecanismos de busca;
- assistentes de inteligência artificial;
- experiências de recomendação.

---

## Simplicidade como princípio de UX

O público inicial possui diferentes níveis de familiaridade digital.

Portanto, a experiência deve priorizar:

- poucos passos;
- linguagem simples;
- orientação durante o cadastro;
- ausência de configurações técnicas desnecessárias.

---

# Alternativas consideradas

## Alternativa 1 — Priorizar consumidores inicialmente

### Descrição

Construir uma experiência de busca e atrair usuários antes de possuir uma base relevante de negócios.

### Motivos para rejeição

Sem uma quantidade mínima de negócios cadastrados:

- a busca possui baixo valor;
- usuários não encontram resultados relevantes;
- a retenção tende a ser baixa.

---

## Alternativa 2 — Criar uma rede social própria para negócios

### Descrição

Permitir que empresas publiquem conteúdo e construam audiência dentro do Bairu.

### Motivos para rejeição

Redes sociais já possuem forte adoção.

O problema principal identificado não é ausência de canal de postagem, mas ausência de presença digital estruturada e descoberta.

---

## Alternativa 3 — Focar apenas em anúncios pagos

### Descrição

Criar uma plataforma baseada em publicidade local.

### Motivos para rejeição

Anúncios resolvem aquisição temporária, mas não resolvem o problema estrutural de presença digital.

---

# Consequências positivas

- Maior clareza de posicionamento do produto.
- Foco inicial em um público específico.
- Criação de uma base de dados local estruturada.
- Maior potencial de descoberta orgânica.
- Melhor preparação para integrações futuras com mecanismos de busca e IA.
- Diferenciação em relação às redes sociais tradicionais.

---

# Consequências negativas

- A aquisição inicial depende de convencer negócios locais.
- Será necessário criar uma experiência extremamente simples.
- O crescimento inicial pode ser mais lento devido à necessidade de construir oferta.

---

# Métricas iniciais de validação

As primeiras métricas importantes serão relacionadas à oferta:

- quantidade de negócios cadastrados;
- quantidade de perfis públicos completos;
- quantidade de categorias representadas;
- quantidade de cidades atendidas;
- quantidade de acessos às páginas públicas;
- quantidade de contatos realizados através do Bairu.

---

# Considerações futuras

Esta decisão não impede que o Bairu evolua posteriormente para uma experiência consumer-first.

Após uma base relevante de negócios, novas funcionalidades poderão ser adicionadas:

- busca avançada;
- avaliações;
- favoritos;
- recomendações personalizadas;
- experiências conversacionais utilizando IA.

A estratégia inicial é construir primeiro a infraestrutura de descoberta local.

---

# Resultado esperado

Ao executar esta estratégia, o Bairu busca resolver uma lacuna existente:

> Pequenos negócios locais existem no mundo real, mas ainda não possuem uma presença digital capaz de conectá-los às pessoas que procuram por eles.
