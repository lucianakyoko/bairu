# COMPANY USERNAME HISTORY — Entity Specification

## 1. Objetivo

Definir a estrutura e as regras específicas da entidade `CompanyUsernameHistory`.

A entidade pertence ao Bounded Context **Business** e representa o histórico de usernames anteriormente atribuídos a uma `Company`.

Seu objetivo é preservar a relação histórica entre uma `Company` e um username, permitindo:

- resolução de usernames anteriormente utilizados;
- redirecionamento de URLs públicas enquanto o vínculo histórico permanecer válido;
- aplicação do período de cooldown;
- controle da retomada do username pela Company original;
- identificação da perda definitiva do vínculo quando outra Company reclamar o username.

As regras gerais de arquitetura, modelagem, lifecycle, auditoria e persistência são definidas nos documentos correspondentes.

A política de lifecycle do username é definida na `ADR-009`.

---

## 2. Responsabilidade

`CompanyUsernameHistory` representa uma atribuição histórica de username.

A entidade não representa o username atualmente utilizado pela Company.

O username atual permanece armazenado em:

```text
Company.username
```

A entidade histórica deve ser utilizada somente para usernames que já foram anteriormente atribuídos a uma Company.

A entidade também registra informações necessárias para determinar se o vínculo histórico continua válido ou se foi perdido após a reclamação do username por outra Company.

---

## 3. Campos

| Campo                   | Tipo        | Obrigatório | Regra / finalidade                                       |
| ----------------------- | ----------- | ----------: | -------------------------------------------------------- |
| `id`                    | UUID        |         Sim | Identificador único do registro histórico                |
| `company_id`            | UUID        |         Sim | Company à qual o username pertenceu                      |
| `username`              | VARCHAR     |         Sim | Username anteriormente atribuído                         |
| `released_at`           | TIMESTAMPTZ |         Sim | Momento em que o username deixou de ser atual            |
| `cooldown_until`        | TIMESTAMPTZ |         Sim | Momento a partir do qual terceiros podem reclamar o nome |
| `claimed_by_company_id` | UUID        |         Não | Company que posteriormente reclamou o username           |
| `claimed_at`            | TIMESTAMPTZ |         Não | Momento em que outra Company reclamou o username         |
| `created_at`            | TIMESTAMPTZ |         Sim | Momento de criação do registro                           |

> **Observação:** os nomes e tipos definitivos devem permanecer alinhados ao schema Prisma e às decisões registradas nos documentos de banco.

---

## 4. Identificação

### 4.1. `id`

Identificador primário do registro histórico.

Deve utilizar UUID conforme definido em `CON-002`.

O identificador não possui significado de negócio.

### 4.2. `company_id`

Identifica a `Company` à qual o username pertenceu.

A relação deve utilizar `Company.id`.

O username nunca deve ser utilizado como chave de referência para relacionamentos internos.

### 4.3. `username`

Representa o valor histórico do username.

O valor deve preservar a mesma normalização utilizada por `Company.username`:

- lowercase;
- sem acentos;
- somente `a-z`, `0-9`, `_` e `-`;
- entre 3 e 30 caracteres;
- sem `_` ou `-` no início ou no final.

O valor armazenado representa o username normalizado, e não uma representação de apresentação.

---

## 5. Lifecycle do Registro Histórico

O lifecycle de um registro pode ser representado conceitualmente por:

```text
ACTIVE LINK
    │
    │ username liberado pela Company
    ▼
COOLDOWN
    │
    ├── Company original recupera username
    │       │
    │       └── vínculo histórico permanece válido
    │
    └── cooldown expira
            │
            ├── ninguém reclama
            │       │
            │       └── Company original mantém prioridade
            │
            └── outra Company reclama
                    │
                    ▼
               LINK LOST
```

O registro histórico não precisa possuir um campo `status` próprio.

Seu estado pode ser determinado a partir de:

- `released_at`;
- `cooldown_until`;
- `claimed_by_company_id`;
- `claimed_at`.

---

## 6. Liberação do Username

Quando uma Company altera seu username:

1. o username atual é registrado em `CompanyUsernameHistory`;
2. `released_at` recebe o momento da alteração;
3. `cooldown_until` recebe o momento definido pela política de cooldown;
4. `Company.username` recebe o novo username.

A alteração deve ser realizada de forma consistente, evitando que o username antigo ou o novo username fiquem em estado intermediário inválido.

A operação deve seguir as regras de transação e consistência definidas pelas convenções de persistência.

