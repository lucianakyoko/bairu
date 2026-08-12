# USER — Entity Specification

## 1. Objetivo

Definir a estrutura e as regras específicas da entidade `User` no banco de dados do Bairu.

A entidade representa uma pessoa autenticada na plataforma e pertence ao Bounded Context **Identity**.

Este documento descreve somente as características específicas de `User`. Convenções gerais de modelagem, identificadores, auditoria, lifecycle e persistência são definidas em:

- `CON-002-domain-and-data-modeling-conventions.md`;
- `CON-008-data-lifecycle-and-audit-standards.md`;
- `DB-001-database-architecture.md`.

---

## 2. Responsabilidade

`User` representa a identidade de uma pessoa que possui uma conta na plataforma.

A entidade é responsável por armazenar informações necessárias para:

- identificação do usuário;
- autenticação;
- controle de acesso;
- gerenciamento da conta;
- associação com empresas administradas pelo usuário;
- identificação do usuário em operações que exigem autenticação.

A entidade não deve armazenar informações específicas das empresas que o usuário administra.

Essas informações pertencem à entidade `Company`.

---

## 3. Campos

| Campo              | Tipo        | Obrigatório | Regra / finalidade                                 |
| ------------------ | ----------- | ----------: | -------------------------------------------------- |
| `id`               | UUID        |         Sim | Identificador único do usuário                     |
| `name`             | VARCHAR     |         Sim | Nome do usuário                                    |
| `email`            | VARCHAR     |         Sim | E-mail utilizado para identificação e autenticação |
| `password_hash`    | VARCHAR     |         Sim | Hash da senha do usuário                           |
| `phone`            | VARCHAR     |         Não | Telefone do usuário                                |
| `profile_media_id` | UUID        |         Não | Referência à imagem de perfil do usuário           |
| `role`             | ENUM        |         Sim | Define o nível de acesso do usuário                |
| `status`           | ENUM        |         Sim | Define o estado da conta                           |
| `created_at`       | TIMESTAMPTZ |         Sim | Momento de criação da conta                        |
| `updated_at`       | TIMESTAMPTZ |         Sim | Momento da última alteração                        |

### 3.1. `id`

Identificador primário da entidade.

Deve utilizar UUID conforme definido em `CON-002`.

O identificador não possui significado de negócio.

---

### 3.2. `name`

Nome da pessoa associada à conta.

É utilizado para identificação e apresentação do usuário em contextos apropriados da plataforma.

Não deve ser utilizado como identificador único.

---

### 3.3. `email`

Endereço de e-mail associado à conta.

O e-mail é utilizado como identificador de autenticação.

Deve ser único entre os usuários.

A comparação e normalização do e-mail devem seguir uma regra consistente em toda a aplicação.

---

### 3.4. `password_hash`

Armazena exclusivamente o hash da senha.

A senha em texto puro nunca deve ser persistida.

O algoritmo de hash e os parâmetros de segurança são responsabilidade da camada de autenticação e segurança da aplicação.

O valor não deve ser exposto em respostas públicas da API.

---

### 3.5. `phone`

Telefone associado ao usuário.

O campo é opcional no MVP.

Não deve ser utilizado como identificador primário da conta.

Caso futuramente o telefone seja utilizado para autenticação ou recuperação de conta, suas regras deverão ser documentadas no contexto de Identity.

---

### 3.6. `profile_media_id`

Referência opcional à imagem de perfil do usuário.

A mídia é armazenada pelo `Media Module`, conforme definido em `CON-007-media-architecture-and-lifecycle-standards.md`.

A entidade `User` não deve armazenar:

- conteúdo binário;
- URL do storage;
- URL do CDN;
- credenciais do provedor;
- identificadores específicos do Cloudinary.

A referência deve apontar para uma entidade `Media`.

No MVP, a relação é de no máximo uma mídia de perfil por usuário.

---

### 3.7. `role`

Define o nível de acesso do usuário na plataforma.

Valores iniciais:

```text
USER
ADMIN
```

#### `USER`

Usuário autenticado com acesso às funcionalidades destinadas a contas comuns.

#### `ADMIN`

Usuário com permissões administrativas da plataforma.

No MVP, o painel administrativo será utilizado por um único usuário administrador.

Essa limitação é uma regra operacional do MVP e não deve impedir que a arquitetura suporte múltiplos administradores futuramente.

---

### 3.8. `status`

Representa o estado da conta do usuário.

Valores iniciais:

