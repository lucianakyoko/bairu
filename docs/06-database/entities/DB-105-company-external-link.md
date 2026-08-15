# DB-105 — Company External Link

## 1. Objetivo

`CompanyExternalLink` representa um link externo associado a uma empresa.

A entidade permite que empresas e profissionais disponibilizem seus canais
digitais, páginas institucionais, websites, blogs e perfis em plataformas
externas para serem encontrados pela comunidade dentro do Bairu.

---

## 2. Responsabilidade

`CompanyExternalLink` é responsável por:

- associar uma empresa a uma plataforma social;
- armazenar o endereço público do perfil;
- identificar a plataforma utilizada;
- impedir duplicidade do mesmo perfil para uma empresa.

A entidade não é responsável por validar ou sincronizar dados diretamente com a plataforma externa.

---

## 3. Estrutura

### 3.1. Campos

| Campo        | Tipo             | Obrigatório | Descrição                       |
| ------------ | ---------------- | ----------: | ------------------------------- |
| `id`         | UUID             |         Sim | Identificador único do registro |
| `company_id` | UUID             |         Sim | Empresa proprietária do link    |
| `platform`   | `SocialPlatform` |         Sim | Plataforma associada ao link    |
| `url`        | String           |         Sim | URL pública do perfil           |
| `created_at` | DateTime         |         Sim | Data e hora de criação          |
| `updated_at` | DateTime         |         Sim | Data e hora da última alteração |

### 3.2. Enum `SocialPlatform`

`SocialPlatform` é um ENUM do domínio e não possui tabela própria no MVP.

Valores inicialmente suportados:

```text
INSTAGRAM
WEBSITE
BLOG
FACEBOOK
WHATSAPP
YOUTUBE
TIKTOK
LINKEDIN
```

Novas plataformas podem ser adicionadas conforme necessidade real do produto.

A utilização de ENUM segue as convenções definidas em `CON-002-domain-and-data-modeling-conventions.md`.

---

## 4. Relacionamentos

### Company

Cada `CompanyExternalLink` pertence obrigatoriamente a uma `Company`.

```text
Company
   │
   └── CompanyExternalLink
```

Uma empresa pode possuir múltiplos links, desde que não haja duplicidade da mesma plataforma conforme as regras definidas abaixo.

---

## 5. Constraints

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

Uma empresa não deve possuir mais de um link para a mesma plataforma
no MVP:

```text
UNIQUE (company_id, platform)
```

Isso permite, por exemplo:

```text
Company A
├── INSTAGRAM
├── FACEBOOK
└── LINKEDIN
```

mas impede:

```text
Company A
├── INSTAGRAM
└── INSTAGRAM
```

A URL pode ser alterada sem necessidade de criar outro registro.

---

## 6. Índices

O relacionamento com `Company` deve possuir índice para consultas dos links associados a uma empresa.

```text
idx_company_external_links_company_id
```

A constraint de unicidade em `(company_id, platform)` também deverá possuir o índice correspondente gerado pelo banco.

---

## 7. Estratégia de Exclusão

`CompanyExternalLink` utiliza **Hard Delete**.

O link representa uma associação simples entre uma empresa e uma plataforma externa e não possui necessidade de preservação histórica no MVP.

Quando uma `Company` for removida, seus `CompanyExternalLink`
associados deverão ser removidos automaticamente.
A Foreign Key `company_id` utilizará comportamento equivalente a
`ON DELETE CASCADE`.

A exclusão do link não afeta a conta ou o perfil existente na plataforma externa.

---

## 8. Regras de Domínio

- Um link deve pertencer a uma empresa existente.
- Uma empresa pode possuir vários links sociais.
- Uma empresa pode possuir no máximo um link por plataforma.
- A URL deve representar um endereço público válido.
- A plataforma deve pertencer ao conjunto definido por `SocialPlatform`.
- A alteração do link deve atualizar `updated_at`.
- O Bairu não é responsável pela existência ou validade futura do perfil na plataforma externa.

Validações específicas da URL pertencem à camada de aplicação/API.

---

## 9. Decisões

| Decisão                    | Justificativa                                                                  |
| -------------------------- | ------------------------------------------------------------------------------ |
| Entidade própria           | O relacionamento possui dados próprios (`platform` e `url`)                    |
| `SocialPlatform` como ENUM | Conjunto pequeno e controlado no MVP                                           |
| Um link por plataforma     | Evita duplicidade e mantém a apresentação simples                              |
| Hard Delete                | O relacionamento não possui necessidade de histórico no MVP                    |
| URL armazenada no Bairu    | Permite apresentar o canal externo sem depender de integração com a plataforma |
| Sem integração externa     | O Bairu apenas armazena e apresenta o link                                     |

---

## 10. Exemplo

```text
Company
└── CompanyExternalLink
    ├── platform: INSTAGRAM
    └── url: https://instagram.com/exemplo
```

Uma empresa poderia possuir:

```text
Company
├── CompanyExternalLink
│   ├── platform: INSTAGRAM
│   └── url: https://instagram.com/exemplo
│
├── CompanyExternalLink
│   ├── platform: WHATSAPP
│   └── url: https://wa.me/5515999999999
│
└── CompanyExternalLink
    ├── platform: FACEBOOK
    └── url: https://facebook.com/exemplo
```

---

## 11. Relação com Outras Convenções

Este documento deve ser utilizado em conjunto com:

- `CON-001-architecture-conventions.md`;
- `CON-002-domain-and-data-modeling-conventions.md`;
- `DB-001-database-architecture.md`;
- `DB-102-company.md`.

As regras gerais de nomenclatura, identificadores, auditoria, exclusão, ENUMs e integridade são definidas nas convenções correspondentes.

---

## 12. Manutenção

Este documento deve ser atualizado quando houver alteração relevante na estrutura ou nas regras de `CompanyExternalLink`.

A inclusão de novas plataformas no `SocialPlatform` deve ser registrada neste documento e refletida na implementação do banco.
