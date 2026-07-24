# ENG-001 — Organização de Packages

## Status

Aprovado

## Versão

1.0

## Última atualização

24/07/2026

---

# 1. Objetivo

Este documento define como os packages compartilhados do monorepo Bairu devem ser organizados.

Mais do que estabelecer uma estrutura de diretórios, este documento descreve a filosofia adotada para manter o projeto previsível, escalável e de fácil manutenção ao longo de sua evolução.

Todo novo package criado deverá respeitar as convenções aqui estabelecidas.

---

# 2. Filosofia

No Bairu, packages representam **responsabilidades**, e não tecnologias.

Ao criar um novo package, a primeira pergunta nunca deve ser:

> "Qual tecnologia será utilizada?"

A pergunta correta é:

> "Qual responsabilidade este package possui dentro da plataforma?"

Essa abordagem permite que a arquitetura permaneça clara mesmo com o crescimento do projeto.

Um desenvolvedor deve conseguir compreender a finalidade de um package apenas pelo seu nome, sem precisar abrir seu código-fonte.

---

# 3. Princípios Arquiteturais

Toda organização de packages deve seguir os seguintes princípios.

## Responsabilidade Única

Cada package deve possuir apenas uma responsabilidade claramente definida.

Quando um package começar a acumular responsabilidades distintas, ele deverá ser dividido.

---

## Alta Coesão

Todo código presente dentro de um package deve contribuir para o mesmo objetivo.

---

## Baixo Acoplamento

Packages devem expor apenas aquilo que realmente precisa ser utilizado por outros módulos.

Implementações internas devem permanecer encapsuladas.

---

## Clareza

A organização deve ser intuitiva.

Encontrar o local correto para adicionar um novo código deve ser uma tarefa simples.

---

## Reutilização

Packages compartilhados existem para evitar duplicação entre aplicações.

Caso um código seja utilizado por apenas uma aplicação, ele deve permanecer dentro dela.

---

# 4. Categorias de Packages

Os packages do projeto são organizados por responsabilidade.

## Packages de Configuração

Responsáveis por compartilhar configurações utilizadas pelas ferramentas de desenvolvimento.

Convenção:

```
config-*
```

Exemplos:

```
config-typescript
config-eslint
config-prettier
config-tailwind
```

Esses packages nunca devem conter regras de negócio.

---

## Bibliotecas Compartilhadas

Contêm código reutilizável por múltiplas aplicações.

Exemplos:

```
ui
shared-types
shared-utils
design-tokens
```

Seu objetivo é promover reutilização e padronização.

---

## Packages de Domínio

Representam capacidades do negócio.

Exemplos:

```
catalog
company
feed
search
```

Sempre que possível, devem permanecer independentes de frameworks.

---

## Packages de Infraestrutura

Agrupam integrações técnicas.

Exemplos:

```
database
storage
auth
api-client
```

Sua responsabilidade é isolar detalhes de implementação.

---

# 5. Convenção de Nomenclatura

Todos os packages devem possuir nomes claros, específicos e descritivos.

Exemplos recomendados:

```
config-typescript
config-eslint
shared-types
shared-utils
ui
database
```

Evitar nomes genéricos como:

```
common
helpers
misc
shared
utils
core
```

Esses nomes tendem a se tornar repositórios de código sem responsabilidade definida.

---

# 6. Namespace

Todos os packages internos deverão utilizar o namespace oficial do projeto.

```
@bairu/
```

Exemplos:

```
@bairu/config-typescript
@bairu/config-eslint
@bairu/ui
```

Essa convenção facilita a identificação de dependências internas e fortalece a identidade do ecossistema Bairu.

---

# 7. Estrutura Esperada

Todo package deverá ser autocontido.

Exemplo:

```
packages/

└── config-typescript/
    ├── package.json
    ├── README.md
    └── base.json
```

Cada package deverá conter apenas os arquivos necessários ao cumprimento de sua responsabilidade.

---

# 8. Árvore de Decisão

Antes de criar um novo package, siga o seguinte fluxo:

```
O código será reutilizado?

├── Não
│   └── Permanece dentro da aplicação.
│
└── Sim
    │
    ├── Configura ferramentas?
    │      └── config-*
    │
    ├── Contém regra de negócio?
    │      └── Package de domínio
    │
    ├── Integra serviço externo?
    │      └── Package de infraestrutura
    │
    └── Compartilha código?
           └── Biblioteca compartilhada
```

Caso nenhuma categoria represente claramente a responsabilidade desejada, a criação do package deve ser reavaliada.

---

# 9. Evolução

A organização definida neste documento foi projetada para acompanhar o crescimento da plataforma.

Novas categorias poderão surgir futuramente, desde que respeitem os princípios arquiteturais aqui estabelecidos.

Mudanças estruturais significativas deverão ser registradas por meio de um ADR.

---

# Referências

- ADR-001 — Adoção do Monorepo
- ADR-002 — Adoção do pnpm Workspaces
- ENG-000 — Convenções de Documentação

---

# Notas de Engenharia

Uma boa arquitetura não é medida pela quantidade de packages existentes, mas pela facilidade com que um desenvolvedor consegue identificar onde um novo código deve ser criado.

Quando a organização é previsível, decisões deixam de depender de pessoas e passam a fazer parte da cultura de engenharia do projeto.
