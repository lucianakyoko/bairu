# CON-001 — Architecture Conventions

## 1. Objetivo

Este documento estabelece as convenções arquiteturais gerais adotadas pelo Bairu.

Seu objetivo é garantir consistência nas decisões técnicas, reduzir ambiguidades durante o desenvolvimento e estabelecer uma base arquitetural capaz de evoluir junto com a plataforma.

Estas convenções devem orientar a criação de novos módulos, funcionalidades e componentes da plataforma.

Detalhes específicos de modelagem de dados, APIs REST, frontend, Git, commits, lifecycle, auditoria e armazenamento de mídias são definidos nos demais documentos da coleção de convenções.

---

## 2. Princípios Arquiteturais

Toda decisão técnica relevante deve considerar os seguintes princípios.

### 2.1. Simplicidade

Resolver problemas com a menor complexidade necessária.

O MVP deve priorizar soluções simples, compreensíveis e sustentáveis, evitando abstrações ou infraestrutura que não possuam uma necessidade concreta.

### 2.2. Clareza

O código e a arquitetura devem ser facilmente compreendidos por outros desenvolvedores.

Nomes, responsabilidades e fluxos devem ser explícitos, evitando soluções excessivamente implícitas ou complexas.

### 2.3. Modularidade

Cada módulo deve possuir uma responsabilidade clara e representar um domínio ou capacidade específica da plataforma.

### 2.4. Alta Coesão

Responsabilidades relacionadas devem permanecer próximas dentro do mesmo módulo ou contexto.

### 2.5. Baixo Acoplamento

Módulos não devem depender diretamente das implementações internas de outros módulos.

Dependências entre módulos devem ocorrer por meio de contratos públicos e interfaces bem definidas.

### 2.6. Evolução Incremental

A arquitetura deve permitir que o produto evolua progressivamente.

Uma decisão arquitetural não deve antecipar complexidades que ainda não são necessárias, mas também não deve impedir uma evolução razoável no futuro.

### 2.7. Escalabilidade

A arquitetura deve permitir crescimento incremental da plataforma sem exigir reestruturações profundas sempre que novos módulos ou funcionalidades forem adicionados.

### 2.8. Domínio como Referência

As regras e conceitos do negócio devem orientar a modelagem da aplicação.

A arquitetura utiliza princípios de Domain-Driven Design (DDD), especialmente a separação de responsabilidades e a definição de contextos de domínio.

O uso de DDD não implica adotar complexidade desnecessária no MVP.

---

## 3. Organização do Monorepo

O Bairu utiliza um monorepo baseado em Turborepo.

A estrutura principal é organizada em aplicações e pacotes compartilhados:

```text
apps/
├── web/
├── admin/
└── api/

packages/
├── ui/
├── types/
├── utils/
├── eslint-config/
├── tsconfig/
└── ...
```

### 3.1. Aplicações

Cada aplicação possui responsabilidade própria:

| Aplicação | Responsabilidade               |
| --------- | ------------------------------ |
| `web`     | Frontend público da plataforma |
| `admin`   | Painel administrativo          |
| `api`     | Backend e API da plataforma    |

Cada aplicação deve possuir independência de build, testes e deploy sempre que necessário.

### 3.2. Pacotes Compartilhados

Pacotes dentro de `packages/` devem conter código realmente compartilhado entre aplicações.

Não devem ser utilizados como depósitos genéricos de código.

Cada pacote deve possuir uma responsabilidade claramente definida.

---

## 4. Organização do Backend

O backend utiliza NestJS e deve ser organizado por domínio.

Exemplo:

```text
apps/api/src/

├── users/
├── companies/
├── categories/
├── catalog/
├── promotions/
├── news/
├── events/
├── jobs/
├── coupons/
├── feed/
├── favorites/
├── reviews/
├── reports/
├── notifications/
├── media/
└── common/
```

A estrutura definitiva dos módulos deve acompanhar a evolução dos contextos de domínio.

