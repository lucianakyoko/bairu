# DB-118 — AuditLog

## 1. Objetivo

`AuditLog` registra operações relevantes realizadas sobre dados e recursos da plataforma que necessitem de rastreabilidade.

A entidade pertence à infraestrutura transversal do Bairu e não representa um conceito específico de negócio.

Seu objetivo é permitir identificar:

- qual operação ocorreu;
- qual entidade foi afetada;
- quando ocorreu;
- quem realizou a operação, quando aplicável;
- informações adicionais necessárias para contextualizar a operação.

---

## 2. Responsabilidade

`AuditLog` é responsável por registrar eventos de auditoria relevantes.

Pode registrar operações como:

- criação;
- alteração relevante;
- alteração de status;
- arquivamento;
- restauração;
- exclusão definitiva;
- alteração de permissões;
- ações administrativas;
- operações relacionadas à privacidade.

O `AuditLog` não deve ser utilizado como:

- histórico completo de todas as alterações;
- mecanismo de recuperação de dados;
- cópia das entidades;
- armazenamento indiscriminado de dados pessoais.

---

## 3. Estrutura

Campos previstos para o MVP:

| Campo           | Tipo        | Obrigatório | Descrição                          |
| --------------- | ----------- | ----------: | ---------------------------------- |
| `id`            | UUID        |         Sim | Identificador do evento            |
| `actor_user_id` | UUID        |         Não | Usuário responsável pela operação  |
| `action`        | ENUM        |         Sim | Tipo da operação realizada         |
| `entity_type`   | VARCHAR     |         Sim | Tipo da entidade afetada           |
| `entity_id`     | UUID        |         Sim | Identificador da entidade afetada  |
| `metadata`      | JSONB       |         Não | Informações adicionais da operação |
| `created_at`    | TIMESTAMPTZ |         Sim | Momento em que o evento ocorreu    |

`actor_user_id` é opcional porque determinadas operações podem ser executadas automaticamente pelo sistema.

---

## 4. Actor

`actor_user_id` identifica o usuário responsável pela operação quando houver um usuário envolvido.

Exemplo:

```text
actor_user_id
      ↓
User
```

Para processos automatizados:

```text
actor_user_id = NULL
```

Nesse caso, o contexto da operação deve permitir identificar que a ação foi executada pelo sistema.

---

## 5. Action

`action` representa o tipo de operação registrada.

Os valores iniciais devem ser pequenos e controlados.

Exemplos:

```text
CREATE
UPDATE
ARCHIVE
RESTORE
HARD_DELETE
PERMISSION_CHANGE
PRIVACY_ACTION
```

Esses valores devem ser representados como um enum controlado pelo banco.

Novas ações somente devem ser adicionadas quando existir uma necessidade concreta de auditoria.

Não deve ser criada uma ação específica para cada entidade.

---

## 6. Entity Reference

A entidade afetada é identificada por:

```text
entity_type
entity_id
```

Exemplo:

```text
entity_type = Company
entity_id   = <uuid>
```

ou:

```text
entity_type = CompanyReview
entity_id   = <uuid>
```

Essa abordagem permite que o mecanismo de auditoria seja utilizado por diferentes módulos sem criar uma tabela de auditoria específica para cada entidade.

---

## 7. Foreign Key para Entity

`entity_id` não deve possuir uma Foreign Key direta para uma entidade específica.

Isso ocorre porque `entity_id` pode representar diferentes tipos de entidade conforme o valor de `entity_type`.

A integridade da referência deve ser tratada pela aplicação no momento do registro do evento.

Essa decisão também permite que o `AuditLog` continue existindo depois de um Hard Delete.

---

## 8. Metadata

`metadata` permite armazenar informações adicionais necessárias para contextualizar uma operação.

Exemplos:

```json
{
  "changed_fields": ["status"]
}
```

ou:

```json
{
  "reason": "user_requested_deletion"
}
```

A estrutura deve permanecer pequena e específica para a operação.

O `metadata` não deve armazenar:

- senhas;
- tokens;
- credenciais;
- conteúdo binário;
- dados pessoais desnecessários;
- cópias completas das entidades.

---

## 9. Auditoria de Alterações

Nem toda alteração precisa armazenar o estado anterior e posterior da entidade.

Quando necessário, `metadata` poderá registrar informações como:

```text
changed_fields
```

permitindo identificar quais propriedades foram alteradas sem duplicar toda a entidade.

Operações comuns poderão ser rastreadas apenas pelos campos de auditoria da própria entidade, como `updated_at`, quando isso for suficiente.

---

## 10. Hard Delete

`AuditLog` deve permanecer armazenado mesmo quando a entidade auditada for removida por Hard Delete, desde que exista necessidade legítima de manter o registro da operação.

Exemplo:

```text
Company
   ↓
HARD DELETE

AuditLog
   ↓
HARD_DELETE
   ↓
entity_type = Company
entity_id   = <uuid>
```

O `AuditLog` não deve manter uma cópia dos dados excluídos.

---

## 11. Exclusão

`AuditLog` não deve ser excluído automaticamente junto com a entidade auditada.

Seu lifecycle deve seguir a política de retenção definida para auditoria.

Quando o período de retenção terminar, os registros poderão ser:

- removidos;
- anonimizados, quando aplicável.

