# API-002 — Company Module

## 1. Objetivo

Este documento registra o estado atual da implementação do módulo `Company` na API do Bairu.

O objetivo é fornecer uma referência rápida e confiável sobre:

- responsabilidades atuais do módulo;
- endpoints disponíveis;
- regras de negócio implementadas;
- ciclo de vida de uma Company;
- controle de acesso;
- contratos de entrada e saída;
- tratamento de erros;
- estratégia atual de testes;
- limitações conhecidas;
- funcionalidades ainda não implementadas;
- próximos passos previstos para evolução do módulo.

Este documento descreve principalmente o estado da **API/backend**. Decisões arquiteturais e de domínio mais amplas permanecem documentadas nos respectivos ADRs e documentos de banco de dados.

---

## 2. Escopo atual

O módulo `Company` representa empresas e profissionais que podem ser apresentados publicamente no Bairu.

A implementação atual contempla:

- criação de Company;
- consulta pública de Company;
- atualização de dados básicos;
- desativação voluntária pelo proprietário;
- reativação voluntária pelo proprietário;
- arquivamento pelo proprietário;
- suspensão administrativa;
- restauração administrativa;
- controle de propriedade;
- controle de acesso administrativo;
- validação dos DTOs;
- proteção de campos que não podem ser alterados pelo endpoint de atualização;
- tratamento padronizado de erros;
- testes unitários e de integração HTTP.

O módulo ainda não contempla todo o domínio de Company previsto para o produto.

Funcionalidades como categorias, horários, catálogo, conteúdo, avaliações, favoritos, mídia e outros relacionamentos fazem parte da evolução futura do domínio.

---

# 3. Estrutura atual

A implementação está localizada principalmente em:

```text
apps/api/src/modules/company/
```

Estrutura conceitual atual:

```text
company/
├── admin/
│   └── admin-company.controller.ts
├── dto/
│   ├── company-response.dto.ts
│   ├── company-status-response.dto.ts
│   ├── create-company.dto.ts
│   └── update-company.dto.ts
├── enums/
│   ├── company-person-type.enum.ts
│   └── company-status.enum.ts
├── company.controller.ts
├── company.service.ts
└── company.module.ts
```

O controle de segurança utilizado pelo módulo está separado em:

```text
apps/api/src/common/security/
```

Incluindo atualmente:

- `CompanyOwnershipGuard`;
- `AdminGuard`;
- `PasswordService`;
- `CurrentUserService` para identidade temporária de desenvolvimento.

---

# 4. Responsabilidades do módulo

O módulo `Company` é responsável por coordenar as operações relacionadas ao agregado Company na camada HTTP da API.

Entre suas responsabilidades atuais estão:

1. receber e validar dados de entrada;
2. executar regras de negócio relacionadas ao ciclo de vida da Company;
3. garantir que operações privadas sejam executadas pelo proprietário correto;
4. garantir que operações administrativas sejam executadas por usuários administradores ativos;
5. retornar contratos de resposta públicos e controlados;
6. traduzir determinadas condições de domínio e banco para erros da API;
7. impedir exposição acidental de campos internos através dos Response DTOs.

O módulo não deve assumir responsabilidades de autenticação, gerenciamento de mídia, categorias, avaliações ou outros domínios que serão implementados separadamente.

---

# 5. Identidade pública

A Company possui um `username` como identificador público.

O username é único no banco de dados e faz parte da identidade pública da Company.

A decisão de utilizar `username` em vez de `slug` está documentada em:

- `ADR-008-companypublicidentifier-username-instead-of-slug.md`

O ciclo de vida específico do username está documentado em:

- `ADR-009-company-username-lifecycle-and-history.md`

A implementação atual permite definir o username durante a criação da Company.

Alterações posteriores de username ainda não fazem parte do fluxo atual de atualização e serão implementadas em uma etapa específica do módulo.

---

# 6. Modelo de status

A Company possui quatro estados de ciclo de vida:

```text
ACTIVE
INACTIVE
SUSPENDED
ARCHIVED
```

## 6.1 ACTIVE

Estado normal de uma Company disponível publicamente.

Companies nesse estado:

- podem ser encontradas pela API pública;
- podem ser atualizadas pelo proprietário;
- podem ser desativadas pelo proprietário;
- podem ser arquivadas pelo proprietário;
- podem ser suspensas administrativamente.

---

## 6.2 INACTIVE

Estado utilizado quando o proprietário desativa temporariamente a Company.

Uma Company `INACTIVE`:

- não é apresentada pela consulta pública atual;
- pode ser reativada pelo proprietário;
- pode ser arquivada pelo proprietário;
- pode ser suspensa administrativamente.

---

## 6.3 SUSPENDED

Estado administrativo utilizado quando a Company precisa ser retirada da operação por uma ação administrativa.

Uma Company `SUSPENDED`:

- não é apresentada pela consulta pública;
- não pode ser reativada pelo fluxo normal do proprietário;
- pode ser restaurada por um administrador.

---

## 6.4 ARCHIVED

Estado persistente utilizado para representar uma Company arquivada.

O arquivamento não representa exclusão física do registro.

Uma Company `ARCHIVED`:

- permanece armazenada no banco;
- não é apresentada pela consulta pública;
- não pode ser reativada pelo proprietário;
- pode ser restaurada por um administrador.

O arquivamento também não altera a identidade pública da Company.

Em particular, o arquivamento:

- não altera o username;
- não cria histórico de username;
- não libera o username;
- não modifica a identidade pública da Company.

---

# 7. Transições de status

As transições atualmente implementadas são:

```text
ACTIVE
  ├── deactivate ──→ INACTIVE
  ├── archive ─────→ ARCHIVED
  └── suspend ─────→ SUSPENDED

INACTIVE
  ├── reactivate ──→ ACTIVE
  ├── archive ─────→ ARCHIVED
  └── suspend ─────→ SUSPENDED

SUSPENDED
  └── restore ─────→ ACTIVE

ARCHIVED
  └── restore ─────→ ACTIVE
```

Transições não previstas são rejeitadas pela API.

Por exemplo:

```text
SUSPENDED → INACTIVE
SUSPENDED → ARCHIVED
ARCHIVED  → INACTIVE
ARCHIVED  → SUSPENDED
```

não fazem parte do ciclo de vida atual.

---

# 8. Endpoints públicos

## 8.1 Criar Company

```http
POST /api/v1/companies
```

Cria uma Company associada ao usuário atualmente identificado.

O proprietário é obtido através do mecanismo de identidade atual da aplicação.

### Entrada

`CreateCompanyDto`

Campos atualmente aceitos:

- `name`
- `username`
- `personType`
- `description`
- `document`
- `phone`
- `email`
- `profileMediaId`
- `coverMediaId`

Campos opcionais podem ser omitidos.

### Resposta

```http
201 Created
```

Retorna `CompanyResponseDto`.

### Regras relevantes

O username deve ser único.

Caso o username já esteja em uso:

```text
HTTP 409
COMPANY_USERNAME_ALREADY_IN_USE
```

---

# 9. Consultar Company

```http
GET /api/v1/companies/:id
```

Este endpoint representa a consulta pública de uma Company.

A consulta pública atualmente considera somente Companies com status:

```text
ACTIVE
```

Portanto:

| Status      | Resultado       |
| ----------- | --------------- |
| ACTIVE      | `200 OK`        |
| INACTIVE    | `404 Not Found` |
| SUSPENDED   | `404 Not Found` |
| ARCHIVED    | `404 Not Found` |
| inexistente | `404 Not Found` |

A decisão de utilizar `404` para Companies que não estão publicamente disponíveis evita expor através deste endpoint público informações sobre Companies suspensas, arquivadas ou inativas.

### Resposta

```http
200 OK
```

Retorna `CompanyResponseDto`.

---

# 10. Atualizar Company

