# API-001 — Health Check

## Objetivo

Definir o contrato inicial do endpoint de Health Check da API do Bairu.

O Health Check permite verificar se a aplicação está ativa e capaz de responder requisições HTTP.

Neste primeiro momento, o endpoint representa exclusivamente o estado de **liveness** da aplicação.

---

## Endpoint

```http
GET /health
```

### Objetivo da operação

Verificar se a API está viva e consegue processar uma requisição HTTP.

### Resposta de sucesso

**HTTP 200 OK**

```json
{
  "status": "ok"
}
```

---

## Semântica

O endpoint `/health` representa o conceito de **liveness**:

> A aplicação está viva e consegue responder requisições?

Uma resposta `200 OK` indica que o processo da API está em execução e conseguiu processar a requisição.

O endpoint não representa, neste momento, a disponibilidade de dependências externas.

---

## Dependências verificadas

Na implementação inicial, o Health Check **não verifica dependências externas**.

Não fazem parte da verificação atual:

- PostgreSQL;
- Redis;
- filas;
- serviços externos;
- APIs de terceiros;
- armazenamento de arquivos.

Essa decisão é intencional. Essas dependências ainda não fazem parte da fundação atual da API e não devem ser introduzidas artificialmente no Health Check.

---

## Responsabilidades

A implementação segue a separação de responsabilidades adotada inicialmente pelo backend:

```text
HTTP Request
     │
     ▼
HealthController
     │
     ▼
HealthService
     │
     ▼
Application Health State
```

### HealthController

Responsável por:

- expor a rota HTTP;
- receber a requisição;
- delegar a obtenção do estado ao service;
- retornar a resposta HTTP adequada.

### HealthService

Responsável por:

- concentrar a lógica relacionada ao estado da aplicação;
- fornecer o resultado utilizado pelo controller;
- permitir a evolução futura do Health Check sem concentrar lógica no controller.

---

## Liveness e Readiness

O Bairu diferencia os conceitos de **liveness** e **readiness**.

### Liveness

Responde à pergunta:

> A aplicação está viva?

Endpoint inicial:

```http
GET /health
```

A implementação atual representa esse conceito.

### Readiness

Responde à pergunta:

> A aplicação está pronta para receber tráfego?

Um endpoint específico de readiness poderá ser introduzido futuramente, quando a aplicação possuir dependências cuja disponibilidade seja necessária para operar corretamente.

Exemplo futuro:

```http
GET /health/ready
```

Esse endpoint poderá verificar dependências como:

```text
API
 │
 ├── PostgreSQL ✓
 ├── Redis      ✓
 └── Outros     ✓
```

A implementação de readiness **não faz parte desta etapa**.

---

## Evolução futura

Quando novas dependências forem introduzidas no backend, o contrato poderá evoluir para contemplar verificações de infraestrutura.

Possíveis informações futuras incluem:

- disponibilidade do PostgreSQL;
- disponibilidade do Redis;
- disponibilidade de serviços essenciais;
- status individual das dependências;
- distinção entre aplicação viva e aplicação pronta.

Essas informações somente deverão ser adicionadas quando houver uma necessidade operacional que justifique sua inclusão.

---

## Decisões

### Resposta inicial mínima

O contrato inicial utiliza somente:

```json
{
  "status": "ok"
}
```

Não são incluídos inicialmente:

- timestamp;
- versão da aplicação;
- uptime;
- informações de infraestrutura;
- lista de dependências.

A decisão evita aumentar o contrato da API sem uma necessidade concreta.

### Banco de dados

O PostgreSQL não é verificado pelo `/health` nesta etapa.

A integração com o banco será estabelecida posteriormente na RF-010 — Database & Prisma.

### Testes

Os testes automatizados do Health Check não fazem parte da implementação desta etapa.

A estratégia de testes do backend será estabelecida na RF-014 — Backend Testing Foundation.

---

## Status

**Status:** Implementado

**Endpoint atual:**

```http
GET /health
```

**Resposta atual:**

```json
{
  "status": "ok"
}
```
