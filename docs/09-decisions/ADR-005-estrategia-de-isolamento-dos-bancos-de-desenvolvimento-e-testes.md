# ADR-005 — Estratégia de isolamento dos bancos de desenvolvimento e testes

- **Status:** Accepted
- **Date:** 2026-08-08
- **Tags:** PostgreSQL, Docker, development, testing, infrastructure

## Contexto

O Bairu precisa de ambientes de banco de dados distintos para desenvolvimento e testes automatizados.

Durante o desenvolvimento, a aplicação precisa de um banco persistente para permitir a execução normal da API, migrations, seeds e testes manuais.

Ao mesmo tempo, os testes automatizados precisam de um banco independente para evitar que dados utilizados durante o desenvolvimento interfiram nos testes ou sejam modificados por eles.

O projeto também pretende utilizar Docker como parte da infraestrutura de desenvolvimento, especialmente para facilitar a reprodução do ambiente local e reduzir dependências instaladas diretamente na máquina do desenvolvedor.

Neste momento, o Bairu está em fase de MVP e ainda não possui necessidade de uma infraestrutura local complexa.

Portanto, precisamos equilibrar:

- isolamento entre ambientes;
- facilidade de configuração;
- baixo custo operacional;
- facilidade de manutenção;
- possibilidade de evolução futura;
- independência em relação ao provedor de infraestrutura.

## Decisão

O Bairu utilizará **dois bancos PostgreSQL logicamente isolados**, destinados respectivamente aos ambientes de desenvolvimento e testes.

Ambos os bancos serão executados inicialmente dentro de **um único container PostgreSQL** durante o desenvolvimento local.

A configuração será conceitualmente:

```text
Docker
└── PostgreSQL container
    ├── bairu_development
    └── bairu_test
```

O banco de desenvolvimento será utilizado pela aplicação durante o desenvolvimento normal:

```text
API
 ↓
Prisma
 ↓
PostgreSQL
 ↓
bairu_development
```

Os testes automatizados utilizarão exclusivamente o banco de testes:

```text
Testes
 ↓
Prisma
 ↓
PostgreSQL
 ↓
bairu_test
```

Cada ambiente terá sua própria configuração de conexão, permitindo que a aplicação ou o ambiente de testes selecione explicitamente o banco correspondente.

## Isolamento

O isolamento entre desenvolvimento e testes será realizado inicialmente no nível do **database**, e não no nível do container.

Isso significa que os bancos:

- possuirão dados independentes;
- possuirão migrations aplicadas independentemente;
- poderão ser limpos ou recriados sem afetar o outro ambiente;
- utilizarão URLs de conexão distintas.

Entretanto, ambos compartilharão:

- o mesmo container;
- o mesmo processo PostgreSQL;
- os mesmos recursos computacionais do ambiente local.

Esse nível de isolamento é considerado suficiente para o estágio atual do projeto.

## Alternativas consideradas

### 1. Dois bancos em um único container

```text
PostgreSQL container
├── bairu_development
└── bairu_test
```

**Vantagens:**

- configuração simples;
- baixo consumo de recursos;
- menor quantidade de containers;
- facilidade de inicialização;
- isolamento lógico suficiente para o MVP.

**Desvantagens:**

- desenvolvimento e testes compartilham o mesmo processo PostgreSQL;
- não há isolamento completo de recursos;
- falhas ou alterações no PostgreSQL afetam ambos os bancos.

**Decisão:** escolhida.

---

### 2. Um container PostgreSQL para cada ambiente

```text
PostgreSQL container
└── bairu_development

PostgreSQL container
└── bairu_test
```

**Vantagens:**

- maior isolamento entre ambientes;
- possibilidade de configurações diferentes;
- isolamento de recursos;
- maior proximidade de uma arquitetura com ambientes completamente independentes.

**Desvantagens:**

- maior consumo de recursos;
- configuração adicional;
- maior complexidade no ambiente local;
- benefício limitado para o estágio atual do MVP.

**Decisão:** não adotada inicialmente.

---

### 3. Um único banco compartilhado

```text
PostgreSQL container
└── bairu
```

**Vantagens:**

- configuração extremamente simples;
- menor quantidade de recursos utilizados.

**Desvantagens:**

- testes podem modificar dados utilizados durante o desenvolvimento;
- maior risco de interferência entre testes e desenvolvimento;
- dificuldade para garantir testes determinísticos;
- possibilidade de migrations ou operações destrutivas afetarem o ambiente de desenvolvimento.

