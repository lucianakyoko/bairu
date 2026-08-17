# CON-003 — Convenções da API REST

## 1. Objetivo

Este documento define as convenções utilizadas pelas APIs REST do Bairu.

Seu objetivo é garantir **consistência, previsibilidade, segurança e facilidade de evolução** na comunicação entre clientes e backend.

As regras aqui descritas devem ser utilizadas por todos os módulos que exponham recursos através da API HTTP.

---

## 2. Princípios

A API do Bairu deve seguir os seguintes princípios:

### 2.1. RESTful

Os endpoints devem representar recursos do domínio, e não ações.

**Preferível:**

```http
GET /api/v1/companies
```

**Evitar:**

```http
GET /api/v1/get-companies
```

### 2.2. Stateless

Cada requisição deve conter as informações necessárias para seu processamento.

A API não deve depender de estado de sessão armazenado no servidor para processar requisições independentes.

### 2.3. Orientação a recursos

As URLs devem representar recursos do domínio.

Exemplos:

```text
companies
catalog-items
promotions
events
coupons
jobs
feed
```

Ações específicas devem ser representadas por métodos HTTP ou, quando realmente necessário, por operações explicitamente justificadas.

### 2.4. Baixo acoplamento

Os consumidores da API não devem depender da estrutura interna do banco de dados ou das entidades do ORM.

A API define o contrato entre backend e seus consumidores.

### 2.5. Consistência

Recursos semelhantes devem possuir comportamentos semelhantes quanto a:

- nomenclatura;
- paginação;
- filtros;
- ordenação;
- respostas;
- erros;
- autenticação;
- autorização.

---

# 3. Versionamento

As APIs públicas devem possuir versão explícita.

O padrão adotado é:

```text
/api/v1
```

Exemplos:

```http
GET /api/v1/companies
GET /api/v1/events
GET /api/v1/feed
```

Mudanças incompatíveis com consumidores existentes devem resultar em uma nova versão da API.

Mudanças compatíveis devem ocorrer dentro da versão atual sempre que possível.

---

# 4. Convenções de Rotas

As rotas devem:

- utilizar substantivos;
- representar recursos;
- utilizar plural para coleções;
- utilizar letras minúsculas;
- utilizar `kebab-case` quando houver múltiplas palavras;
- evitar verbos.

### Exemplos

```http
GET /api/v1/companies
GET /api/v1/catalog-items
GET /api/v1/company-reviews
```

### Evitar

```http
GET /api/v1/getCompanies
POST /api/v1/createCompany
GET /api/v1/list-catalog-items
```

---

# 5. Métodos HTTP

| Método   | Finalidade                          |
| -------- | ----------------------------------- |
| `GET`    | Consultar recursos                  |
| `POST`   | Criar recursos                      |
| `PUT`    | Substituir completamente um recurso |
| `PATCH`  | Atualizar parcialmente um recurso   |
| `DELETE` | Remover um recurso                  |

Os métodos devem respeitar sua semântica HTTP sempre que possível.

---

# 6. Estrutura das URLs

## 6.1. Coleção

```http
GET /api/v1/companies
```

## 6.2. Recurso específico

```http
GET /api/v1/companies/{id}
```

## 6.3. Recursos relacionados

Quando uma relação fizer parte da navegação natural do domínio, poderão ser utilizados recursos aninhados.

```http
GET /api/v1/companies/{id}/events
GET /api/v1/companies/{id}/promotions
```

O aninhamento deve ser utilizado com moderação para evitar URLs excessivamente acopladas à estrutura interna do domínio.

---

# 7. Query Parameters

Filtros, paginação, ordenação e buscas devem utilizar query parameters.

Exemplos:

```http
GET /api/v1/companies?page=1&pageSize=20
```

```http
GET /api/v1/companies?sortBy=name&sortOrder=asc
```

```http
GET /api/v1/companies?q=padaria
```

Convenções iniciais:

| Parâmetro   | Finalidade                     |
| ----------- | ------------------------------ |
| `page`      | Número da página               |
| `pageSize`  | Quantidade de itens por página |
| `sortBy`    | Campo utilizado para ordenação |
| `sortOrder` | Direção da ordenação           |
| `q`         | Busca textual                  |
| `status`    | Filtro por status              |
| `category`  | Filtro por categoria           |
| `city`      | Filtro por cidade              |

Novos parâmetros devem seguir `camelCase`.

---