```http
PATCH /api/v1/companies/:id
```

Endpoint privado destinado ao proprietário da Company.

A rota é protegida pelo:

```text
CompanyOwnershipGuard
```

### Campos atualmente alteráveis

- `name`
- `description`
- `phone`
- `email`
- `profileMediaId`
- `coverMediaId`

O endpoint exige pelo menos um campo válido para atualização.

### Campos deliberadamente não alteráveis

O endpoint não permite alterar:

- `username`
- `personType`
- `document`
- `status`
- `ownerUserId`

Essa separação é intencional.

Alterações de username possuem regras próprias e serão implementadas através de um fluxo específico.

O status também possui endpoints específicos para representar corretamente as transições de ciclo de vida.

---

# 11. Operações do proprietário

As operações de ciclo de vida disponíveis ao proprietário são protegidas pelo `CompanyOwnershipGuard`.

## 11.1 Desativar

```http
POST /api/v1/companies/:id/deactivate
```

Transição:

```text
ACTIVE → INACTIVE
```

Retorna:

```http
200 OK
```

---

## 11.2 Reativar

```http
POST /api/v1/companies/:id/reactivate
```

Transição:

```text
INACTIVE → ACTIVE
```

Retorna:

```http
200 OK
```

---

## 11.3 Arquivar

```http
POST /api/v1/companies/:id/archive
```

Transições permitidas:

```text
ACTIVE   → ARCHIVED
INACTIVE → ARCHIVED
```

O arquivamento é realizado através de uma atualização condicional no banco.

A operação só altera o registro quando:

- a Company existe;
- pertence ao usuário proprietário;
- seu status atual é `ACTIVE` ou `INACTIVE`.

Essa abordagem evita uma condição de corrida na qual o status pudesse ser alterado entre uma leitura e a atualização.

Caso a Company não pertença ao usuário ou não exista, a API retorna:

```text
COMPANY_NOT_FOUND
```

Caso exista, pertença ao usuário, mas esteja em um estado incompatível:

```text
COMPANY_INVALID_STATUS_TRANSITION
```

---

# 12. Operações administrativas

As operações administrativas ficam separadas das operações do proprietário.

As rotas administrativas utilizam:

```text
AdminGuard
```

O `AdminGuard` exige que o usuário atual:

- exista;
- possua `role = ADMIN`;
- possua `status = ACTIVE`.

---

## 12.1 Suspender Company

```http
POST /api/v1/admin/companies/:id/suspend
```

Transições permitidas:

```text
ACTIVE   → SUSPENDED
INACTIVE → SUSPENDED
```

Retorna:

```http
200 OK
```

---

## 12.2 Restaurar Company

```http
POST /api/v1/admin/companies/:id/restore
```

Transições permitidas:

```text
SUSPENDED → ACTIVE
ARCHIVED  → ACTIVE
```

Retorna:

```http
200 OK
```

A restauração administrativa não representa simplesmente uma reversão do último estado.

A regra atual é explícita:

```text
SUSPENDED → ACTIVE
ARCHIVED  → ACTIVE
```

---

# 13. Controle de propriedade

Operações privadas da Company utilizam:

```text
CompanyOwnershipGuard
```

Atualmente o guard:

1. obtém o `companyId` da rota;
2. valida o UUID;
3. obtém o usuário atual;
4. consulta o proprietário da Company;
5. compara `ownerUserId` com o usuário atual;
6. permite ou bloqueia a operação.

Quando o usuário não é proprietário, a API retorna:

```http
403 Forbidden
```

A ausência da Company ou a ausência de propriedade não é diferenciada pelo guard para o cliente.

Isso evita transformar o guard em uma fonte adicional de enumeração de recursos.

---

# 14. Identidade atual do usuário

A API ainda utiliza um mecanismo temporário de identidade para desenvolvimento:

```text
CurrentUserService
```

A implementação atual utiliza:

```text
DEV_USER_ID
```

como identificação do usuário.

Esse mecanismo não representa a autenticação definitiva do Bairu.