A retenção deve considerar requisitos legais, operacionais, de segurança e de privacidade.

---

## 12. Índices

Devem ser criados índices para os principais padrões de consulta de auditoria:

```text
idx_audit_logs_entity
```

para consultas por:

```
(entity_type, entity_id)
idx_audit_logs_actor_user_id
```

para consultas por usuário responsável pela operação.

```
idx_audit_logs_created_at
```

para consultas e ordenação por período.
Esses índices permitem consultas como:

histórico de operações de uma entidade;
ações realizadas por determinado usuário;
eventos ocorridos em determinado período.

Não deve ser criado índice único para `entity_type` + `entity_id`, pois uma mesma entidade pode possuir múltiplos eventos de auditoria.

Índices adicionais deverão ser introduzidos somente conforme os padrões reais de consulta da aplicação administrativa.

---

## 13. Constraints

Devem ser aplicadas:

- `PRIMARY KEY` em `id`;
- `FOREIGN KEY` em `actor_user_id`, quando informado;
- `NOT NULL` em `action`;
- `NOT NULL` em `entity_type`;
- `NOT NULL` em `entity_id`;
- `NOT NULL` em `created_at`;
- valores válidos para `action`.

`actor_user_id` permanece nullable.

A Foreign Key de `actor_user_id` deve utilizar comportamento equivalente a:

```
ON DELETE SET NULL
```

A entidade auditada (`entity_type` + `entity_id`) não possui Foreign Key direta, pois a referência é polimórfica.

Não deve existir `UNIQUE` entre `entity_type` e `entity_id`, pois uma mesma entidade pode possuir diversos eventos de auditoria.

---

## 14. Relacionamento com User

Quando `actor_user_id` for utilizado, ele referencia o usuário que realizou a operação.

```text
User
  │
  │ 1:N
  ▼
AuditLog
```

A relação com `User` deve utilizar uma Foreign Key opcional.

`actor_user_id` é nullable porque operações automáticas podem não possuir um usuário responsável.

Quando o usuário responsável for removido, a referência em `actor_user_id` deve ser definida como `NULL`, preservando o registro de auditoria sem manter uma referência inválida ao usuário removido.

A exclusão de um `User` nunca deve remover automaticamente seus `AuditLog`.

```text
User
  │
  │ 1:N
  ▼
AuditLog
```

A relação deve utilizar comportamento equivalente a: `ON DELETE SET NULL`
Isso permite preservar a existência do evento de auditoria sem transformar o AuditLog em dependência de lifecycle do usuário.

---

## 15. Lifecycle

O lifecycle de um `AuditLog` é simples:

```text
Operation
    ↓
AuditLog created
    ↓
Retention period
    ↓
Deleted / Anonymized
```

Um evento de auditoria, uma vez registrado, não deve ser utilizado como registro mutável da entidade auditada.

Alterações posteriores no `AuditLog` devem ser excepcionais e justificadas.

---

## 16. Segurança e Privacidade

O `AuditLog` pode conter informações sensíveis sobre operações realizadas na plataforma.

Seu acesso deve ser restrito a usuários ou processos autorizados.

O sistema deve evitar registrar informações desnecessárias.

Especialmente, não devem ser armazenados:

- senhas;
- tokens de autenticação;
- chaves privadas;
- credenciais;
- dados pessoais sem finalidade de auditoria;
- conteúdo integral de entidades.

A auditoria deve registrar **o contexto necessário**, e não reproduzir os dados da aplicação.

---

## 17. Dados Derivados

`AuditLog` não possui dados derivados no MVP.

Cada registro representa diretamente um evento de auditoria ocorrido.

---

## 18. Decisões Importantes

| Decisão                                     | Justificativa                                                    |
| ------------------------------------------- | ---------------------------------------------------------------- |
| `AuditLog` é transversal                    | Auditoria atende diferentes módulos                              |
| Entidade e ID são armazenados separadamente | Permite auditar diferentes tipos de entidade                     |
| `actor_user_id` é nullable                  | Processos automáticos podem gerar eventos                        |
| `metadata` utiliza JSONB                    | Permite contexto adicional sem alterar o schema para cada evento |
| Não copiar entidades inteiras               | Reduz duplicação e exposição de dados                            |
| AuditLog sobrevive ao Hard Delete           | Permite preservar a rastreabilidade da operação                  |
| Sem histórico completo por padrão           | Evita crescimento desnecessário do armazenamento                 |
| Retenção própria                            | Auditoria possui lifecycle diferente das entidades de negócio    |

---

## 19. Relação com Outras Convenções

Este documento deve ser utilizado em conjunto com:

- `CON-001-architecture-conventions.md`;
- `CON-002-domain-and-data-modeling-conventions.md`;
- `CON-008-data-lifecycle-and-audit-standards.md`;
- documentação das entidades auditadas.

As regras gerais de auditoria, retenção, privacidade e lifecycle não devem ser duplicadas neste documento.

---

## 20. Manutenção

Este documento deve ser atualizado quando houver alteração relevante na estratégia de auditoria da plataforma.

Novos tipos de operação devem ser adicionados somente quando houver necessidade concreta de rastreabilidade.

Mudanças significativas na política de auditoria ou retenção devem ser registradas também como ADR.