```text
ACTIVE
INACTIVE
```

#### `ACTIVE`

A conta está ativa e pode realizar as operações permitidas pelo seu papel.

#### `INACTIVE`

A conta permanece cadastrada, mas não pode utilizar normalmente as funcionalidades autenticadas da plataforma.

A alteração de `status` não representa necessariamente exclusão física do registro.

---

### 3.9. `created_at`

Indica quando a conta foi criada.

Deve utilizar `TIMESTAMPTZ` e representar um instante no tempo.

---

### 3.10. `updated_at`

Indica quando a conta foi alterada pela última vez.

Deve ser atualizado sempre que dados persistidos relevantes da entidade forem modificados.

---

## 4. Relacionamentos

### 4.1. User → Company

Um usuário pode possuir e administrar uma ou mais empresas.

```text
User
  │
  ├── owns/manages ── Company
  │
  ├── owns/manages ── Company
  │
  └── owns/manages ── Company
```

No MVP:

- cada `Company` possui exatamente um proprietário;
- um `User` pode possuir uma ou mais `Company`;
- a relação deve ser representada pela referência de proprietário em `Company`;
- `User` não deve armazenar uma lista de empresas em um campo próprio.

A relação será definida no documento da entidade `Company`.

---

### 4.2. User → Media

Um usuário pode possuir uma imagem de perfil.

```text
User
  │
  └── profile_media_id ── Media
```

A relação é opcional.

No MVP, uma mesma `Media` não deve ser compartilhada entre diferentes entidades consumidoras.

As regras gerais estão definidas em `CON-007-media-architecture-and-lifecycle-standards.md`.

---

## 5. Regras de Negócio

### 5.1. Identidade

Cada conta representa uma pessoa identificável por uma combinação de credenciais de autenticação.

O `email` deve ser único.

---

### 5.2. Autenticação

Somente usuários com credenciais válidas podem acessar funcionalidades protegidas.

A existência da entidade `User` não implica automaticamente autorização para qualquer operação.

A autorização deve considerar o `role`, o estado da conta e as regras do domínio.

---

### 5.3. Acesso público

Usuários não autenticados podem utilizar funcionalidades públicas da plataforma, como:

- pesquisar empresas;
- navegar por categorias;
- visualizar empresas;
- visualizar produtos e serviços;
- visualizar conteúdos públicos.

A criação de dados ou operações que exigem identidade devem requerer autenticação.

---

### 5.4. Proprietário

O proprietário de uma `Company` é um `User`.

Um usuário pode administrar mais de uma empresa.

No MVP, cada empresa possui somente um proprietário.

Não existe, neste momento, um modelo de múltiplos proprietários ou colaboradores para uma mesma empresa.

---

### 5.5. Administrador

`ADMIN` representa um usuário com permissões administrativas da plataforma.

A existência de `ADMIN` não deve ser utilizada para representar propriedade de uma `Company`.

Administração da plataforma e propriedade de negócio são responsabilidades distintas.

---

## 6. Constraints

A entidade deve possuir, no mínimo, as seguintes restrições:

### Primary Key

```text
PRIMARY KEY (id)
```

### Unique

```text
UNIQUE (email)
```

### Foreign Key

Quando `profile_media_id` estiver presente:

```text
FOREIGN KEY (profile_media_id)
REFERENCES media(id)
```

A estratégia de exclusão dessa relação deve respeitar o lifecycle definido para `Media`.

---

## 7. Índices

O índice de unicidade do `email` deve ser utilizado para garantir a integridade e otimizar a identificação da conta durante a autenticação.

Consultas frequentes por `status` ou `role` somente devem receber índices adicionais quando houver necessidade observável.

Não devem ser criados índices indiscriminadamente.

---

## 8. Lifecycle

O ciclo de vida básico da conta é:

```text
Created
   ↓
ACTIVE
   │
   ├── INACTIVE
   │
   └── ACTIVE
```

A conta pode permanecer persistida mesmo quando estiver `INACTIVE`.

A alteração de estado não representa Hard Delete.

As regras gerais de lifecycle e retenção são definidas em `CON-008-data-lifecycle-and-audit-standards.md`.

---

## 9. Exclusão

A estratégia de exclusão de `User` deve considerar os dados relacionados à conta.

Antes de uma exclusão definitiva, devem ser avaliados:

- empresas pertencentes ao usuário;
- avaliações realizadas;
- favoritos;
- demais dados associados;
- mídias;
- requisitos de retenção;
- requisitos de auditoria;
- obrigações relacionadas à privacidade.