Um módulo deve concentrar as responsabilidades relacionadas ao seu próprio domínio e evitar conhecimento desnecessário sobre a implementação interna de outros módulos.

### 4.1. Módulos de Domínio

Um módulo deve possuir:

- responsabilidade bem definida;
- regras de negócio relacionadas ao seu domínio;
- contratos públicos claros;
- dependências explícitas;
- baixo acoplamento com outros módulos.

### 4.2. Módulo `common`

O módulo ou espaço compartilhado `common` deve conter apenas funcionalidades realmente transversais à aplicação.

Exemplos:

- utilidades de infraestrutura;
- filtros globais;
- interceptors;
- pipes;
- decorators compartilhados;
- exceções base;
- componentes técnicos reutilizáveis.

Regras específicas de negócio não devem ser colocadas em `common` apenas para facilitar o acesso entre módulos.

---

## 5. Bounded Contexts

O domínio da plataforma é organizado conceitualmente em Bounded Contexts.

| Contexto       | Responsabilidade                              |
| -------------- | --------------------------------------------- |
| Identity       | Usuários e autenticação                       |
| Business       | Empresas e informações institucionais         |
| Catalog        | Categorias e catálogo                         |
| Content        | Promoções, novidades, vagas, eventos e cupons |
| Feed           | Distribuição e agregação de conteúdo          |
| Community      | Favoritos, avaliações e denúncias             |
| Administration | Administração, auditoria e notificações       |

Esses contextos representam limites conceituais do domínio.

Eles não precisam necessariamente corresponder a aplicações ou serviços independentes.

No MVP, os contextos permanecem dentro de uma aplicação backend única.

Essa abordagem permite manter a operação simples enquanto preserva limites claros entre responsabilidades.

---

## 6. Comunicação Entre Módulos

Módulos não devem acessar diretamente a implementação interna de outros módulos.

A comunicação deve utilizar, conforme a necessidade:

- serviços públicos;
- casos de uso;
- interfaces;
- contratos de domínio;
- eventos de domínio, quando introduzidos.

### 6.1. Dependências Permitidas

Um módulo pode depender de uma capacidade pública de outro módulo.

Por exemplo:

```text
Review
   ↓
Company
```

O módulo de avaliações pode precisar consultar ou atualizar informações relacionadas à empresa, mas não deve acessar diretamente repositórios, entidades internas ou detalhes de persistência do módulo `Company`.

### 6.2. Eventos de Domínio

Eventos de domínio poderão ser utilizados quando houver benefício real em desacoplar operações.

Eles não devem ser introduzidos apenas por preferência arquitetural.

Para fluxos simples e síncronos, comunicação direta por contratos públicos continua sendo a abordagem preferencial no MVP.

---

## 7. Feed como Contexto Independente

O Feed é um contexto independente responsável pela distribuição e agregação de conteúdos publicados.

O Feed não deve conhecer as regras internas de cada módulo de conteúdo.

Exemplo:

```text
Promotion
    │
    ▼
FeedPublication
```

O mesmo princípio se aplica a outros tipos de conteúdo.

O Feed trabalha com a representação necessária para distribuição, enquanto as regras específicas do conteúdo permanecem em seus respectivos módulos.

Essa separação permite que novos tipos de conteúdo sejam adicionados sem transformar o Feed em um módulo dependente de todas as regras de negócio da plataforma.

---

## 8. Separação de Responsabilidades

Cada camada deve possuir responsabilidade clara.

De forma geral:

```text
HTTP / Controller
        ↓
Application / Use Case
        ↓
Domain
        ↓
Infrastructure
        ↓
Database / External Services
```

A nomenclatura e a granularidade dessas camadas podem variar conforme o módulo, desde que suas responsabilidades permaneçam claras.

### 8.1. Controllers

Controllers são responsáveis pela comunicação HTTP.

Devem:

- receber requisições;
- validar ou encaminhar validações;
- chamar casos de uso ou serviços apropriados;
- retornar respostas HTTP.

