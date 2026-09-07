# Username Lifecycle Contract

## 1. Objetivo

Definir o contrato técnico do lifecycle de `Company.username` antes da implementação da funcionalidade.

Este contrato complementa:

- `ADR-009-company-username-lifecycle-and-history.md`;
- `DB-121-company-username-history.md`;
- `DB-102.company.md`;
- `CON-003-rest-api-conventions.md`.

O objetivo é transformar as decisões de produto e banco em regras operacionais determinísticas para domínio, persistência, API e testes.

---

# 2. Princípios

O lifecycle do username deve preservar quatro propriedades:

1. **unicidade do username atual**;
2. **continuidade das URLs públicas**;
3. **prioridade temporária da Company original**;
4. **consistência transacional entre Company e seu histórico**.

`Company.id` continua sendo o identificador interno estável.

`username` continua sendo o identificador público da Company.

`CompanyUsernameHistory` representa somente vínculos históricos e não substitui `Company.id`.

---

# 3. Estado do username

O username atual possui uma única ocupação:

```text
Company.username
```

Um username que deixou de ser utilizado por uma Company pode possuir um ou mais registros históricos ao longo do tempo.

O estado de um registro histórico é derivado dos dados persistidos, conforme definido pelo `DB-121`.

### Registro histórico ainda válido

Um histórico é considerado recuperável/redirecionável quando:

```text
claimed_by_company_id IS NULL
```

e o vínculo ainda não foi perdido.

Durante o cooldown:

```text
now < cooldown_until
```

Após o cooldown:

```text
now >= cooldown_until
```

A diferença é importante:

- durante o cooldown, somente a Company original pode recuperar;
- após o cooldown, outra Company pode reivindicar;
- após a reivindicação, `claimed_by_company_id` deixa de ser `NULL` e o vínculo original é encerrado.

O `DB-121` determina que o estado não seja armazenado em um campo `status` separado.

---

# 4. Operações do lifecycle

O MVP terá quatro operações de domínio:

```text
1. Change Username
2. Recover Username
3. Claim Username
4. Resolve Username
```

A operação `Claim Username` não precisa necessariamente ser um endpoint público separado. Ela representa a regra de domínio aplicada quando uma Company tenta assumir um username disponível.

---

# 5. Change Username

## 5.1. Objetivo

Permitir que o proprietário altere o username atual da própria Company.

Exemplo:

```text
Company A
username = padariacentral
```

altera para:

```text
padariadocentro
```

O username anterior:

```text
padariacentral
```

passa a ser histórico.

---

## 5.2. Pré-condições

A operação exige:

- Company existente;
- usuário autenticado;
- usuário ser proprietário da Company;
- Company estar em estado compatível com alteração;
- novo username ser válido;
- novo username ser diferente do atual;
- novo username estar disponível;
- Company não ter excedido o rate limit.

A autorização do proprietário deve continuar seguindo o mecanismo de `CompanyOwnershipGuard`.

---

## 5.3. Rate limit

A regra definida pelo `ADR-009` é:

```text
1 alteração de username a cada 7 dias
```

O objetivo é evitar alterações repetitivas, abuso do histórico e tentativas de reservar usernames.

O contrato deve considerar que **a alteração somente é contabilizada quando efetivamente concluída**.

Uma tentativa que falha por username indisponível não deve consumir a janela de alteração.

---

# 6. Atomicidade da alteração

A alteração de username deve ser uma única operação transacional.

A transação deve garantir que estas operações ocorram juntas:

```text
BEGIN

1. validar Company
2. validar rate limit
3. validar novo username
4. verificar disponibilidade
5. criar CompanyUsernameHistory
6. atualizar Company.username
7. registrar auditoria

COMMIT
```

Se qualquer etapa falhar:

```text
ROLLBACK
```

Não pode existir estado intermediário em que:

```text
Company.username = novo username
```

mas o username anterior não esteja registrado no histórico.

Também não pode existir o inverso.

O `DB-121` exige explicitamente consistência/atomicidade na liberação do username.

---

# 7. Estrutura criada durante Change Username