Ele existe para permitir que os módulos e os fluxos de autorização sejam desenvolvidos antes da integração do mecanismo real de autenticação.

Portanto, esta implementação deve ser considerada temporária e não deve ser utilizada como solução de autenticação em produção.

---

# 15. DTOs

## 15.1 CreateCompanyDto

Responsável pela validação da criação.

Principais validações:

- `name`: string entre 2 e 150 caracteres;
- `username`: string entre 3 e 30 caracteres;
- `personType`: enum válido;
- `description`: opcional, entre 10 e 1000 caracteres;
- `email`: opcional e validado como email;
- `profileMediaId`: UUID opcional;
- `coverMediaId`: UUID opcional.

---

## 15.2 UpdateCompanyDto

Representa os campos que podem ser alterados pelo proprietário.

O DTO também utiliza a validação:

```text
AtLeastOneField
```

para impedir requisições de atualização vazias.

---

## 15.3 CompanyResponseDto

É o contrato público principal de Company.

O DTO utiliza `class-transformer` com:

```text
@Exclude()
@Expose()
```

para controlar explicitamente os campos retornados.

Entre os campos expostos estão:

- `id`
- `username`
- `personType`
- `name`
- `description`
- `phone`
- `email`
- `profileMediaId`
- `coverMediaId`
- `status`
- `createdAt`
- `updatedAt`

Campos internos, como `ownerUserId` e `document`, não são expostos pelo contrato público.

---

## 15.4 CompanyStatusResponseDto

Utilizado nas operações de ciclo de vida.

Retorna somente:

```text
id
status
```

Isso evita retornar o objeto completo da Company quando a operação realizada altera somente o status.

---

# 16. Tratamento de erros

A API utiliza:

```text
AppException
```

para erros de domínio conhecidos.

