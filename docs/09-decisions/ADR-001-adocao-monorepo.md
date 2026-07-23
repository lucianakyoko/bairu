# ADR-001 — Adoção de Monorepo

## Status

Accepted

## Data

2026-07-23

---

# Contexto

O Bairu é uma plataforma digital criada para conectar pessoas, profissionais autônomos, pequenos negócios e comunidades locais através da tecnologia.

Desde o início do projeto, foi identificado que a plataforma poderá evoluir para possuir múltiplas aplicações e serviços, como:

- Aplicação web pública;
- API backend;
- Painel administrativo;
- Aplicações móveis;
- Pacotes compartilhados de interface, configurações e regras de negócio.

Diante dessa possibilidade de crescimento, tornou-se necessário definir uma estratégia de organização do código-fonte que favorecesse escalabilidade, manutenção, compartilhamento de recursos e padronização entre os diferentes componentes da plataforma.

Foram avaliadas duas abordagens principais:

- Repositórios separados (multirepo);
- Um único repositório contendo múltiplas aplicações e pacotes compartilhados (monorepo).

---

# Decisão

Adotaremos uma arquitetura baseada em **monorepo** para o desenvolvimento do Bairu.

O repositório será organizado utilizando:

- **pnpm workspaces** para gerenciamento das dependências;
- **Turborepo** para orquestração de tarefas, cache e pipelines de desenvolvimento.

A estrutura seguirá uma separação baseada em responsabilidades:

## ```/apps```

Responsável por aplicações executáveis.

Exemplos:

- aplicação web;
- API;
- painel administrativo;
- aplicações mobile.

## ```packages/```

Responsável por código compartilhado entre aplicações.

Exemplos:

- componentes de UI;
- configurações compartilhadas;
- bibliotecas internas;
- tipos e utilitários.

## ```docs/```

Responsável pela documentação técnica e decisões do projeto.

---

# Motivações

A adoção do monorepo foi escolhida pelos seguintes motivos:

## Compartilhamento de código

Permite reutilização de componentes, bibliotecas e configurações entre diferentes aplicações.

## Padronização

Mantém uma única fonte de verdade para:

- configurações;
- ferramentas;
- padrões de código;
- dependências compartilhadas.

## Evolução da plataforma

O Bairu possui potencial para crescer além de uma única aplicação, tornando importante uma arquitetura preparada para múltiplos produtos.

## Experiência semelhante a equipes profissionais

A estrutura permite aplicar práticas utilizadas em empresas que trabalham com grandes bases de código:

- versionamento único;
- revisão centralizada;
- pipelines automatizados;
- governança técnica.

---

# Alternativas Consideradas

## Multirepo

### Descrição

Cada aplicação possuiria seu próprio repositório independente.

Exemplo:
bairu-web
bairu-api
bairu-admin


### Motivos para não escolher

Apesar de ser uma abordagem válida, apresenta alguns desafios:

- maior dificuldade para sincronizar versões;
- duplicação de configurações;
- manutenção mais complexa;
- menor facilidade para compartilhar código.

---

## Monorepo tradicional orientado por ferramenta

### Descrição

Utilização de estruturas altamente baseadas em convenções de ferramentas específicas.

### Motivos para não escolher

O Bairu seguirá uma abordagem de monorepo orientada por domínio e responsabilidades, evitando acoplamento excessivo à ferramenta utilizada.

---

# Consequências Positivas

A decisão permite:

- compartilhamento simples de código;
- evolução organizada da plataforma;
- padronização entre aplicações;
- melhor experiência para desenvolvimento colaborativo;
- possibilidade de criação de pipelines automatizados.

---

# Consequências Negativas

A decisão também traz alguns custos:

- maior complexidade inicial;
- necessidade de conhecimento sobre ferramentas de monorepo;
- necessidade de disciplina na organização dos pacotes;
- maior cuidado com dependências compartilhadas.

---

# Considerações Futuras

A estrutura poderá evoluir conforme novas necessidades surgirem.

Novas decisões arquiteturais deverão ser registradas através de ADRs quando representarem mudanças significativas na arquitetura do sistema.

---

# Referências

- pnpm Workspaces
- Turborepo Documentation