A exclusão de um usuário não deve ser implementada isoladamente sem avaliar seus relacionamentos.

A estratégia definitiva de exclusão deverá ser consolidada juntamente com as entidades relacionadas.

---

## 10. Auditoria

Alterações relevantes na conta podem estar sujeitas às regras gerais de auditoria da plataforma.

Operações especialmente relevantes incluem:

- alteração de `role`;
- alteração de `status`;
- alteração de credenciais;
- exclusão da conta;
- alterações administrativas;
- operações relacionadas à privacidade.

O histórico completo não deve ser armazenado diretamente na entidade `User`.

Quando necessário, a rastreabilidade deve utilizar o mecanismo central de auditoria definido em `CON-008`.

---

## 11. Segurança e Privacidade

A entidade `User` contém dados pessoais e informações relacionadas à autenticação.

Devem ser observados:

- princípio do menor privilégio;
- proteção do `password_hash`;
- não exposição de credenciais;
- controle de acesso aos dados pessoais;
- armazenamento mínimo necessário;
- políticas de retenção;
- requisitos aplicáveis da LGPD.

O `password_hash` nunca deve ser retornado em respostas destinadas ao cliente.

Dados pessoais também não devem ser expostos além do necessário para cada contexto de uso.

---

## 12. Dados que não pertencem a `User`

As seguintes informações não devem ser armazenadas diretamente na entidade:

- dados cadastrais da empresa;
- endereço da empresa;
- categorias da empresa;
- catálogo;
- publicações;
- avaliações recebidas pela empresa;
- horários de funcionamento;
- links sociais da empresa;
- dados específicos do negócio.

Essas informações pertencem às respectivas entidades do domínio.

A relação entre usuário e empresa deve ocorrer por relacionamento, e não pela duplicação desses dados em `User`.

---

## 13. Estrutura Conceitual

A entidade pode ser representada conceitualmente como:

```text
User
├── id
├── name
├── email
├── password_hash
├── phone
├── profile_media_id
├── role
├── status
├── created_at
└── updated_at
```

Relacionamentos:

```text
                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
              owns/manages │
                           ▼
                    ┌──────────────┐
                    │   Company    │
                    └──────────────┘

                           │
                           │ profile_media_id
                           ▼
                    ┌──────────────┐
                    │    Media     │
                    └──────────────┘
```

---

## 14. Decisões Consolidadas

| Decisão                   | Definição                                                      |
| ------------------------- | -------------------------------------------------------------- |
| Contexto                  | Identity                                                       |
| Identificador             | UUID                                                           |
| Autenticação              | E-mail + senha                                                 |
| E-mail                    | Único                                                          |
| Senha                     | Somente hash persistido                                        |
| Perfil                    | Nome, telefone e imagem opcional                               |
| Papel                     | `USER` ou `ADMIN`                                              |
| Status                    | `ACTIVE` ou `INACTIVE`                                         |
| Empresas                  | Um usuário pode possuir uma ou mais `Company`                  |
| Propriedade               | Cada `Company` possui um único proprietário no MVP             |
| Administradores           | Um único administrador no MVP, sem limitação estrutural futura |
| Foto de perfil            | Referência opcional a `Media`                                  |
| Compartilhamento de mídia | Não permitido no MVP                                           |
| Lifecycle                 | Estado de negócio separado da existência física                |
| Auditoria                 | Utiliza mecanismo central quando necessário                    |

---

## 15. Documentos Relacionados

- `DB-001-database-architecture.md` — arquitetura do banco de dados;
- `DB-003-entity-inventory.md` — inventário oficial das entidades;
- `CON-001-architecture-conventions.md` — convenções arquiteturais;
- `CON-002-domain-and-data-modeling-conventions.md` — convenções de domínio e dados;
- `CON-007-media-architecture-and-lifecycle-standards.md` — arquitetura e lifecycle de mídias;
- `CON-008-data-lifecycle-and-audit-standards.md` — lifecycle, retenção e auditoria;
- `CON-003-rest-api-conventions.md` — convenções da API REST.

---

## 16. Manutenção

Este documento deve ser atualizado quando a estrutura ou as regras específicas da entidade `User` forem alteradas.

Alterações que afetem princípios arquiteturais gerais, lifecycle, segurança ou relacionamento entre Bounded Contexts devem também atualizar os documentos correspondentes ou ser registradas como ADR quando necessário.
