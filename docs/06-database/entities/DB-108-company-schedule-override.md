# DB-108 — Company Schedule Override

## 1. Objetivo

`CompanyScheduleOverride` representa uma exceção à agenda regular de uma empresa.

A entidade permite registrar alterações temporárias ou específicas no funcionamento da empresa, como:

- fechamento em um dia normalmente aberto;
- abertura em um dia normalmente fechado;
- alteração excepcional de horário;
- feriados;
- recesso;
- funcionamento especial.

A exceção prevalece sobre a programação regular da empresa para a data correspondente.

---

## 2. Estrutura

| Campo         | Tipo        | Obrigatório | Descrição                                  |
| ------------- | ----------- | ----------: | ------------------------------------------ |
| `id`          | UUID        |         Sim | Identificador da exceção                   |
| `company_id`  | UUID        |         Sim | Empresa à qual a exceção pertence          |
| `date`        | DATE        |         Sim | Data afetada pela exceção                  |
| `is_closed`   | BOOLEAN     |         Sim | Indica se a empresa estará fechada na data |
| `observation` | VARCHAR     |         Não | Observação sobre a exceção                 |
| `created_at`  | TIMESTAMPTZ |         Sim | Data de criação do registro                |
| `updated_at`  | TIMESTAMPTZ |         Sim | Data da última alteração                   |

- Quando `is_closed = true`, a empresa não possui horário de funcionamento nessa data.
- Quando `is_closed = true`, a exceção não deve possuir períodos excepcionais.
- Quando `is_closed = false`, a exceção deve possuir pelo menos um período excepcional.
- Quando `is_closed = false`, a exceção representa funcionamento diferente da agenda regular e deverá estar associada aos horários excepcionais definidos para a data.

---

## 3. Relacionamentos

```text
Company
   │
   └── CompanyScheduleOverride
             │
             └──< CompanyScheduleOverridePeriod
```

- Uma `Company` pode possuir várias exceções.
- Cada `CompanyScheduleOverride` pertence a uma única `Company`.

Relacionamento:

```text
Company 1 ─── N CompanyScheduleOverride
```

### CompanyScheduleOverridePeriod

Uma `CompanyScheduleOverride` pode possuir um ou mais períodos excepcionais quando `is_closed = false`.

Os períodos representam os horários específicos daquela data e não fazem parte da agenda regular da empresa.

---

## 4. Constraints

### 4.1. Primary Key

```text
PRIMARY KEY (id)
```

### 4.2. Foreign Key

```text
company_id → companies.id
```

O relacionamento é obrigatório.

### 4.3. Unicidade

Uma empresa não deve possuir mais de uma exceção para a mesma data.

```text
UNIQUE (company_id, date)
```

Isso garante que exista uma única definição de exceção para cada empresa e data.

### 4.4. Validações

- `company_id` deve existir.
- `date` é obrigatório.
- `is_closed` é obrigatório.
- `observation`, quando informada, deve respeitar o limite definido pela aplicação.
- Uma exceção não deve possuir horários conflitantes com sua própria definição.

---

## 5. Índices

A constraint:

```text
UNIQUE (company_id, date)
```

já cria um índice adequado para:

localizar a exceção de uma empresa em determinada data;
garantir que exista no máximo uma exceção por empresa e data.

Não é necessário um índice adicional por company_id ou (company_id, date) no MVP.

---

## 6. Exclusão

`CompanyScheduleOverride` utiliza **Hard Delete**.

A exceção representa uma configuração específica da agenda e não possui, no MVP, necessidade de histórico próprio.

Quando uma `Company` for removida, suas `CompanyScheduleOverride` deverão ser removidas em cascata.

Quando uma `CompanyScheduleOverride` for removida, seus períodos excepcionais também deverão ser removidos em cascata.

A cadeia de exclusão será:

```text
Company
   │
   └── CASCADE
        ↓
CompanyScheduleOverride
   │
   └── CASCADE
        ↓
CompanyScheduleOverridePeriod
```

A entidade utiliza Hard Delete.

---

## 7. Regras de Negócio

As regras relacionadas à interpretação da agenda permanecem no domínio de `Company`.

A aplicação deve considerar a seguinte precedência:

```text
Schedule Override
       ↓
Regular Schedule
```

Ou seja, quando existir uma exceção para determinada data, ela prevalece sobre os horários regulares da empresa.

A entidade não deve duplicar a lógica de funcionamento regular armazenada em `CompanyBusinessDay` e `CompanyBusinessHourPeriod`.

---

## 8. Decisões Importantes

- A exceção é vinculada diretamente à `Company`.
- Cada empresa pode possuir no máximo uma exceção por data.
- A data utiliza `DATE`, pois representa um dia de calendário e não um instante no tempo.
- `is_closed` permite representar explicitamente dias de fechamento excepcional.
- Exceções não substituem a agenda regular; apenas a sobrescrevem para uma data específica.
- O histórico de alterações não é mantido na própria entidade.
- Horários excepcionais devem ser representados de forma compatível com a modelagem de períodos de horário definida para a agenda.

---

## 9. Relação com Outras Entidades

```text
Company
 ├── CompanyBusinessDay
 │      └── CompanyBusinessHourPeriod
 │
 └── CompanyScheduleOverride
```

A agenda regular define o funcionamento habitual.

`CompanyScheduleOverride` define exceções específicas.

Essa separação evita alterar permanentemente a agenda regular para representar situações temporárias ou pontuais.