Para:

```text
Company A
username = padariacentral
```

alterar para:

```text
padariadocentro
```

deve ser criado:

```text
CompanyUsernameHistory
{
  company_id: A,
  username: "padariacentral",
  released_at: now,
  cooldown_until: now + 30 days,
  claimed_by_company_id: null,
  claimed_at: null
}
```

E somente então:

```text
Company.username = "padariadocentro"
```

O cooldown inicial de 30 dias é definido pelo `ADR-009`.

---

# 8. Disponibilidade do novo username

Um username está indisponível quando:

### Caso 1 — está sendo utilizado atualmente

Existe:

```text
Company.username = requestedUsername
```

Resultado:

```text
409 CONFLICT
```

---

### Caso 2 — está em cooldown para outra Company

Existe histórico correspondente em período de cooldown.

Resultado:

```text
409 CONFLICT
```

---

### Caso 3 — pertence historicamente à própria Company

Se a Company original ainda possuir prioridade sobre o username, a operação deve ser tratada como recuperação, e não como uma nova reivindicação.

---

### Caso 4 — cooldown expirou

O username pode ser reivindicado por outra Company.

Nesse momento, a reivindicação deve encerrar definitivamente a prioridade histórica da Company original.

---

# 9. Claim Username

A reivindicação acontece quando uma Company assume um username histórico cujo cooldown já terminou.

Exemplo:

```text
Company A
    |
    └── padariacentral
            |
            └── liberado
                    |
                    └── cooldown expirou
                            |
                            ▼
                        Company B
```

A operação deve produzir atomicamente:

```text
Company B.username = "padariacentral"

CompanyUsernameHistory(A):
    claimed_by_company_id = B
    claimed_at = now
```

O vínculo de A deixa de ser recuperável.

O `DB-121` determina que a perda seja representada por `claimed_by_company_id`.

---

# 10. Concorrência na reivindicação

Este é um ponto crítico do contrato.

Imagine:

```text
Company B ──┐
            ├── tenta reivindicar "padariacentral"
Company C ──┘
```

As duas requisições podem ocorrer simultaneamente.

O banco deve ser a autoridade final sobre a ocupação do username.

A implementação deve garantir que somente uma delas consiga concluir a operação.

A outra deve receber:

```text
409 CONFLICT
```

Nunca devemos depender apenas de:

```text
SELECT username
```

seguido de:

```text
UPDATE username
```

sem proteção transacional/constritiva.

A unicidade atual continua sendo garantida por `Company.username`, enquanto o histórico não deve possuir `UNIQUE` global.

---

# 11. Recover Username

A Company original pode recuperar um username histórico enquanto o vínculo não tiver sido perdido.

Exemplo:

```text
Company A
    |
    ├── username atual: padariadocentro
    |
    └── histórico: padariacentral
                     |
                     └── cooldown ativo
```

A Company A pode solicitar:

```text
padariacentral
```

e recuperar o username imediatamente.

Não precisa esperar os 30 dias.

## Essa regra está explicitamente definida no `ADR-009` e no `DB-121`.

# 12. Recuperação deve ser transacional

A recuperação deve garantir:

```text
Company.username = historical.username
```

e o encerramento do período de liberação correspondente.

Não deve ser criado um novo histórico para representar a recuperação do mesmo vínculo.

O registro histórico continua representando aquele período de liberação.

---

# 13. Recuperação após reivindicação

Se:

```text
claimed_by_company_id IS NOT NULL
```

a Company original não pode recuperar aquele vínculo.

Resultado:

```text
409 CONFLICT
```

ou outro código específico de domínio, caso posteriormente seja definido um contrato mais granular.

Para o MVP, recomendo `409`, pois a solicitação entra em conflito com o estado atual do recurso.

A convenção REST define `409` para conflitos com o estado atual do recurso.

---

# 14. Resolução pública por username

A resolução pública deve seguir esta ordem:

```text
requested username
        │
        ▼
Company.username
        │
   encontrado?
     /     \
   sim      não
   │         │
  200        ▼
        CompanyUsernameHistory
              │
        encontrado?
          /       \
        não        sim
        │           │
       404          ▼
              claimed_by_company_id?
                 /           \
               sim            não
               │               │
              404              ▼
                         histórico válido
                               │
                              301
```

O comportamento de `301` e `404` é parte explícita do `ADR-009`.

---

# 15. Regra crítica para múltiplos históricos

O `DB-121` permite que o mesmo username apareça em múltiplos registros históricos ao longo do tempo.

Portanto, precisamos de uma regra determinística para resolução.

### Regra proposta

Quando existirem múltiplos históricos para o mesmo username, considerar o registro histórico mais recente pela data de liberação:

```text
ORDER BY released_at DESC
LIMIT 1
```

A resolução desse registro determina o resultado.

Isso evita um problema importante:

```text
Company A
  usa X
  libera X

Company B
  reivindica X
  libera X novamente

Company C
  tenta acessar /X
```

Não devemos voltar para o histórico antigo de A.

Devemos considerar o ciclo mais recente de X.

Essa regra é uma **decisão técnica complementar**, pois o ADR/DB definem que múltiplos históricos podem existir, mas não especificam qual registro deve vencer em uma consulta ambígua.

---

# 16. Redirect histórico

Quando o histórico mais recente estiver válido:

```http
301 Moved Permanently
Location: /<company.username>
```

Exemplo:

```text
/padariacentral
        ↓ 301
/padariadocentro
```

O `DB-121` determina que o redirect histórico seja `301`.

---

# 17. Histórico reivindicado não redireciona

Se:

```text
claimed_by_company_id IS NOT NULL
```

a resolução deve ser:

```http
404 Not Found
```

Nunca:

```text
301 → Company B
```

O motivo é preservar a integridade do link histórico da Company A e evitar que uma URL anteriormente pertencente a A passe silenciosamente a representar B.

---

# 18. Company arquivada

O arquivamento da Company não deve apagar seus históricos.

O `DB-121` determina que o histórico não seja removido automaticamente quando a Company original for arquivada.

Portanto:

```text
Company ARCHIVED
        │
        └── CompanyUsernameHistory
                │
                └── permanece
```

A retenção segue as políticas gerais de lifecycle e auditoria.

---

# 19. API — proposta de contrato

O ADR/DB não definem os endpoints HTTP específicos. Portanto, esta parte é uma proposta técnica para o módulo Company.

## Alterar username

```http
PATCH /api/v1/companies/:id/username
```

Request:

```json
{
  "username": "padariadocentro"
}
```

Response:

```http
200 OK
```

```json
{
  "id": "...",
  "username": "padariadocentro"
}
```

A operação deve ser protegida por:

```text
CompanyOwnershipGuard
```

---

## Recuperar username histórico

Minha recomendação é **não criar inicialmente um endpoint separado**.

Podemos tratar:

```text
PATCH /companies/:id/username
```

com o mesmo username como uma operação de recuperação quando a Company possuir prioridade histórica.

Exemplo:

```json
{
  "username": "padariacentral"
}
```

Isso mantém a API simples e evita duplicar uma operação que, para o proprietário, continua sendo uma alteração do username atual.

---

# 20. Resolução pública

A resolução por username deve existir na camada pública responsável pela URL da Company.

O contrato deve ser:

### Username atual

```http
200 OK
```

### Histórico válido

```http
301 Moved Permanently
Location: /<current-username>
```

### Histórico perdido

```http
404 Not Found
```

### Username inexistente

```http
404 Not Found
```

A convenção REST estabelece `404` para recurso não encontrado.

---

# 21. Erros de domínio

Recomendo adicionar códigos específicos ao `ErrorCode`:

```text
COMPANY_USERNAME_ALREADY_IN_USE
COMPANY_USERNAME_COOLDOWN_ACTIVE
COMPANY_USERNAME_HISTORY_NOT_RECOVERABLE
COMPANY_USERNAME_CHANGE_RATE_LIMITED
```

Podemos manter:

```text
COMPANY_USERNAME_ALREADY_IN_USE
```