O formato padronizado é:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message."
  }
}
```

O código do erro é tratado como identificador estável para consumo da aplicação.

Mensagens são destinadas à apresentação e diagnóstico e não devem ser utilizadas como identificadores de lógica.

---

# 17. Erros atualmente definidos para Company

Entre os códigos atualmente utilizados estão:

```text
COMPANY_NOT_FOUND
COMPANY_USERNAME_ALREADY_IN_USE
COMPANY_INVALID_STATUS_TRANSITION
```

Também existe o erro genérico:

```text
INTERNAL_SERVER_ERROR
```

para falhas não tratadas.

---

# 18. Integração com Prisma

Erros específicos do Prisma são tratados na camada de serviço somente quando existe uma tradução de domínio/API apropriada.

Atualmente isso inclui, principalmente:

```text
P2002
```

para conflito de username.

A identificação dos campos envolvidos na constraint é isolada em:

```text
prisma-error.utils.ts
```

Essa separação evita espalhar detalhes do Prisma pelo domínio da aplicação.

---

# 19. Segurança e autorização

O módulo atualmente possui dois níveis principais de autorização.

### Proprietário

Utiliza:

```text
CompanyOwnershipGuard
```

Aplicado a:

```text
PATCH /companies/:id
POST  /companies/:id/deactivate
POST  /companies/:id/reactivate
POST  /companies/:id/archive
```

### Administrador

Utiliza:

```text
AdminGuard
```

Aplicado a:

```text
POST /admin/companies/:id/suspend
POST /admin/companies/:id/restore
```

A separação entre autorização do proprietário e autorização administrativa é intencional.

O módulo não utiliza o `CompanyService` como substituto para autorização HTTP.

---

# 20. Estratégia de testes

O módulo possui cobertura em diferentes níveis.

## 20.1 Testes unitários do serviço

O `CompanyService` possui testes para:

- criação;
- username duplicado;
- consulta;
- atualização;
- validação de transições;
- desativação;
- reativação;
- arquivamento;
- suspensão;
- restauração.

---

## 20.2 Testes dos guards

O `CompanyOwnershipGuard` possui testes para:

- proprietário autorizado;
- usuário não proprietário;
- Company inexistente;
- UUID inválido.

O `AdminGuard` possui testes para:

- administrador ativo autorizado;
- usuário não administrador;
- administrador inativo.

---

## 20.3 Testes dos DTOs

Os DTOs possuem testes específicos para:

- criação;
- atualização;
- resposta pública;
- resposta de status.

---

## 20.4 Testes HTTP

A API possui testes HTTP através de `supertest`.

Os testes cobrem atualmente:

- criação;
- consulta pública;
- UUID inválido;
- Company inexistente;
- Company `INACTIVE`;
- Company `SUSPENDED`;
- Company `ARCHIVED`;
- atualização;
- tentativa de atualização por não proprietário;
- campos protegidos;
- desativação;
- reativação;
- arquivamento;
- suspensão administrativa;
- restauração administrativa;
- acesso administrativo não autorizado.

---

# 21. Estado atual dos testes

No estado atual do projeto, a suíte completa está passando.

API:

```text
Test Suites: 13 passed, 13 total
Tests:       78 passed, 78 total
Snapshots:   0 total
```

Web:

```text
Test Files: 2 passed
Tests:      7 passed
```

Execução pela raiz do monorepo:

```text
Tasks: 2 successful, 2 total
```

A API utiliza atualmente execução serial dos testes Jest devido ao compartilhamento do banco de dados de testes entre os arquivos de integração.

Essa configuração evita condições de corrida entre testes que executam limpeza e criação de registros no mesmo banco.

A estratégia pode ser revisitada no futuro caso a suíte cresça a ponto de o tempo de execução justificar isolamento por worker, schema ou banco.

---

# 22. Infraestrutura de testes

A API possui uma aplicação NestJS específica para testes HTTP, incluindo:

- `ValidationPipe`;
- `GlobalExceptionFilter`;
- prefixo global `/api/v1`;
- inicialização completa do `AppModule`.

Os testes de integração utilizam banco PostgreSQL de testes.

Factories são utilizadas para criação de entidades de teste, incluindo:

```text
user.factory.ts
company.factory.ts
```

A limpeza do banco é centralizada em:

```text
src/test/database/clean-database.ts
```

---

# 23. O que ainda não faz parte do módulo

O estado atual não deve ser interpretado como a implementação completa do domínio Company.

Ainda estão previstos, entre outros:

- alteração de username;
- histórico de username;
- política de cooldown para username;
- rate limiting relacionado a username;
- fluxo transacional para mudança de username;
- regras específicas de documento;
- integração completa com o domínio de mídia;
- categorias;
- horários de funcionamento;
- catálogo;
- links externos;
- conteúdo;
- oportunidades;
- avaliações;
- favoritos;
- auditoria;
- outras relações previstas no modelo de dados.

Essas funcionalidades devem ser implementadas incrementalmente e respeitando a separação de domínios.

---

# 24. Próxima evolução: Username Lifecycle

O próximo passo planejado para o módulo Company é a implementação do ciclo de vida do username.

Essa etapa deve ser tratada separadamente da atualização comum da Company porque o username possui características de identidade pública.

A implementação deverá considerar as decisões já registradas em:

```text
ADR-008-companypublicidentifier-username-instead-of-slug.md
ADR-009-company-username-lifecycle-and-history.md
```

e o modelo:

```text
DB-121-company-username-history.md
```

A mudança de username deverá ser implementada como uma operação própria, e não adicionada simplesmente ao `UpdateCompanyDto`.

Os pontos previstos incluem:

- endpoint dedicado;
- validação do novo username;
- garantia de unicidade;
- política de alteração;
- cooldown;
- proteção contra abuso;
- registro em `CompanyUsernameHistory`;
- operação transacional;
- definição clara de quando o username antigo deixa de estar disponível;
- preservação da consistência da identidade pública.

A implementação deve ser precedida pela revisão conjunta do `ADR-009` e do modelo `DB-121`, garantindo que a implementação da API siga exatamente as regras de domínio já definidas.

---

# 25. Itens conscientemente adiados

Algumas decisões foram identificadas durante a implementação, mas não fazem parte do escopo atual.

## 25.1 Autenticação definitiva

O `CurrentUserService` continuará sendo temporário até a implementação do mecanismo real de autenticação.

## 25.2 Histórico completo do ciclo de vida

Atualmente o status atual é persistido, mas não existe ainda um histórico completo das transições de Company.

## 25.3 Auditoria

Operações administrativas importantes poderão futuramente gerar registros em `AuditLog`.

## 25.4 Logging estruturado

O tratamento atual ainda utiliza mecanismos básicos de logging e deverá evoluir para observabilidade estruturada.

## 25.5 Isolamento avançado de testes

A suíte atualmente utiliza execução serial para proteger o banco compartilhado.

Uma estratégia mais sofisticada poderá ser adotada posteriormente se o crescimento da suíte justificar.

---

# 26. Decisões arquiteturais relacionadas

A implementação atual do Company está relacionada aos seguintes documentos:

### Arquitetura e engenharia

```text
03-engineering/ENG-007-testing-strategy.md
03-engineering/ENG-008-backend-architecture.md
```

### Banco de dados

```text
06-database/entities/DB-102.company.md
06-database/entities/DB-121-company-username-history.md
```

### Decisões arquiteturais

```text
09-decisions/ADR-007-company-lifecycle-and-domain-rules.md
09-decisions/ADR-008-companypublicidentifier-username-instead-of-slug.md
09-decisions/ADR-009-company-username-lifecycle-and-history.md
```

### Convenções

```text
10-conventions/CON-003-rest-api-conventions.md
10-conventions/CON-008-data-lifecycle-and-audit-standards.md
```

---

# 27. Estado resumido

Para uma consulta rápida:

| Área                            | Estado                                   |
| ------------------------------- | ---------------------------------------- |
| Criação de Company              | Implementado                             |
| Consulta pública                | Implementado                             |
| Atualização básica              | Implementado                             |
| Controle de proprietário        | Implementado                             |
| Desativação                     | Implementado                             |
| Reativação                      | Implementado                             |
| Arquivamento                    | Implementado                             |
| Suspensão administrativa        | Implementado                             |
| Restauração administrativa      | Implementado                             |
| ACTIVE-only na consulta pública | Implementado                             |
| Response DTOs                   | Implementado                             |
| Error contract                  | Implementado                             |
| Testes unitários                | Implementado                             |
| Testes HTTP                     | Implementado                             |
| Execução da suíte no monorepo   | Implementado                             |
| Autenticação definitiva         | Pendente                                 |
| Alteração de username           | Próximo passo                            |
| Username history                | Modelo definido / implementação pendente |
| Cooldown de username            | Pendente                                 |
| Auditoria de lifecycle          | Pendente                                 |
| Mídia                           | Pendente                                 |
| Categorias                      | Pendente                                 |
| Horários                        | Pendente                                 |
| Catálogo                        | Pendente                                 |
| Avaliações                      | Pendente                                 |
| Favoritos                       | Pendente                                 |

---

# 28. Conclusão

O módulo `Company` encontra-se atualmente em um estado funcional inicial e consistente para servir como base para a evolução do Bairu.

A API já possui:

- criação e atualização controladas;
- identificação pública por username;
- ciclo de vida explícito;
- separação entre operações do proprietário e administrativas;
- consulta pública protegida por status;
- contratos de resposta;
- tratamento padronizado de erros;
- testes unitários;
- testes de integração;
- infraestrutura de testes integrada ao monorepo.

O próximo incremento recomendado é implementar o **Username Lifecycle**, mantendo-o como uma responsabilidade específica dentro do domínio Company.

Após essa etapa, o módulo poderá avançar progressivamente para os demais subdomínios relacionados à presença pública da Company, sem transformar o `CompanyService` em um ponto de acoplamento excessivo entre todos os recursos do produto.
