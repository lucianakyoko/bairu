# DB-106 — Company Business Day

## 1. Objetivo

`CompanyBusinessDay` representa a configuração de funcionamento de um determinado dia da semana para uma `Company`.

A entidade define se o negócio possui funcionamento regular naquele dia e serve como base para os períodos de horário representados por `CompanyBusinessHourPeriod`.

---

## 2. Responsabilidade

`CompanyBusinessDay` é responsável por:

- representar um dia da semana na agenda regular do negócio;
- indicar se o negócio funciona naquele dia;
- estabelecer a relação entre o negócio e seus períodos de funcionamento;
- servir como referência para exceções de agenda.

A entidade não representa horários específicos. Os horários pertencem a `CompanyBusinessHourPeriod`.

---

## 3. Estrutura

| Campo         | Tipo        | Obrigatório | Descrição                       |
| ------------- | ----------- | ----------: | ------------------------------- |
| `id`          | UUID        |         Sim | Identificador único do registro |
| `company_id`  | UUID        |         Sim | Empresa à qual o dia pertence   |
| `day_of_week` | `DayOfWeek` |         Sim | Dia da semana representado      |
| `created_at`  | DateTime    |         Sim | Data e hora de criação          |
| `updated_at`  | DateTime    |         Sim | Data e hora da última alteração |

O campo `day_of_week` representa o dia da semana da agenda regular.

---

## 4. Enum `DayOfWeek`

`DayOfWeek` é um ENUM controlado pelo domínio.

Valores:

```text
MONDAY
TUESDAY
WEDNESDAY
THURSDAY
FRIDAY
SATURDAY
SUNDAY
```

Não deve existir uma tabela própria para representar os dias da semana.

A utilização de ENUM segue as convenções definidas em `CON-002-domain-and-data-modeling-conventions.md`.

---

## 5. Relacionamentos

### Company

Cada `CompanyBusinessDay` pertence obrigatoriamente a uma `Company`.

```text
Company
   │
   └── CompanyBusinessDay
```

Uma empresa pode possuir, no máximo, uma configuração regular para cada dia da semana.

### CompanyBusinessHourPeriod

Um `CompanyBusinessDay` pode possuir zero ou vários períodos de funcionamento.

```text
CompanyBusinessDay
        │
        └──< CompanyBusinessHourPeriod
```

A entidade `CompanyBusinessHourPeriod` será responsável por representar os horários propriamente ditos.

---

## 6. Constraints

### Primary Key

```text
PK (id)
```

### Foreign Key

```text
company_id → companies.id
```

O relacionamento com `Company` é obrigatório.

### Unique

Uma empresa não pode possuir duas configurações para o mesmo dia da semana:

```text
UNIQUE (company_id, day_of_week)
```

Exemplo válido:

```text
Company A
├── MONDAY
├── TUESDAY
├── WEDNESDAY
├── THURSDAY
└── FRIDAY
```

Exemplo inválido:

```text
Company A
├── MONDAY
└── MONDAY
```

---

## 7. Índices

A constraint:

```text
UNIQUE (company_id, day_of_week)
```

---

## 8. Regras de Domínio

- Cada registro representa um único dia da semana para uma empresa.
- Uma empresa pode possuir configuração para cada um dos sete dias da semana.
- Uma empresa não pode possuir duas configurações para o mesmo dia.
- Um `CompanyBusinessDay` representa um dia incluído na agenda regular da empresa.
- Um dia sem `CompanyBusinessDay` não possui funcionamento regular configurado.
- Um `CompanyBusinessDay` deve possuir pelo menos um `CompanyBusinessHourPeriod`.
- Os horários pertencem a `CompanyBusinessHourPeriod`.
- A existência de `CompanyBusinessDay` não significa necessariamente que o negócio esteja aberto naquele momento.
- Exceções ao funcionamento regular pertencem a `CompanyScheduleOverride`.

O comportamento exato de um dia sem períodos de horário deverá ser definido em conjunto com a modelagem de `CompanyBusinessHourPeriod`.

