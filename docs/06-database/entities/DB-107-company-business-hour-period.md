# DB-107 — Company Business Hour Period

## 1. Objetivo

`CompanyBusinessHourPeriod` representa um período de funcionamento dentro de um dia de funcionamento de uma empresa.

A entidade permite representar negócios que possuem mais de um período de atendimento no mesmo dia, como:

```text
Segunda-feira

08:00 ── 12:00
13:00 ── 18:00
```

A entidade pertence ao contexto **Business**.

---

## 2. Responsabilidade

`CompanyBusinessHourPeriod` é responsável por representar os intervalos de horário associados a um `CompanyBusinessDay`.

Ela não é responsável por:

- definir quais dias o negócio funciona;
- representar exceções de calendário;
- controlar feriados ou alterações pontuais;
- definir regras de publicação ou disponibilidade de conteúdos.

Essas responsabilidades pertencem às entidades e módulos correspondentes.

---

## 3. Estrutura

A estrutura deve conter, no mínimo, os dados necessários para:

| Campo                     | Descrição                                  |
| ------------------------- | ------------------------------------------ |
| `id`                      | Identificador UUID da entidade             |
| `company_business_day_id` | Referência ao dia de funcionamento         |
| `starts_at`               | Início do período                          |
| `ends_at`                 | Fim do período                             |
| `observation`             | Observação opcional relacionada ao período |
| `created_at`              | Momento de criação                         |
| `updated_at`              | Momento da última alteração                |

> Os nomes dos campos de horário devem ser mantidos consistentes com a convenção adotada para o restante do modelo. `starts_at` e `ends_at` para representar os limites temporais de um período, independentemente de serem instantes ou horários recorrentes.

---

## 4. Relacionamentos

A relação principal é:

```text
Company
   │
   └── CompanyBusinessDay
            │
            └── CompanyBusinessHourPeriod
```

Um `CompanyBusinessDay` pode possuir **um ou mais períodos** de funcionamento.

Exemplo:

```text
Company
└── Monday
    ├── 08:00 - 12:00
    └── 13:00 - 18:00
```

Cada `CompanyBusinessHourPeriod` pertence a exatamente um `CompanyBusinessDay`.

---

## 5. Constraints

Devem ser consideradas as seguintes restrições:

- `id` deve ser `PRIMARY KEY`;
- `company_business_day_id` deve ser `NOT NULL`;
- `starts_at` deve ser `TIME NOT NULL`;
- `ends_at` deve ser `TIME NOT NULL`;
- `starts_at < ends_at`;
- `starts_at` deve representar um horário anterior a `ends_at`;
- `observation` é opcional;
- a Foreign Key deve garantir a existência do `CompanyBusinessDay`.
- `created_at` deve ser `TIMESTAMPTZ NOT NULL`;
- `updated_at` deve ser `TIMESTAMPTZ NOT NULL`;

A regra de horário inválido deve ser protegida pelo banco quando puder ser representada por constraint e também validada na aplicação.

---

## 6. Índices

O principal índice esperado é:

```text
idx_company_business_hour_periods_company_business_day_id
```

Esse índice suporta a recuperação dos períodos pertencentes a um determinado `CompanyBusinessDay`.

Não devem ser adicionados índices adicionais sem necessidade de consulta identificada.

---

## 7. Exclusão

`CompanyBusinessHourPeriod` possui ciclo de vida dependente de `CompanyBusinessDay`.

Quando um `CompanyBusinessDay` deixar de existir, seus períodos deixam de possuir significado independente.

A estratégia preferencial é:

```text
CompanyBusinessDay
        │
        └── CASCADE
              ↓
   CompanyBusinessHourPeriod
```

A aplicação não deve permitir que um período permaneça associado a um dia inexistente.

A entidade utiliza **Hard Delete**, conforme as convenções gerais de entidades de relacionamento e dados dependentes.

---

## 8. Regras de Negócio

As seguintes regras devem ser respeitadas:

1. Um período pertence a apenas um `CompanyBusinessDay`.
2. Um dia pode possuir múltiplos períodos.
3. O início deve ocorrer antes do término.
4. Períodos de um mesmo `CompanyBusinessDay` não podem se sobrepor.
5. Períodos que apenas compartilham o mesmo limite de horário podem coexistir.
6. A validação de sobreposição deve ser realizada na camada de aplicação no MVP.
7. Períodos não devem representar exceções de calendário.
8. Alterações excepcionais de funcionamento devem ser representadas por `CompanyScheduleOverride`.
9. A entidade não deve conhecer regras específicas de apresentação ou publicação do negócio.
10. `starts_at` e `ends_at` representam horários locais recorrentes associados ao dia de funcionamento. Não representam instantes absolutos e, portanto, não devem ser armazenados como timestamps UTC.
11. `observation` é apenas informativa e não altera a interpretação do período.
12. Informações que alterem efetivamente o funcionamento do negócio devem
    ser representadas por regras ou entidades apropriadas, especialmente
    `CompanyScheduleOverride`.

---

## 9. Lifecycle

O lifecycle da entidade é simples:

```text
Criação
   ↓
Período ativo
   ↓
Alteração
   ↓
Remoção
```

Não há necessidade de `status`, `archived_at` ou `deleted_at`.

O ciclo de vida da entidade é determinado principalmente por sua associação com `CompanyBusinessDay`.

---

## 10. Decisões Importantes

| Decisão                          | Justificativa                                                   |
| -------------------------------- | --------------------------------------------------------------- |
| Entidade própria                 | Um dia pode possuir múltiplos períodos                          |
| Relação com `CompanyBusinessDay` | Mantém separadas as responsabilidades de dia e horário          |
| UUID                             | Segue a convenção geral das entidades persistentes              |
| Hard Delete                      | O período não possui significado independente após sua remoção  |
| Cascade                          | O período depende semanticamente do dia                         |
| `observation` opcional           | Permite informações adicionais sem criar estruturas específicas |
| Sem `status`                     | O lifecycle é simples e dependente do dia de funcionamento      |

---

## 11. Relação com Outras Entidades

```text
Company
   │
   ├── CompanyBusinessDay
   │       │
   │       └── CompanyBusinessHourPeriod
   │
   └── CompanyScheduleOverride
```

`CompanyBusinessHourPeriod` representa o **horário normal** de funcionamento.

`CompanyScheduleOverride` representa alterações excepcionais desse funcionamento.

---

## 12. Documentação Relacionada

Este documento deve ser utilizado em conjunto com:

- `DB-102-company.md` — negócio;
- `DB-106-company-business-day.md` — dia de funcionamento;
- `DB-108-company-schedule-override.md` — exceções de horário;
- `DB-001-database-architecture.md` — arquitetura do banco;
- `CON-002-domain-and-data-modeling-conventions.md` — convenções de modelagem;
- `CON-008-data-lifecycle-and-audit-standards.md` — lifecycle e auditoria.

---

## 13. Manutenção

Este documento deve ser atualizado quando houver alteração na estrutura ou nas regras de funcionamento dos períodos de horário.

Mudanças que alterem significativamente o modelo de horários devem ser avaliadas antes da criação ou alteração das migrations correspondentes.