Controllers não devem concentrar regras complexas de negócio.

### 8.2. Application / Use Cases

Casos de uso coordenam operações da aplicação.

São responsáveis por:

- orquestrar operações;
- aplicar regras relacionadas ao fluxo de execução;
- coordenar diferentes componentes do domínio;
- controlar transações quando necessário.

### 8.3. Domain

O domínio concentra as regras de negócio.

Regras importantes não devem depender diretamente de detalhes específicos de HTTP ou infraestrutura.

### 8.4. Infrastructure

A infraestrutura contém integrações técnicas, como:

- banco de dados;
- Prisma;
- serviços externos;
- armazenamento de arquivos;
- mensageria;
- cache.

Detalhes de infraestrutura não devem definir as regras do domínio.

---

## 9. Persistência

O Bairu utiliza PostgreSQL como banco de dados relacional e Prisma como ORM.

A camada de domínio não deve depender desnecessariamente de detalhes específicos do banco.

A persistência deve permanecer encapsulada por componentes apropriados, permitindo evolução futura da infraestrutura sem espalhar detalhes do banco pela aplicação.

As convenções específicas de modelagem, nomenclatura, identificadores, auditoria, lifecycle e exclusão estão definidas nos documentos correspondentes da coleção de convenções.

---

## 10. Armazenamento de Arquivos

Arquivos binários não devem ser armazenados diretamente no banco de dados.

A aplicação deve persistir apenas referências e metadados necessários para relacionar o arquivo ao domínio.

O armazenamento físico deve permanecer sob responsabilidade de um provedor externo de mídia.

No MVP, o Bairu utiliza o Cloudinary.

A arquitetura deve permitir futura substituição do provedor sem exigir alterações significativas nas entidades de domínio.

Possíveis provedores futuros incluem:

- AWS S3;
- Magalu Cloud;
- MinIO;
- Google Cloud Storage.

A implementação detalhada do armazenamento, upload, associação, substituição, exclusão e tratamento de falhas está definida em:

`CON-009-media-architecture-and-lifecycle-standards.md`

---

## 11. Segurança como Responsabilidade Arquitetural

Segurança deve ser considerada desde o início do desenvolvimento e não adicionada apenas posteriormente.

A arquitetura deve observar, entre outros:

- princípio do menor privilégio;
- autenticação;
- autorização;
- validação de entrada;
- proteção contra abuso;
- proteção de dados sensíveis;
- isolamento de responsabilidades;
- não exposição de detalhes internos da infraestrutura.

As regras específicas de segurança da API são tratadas no documento de convenções da API REST.

Regras relacionadas à proteção de dados pessoais, retenção e auditoria devem ser tratadas nas convenções específicas de lifecycle e compliance.

---

## 12. Performance

Performance deve ser considerada nas decisões arquiteturais, mas otimizações prematuras devem ser evitadas.

As principais diretrizes são:

- evitar consultas N+1;
- utilizar paginação em coleções;
- criar índices para consultas relevantes;
- evitar carregamento desnecessário de dados;
- utilizar cache quando houver necessidade comprovada;
- monitorar operações críticas antes de introduzir otimizações complexas.

A necessidade de otimização deve ser baseada, sempre que possível, em evidências observáveis.

---

## 13. Testabilidade

A arquitetura deve favorecer testes isolados das regras de negócio.

Novas funcionalidades devem priorizar:

- testes unitários para regras de negócio;
- testes de integração para fluxos que envolvam múltiplas partes do sistema;
- testes end-to-end para fluxos críticos.

As ferramentas adotadas pela plataforma são definidas nas convenções específicas de cada camada.

---

## 14. Documentação

Decisões arquiteturais relevantes devem ser documentadas.

A documentação técnica deve existir próxima ao código e ser atualizada conforme a arquitetura evolui.

Decisões que representem escolhas arquiteturais importantes devem ser registradas como Architecture Decision Records (ADRs).