**Decisão:** rejeitada.

## Docker

O PostgreSQL será executado em Docker durante o desenvolvimento local.

O Docker será tratado como **infraestrutura do ambiente de desenvolvimento**, e não como parte do domínio ou da lógica da aplicação.

A aplicação continuará acessando o banco por meio de uma URL de conexão configurada através de variáveis de ambiente.

Dessa forma, a aplicação não deverá depender de detalhes específicos do Docker para acessar o banco.

Conceitualmente:

```text
                 ┌─────────────────────┐
                 │       Bairu API     │
                 │       NestJS         │
                 └──────────┬──────────┘
                            │
                         Prisma
                            │
                   DATABASE_URL
                            │
                 ┌──────────▼──────────┐
                 │ PostgreSQL container│
                 │                     │
                 │ ┌─────────────────┐ │
                 │ │bairu_development│ │
                 │ └─────────────────┘ │
                 │                     │
                 │ ┌─────────────────┐ │
                 │ │    bairu_test   │ │
                 │ └─────────────────┘ │
                 └─────────────────────┘
```

## Ambientes

A separação local deverá seguir a seguinte convenção conceitual:

| Ambiente    | Banco                  | Finalidade            |
| ----------- | ---------------------- | --------------------- |
| Development | `bairu_development`    | Desenvolvimento local |
| Test        | `bairu_test`           | Testes automatizados  |
| Production  | Infraestrutura própria | Ambiente de produção  |

Os ambientes de desenvolvimento e testes não deverão utilizar o banco de produção.

## Produção

A decisão desta ADR é limitada ao ambiente local de desenvolvimento e testes.

Em produção, o PostgreSQL poderá ser hospedado por um provedor de infraestrutura, como Supabase, AWS, Magalu Cloud ou outro serviço compatível.

A aplicação deverá permanecer desacoplada do provedor escolhido.

A responsabilidade da aplicação será conhecer uma configuração de conexão PostgreSQL, e não detalhes específicos do serviço que hospeda o banco.

Conceitualmente:

```text
Bairu
  │
  └── PostgreSQL
        │
        ├── Development → infraestrutura local
        ├── Test        → infraestrutura local
        └── Production  → infraestrutura de produção
```

O provedor de produção poderá ser substituído posteriormente sem necessidade de alterar o domínio da aplicação.

## Consequências

### Positivas

- Desenvolvimento e testes possuem dados isolados.
- Reduzimos o risco de testes contaminarem o banco de desenvolvimento.
- O ambiente local permanece simples.
- O consumo de recursos é menor do que com containers separados.
- Docker passa a fornecer uma infraestrutura reproduzível.
- A aplicação permanece desacoplada do provedor de PostgreSQL.
- A estratégia pode evoluir para maior isolamento posteriormente.

### Negativas

- Desenvolvimento e testes compartilham o mesmo processo PostgreSQL.
- Os recursos do PostgreSQL não são isolados entre os ambientes.
- Uma falha no container afeta ambos os bancos.
- A estratégia pode precisar ser revista para cenários de testes paralelos, CI/CD ou maior complexidade operacional.

## Critérios para revisão da decisão

A estratégia deverá ser reavaliada caso surja uma necessidade concreta de:

- isolamento completo de recursos;
- execução de testes paralelos em grande escala;
- múltiplas versões do PostgreSQL;
- ambientes locais com configurações significativamente diferentes;
- pipelines de CI que exijam infraestrutura independente;
- requisitos de segurança que exijam isolamento adicional.

Nesses cenários, poderá ser adotada uma estratégia com containers separados ou outros mecanismos de isolamento.

## Relação com outras decisões

Esta ADR complementa as decisões relacionadas à arquitetura de backend, persistência e infraestrutura do Bairu.

A estratégia de acesso ao banco deverá permanecer baseada em configuração, evitando que componentes de domínio dependam diretamente de Docker, Supabase, AWS ou qualquer outro provedor de infraestrutura.

## Resumo

Para o MVP, o Bairu adotará:

```text
                 Docker
                   │
          PostgreSQL container
             ┌─────┴─────┐
             │           │
      Development      Test
             │           │
   bairu_development  bairu_test
```

A decisão prioriza **isolamento suficiente, simplicidade operacional e capacidade de evolução**, evitando introduzir complexidade de infraestrutura antes que exista uma necessidade concreta para isso.
