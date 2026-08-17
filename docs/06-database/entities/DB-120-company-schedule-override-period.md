# DB-120 — Company Schedule Override Period

## 1. Objetivo

`CompanyScheduleOverridePeriod` representa um período de funcionamento excepcional associado a uma `CompanyScheduleOverride`.

A entidade permite definir os horários específicos que deverão ser aplicados em uma determinada data quando a empresa possuir uma exceção de funcionamento.

Exemplo:

```
25/12/2026
CompanyScheduleOverride
└── CompanyScheduleOverridePeriod
    ├── 08:00 → 12:00
    └── 13:00 → 16:00
```

A entidade pertence ao contexto Business.

---

## 2. Responsabilidade

`CompanyScheduleOverridePeriod` é responsável por:

- representar um período de funcionamento excepcional;
- associar o período a uma CompanyScheduleOverride;
- definir o horário inicial e final do funcionamento excepcional.

A entidade não é responsável por:

- definir a data da exceção;
- definir se a empresa estará fechada;
- representar a agenda regular;
- representar outras regras de funcionamento da empresa.

Essas responsabilidades pertencem a CompanyScheduleOverride e às entidades da agenda regular.

---

## 3. Estrutura

| Campo                          | Tipo        | Obrigatório | Descrição                         |
| ------------------------------ | ----------- | ----------: | --------------------------------- |
| `id`                           | UUID        |         Sim | Identificador único do registro   |
| `company_schedule_override_id` | UUID        |         Sim | Exceção à qual o período pertence |
| `starts_at`                    | TIME        |         Sim | Horário de início do período      |
| `ends_at`                      | TIME        |         Sim | Horário de término do período     |
| `created_at`                   | TIMESTAMPTZ |         Sim | Momento de criação                |
| `updated_at`                   | TIMESTAMPTZ |         Sim | Momento da última alteração       |

`starts_at` e `ends_at` representam horários locais recorrentes para a data da exceção.

Não representam instantes absolutos e, portanto, não devem ser armazenados como timestamps.

---

## 4. Relacionamentos

A relação principal é:

```
Company
   │
   └── CompanyScheduleOverride
             │
             └──< CompanyScheduleOverridePeriod
```

Uma `CompanyScheduleOverride` pode possuir um ou mais períodos excepcionais.

Cada `CompanyScheduleOverridePeriod` pertence a exatamente uma `CompanyScheduleOverride`.

---

## 5. Constraints

### Primary Key

`PK (id)`

### Foreign Key

```
company_schedule_override_id
    → company_schedule_overrides.id
```

O relacionamento é obrigatório.

### Horário

O período deve obedecer: `starts_at < ends_at`
Um período com horário inicial igual ou posterior ao horário final é inválido.

### Sobreposição

Períodos pertencentes à mesma `CompanyScheduleOverride` não devem se sobrepor.

Exemplo válido:

```
08:00 → 12:00
13:00 → 17:00
```

Exemplo inválido:

```
08:00 → 12:00
11:00 → 15:00
```

Períodos que apenas compartilham o mesmo limite podem coexistir:

```
08:00 → 12:00
12:00 → 18:00
```

A validação de sobreposição será realizada na camada de aplicação no MVP.

---

## 6. Índices

O principal índice será:
`idx_company_schedule_override_periods_override_id`

Esse índice permite recuperar rapidamente todos os períodos associados a uma determinada exceção.

Não devem ser adicionados índices adicionais sem necessidade de consulta identificada.

---

## 7. Estratégia de Exclusão

`CompanyScheduleOverridePeriod` possui ciclo de vida dependente de `CompanyScheduleOverride`.

Quando a exceção for removida, seus períodos também deverão ser removidos.

```
CompanyScheduleOverride
          │
          └── CASCADE
                ↓
CompanyScheduleOverridePeriod
```

A entidade utiliza Hard Delete.

O período não possui significado independente da exceção à qual pertence.

---

## 8. Regras de Domínio

- Um período pertence a apenas uma `CompanyScheduleOverride`.
- Uma exceção pode possuir múltiplos períodos.
- `starts_at` deve ser anterior a `ends_at`.
- Períodos da mesma exceção não podem se sobrepor.
- Os horários representam o funcionamento excepcional da data associada à exceção.
- A entidade não deve ser utilizada para representar horários da agenda regular.
- A entidade não deve representar exceções de outras empresas.

A regra de existência dos períodos depende do estado de `CompanyScheduleOverride`:

```
is_closed = true
    ↓
nenhum período excepcional

is_closed = false
    ↓
pelo menos um período excepcional
```

A validação dessa relação será realizada na camada de aplicação.

---

## 9. Lifecycle

O lifecycle é simples:

```
Criação
   ↓
Período excepcional ativo
   ↓
Alteração
   ↓
Remoção
```

Não há necessidade de:

- `status`;
- `archived_at`;
- `deleted_at`.

O lifecycle do período é determinado pela `CompanyScheduleOverride` à qual pertence.

---

## 10. Decisões Importantes

| Decisão                               | Justificativa                                 |
| ------------------------------------- | --------------------------------------------- |
| Entidade própria                      | Uma exceção pode possuir múltiplos períodos   |
| Relação com `CompanyScheduleOverride` | Mantém separada a exceção de seus horários    |
| `TIME`                                | Representa horário local da data da exceção   |
| Hard Delete                           | O período não possui significado independente |
| Cascade                               | O período depende semanticamente da exceção   |
| Sem `status`                          | O lifecycle é simples e dependente da exceção |
| Sem data própria                      | A data pertence à `CompanyScheduleOverride`   |
| Sem `is_closed`                       | O fechamento é responsabilidade da exceção    |

---

## 11. Relação com Outras Entidades

```
Company
│
├── CompanyBusinessDay
│      └── CompanyBusinessHourPeriod
│
└── CompanyScheduleOverride
       └── CompanyScheduleOverridePeriod
```

A agenda regular continua sendo representada por:

```
CompanyBusinessDay
└── CompanyBusinessHourPeriod
```

As alterações excepcionais são representadas por:

```
CompanyScheduleOverride
└── CompanyScheduleOverridePeriod
```

Essa separação evita modificar a agenda regular para representar situações temporárias.

## 12. Documentação Relacionada

Este documento deve ser utilizado em conjunto com:

- DB-102-company.md — negócio;
- DB-106-company-business-day.md — dia de funcionamento;
- DB-107-company-business-hour-period.md — períodos regulares;
- DB-108-company-schedule-override.md — exceções de funcionamento;
- DB-001-database-architecture.md;
- CON-002-domain-and-data-modeling-conventions.md;
- CON-008-data-lifecycle-and-audit-standards.md.

## 13. Manutenção

Este documento deve ser atualizado quando houver alteração relevante na estrutura ou nas regras dos períodos excepcionais.

Alterações que afetem a interpretação de `CompanyScheduleOverride` ou da agenda da empresa devem ser avaliadas conjuntamente com `DB-108-company-schedule-override.md`.
