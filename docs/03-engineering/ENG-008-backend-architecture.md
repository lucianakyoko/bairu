# ENG-008 — Backend Architecture

## Objetivo

Definir a arquitetura e os padrões estruturais utilizados no backend do Bairu.

Este documento estabelece diretrizes para organização dos módulos, responsabilidades, dependências, acesso a dados, configuração, infraestrutura e testes da API, mantendo a aplicação simples no MVP e preparada para evolução conforme a complexidade do produto aumente.

---

## Escopo

Este documento cobre:

- organização do `apps/api`;
- módulos e domínios;
- Controllers;
- Services;
- Providers;
- Dependency Injection;
- Repository Pattern;
- Prisma;
- configuração;
- infraestrutura;
- componentes compartilhados;
- testes;
- critérios para introdução de novas abstrações.

---

## Princípios arquiteturais

O backend deverá seguir os seguintes princípios:

- modularidade;
- separação de responsabilidades;
- baixo acoplamento;
- alta coesão;
- Dependency Injection;
- simplicidade no MVP;
- evolução incremental da arquitetura;
- separação entre regras de negócio e infraestrutura;
- evitar abstrações sem necessidade concreta.

A arquitetura deverá evoluir conforme a complexidade do domínio justificar novas fronteiras.

Não serão criadas camadas ou abstrações apenas para seguir padrões arquiteturais de forma dogmática.

---

## Stack

O backend utilizará:

- NestJS;
- TypeScript;
- PostgreSQL;
- Prisma.

O backend será mantido como uma aplicação independente dentro do monorepo.

Estrutura inicial:

```text
apps/
└── api/
```

---

## Organização do projeto

A organização inicial seguirá o modelo modular do NestJS, agrupando funcionalidades por domínio ou capacidade de negócio.

Estrutura inicial esperada:

```text
apps/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── config/
│   │
│   ├── database/
│   │   └── prisma.service.ts
│   │
│   └── modules/
│       ├── health/
│       │   ├── health.controller.ts
│       │   ├── health.service.ts
│       │   └── health.module.ts
│       │
│       ├── companies/
│       │   ├── companies.controller.ts
│       │   ├── companies.service.ts
│       │   └── companies.module.ts
│       │
│       └── categories/
│           ├── categories.controller.ts
│           ├── categories.service.ts
│           └── categories.module.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
└── package.json
```

A estrutura poderá ser expandida conforme a complexidade dos módulos aumentar.

---

## Modules

Os Modules representam as principais fronteiras da aplicação.

Cada módulo deverá representar um domínio ou capacidade de negócio coerente.

Exemplos:

```text
modules/
├── companies/
├── categories/
├── publications/
├── auth/
└── health/
```

Um módulo deverá ser responsável por organizar os componentes relacionados à sua funcionalidade.

Exemplo:

```ts
@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
```

### Regras

- módulos devem possuir responsabilidades claras;
- dependências entre módulos devem ser explícitas;
- utilizar `imports` e `exports` do NestJS para controlar fronteiras;
- evitar acesso direto a componentes internos de outro módulo;
- evitar dependências circulares.

---

## Controllers

Controllers são responsáveis pela interface HTTP da aplicação.

Responsabilidades:

- receber requisições;
- validar e transformar entradas quando necessário;
- delegar operações para serviços;
- retornar respostas HTTP adequadas.

Controllers não devem:

- conter regras complexas de negócio;
- acessar Prisma diretamente;
- executar consultas SQL;
- conter lógica de persistência;
- conhecer detalhes de infraestrutura que não sejam necessários para a interface HTTP.

Fluxo esperado:

```text
HTTP Request
     ↓
Controller
     ↓
Service
```

---

## Providers e Dependency Injection

O NestJS utiliza um container de Dependency Injection para gerenciar dependências.

Providers são componentes registrados no sistema de DI e podem ser injetados em outros componentes.

Exemplo:

```ts
@Injectable()
export class CompaniesService {
  constructor(private readonly repository: CompaniesRepository) {}
}
```

O componente consumidor não deverá ser responsável por instanciar manualmente suas dependências.

Evitar:

```ts
const repository = new CompaniesRepository();
```

Preferir:

```ts
constructor(
  private readonly repository: CompaniesRepository,
) {}
```

### Objetivo

Dependency Injection deverá ser utilizada para:

- reduzir acoplamento;
- facilitar testes;
- permitir substituição de implementações;
- manter responsabilidades bem definidas.

---

## Services

Services representam a camada responsável pela coordenação da lógica da aplicação.

Responsabilidades:

- executar operações da aplicação;
- coordenar dependências;
- aplicar regras de negócio quando apropriado;
- utilizar repositories e outros providers quando necessário.

Services não devem:

- conhecer detalhes HTTP específicos;
- depender diretamente de Controllers;
- concentrar responsabilidades de infraestrutura sem necessidade;
- crescer indefinidamente como "classe que faz tudo".

Quando um Service acumular responsabilidades distintas, sua estrutura deverá ser reavaliada.

---

## Domain

No Bairu, `domain` representa os conceitos, regras e comportamentos relacionados ao negócio.

Exemplos:

- Company;
- Category;
- Publication;
- BusinessHours;
- Promotion;
- JobVacancy.

O domínio não representa simplesmente:

> "qualquer classe relacionada a uma entidade do banco."

Uma classe pertence ao domínio quando representa comportamento ou regra relevante do negócio.

Exemplo de regra de domínio:

> Uma empresa não pode possuir duas publicações promocionais ativas simultaneamente, considerando os limites definidos pela plataforma.

### Introdução gradual

Nem todo módulo precisa possuir uma pasta `domain/` desde o início.

Um módulo simples poderá começar como:

```text
companies/
├── companies.controller.ts
├── companies.service.ts
└── companies.module.ts
```

Se surgirem regras de negócio complexas, poderá evoluir para:

```text
companies/
├── domain/
│   ├── company.ts
│   └── company.rules.ts
├── companies.controller.ts
├── companies.service.ts
└── companies.module.ts
```

---

## Repository Pattern

O Repository Pattern **não será obrigatório para todos os módulos no MVP**.

Repositories serão introduzidos quando existir uma necessidade arquitetural concreta, como:

- encapsular consultas complexas;
- separar regras de negócio da persistência;
- facilitar substituição de infraestrutura;
- reduzir acoplamento com Prisma;
- permitir testes de componentes de aplicação sem depender diretamente do banco.

Uma funcionalidade simples não deverá receber um Repository apenas por convenção.

Exemplo:

```text
HealthController
      ↓
HealthService
      ↓
PrismaService
```

Não é necessário:

```text
HealthController
      ↓
HealthService
      ↓
HealthRepository
      ↓
Prisma
```

quando não existe uma necessidade real de abstração de persistência.

---

## Prisma

Prisma será utilizado como ORM e camada de acesso ao PostgreSQL.

Responsabilidades:

- comunicação com PostgreSQL;
- execução de queries;
- mapeamento dos modelos;
- migrations;
- operações de persistência.

O Prisma pertence à infraestrutura da aplicação.