# 8. Paginação

Toda operação que retornar uma coleção potencialmente grande deve possuir paginação.

O formato padrão é:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 154,
    "totalPages": 8
  }
}
```

A paginação deve ser aplicada principalmente a:

- empresas;
- catálogo;
- feed;
- avaliações;
- eventos;
- promoções;
- vagas;
- demais coleções potencialmente extensas.

Limites máximos de `pageSize` devem ser definidos pela API para evitar consultas excessivamente grandes.

---

# 9. Ordenação

Coleções que permitirem ordenação devem utilizar:

```text
sortBy
sortOrder
```

Exemplo:

```http
GET /api/v1/companies?sortBy=name&sortOrder=asc
```

Valores esperados para `sortOrder`:

```text
asc
desc
```

A API deve validar os campos permitidos para `sortBy`, evitando que o cliente possa solicitar arbitrariamente campos internos do banco.

---

# 10. Busca

Buscas textuais devem utilizar o parâmetro:

```text
q
```

Exemplo:

```http
GET /api/v1/companies?q=padaria
```

Não devem ser criados endpoints separados exclusivamente para representar diferentes tipos de pesquisa quando um recurso existente puder ser filtrado adequadamente.

---

# 11. Estrutura das Respostas

## 11.1. Resposta de sucesso

Quando um recurso for retornado:

```json
{
  "data": {}
}
```

## 11.2. Resposta de coleção

```json
{
  "data": []
}
```

## 11.3. Resposta paginada

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 154,
    "totalPages": 8
  }
}
```

## 11.4. Resposta sem conteúdo

Quando apropriado:

```http
204 No Content
```

---

# 12. Tratamento de Erros

Os erros devem possuir estrutura previsível.

Formato padrão:

```json
{
  "error": {
    "code": "COMPANY_NOT_FOUND",
    "message": "Empresa não encontrada."
  }
}
```

O campo `code` deve possuir um identificador estável para consumo programático.

O campo `message` deve ser apropriado para apresentação ou diagnóstico conforme o contexto.

Detalhes internos da aplicação, stack traces ou informações sensíveis nunca devem ser expostos em respostas públicas.

---

# 13. Códigos HTTP

A API deve utilizar códigos HTTP de acordo com a natureza da operação.

| Código | Utilização                                           |
| ------ | ---------------------------------------------------- |
| `200`  | Operação realizada com sucesso                       |
| `201`  | Recurso criado                                       |
| `204`  | Operação concluída sem conteúdo                      |
| `400`  | Requisição inválida                                  |
| `401`  | Não autenticado                                      |
| `403`  | Sem permissão                                        |
| `404`  | Recurso não encontrado                               |
| `409`  | Conflito com o estado atual do recurso               |
| `422`  | Entidade semanticamente inválida / erro de validação |
| `429`  | Limite de requisições excedido                       |
| `500`  | Erro interno                                         |

---

# 14. DTOs e Contratos

Cada endpoint deve possuir contratos explícitos de entrada e saída.

Podem ser utilizados DTOs específicos para:

- criação;
- atualização;
- filtros;
- resposta;
- resumo;
- itens de listagem.

Exemplos:

```text
CreateCompanyDto
UpdateCompanyDto
CompanyResponseDto
CompanySummaryDto
CompanyListItemDto
CompanyFilterDto
```

As entidades do ORM nunca devem ser expostas diretamente pela API.

Isso mantém o contrato HTTP desacoplado da persistência.

---

# 15. Datas

As datas transmitidas pela API devem:

- utilizar UTC;
- seguir ISO-8601;
- ser representadas de forma consistente;
- não possuir formatação específica para apresentação.

Exemplo:

```text
2026-08-09T12:30:00.000Z
```

A responsabilidade pela formatação para apresentação pertence ao cliente.

As regras específicas para campos temporais de domínio, como `starts_at` e `expires_at`, devem seguir as convenções compartilhadas do módulo de conteúdo.

---

# 16. Soft Delete

Endpoints públicos não devem retornar registros logicamente excluídos.

Quando houver necessidade de consultar registros excluídos, essa operação deve estar restrita a contextos administrativos devidamente autorizados.

A utilização de Soft Delete não é obrigatória para todas as entidades.

---

# 17. Upload de Arquivos

Uploads devem ser tratados por uma camada específica de mídia.

Quando aplicável, a API poderá utilizar um endpoint dedicado:

```http
POST /api/v1/media
```

A API deve retornar a referência da mídia criada.

As entidades de domínio devem armazenar apenas a referência necessária para associar o arquivo ao recurso, e não o conteúdo binário do arquivo.

A estratégia de armazenamento de arquivos é definida nas convenções arquiteturais gerais do projeto.

---

# 18. Cache HTTP

Conteúdos públicos e de leitura frequente poderão utilizar mecanismos de cache HTTP.

Recursos potencialmente elegíveis incluem:

- empresas;
- categorias;
- catálogo;
- promoções;
- eventos;
- cupons;
- feed.

Não devem ser aplicados mecanismos de cache público a operações ou recursos que possam expor dados privados ou apresentar risco de inconsistência inadequada, como:

- autenticação;
- perfil autenticado;
- favoritos;
- avaliações privadas;
- painel administrativo;
- operações de escrita.

Quando aplicável, poderão ser utilizados:

```http
Cache-Control
ETag
Last-Modified
```

A estratégia de invalidação deve ser definida de acordo com o recurso.

---

# 19. Compressão HTTP

A API deve utilizar compressão de resposta quando suportada pelo cliente e quando houver benefício relevante.

Os mecanismos preferenciais são:

1. Brotli;
2. Gzip.

A configuração deve permanecer na infraestrutura HTTP e não nas regras de negócio.

---

# 20. Rate Limiting

A API deve possuir mecanismos de limitação de requisições para reduzir abuso e proteger a disponibilidade da plataforma.

Os limites poderão considerar:

- endereço IP;
- usuário autenticado;
- chave de API, futuramente.

Quando o limite for excedido:

```http
429 Too Many Requests
```

Resposta:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Limite de requisições excedido. Tente novamente em instantes."
  }
}
```

Os limites específicos devem ser configuráveis e ajustados conforme o comportamento da plataforma.

---

# 21. Autenticação

A autenticação da API será baseada em JWT.

Fluxo esperado:

```text
Login
  ↓
JWT
  ↓
Authorization: Bearer <token>
  ↓