As convenções gerais da plataforma estão organizadas na coleção `10-conventions`.

---

## 15. Critérios para Novas Funcionalidades

Antes de implementar uma nova funcionalidade relevante, deve-se avaliar:

1. A funcionalidade pertence a um contexto existente?
2. Introduz um novo conceito de domínio?
3. Pode ser implementada como módulo independente?
4. Existe uma regra de negócio nova?
5. Existe impacto em outros módulos?
6. A comunicação entre módulos precisa ser síncrona?
7. Existe necessidade real de evento de domínio?
8. Qual é a estratégia de persistência e lifecycle?
9. Existem impactos de performance?
10. Existem impactos de segurança?
11. É necessário atualizar alguma convenção ou documentação?
12. A funcionalidade possui impacto sobre limites ou planos da plataforma?

Essa análise não deve ser burocrática para pequenas alterações.

Seu objetivo é orientar decisões arquiteturais relevantes.

---

## 16. Evolução da Arquitetura

A arquitetura do Bairu deve evoluir conforme as necessidades reais do produto.

Novas abstrações, serviços, filas, eventos, caches ou componentes distribuídos devem ser introduzidos somente quando houver justificativa técnica ou de produto.

A existência de uma possibilidade futura não constitui, por si só, motivo para implementá-la antecipadamente.

O princípio adotado é:

> **Preparar a arquitetura para evoluir sem implementar complexidade antes da necessidade.**

---

## 17. Decisões Arquiteturais Consolidadas

As seguintes decisões fazem parte da arquitetura atual do Bairu:

| Decisão                                            | Justificativa                                                   |
| -------------------------------------------------- | --------------------------------------------------------------- |
| Monorepo com Turborepo                             | Compartilhamento controlado de código e gerenciamento unificado |
| Backend único com NestJS                           | Centralização das regras de negócio no MVP                      |
| Frontend público separado do painel administrativo | Objetivos e necessidades diferentes                             |
| PostgreSQL + Prisma                                | Banco relacional robusto e produtividade de desenvolvimento     |
| Organização por domínio                            | Alta coesão e baixo acoplamento                                 |
| Bounded Contexts                                   | Definição clara dos limites conceituais do domínio              |
| Feed desacoplado do conteúdo                       | Permite evolução independente dos tipos de conteúdo             |
| Storage externo                                    | Mantém o banco independente do provedor de arquivos             |
| Media como capacidade transversal                  | Centraliza upload e lifecycle de arquivos                       |
| UUID                                               | Identificadores adequados para distribuição e exposição pública |
| Evolução incremental                               | Evita complexidade desnecessária no MVP                         |

---

## 18. Relação com Outras Convenções

Este documento estabelece princípios arquiteturais gerais.

As regras específicas devem ser consultadas nos documentos correspondentes:

- `CON-002-domain-and-data-modeling-conventions.md` — domínio, entidades e dados;
- `CON-003-rest-api-conventions.md` — APIs REST;
- `CON-004-frontend-conventions.md` — frontend;
- `CON-005-git-conventions.md` — Git e fluxo de desenvolvimento;
- `CON-006-commit-conventions.md` — mensagens de commit;
- `CON-007-audit-and-compliance-standards.md` — auditoria e compliance;
- `CON-008-data-lifecycle-standards.md` — ciclo de vida e retenção de dados;
- `CON-009-media-architecture-and-lifecycle-standards.md` — arquitetura e ciclo de vida das mídias.

Quando houver conflito entre documentos, a decisão mais específica deve ser avaliada em conjunto com a arquitetura geral e, quando necessário, registrada como ADR.

---

## 19. Manutenção deste Documento

Este documento deve ser atualizado quando uma convenção arquitetural geral for alterada.

Mudanças significativas na arquitetura devem ser acompanhadas de uma ADR quando representarem uma decisão relevante ou irreversível.

As convenções devem refletir o estado real do projeto e não apenas uma arquitetura desejada para o futuro.