para conflitos de disponibilidade atual.

Os demais representam estados diferentes do lifecycle.

Todos devem seguir o contrato:

```json
{
  "error": {
    "code": "COMPANY_USERNAME_COOLDOWN_ACTIVE",
    "message": "Username is temporarily unavailable."
  }
}
```

O `CON-003` estabelece `error.code` como identificador estável para consumo programático.

---

# 22. Rate limit HTTP

Quando a Company ultrapassar:

```text
1 alteração / 7 dias
```

a API deve retornar:

```http
429 Too Many Requests
```

O `CON-003` já define `429` para limite de requisições excedido.

A mensagem/código exato deve ser definido pelo módulo.

Sugestão:

```text
COMPANY_USERNAME_CHANGE_RATE_LIMITED
```

---

# 23. Auditoria

As seguintes operações devem poder gerar eventos de auditoria:

```text
USERNAME_CHANGED
USERNAME_RECOVERED
USERNAME_CLAIMED
USERNAME_HISTORY_LOST
```

A implementação deve utilizar o mecanismo central de auditoria.

O `DB-121` explicitamente coloca criação de histórico, alteração, reclamação e perda de vínculo entre os eventos potencialmente auditáveis.

A implementação da auditoria pode ser integrada posteriormente caso o mecanismo central ainda não esteja disponível.

---

# 24. Regras de transação

As seguintes operações devem ser transacionais:

### Change

```text
create history
+
update Company.username
```

### Recover

```text
update Company.username
+
close historical release period
```

### Claim

```text
claim historical record
+
assign username to new Company
```

A operação não pode produzir estado parcialmente atualizado.

---

# 25. Regras de concorrência

Devemos testar explicitamente:

### Dois usuários tentando assumir o mesmo username

```text
B ──────┐
        ├── username X
C ──────┘
```

Somente um deve vencer.

---

### Dono recuperando enquanto terceiro tenta reivindicar

```text
A ──────┐
        ├── recover X
B ──────┘
        └── claim X
```

A transação deve garantir uma decisão consistente.

Não pode ocorrer:

```text
Company A acredita que recuperou
+
Company B também possui X
```

---

### Alteração simultânea pelo mesmo proprietário

Duas requisições simultâneas de mudança de username não podem criar dois estados inconsistentes ou permitir que o rate limit seja contornado.

---

# 26. Testes obrigatórios

Antes de considerar o lifecycle pronto, devemos cobrir pelo menos:

## Change

- altera username com sucesso;
- cria histórico;
- define `released_at`;
- define `cooldown_until`;
- mantém `Company.id`;
- rejeita username atualmente utilizado;
- rejeita username em cooldown;
- rejeita alteração antes do rate limit;
- permite alteração após 7 dias;
- rollback se a operação falhar.

## Recover

- recupera username durante cooldown;
- recupera username antes do término dos 30 dias;
- não cria histórico adicional;
- rejeita recuperação após claim;
- rejeita recuperação por Company diferente da original.

## Claim

- permite claim após cooldown;
- bloqueia claim durante cooldown;
- registra `claimed_by_company_id`;
- registra `claimed_at`;
- encerra definitivamente o vínculo original;
- impede que Company A recupere depois.

## Resolution

- username atual → `200`;
- histórico válido → `301`;
- histórico reivindicado → `404`;
- username inexistente → `404`;
- múltiplos históricos → resolve pelo ciclo mais recente.

## Concorrência

- duas Companies tentando claim simultaneamente;
- recuperação concorrente com claim;
- duas alterações simultâneas da mesma Company.

---

# 27. O que pertence ao domínio e o que pertence à infraestrutura

### Domínio

O domínio deve decidir:

- se username pode ser alterado;
- se está em cooldown;
- se Company possui prioridade;
- se pode recuperar;
- se pode ser reivindicado;
- se perdeu o vínculo;
- se rate limit permite a operação.

### Persistência

Prisma/DB deve garantir:

- unicidade do username atual;
- foreign keys;
- atomicidade;
- consistência transacional;
- índices.

### API