---

## 7. Cooldown

O período de cooldown impede que outra Company reclame imediatamente um username liberado.

Durante o cooldown:

- a Company original pode recuperar o username;
- outras Companies não podem reclamar o username;
- o registro histórico permanece associado à Company original.

O período exato de cooldown é definido pela `ADR-009`.

A entidade deve armazenar o momento de término em `cooldown_until` em vez de depender exclusivamente de uma constante de aplicação para determinar o estado histórico.

---

## 8. Retomada pelo Proprietário Original

Enquanto o username não tiver sido reclamado por outra Company, a Company original pode recuperar seu username histórico sem cumprir novamente o cooldown.

A retomada:

- restaura o username em `Company.username`;
- mantém o registro histórico;
- não cria uma nova relação histórica para o mesmo período de utilização;
- encerra o período em que o username estava liberado.

A política detalhada de alteração e retomada de usernames é definida na `ADR-009`.

---

## 9. Perda do Vínculo

Quando outra Company reclamar um username histórico após o cooldown:

- `claimed_by_company_id` deve receber o `id` da nova Company;
- `claimed_at` deve registrar o momento da reclamação;
- a Company original perde sua prioridade sobre o username;
- o registro histórico deixa de representar um vínculo válido para redirecionamento.

A perda do vínculo é definitiva para aquele registro histórico.

A Company original passa a estar sujeita às mesmas regras aplicáveis a qualquer outra Company caso tente reclamar novamente o username no futuro.

---

## 10. Resolução de URLs Históricas

Quando uma URL pública utilizar um username que não corresponde ao `Company.username` atual:

1. a aplicação deve procurar o username entre os registros históricos;
2. deve verificar se o vínculo histórico continua válido;
3. quando o vínculo estiver válido, deve identificar a Company original;
4. a aplicação deve redirecionar para o username atual da Company.

O redirecionamento histórico deve utilizar HTTP `301`.

Um registro histórico com `claimed_by_company_id` preenchido não deve gerar redirect para a Company original.

Nesse caso, a resolução deve resultar em `404`, salvo decisão posterior de produto que estabeleça comportamento diferente.

A resolução de URL não deve redirecionar automaticamente para a nova Company que reclamou o username histórico.

Isso evita que um link antigo de uma Company passe silenciosamente a apontar para outra Company.

---

## 11. Constraints

A entidade deve possuir, no mínimo:

- **Primary Key**

  ```text
  PRIMARY KEY (id)
  ```

- **Foreign Key**

  ```text
  FOREIGN KEY (company_id)
  REFERENCES companies(id)
  ```

- **Foreign Key**

  ```text
  FOREIGN KEY (claimed_by_company_id)
  REFERENCES companies(id)
  ```

As Foreign Keys não devem utilizar `ON DELETE CASCADE` sem decisão específica sobre o lifecycle das Companies relacionadas.

O `username` histórico não deve possuir uma constraint `UNIQUE` global isolada, pois o mesmo username pode possuir múltiplos registros históricos ao longo do tempo.

A unicidade e integridade da ocupação atual do username permanecem sob responsabilidade de:

```text
Company.username
```

---

## 12. Índices

Devem ser considerados índices para:

- `company_id`;
- `username`;
- `claimed_by_company_id`.

A busca pública por username histórico deve possuir índice adequado para permitir a resolução eficiente de URLs antigas.

Consultas que busquem somente registros históricos ainda válidos podem utilizar índices adicionais quando os padrões reais de consulta justificarem sua criação.

Índices adicionais não devem ser criados indiscriminadamente.

---

## 13. Auditoria

Alterações relevantes relacionadas ao lifecycle do username podem exigir auditoria.

Exemplos:

- criação de histórico;
- alteração de username;
- reclamação por outra Company;
- perda de vínculo;
- operações administrativas relacionadas ao username.

A auditoria deve utilizar o mecanismo central definido em `CON-008`.

A entidade não deve armazenar seu próprio histórico de alterações além dos dados necessários para representar o lifecycle do vínculo.

---

## 14. Segurança e Privacidade

O username é um identificador público e não deve conter informações pessoais que não sejam necessárias à identidade pública da Company.

A entidade não deve armazenar dados pessoais adicionais apenas para fins de histórico.

O acesso administrativo aos registros históricos deve respeitar as regras de autorização do contexto `Business`.

---

## 15. Dados que não pertencem a `CompanyUsernameHistory`