Fluxo esperado quando Repository Pattern for necessário:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
PostgreSQL
```

O domínio e as regras de negócio não deverão depender diretamente das APIs específicas do Prisma quando essa separação for necessária.

---

## Database

A infraestrutura de banco ficará centralizada em uma camada própria. Esta camada representa integração do Nest com a infraestrutura de banco.

Estrutura inicial:

```text
src/
└── database/
```

Responsabilidades possíveis:

- configuração do Prisma;
- registro do `PrismaService`;
- conexão com PostgreSQL;
- componentes relacionados à infraestrutura de persistência.

O schema e migrations do Prisma ficarão em:

```text
apps/api/prisma/
```

---

## Configuração

Configurações da aplicação deverão ser separadas da lógica de negócio.

Estrutura:

```text
src/
└── config/
```

Exemplos:

- ambiente;
- URLs;
- credenciais;
- configurações de serviços externos;
- parâmetros operacionais.

Segredos não deverão ser versionados no repositório.

Variáveis de ambiente deverão ser utilizadas para valores específicos de cada ambiente.

---

## Shared

`shared` representa componentes realmente compartilhados por diferentes módulos e que não pertencem exclusivamente a um domínio.

Exemplos possíveis:

```text
shared/
├── decorators/
├── guards/
├── filters/
├── interceptors/
└── utils/
```

Um componente não deverá ser colocado em `shared` apenas porque pode ser reutilizado futuramente.

Antes de mover algo para `shared`, deverá existir uma necessidade real de compartilhamento.

O objetivo é evitar que `shared` se torne um "depósito de código genérico".

---

## Infraestrutura

Infraestrutura representa componentes responsáveis por comunicação com recursos externos à lógica de negócio.

Exemplos:

- PostgreSQL;
- Prisma;
- Redis;
- armazenamento de arquivos;
- APIs externas;
- serviços de e-mail;
- filas;
- cache.

A infraestrutura deverá permanecer isolada das regras de negócio sempre que essa separação trouxer benefício arquitetural real.

---

## Exemplo de fluxo

Uma operação típica poderá seguir:

```text
HTTP Request
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
Prisma
     ↓
PostgreSQL
```

Quando não houver necessidade de Repository:

```text
HTTP Request
     ↓
Controller
     ↓
Service
     ↓
Provider
```

A arquitetura não exige que todas as funcionalidades atravessem todas as camadas.

---

## Health Check

O HealthModule será implementado desde a primeira versão da API como mecanismo mínimo de verificação da disponibilidade da aplicação e como componente inicial para validação da infraestrutura do backend.

O módulo de health check será tratado como uma funcionalidade operacional e não como domínio de negócio.

Estrutura inicial:

```text
health/
├── health.controller.ts
├── health.service.ts
└── health.module.ts
```

Exemplo:

```text
HealthController
      ↓
HealthService
      ↓
PrismaService
```

Caso múltiplas verificações de infraestrutura sejam adicionadas, poderão ser introduzidos componentes especializados:

```text
HealthService
├── DatabaseHealthIndicator
└── RedisHealthIndicator
```

Essa abstração somente deverá ser criada quando houver necessidade concreta.

---

## Limite entre simplicidade e abstração

A arquitetura deverá seguir uma abordagem evolutiva.

Uma nova abstração deverá ser considerada quando:

- uma responsabilidade estiver crescendo;
- houver duplicação relevante;
- um componente possuir múltiplas responsabilidades distintas;
- houver necessidade real de substituição de implementação;
- testes estiverem sendo prejudicados pelo acoplamento;
- uma fronteira de domínio estiver se tornando evidente;
- uma dependência externa estiver contaminando regras de negócio.

Não criar abstrações apenas porque:

- são consideradas "boas práticas";
- podem ser úteis no futuro;
- outras arquiteturas utilizam;
- o projeto ainda não possui complexidade que as justifique.

Princípio:

> **Complexidade deve ser uma resposta ao problema, não uma característica inicial da arquitetura.**

---

## Testes

Os testes serão organizados por camada e responsabilidade.

Estratégia inicial:

```text
Unit Tests
    ↓
Services / Domain / regras isoladas

Integration Tests
    ↓
Repository / Prisma / PostgreSQL

E2E Tests
    ↓