Controller/DTO deve cuidar de:

- autenticação/autorização;
- validação de entrada;
- códigos HTTP;
- serialização;
- contrato de erro.

### Resolução pública

A camada pública deve decidir:

```text
current → 200
historical valid → 301
historical lost → 404
not found → 404
```

---

# 28. Decisões ainda abertas

Antes da implementação, existem **quatro pontos que eu considero importantes fechar explicitamente**.

### 28.1. Normalização do username

O ADR/DB definem o lifecycle, mas não definem aqui a política de normalização.

Precisamos decidir se:

```text
PadariaCentral
```

é tratado como:

```text
padariacentral
```

e se:

```text
padaria-central
```

possui regras específicas.

Essa decisão deve ser fechada antes da implementação porque afeta disponibilidade e histórico.

---

### 28.2. Fonte do rate limit

O contrato precisa definir como saber:

```text
última alteração de username
```

O `CompanyUsernameHistory` pode fornecer essa informação por `released_at`, mas precisamos definir explicitamente se o rate limit será derivado do histórico ou armazenado em outra estrutura.

Minha recomendação para o MVP:

**derivar do histórico**, evitando uma coluna/entidade adicional enquanto não houver necessidade.

---

### 28.3. Múltiplos históricos do mesmo username

O DB permite múltiplos registros históricos para o mesmo username.

O contrato acima propõe:

```text
ORDER BY released_at DESC
LIMIT 1
```

Precisamos aceitar formalmente essa regra antes de codificar a resolução pública.

---

### 28.4. Status da Company durante alteração

O ADR-009 não define explicitamente se:

```text
ACTIVE
INACTIVE
SUSPENDED
ARCHIVED
```

podem alterar username.

Como já definimos lifecycle da Company, minha recomendação seria:

```text
ACTIVE → pode alterar
INACTIVE → não pode alterar
SUSPENDED → não pode alterar
ARCHIVED → não pode alterar
```

Mas isso é uma **decisão complementar**, não algo que o ADR-009/DB-121 atuais estabeleçam.

---

# 29. Contrato resumido

| Operação                    | Condição                        | Resultado |
| --------------------------- | ------------------------------- | --------- |
| Alterar username            | disponível + rate limit OK      | `200`     |
| Username atual já ocupado   | qualquer Company                | `409`     |
| Username em cooldown        | outra Company                   | `409`     |
| Recuperar histórico próprio | vínculo válido                  | `200`     |
| Recuperar histórico perdido | `claimed_by_company_id != null` | `409`     |
| Claim após cooldown         | disponível                      | sucesso   |
| Claim durante cooldown      | bloqueado                       | `409`     |
| Rate limit excedido         | < 7 dias                        | `429`     |
| Username atual na URL       | encontrado                      | `200`     |
| Username histórico válido   | encontrado                      | `301`     |
| Histórico reivindicado      | encontrado, mas perdido         | `404`     |
| Username inexistente        | nenhum vínculo                  | `404`     |

---

# 30. Regra central

O princípio mais importante para a implementação é:

> **O username atual é uma ocupação única; o histórico representa ciclos anteriores de ocupação; e cada transição entre esses estados deve ser atômica.**

Isso preserva as decisões do `ADR-009` e do `DB-121` sem transformar o histórico em um segundo sistema de identidade.

---

# 31. Próximo passo

Antes de escrever código, devemos fechar os quatro pontos da seção 28:

1. normalização;
2. origem do rate limit;
3. resolução de múltiplos históricos;
4. quais `CompanyStatus` podem alterar username.

Depois disso, o próximo artefato técnico deve ser o **contrato de domínio**, com algo próximo de:

```text
CompanyUsernameService
├── changeUsername()
├── recoverUsername()
├── claimUsername()
└── resolveUsername()
```

e suas invariantes.

Somente depois disso eu partiria para:

```text
Prisma schema
→ migration
→ service
→ controller
→ DTOs
→ tests
→ HTTP/integration tests
```

Assim evitamos implementar primeiro e descobrir depois que alguma regra do lifecycle ficou ambígua.