A entidade não deve armazenar:

- nome da Company;
- dados do proprietário;
- dados de autenticação;
- conteúdo da Company;
- dados de catálogo;
- informações de contato;
- cópias completas da Company;
- histórico completo de alterações da Company.

Essas informações pertencem às respectivas entidades e módulos.

---

## 16. Relações

### 16.1. Company → CompanyUsernameHistory

Uma `Company` pode possuir zero ou mais registros históricos.

```text
Company
   │
   ├── CompanyUsernameHistory
   ├── CompanyUsernameHistory
   └── CompanyUsernameHistory
```

A relação é:

```text
Company 1 ─────── N CompanyUsernameHistory
```

Cada registro histórico pertence a exatamente uma Company original.

### 16.2. Claimed Company

Um registro histórico pode possuir uma Company que posteriormente reclamou o username.

```text
Company A
   │
   └── CompanyUsernameHistory
             │
             └── claimed_by_company_id → Company B
```

A relação é opcional porque um username histórico pode nunca ter sido reclamado por outra Company.

---

## 17. Dados Derivados

A entidade não deve armazenar indicadores derivados no MVP.

O estado do vínculo deve ser calculado a partir dos campos persistidos e das regras definidas na `ADR-009`.

---

## 18. Exclusão e Retenção

O histórico de usernames não deve ser removido automaticamente quando a Company original for arquivada.

A retenção deve seguir a finalidade do histórico e as políticas gerais definidas em `CON-008`.

Um registro histórico pode deixar de ser necessário quando não houver finalidade legítima para sua manutenção.

A exclusão definitiva deve considerar:

- necessidade de auditoria;
- integridade referencial;
- resolução de URLs históricas;
- retenção aplicável;
- eventuais referências externas.

---

## 19. Estrutura Conceitual

```text
Company
├── id
├── username
│
└── CompanyUsernameHistory
    ├── id
    ├── company_id
    ├── username
    ├── released_at
    ├── cooldown_until
    ├── claimed_by_company_id
    ├── claimed_at
    └── created_at
```

Fluxo:

```text
Company A
    │
    │ altera username
    ▼
CompanyUsernameHistory
    │
    ├── username = "padariacentral"
    ├── company_id = A
    ├── released_at = ...
    ├── cooldown_until = ...
    │
    ├── A recupera
    │      └── vínculo permanece válido
    │
    └── B reclama após cooldown
           │
           ├── claimed_by_company_id = B
           └── claimed_at = ...
```

---

## 20. Decisões Consolidadas

| Decisão                         | Definição                                    |
| ------------------------------- | -------------------------------------------- |
| Contexto                        | Business                                     |
| Entidade                        | `CompanyUsernameHistory`                     |
| Identificador                   | UUID                                         |
| Company original                | `company_id`                                 |
| Username atual                  | Mantido em `Company.username`                |
| Username histórico              | Mantido em `CompanyUsernameHistory.username` |
| Cooldown                        | Representado por `cooldown_until`            |
| Reutilização pelo dono original | Permitida enquanto vínculo não for perdido   |
| Reivindicação por terceiro      | Permitida após cooldown                      |
| Perda do vínculo                | Registrada por `claimed_by_company_id`       |
| Redirect histórico              | HTTP 301 enquanto vínculo for válido         |
| Redirect após perda de vínculo  | Não realizado no MVP                         |
| Chave de relacionamento         | `Company.id`                                 |
| Soft Delete                     | Não adotado                                  |
| Hard Delete                     | Sujeito às regras de retenção                |
| Auditoria                       | Mecanismo central de auditoria               |

---

## 21. Documentos Relacionados

- `DB-001-database-architecture.md` — arquitetura do banco de dados;
- `DB-003-entity-inventory.md` — inventário oficial das entidades;
- `DB-102.company.md` — entidade `Company`;
- `CON-002-domain-and-data-modeling-conventions.md` — convenções de domínio e dados;
- `CON-003-rest-api-conventions.md` — convenções da API REST;
- `CON-008-data-lifecycle-and-audit-standards.md` — lifecycle, retenção e auditoria;
- `ADR-009-company-username-lifecycle-and-history.md` — lifecycle e histórico de usernames.

---

## 22. Manutenção

Este documento deve ser atualizado quando a estrutura ou as regras específicas do histórico de usernames forem alteradas.

Mudanças que afetem o lifecycle do username devem também ser avaliadas na `ADR-009` e na documentação da entidade `Company`.