---

## 9. Estratégia de Exclusão

`CompanyBusinessDay` utiliza **Hard Delete**.

A configuração representa parte da agenda regular da empresa e não possui necessidade de histórico próprio no MVP.

Quando uma `Company` for removida, seus registros de
`CompanyBusinessDay` deverão ser removidos automaticamente.

A relação `Company → CompanyBusinessDay` utilizará `ON DELETE CASCADE`.

Quando um `CompanyBusinessDay` for removido, seus
`CompanyBusinessHourPeriod` associados também deverão ser removidos
automaticamente.

A relação `CompanyBusinessDay → CompanyBusinessHourPeriod` utilizará
`ON DELETE CASCADE`.

Soft Delete não é necessário.

---

## 10. Dados Derivados

`CompanyBusinessDay` não possui dados derivados.

O estado de funcionamento do negócio deve ser determinado a partir:

```text
CompanyBusinessDay
        │
        └── CompanyBusinessHourPeriod
```

e, quando aplicável:

```text
CompanyScheduleOverride
```

---

## 11. Decisões

| Decisão                              | Justificativa                                                            |
| ------------------------------------ | ------------------------------------------------------------------------ |
| Entidade própria                     | O dia possui relação e configuração próprias dentro da agenda da empresa |
| `DayOfWeek` como ENUM                | Conjunto pequeno, estável e controlado                                   |
| Uma configuração por dia             | Evita duplicidade estrutural                                             |
| Horários em entidade separada        | Permite múltiplos períodos no mesmo dia                                  |
| Hard Delete                          | A configuração não possui histórico próprio no MVP                       |
| Sem `is_open`                        | O comportamento pode ser determinado pela existência dos períodos        |
| Sem horários diretamente na entidade | Separa dia de funcionamento dos períodos de horário                      |

---

## 12. Exemplo

Uma empresa que funciona de segunda a sexta poderia possuir:

```text
Company
│
├── CompanyBusinessDay
│   └── MONDAY
│
├── CompanyBusinessDay
│   └── TUESDAY
│
├── CompanyBusinessDay
│   └── WEDNESDAY
│
├── CompanyBusinessDay
│   └── THURSDAY
│
└── CompanyBusinessDay
    └── FRIDAY
```

Os horários de cada dia serão representados posteriormente por:

```text
CompanyBusinessDay
        │
        └── CompanyBusinessHourPeriod
```

Por exemplo, um mesmo dia poderá futuramente possuir:

```text
MONDAY
├── 08:00 → 12:00
└── 13:00 → 18:00
```

---

## 13. Relação com Outras Entidades

```text
Company
   │
   └── CompanyBusinessDay
          │
          └── CompanyBusinessHourPeriod

Company
   │
   └── CompanyScheduleOverride
```

`CompanyBusinessDay` representa a configuração regular.

`CompanyBusinessHourPeriod` representa os períodos dentro dessa configuração.

`CompanyScheduleOverride` representa exceções à agenda regular.

---

## 14. Relação com Outras Convenções

Este documento deve ser utilizado em conjunto com:

- `CON-001-architecture-conventions.md`;
- `CON-002-domain-and-data-modeling-conventions.md`;
- `CON-008-data-lifecycle-and-audit-standards.md`;
- `DB-001-database-architecture.md`;
- `DB-102-company.md`;
- `DB-107-company-business-hour-period.md`;
- `DB-108-company-schedule-override.md`.

As regras gerais de nomenclatura, identificadores, ENUMs, integridade, exclusão e auditoria permanecem definidas nas convenções correspondentes.

---

## 15. Manutenção

Este documento deve ser atualizado quando houver alteração relevante na estrutura ou nas regras de `CompanyBusinessDay`.

Alterações relacionadas à interpretação de horários, períodos ou exceções devem ser avaliadas conjuntamente com `CompanyBusinessHourPeriod` e `CompanyScheduleOverride`.
