# DB-111 — Job Vacancy

## 1. Objetivo

A entidade `JobVacancy` representa uma oportunidade de trabalho publicada por um negócio no Bairu.

A entidade pertence ao Bounded Context `Content`.

Seu objetivo é permitir que negócios divulguem vagas e oportunidades profissionais para serem encontradas pela comunidade.

As regras gerais de lifecycle, publicação, expiração, retenção e auditoria devem seguir as convenções compartilhadas da plataforma.

---

## 2. Responsabilidade

`JobVacancy` é responsável por representar o conteúdo específico de uma vaga.

Compete à entidade:

- armazenar as informações da oportunidade;
- identificar o negócio responsável pela publicação;
- controlar seu lifecycle de publicação;
- definir o período em que a vaga permanece disponível;
- armazenar as informações necessárias para apresentação da oportunidade.

Regras de distribuição no Feed pertencem ao contexto `Feed`.

---

## 3. Estrutura

Campos previstos para a entidade:

| Campo             | Tipo        | Obrigatório | Descrição                                       |
| ----------------- | ----------- | ----------: | ----------------------------------------------- |
| `id`              | UUID        |         Sim | Identificador da vaga                           |
| `company_id`      | UUID        |         Sim | Negócio responsável pela vaga                   |
| `title`           | VARCHAR     |         Sim | Título da oportunidade                          |
| `description`     | TEXT        |         Sim | Descrição da vaga                               |
| `location`        | VARCHAR     |         Não | Local de trabalho informado pelo negócio        |
| `employment_type` | ENUM        |         Não | Tipo de contratação                             |
| `status`          | ENUM        |         Sim | Estado atual da vaga                            |
| `starts_at`       | TIMESTAMPTZ |         Não | Início da disponibilidade da vaga               |
| `expires_at`      | TIMESTAMPTZ |         Não | Momento em que a vaga deixa de estar disponível |
| `created_at`      | TIMESTAMPTZ |         Sim | Momento de criação                              |
| `updated_at`      | TIMESTAMPTZ |         Sim | Momento da última alteração                     |

Os valores definitivos dos ENUMs devem ser definidos conforme as regras do domínio e mantidos consistentes com as convenções gerais de modelagem.

---

## 4. Relacionamentos

### Company

Cada vaga pertence a um único negócio.

```text
Company
   │
   └── JobVacancy
```

Um negócio pode possuir várias vagas ao longo do tempo.

A vaga não deve existir sem um negócio responsável.

### FeedPublication

Uma vaga poderá ser representada no Feed através de `FeedPublication`.

```text
JobVacancy
    │
    ▼
FeedPublication
```

A distribuição da vaga não altera as regras próprias de lifecycle da entidade `JobVacancy`.

---

## 5. Lifecycle

A vaga possui lifecycle próprio de conteúdo.

Conceitualmente:

```text
Draft / Created
      ↓
Published
      ↓
Active
      ↓
Expired / Closed
```

A implementação dos estados deve refletir as necessidades reais do MVP e não deve introduzir estados sem comportamento associado.

`expires_at` representa o momento a partir do qual a oportunidade deixa de estar disponível para o fluxo público, quando utilizado.

Uma vaga expirada permanece armazenada enquanto houver necessidade de histórico, auditoria ou retenção.

A expiração não representa automaticamente Hard Delete.

---

## 6. Regras de Negócio

No MVP:

- uma vaga pertence a um único `Company`;
- uma empresa pode publicar várias vagas;
- uma vaga possui um título;
- uma vaga possui uma descrição;
- a localização pode ser informada quando aplicável;
- o tipo de contratação pode ser informado quando aplicável;
- a vaga pode possuir período de disponibilidade;
- vagas expiradas não devem aparecer como oportunidades ativas;
- regras específicas de publicação e distribuição permanecem separadas do Feed.

Os limites de quantidade e duração das vagas devem ser definidos pelas regras do módulo de Content e pelos limites do plano da empresa quando aplicável.

---

## 7. Constraints

Devem ser aplicadas, conforme a implementação:

- `PRIMARY KEY` em `id`;
- `FOREIGN KEY` em `company_id`;
- `NOT NULL` nos campos obrigatórios;
- `CHECK` para garantir consistência de períodos quando aplicável;
- valores controlados para `status`;
- valores controlados para `employment_type`, quando utilizado.

Quando `expires_at` estiver definido, seu valor não deve ser anterior a `starts_at`.

---

## 8. Índices

Índices devem priorizar os padrões de consulta esperados.

Índices candidatos:

```text
idx_job_vacancies_company_id
idx_job_vacancies_status
idx_job_vacancies_expires_at
```

Um índice composto poderá ser considerado para consultas frequentes de vagas ativas por negócio e período.

A criação definitiva dos índices deve acompanhar os padrões reais de consulta da aplicação.

---

## 9. Exclusão

A estratégia de exclusão deve seguir as convenções gerais definidas em `CON-002` e `CON-008`.

A vaga não deve ser removida automaticamente apenas porque expirou.

Quando houver necessidade de preservar histórico, auditoria ou outras informações relevantes, a vaga poderá permanecer armazenada em estado apropriado.

Hard Delete poderá ser utilizado quando não houver necessidade legítima de retenção.

---

## 10. Decisões Importantes

### 10.1. JobVacancy pertence ao Content

`JobVacancy` representa o significado e o lifecycle da oportunidade.

O Feed apenas distribui a vaga quando aplicável.

Essa separação evita que regras específicas de vagas sejam incorporadas ao contexto `Feed`.

### 10.2. Vaga pertence a Company

A oportunidade é publicada por um negócio identificado por `company_id`.

Não será criada uma entidade intermediária específica para representar o responsável pela vaga no MVP.

### 10.3. Lifecycle independente da distribuição

A existência ou exibição de uma `FeedPublication` não define o lifecycle da vaga.

O conteúdo continua pertencendo ao contexto `Content`.

---

## 11. Relação com Outras Convenções

Este documento deve ser utilizado em conjunto com:

- `CON-001-architecture-conventions.md`;
- `CON-002-domain-and-data-modeling-conventions.md`;
- `CON-008-data-lifecycle-and-audit-standards.md`;
- documentação de `Company`;
- documentação de `FeedPublication`;
- convenções compartilhadas do módulo `Content`.

---

## 12. Manutenção

Este documento deve ser atualizado quando houver alteração relevante na estrutura ou nas regras de negócio de `JobVacancy`.

Alterações que introduzam novos estados, mudanças significativas de lifecycle, novos relacionamentos ou alterações estruturais relevantes devem ser avaliadas também quanto ao impacto no modelo de dados e nas migrations.