API
```

Endpoints públicos podem ser acessados sem autenticação quando não houver necessidade de identificação do usuário.

Recursos protegidos devem exigir autenticação válida.

---

# 22. Autorização

A autorização deve ser aplicada exclusivamente no backend.

O frontend pode ocultar ou desabilitar funcionalidades de acordo com o estado do usuário, mas isso não substitui a validação de autorização realizada pela API.

Exemplos:

- proprietário pode editar sua empresa;
- usuário pode editar apenas sua própria avaliação;
- administrador possui permissões adicionais.

Toda operação protegida deve validar as permissões no backend.

---

# 23. CORS

A API deve aceitar somente origens explicitamente autorizadas.

Em produção:

- não utilizar `*` indiscriminadamente;
- restringir origens aos domínios conhecidos;
- habilitar credenciais somente quando necessário.

As origens permitidas devem ser configuráveis por ambiente.

---

# 24. Observabilidade

A API deve fornecer informações suficientes para diagnóstico e monitoramento das requisições.

Quando aplicável, devem ser registrados:

- método HTTP;
- endpoint;
- código de resposta;
- duração da requisição;
- Request ID;
- identificação do usuário autenticado, quando apropriado;
- origem da requisição, quando necessário.

Informações sensíveis nunca devem ser registradas.

Isso inclui, entre outros:

- senhas;
- tokens;
- chaves privadas;
- dados de autenticação;
- informações pessoais desnecessárias para diagnóstico.

---

# 25. Request ID

Cada requisição deve possuir um identificador de correlação quando suportado pela infraestrutura.

O padrão preferencial é:

```http
X-Request-ID
```

O identificador deve facilitar:

- rastreamento de requisições;
- diagnóstico de erros;
- correlação de logs;
- investigação de incidentes.

Quando o cliente fornecer um identificador válido, a aplicação poderá preservá-lo conforme as regras de segurança.

---

# 26. Documentação

A API deve possuir documentação baseada em OpenAPI utilizando Swagger.

Cada endpoint deve documentar, quando aplicável:

- descrição;
- autenticação;
- parâmetros;
- query parameters;
- DTOs;
- respostas;
- códigos HTTP;
- exemplos de requisição;
- exemplos de resposta.

A documentação deve permanecer sincronizada com a implementação.

---

# 27. Segurança

Toda API deve:

- validar autenticação;
- validar autorização;
- validar payloads;
- validar parâmetros;
- sanitizar entradas quando necessário;
- utilizar HTTPS em ambientes de produção;
- aplicar rate limiting;
- proteger operações de upload;
- evitar exposição de detalhes internos;
- aplicar o princípio do menor privilégio.

As regras detalhadas de segurança devem ser mantidas em documentação específica quando o Guia de Segurança da API for criado.

---

# 28. Convenções Específicas do Bairu

Além das regras gerais de APIs REST, os endpoints do Bairu devem respeitar as seguintes decisões de domínio.

### 28.1. Feed

O Feed é um recurso agregador:

```http
GET /api/v1/feed
```

A resposta do Feed não deve expor diretamente a estrutura das entidades persistidas.

### 28.2. Mídia

Entidades de conteúdo devem armazenar referências às mídias, e não os arquivos diretamente.

### 28.3. Conteúdo público

Endpoints públicos devem retornar somente conteúdos que estejam atualmente elegíveis para publicação.

Isso inclui respeitar:

- status de publicação;
- período de publicação;
- início de vigência;
- expiração;
- demais regras de visibilidade do domínio.

### 28.4. Dados derivados

Campos como:

```text
ratingAverage
ratingCount
```

quando utilizados na API, representam dados derivados mantidos pela entidade de origem definida pelo domínio.

A API não deve permitir edição direta desses valores.

### 28.5. Conteúdo expirado

Conteúdos expirados não devem ser retornados pelos endpoints públicos, salvo quando houver uma regra explícita que determine comportamento diferente.

---

# 29. Decisões Arquiteturais

## 29.1. API como contrato

A API representa o contrato oficial entre frontend e backend.

Alterações internas no domínio, ORM ou banco de dados não devem obrigatoriamente provocar alterações no contrato público.

## 29.2. DTOs como fronteira

DTOs são utilizados como fronteira entre a API e o domínio.

Isso evita que detalhes internos de persistência sejam expostos aos consumidores.

## 29.3. API desacoplada do banco

O modelo de persistência pode evoluir sem necessariamente alterar os contratos públicos.

## 29.4. Segurança por padrão

Autenticação, autorização, validação, rate limiting e proteção da infraestrutura devem ser considerados desde as primeiras versões da API.

## 29.5. Observabilidade desde o início

Logs estruturados, Request ID e documentação automática são considerados parte da infraestrutura da API, e não funcionalidades opcionais.

---

# 30. Evoluções Futuras

A arquitetura deve permitir a adoção futura de mecanismos complementares, quando houver necessidade real, como:

- WebSockets;
- Server-Sent Events (SSE);
- GraphQL;
- Webhooks;
- OAuth 2.0;
- OpenID Connect;
- API Gateway;
- geração automática de SDKs;
- CDN;
- estratégias adicionais de versionamento.

Essas tecnologias não fazem parte do escopo obrigatório do MVP.

Sua adoção deverá ser precedida de uma decisão arquitetural que justifique a necessidade e avalie seus custos de manutenção.

---

# 31. Checklist para Novos Endpoints

Antes de implementar um novo endpoint, verificar:

- [ ] A rota representa um recurso?
- [ ] A versão `/api/v1` está sendo utilizada?
- [ ] O método HTTP corresponde à operação?
- [ ] A rota segue `kebab-case`?
- [ ] Coleções utilizam nomes no plural?
- [ ] Filtros estão em query parameters?
- [ ] Coleções possuem paginação quando necessário?
- [ ] Ordenação utiliza `sortBy` e `sortOrder`?
- [ ] O endpoint possui DTOs próprios?
- [ ] Entidades do ORM não são expostas?
- [ ] Códigos HTTP estão adequados?
- [ ] Erros seguem o contrato padronizado?
- [ ] Autenticação e autorização foram avaliadas?
- [ ] Regras de conteúdo público foram consideradas?
- [ ] Documentação Swagger foi atualizada?
- [ ] Logs e observabilidade foram considerados?
- [ ] Há necessidade de rate limiting específico?
- [ ] Há impacto sobre cache?
- [ ] Há impacto sobre segurança?

---

## 32. Referências

Este documento deve ser utilizado em conjunto com:

- `CON-001` — Convenções Arquiteturais;
- documento de segurança da API, quando criado;
- documentação dos módulos de domínio;
- ADRs relacionados à evolução da arquitetura da API.