HTTP / Modules / fluxos completos
```

Os testes deverão permanecer próximos ao código relacionado.

Exemplo:

```text
companies/
├── companies.service.ts
├── companies.service.spec.ts
├── companies.controller.ts
└── companies.module.ts
```

Quando uma implementação exigir infraestrutura real, testes de integração deverão ser utilizados.

A estratégia detalhada de testes será definida em documentação própria de engenharia.

---

## Segurança

O backend deverá considerar desde o início:

- validação de entrada;
- autenticação;
- autorização;
- proteção de dados sensíveis;
- gerenciamento seguro de secrets;
- tratamento adequado de erros;
- rate limiting quando necessário;
- logs sem exposição de informações sensíveis.

Segurança deverá ser considerada parte da arquitetura e não apenas uma etapa posterior.

---

## Performance

As decisões de performance deverão ser orientadas por métricas e necessidade real.

Diretrizes:

- evitar queries desnecessárias;
- utilizar paginação quando aplicável;
- evitar N+1;
- criar índices conforme necessidade;
- utilizar cache quando houver benefício comprovado;
- utilizar processamento assíncrono para operações apropriadas;
- evitar carregamento de dados desnecessários.

Nenhuma otimização deverá ser introduzida apenas por antecipação.

---

## Evolução arquitetural

A arquitetura poderá evoluir conforme o produto crescer.

Possíveis evoluções:

```text
MVP
 ↓
Modules + Services
 ↓
Repositories
 ↓
Domain Objects
 ↓
Infrastructure boundaries
 ↓
Caching / Queues
 ↓
Distributed components
```

Essas evoluções não são obrigatórias nem possuem cronograma pré-definido.

Cada mudança deverá ser motivada por uma necessidade concreta do produto ou da engenharia.

---

## Decisões arquiteturais

### NestJS como base modular

O Bairu utilizará a arquitetura modular nativa do NestJS como estrutura inicial.

**Motivo**

O sistema de Modules, Providers e Dependency Injection do NestJS fornece uma estrutura suficiente para manter baixo acoplamento e separação de responsabilidades no MVP sem introduzir camadas adicionais desnecessárias.

---

### Organização por domínio/capacidade

Os módulos serão organizados por domínio ou capacidade de negócio, e não globalmente por tipo técnico.

Preferir:

```text
modules/
├── companies/
├── categories/
└── publications/
```

em vez de:

```text
controllers/
services/
repositories/
```

**Motivo**
A organização por domínio mantém os componentes relacionados próximos e facilita a evolução independente de cada contexto.

---

### Arquitetura evolutiva

Novas camadas serão introduzidas somente quando houver necessidade concreta.

**Motivo**
Evitar overengineering e manter o MVP simples, sustentável e compreensível.

---

### Repository Pattern opcional

Repositories não serão obrigatórios em todos os módulos.

**Motivo**
Nem toda funcionalidade necessita de uma abstração adicional sobre Prisma. A abstração deverá ser introduzida quando trouxer benefício real para isolamento, testes, manutenção ou complexidade de persistência.

---

## Segurança

O backend deverá considerar segurança como requisito arquitetural desde o início.

Diretrizes gerais:

- validação de entrada;
- autenticação;
- autorização;
- proteção de dados sensíveis;
- gerenciamento seguro de secrets;
- tratamento seguro de erros;
- logs sem exposição de informações sensíveis.

As políticas, padrões e procedimentos detalhados de segurança são definidos na documentação específica do diretório: `07-security/`

---

## Testes

### Unit

Testar componentes isoladamente:

- Services;
- regras de domínio;
- providers;
- utilitários.

### Integration

Testar integração entre componentes reais:

- Prisma;
- PostgreSQL;
- repositories, quando existirem;
- infraestrutura.

### E2E

Testar fluxos através da API:

```
HTTP
 ↓
Controller
 ↓
Service
 ↓
Database
```

---

## Revisão

Este documento deverá ser revisado quando:

- novos bounded contexts forem introduzidos;
- a estrutura do backend sofrer mudanças significativas;
- novas tecnologias de infraestrutura forem adotadas;
- novas camadas arquiteturais forem introduzidas;
- decisões atuais deixarem de representar adequadamente a arquitetura do Bairu.
