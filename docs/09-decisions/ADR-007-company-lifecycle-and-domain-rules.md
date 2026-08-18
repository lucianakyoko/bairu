# ADR-007 — Company Lifecycle and Domain Rules

Status: Accepted
Data: 2026-08-18

---

## Contexto

A entidade `Company` representa empresas e profissionais autônomos presentes na plataforma Bairu.

A `Company` pertence ao bounded context Business e concentra informações institucionais, identificação do negócio, propriedade e estado operacional na plataforma.

A especificação original da entidade Company definia os seguintes estados:

```
ACTIVE
INACTIVE
ARCHIVED
```

Durante a preparação da implementação do `Company Module`, foram identificadas algumas decisões de domínio que precisavam ser consolidadas antes da implementação da API.

Essas decisões envolvem principalmente:

- semântica dos estados da `Company`;
- autoridade para realizar transições de estado;
- semântica de `DELETE /companies/:id`;
- comportamento do `slug` durante o arquivamento;
- representação de empresas e profissionais autônomos;
- classificação entre pessoa física e pessoa jurídica;
- tratamento do campo `document`;
- utilização de `CompanyExternalLink` para links externos;
- remoção de `website_url` da entidade `Company`.

A `Company` também possui relacionamentos com entidades pertencentes a outros módulos e contextos, incluindo:

- `User`;
- `Media`;
- `CompanyCategory`;
- `CompanyExternalLink`;
- `CompanyBusinessDay`;
- `CompanyScheduleOverride`;
- `CompanyCatalogItem`;
- `Promotion`;
- `JobVacancy`;
- `News`;
- `Event`;
- `Coupon`;
- `FeedPublication`;
- `Favorite`;
- `CompanyReview`.

Essas entidades não possuem necessariamente o mesmo ciclo de vida da `Company`.

Portanto, o ciclo de vida da `Company` não deve ser utilizado como mecanismo implícito para determinar a exclusão física de todos os registros relacionados.

---

## Decisões

### 2.1. Lifecycle da Company

A entidade `Company` utilizará quatro estados:

```
ACTIVE
INACTIVE
SUSPENDED
ARCHIVED
```

Cada estado possui uma semântica distinta.

- **`ACTIVE`**
  Representa o estado operacional normal da `Company`.
  Uma `Company` criada através do fluxo normal de criação nascerá automaticamente como: `ACTIVE`
  O proprietário não deverá precisar informar o estado durante a criação.
  Empresas `ACTIVE` podem participar das experiências públicas da plataforma quando atenderem às demais regras de elegibilidade.

- **`INACTIVE`**
  Representa uma desativação voluntária e temporária realizada pelo proprietário.
  O proprietário poderá utilizar esse estado quando desejar retirar temporariamente a `Company` das experiências públicas sem encerrar definitivamente sua operação na plataforma.
  O proprietário poderá realizar:

  ```
  ACTIVE → INACTIVE
  INACTIVE → ACTIVE
  ```

  Portanto, `INACTIVE` representa um estado reversível sob controle do proprietário.
  Empresas `INACTIVE` não devem aparecer normalmente nas experiências públicas de descoberta.

- **`SUSPENDED`**
  Representa uma suspensão aplicada pela plataforma.
  Esse estado poderá ser utilizado quando a `Company` violar políticas, regras de uso ou requisitos operacionais definidos pelo Bairu.
  A transição para `SUSPENDED` não poderá ser realizada pelo proprietário através das operações normais da `Company`.
  A plataforma poderá realizar: `ACTIVE → SUSPENDED` e, após a resolução da situação que originou a suspensão: `SUSPENDED → ACTIVE`.
  Essas operações são administrativas.
  O proprietário não poderá alterar livremente uma `Company` de `SUSPENDED` para `INACTIVE` ou `ACTIVE`.

- **`ARCHIVED`**
  Representa a retirada da `Company` do ciclo operacional normal da plataforma.
  Uma `Company` arquivada permanece persistida no banco de dados, mas não participa normalmente das experiências públicas.
  O arquivamento não representa exclusão física.
  O proprietário poderá solicitar o arquivamento da própria `Company`.
  A restauração de uma `Company` arquivada não faz parte das operações normais disponíveis ao proprietário.
  Uma eventual restauração deverá ser realizada exclusivamente por autoridade administrativa e será considerada uma operação excepcional.
  Conceitualmente: `ARCHIVED → ACTIVE` é uma transição administrativa excepcional.
  O proprietário não poderá realizar:
  ```
  ARCHIVED → ACTIVE
  ARCHIVED → INACTIVE
  ```
  através do painel normal da plataforma.

### 2.2. Transições de estado

As transições previstas para o MVP são:

```
                 ┌───────────────┐
                 │    ACTIVE     │
                 └───────┬───────┘
                         │
             ┌───────────┼────────────┐
             │           │            │
             ▼           ▼            ▼
        INACTIVE     SUSPENDED     ARCHIVED
             │           │            │
             │           │            │
             └──→ ACTIVE ←────────────┘
```

Com as seguintes regras de autoridade:

| Transição             | Autoridade         |
| --------------------- | ------------------ |
| `ACTIVE → INACTIVE`   | Owner              |
| `INACTIVE → ACTIVE`   | Owner              |
| `ACTIVE → SUSPENDED`  | Admin              |
| `SUSPENDED → ACTIVE`  | Admin              |
| `ACTIVE → ARCHIVED`   | Owner              |
| `INACTIVE → ARCHIVED` | Owner              |
| `ARCHIVED → ACTIVE`   | Admin, excepcional |

As seguintes transições não fazem parte do comportamento normal do MVP:

```
SUSPENDED → INACTIVE
SUSPENDED → ARCHIVED
ARCHIVED → INACTIVE
```

Essas regras evitam que status seja tratado como um campo comum de edição.

O estado da `Company` representa uma regra de domínio e sua alteração deverá respeitar a autoridade correspondente.

---

## 3. Semântica de DELETE

O endpoint: `DELETE /api/v1/companies/:id` representará uma operação de arquivamento da `Company`.

Ele não representará uma exclusão física do registro.

Quando a operação for autorizada e a `Company` existir:

```
DELETE /companies/:id
        │
        ▼
 CompanyService
        │
        ├── verificar existência
        ├── verificar ownership/autorização
        ├── verificar estado atual
        ├── aplicar lifecycle
        ├── arquivar Company
        ├── tratar slug
        └── registrar auditoria quando aplicável
```

O resultado será: `status = ARCHIVED`

A Company permanecerá persistida.

Portanto:

```
HTTP DELETE
    ≠
SQL DELETE
```

Para `Company`, o método `HTTP DELETE` representa a remoção do recurso de seu ciclo operacional normal, enquanto a persistência física do registro permanece necessária para atender às regras de lifecycle, histórico e auditoria.

---

## 4. Nenhuma cascata destrutiva durante o arquivamento

O arquivamento da `Company` não deverá executar automaticamente:

```
DELETE Company
    ↓
ON DELETE CASCADE
    ↓
DELETE todas as entidades relacionadas
```

Não será utilizada uma estratégia genérica de `ON DELETE CASCADE` como mecanismo para implementar o arquivamento da `Company`.

O ciclo de vida das entidades relacionadas continuará pertencendo aos respectivos módulos e regras de domínio.

Por exemplo:

- `CompanyCategory` possui ciclo de vida próprio;
- `CompanyCatalogItem` possui ciclo de vida próprio;
- `Promotion` possui suas próprias regras;
- `JobVacancy` possui suas próprias regras;
- `News` possui suas próprias regras;
- `Event` possui suas próprias regras;
- `Coupon` possui suas próprias regras;
- `CompanyReview` representa informação histórica da comunidade;
- `Media` possui seu próprio lifecycle;
- `AuditLog` deve sobreviver à operação para permitir auditoria.

O `Company Module` não deverá assumir responsabilidade pelo ciclo de vida físico de entidades pertencentes a outros módulos.

---

## 5. Novo modelo de identidade de negócio

A `Company` deverá possuir um campo obrigatório: `personType` com os valores:

```
INDIVIDUAL
LEGAL_ENTITY
```

Esse campo representa a natureza da pessoa que está sendo representada pela `Company`.

- **`INDIVIDUAL`**
  Utilizado quando a `Company` representa uma pessoa física, incluindo profissionais autônomos.

- **`LEGAL_ENTITY`**
  Utilizado quando a `Company` representa uma pessoa jurídica.

O campo será obrigatório porque a natureza do negócio é uma informação estrutural da entidade e influencia a interpretação de campos como document.

A existência de `personType` não implica a criação de entidades distintas para empresas e profissionais autônomos.

O Bairu continuará utilizando: `Company` para ambos os casos.

---

## 6. Document

O campo: `document` continuará sendo opcional no MVP.
A interpretação do documento será determinada por `personType`.

Conceitualmente:

```
INDIVIDUAL
    ↓
CPF
```

```
LEGAL_ENTITY
    ↓
CNPJ
```

Entretanto, a ausência de `document` continuará sendo válida.

Portanto:

```
personType = INDIVIDUAL
document = null
```

é uma combinação válida no MVP.

Da mesma forma:

```
personType = LEGAL_ENTITY
document = null
```

também é válida.

A obrigatoriedade futura do documento poderá ser estabelecida por regras específicas de negócio, verificação ou publicação.

---

## 7. Proteção do document

O documento não será tratado como senha.

Um CPF ou CNPJ não é um segredo de autenticação, portanto uma estratégia de hash irreversível semelhante à utilizada para senhas não é adequada caso a aplicação precise posteriormente recuperar, exibir, validar ou comparar o documento.

Para dados documentais que exigirem proteção adicional, a estratégia preferencial será:

```
entrada
   ↓
normalização
   ↓
validação
   ↓
proteção no armazenamento
   ↓
persistência
```

Quando houver necessidade de armazenar CPF de forma protegida, deverá ser utilizada criptografia reversível em nível de aplicação/armazenamento, com gerenciamento adequado das chaves.

O sistema não deverá registrar o documento em logs, mensagens de erro ou outros mecanismos de observabilidade.

A aplicação deverá minimizar a exposição desse dado e utilizá-lo somente quando houver necessidade legítima.

O CNPJ também deverá ser tratado conforme os princípios de minimização e proteção de dados aplicáveis, embora sua classificação e necessidade de proteção possam ser diferentes da utilizada para dados pessoais.

A implementação detalhada de criptografia, gerenciamento de chaves e eventual estratégia de busca por documento deverá ser definida na documentação de segurança quando essa funcionalidade for efetivamente implementada.

Esta ADR não define uma implementação criptográfica específica.

---

## 8. Validação de `document`

A validação deverá considerar `personType`.

Inicialmente:

```
INDIVIDUAL
    → validar formato de CPF
```

```
LEGAL_ENTITY
    → validar formato de CNPJ
```

A validação deverá ocorrer na camada apropriada da aplicação.

O formato recebido pelo cliente não deve necessariamente ser armazenado da mesma maneira em que foi enviado.

A aplicação poderá normalizar o documento antes da persistência, removendo formatação superficial como:

```
.
-
/
```

quando aplicável.

A política definitiva de unicidade de `document` permanece fora do escopo desta ADR.

---

## 9. CompanyExternalLink e websiteUrl

O campo: `websiteUrl` será removido de `Company`.
A entidade `Company` utilizará: `CompanyExternalLink` como mecanismo único para armazenar links externos do negócio.
A decisão evita duplicação semântica entre: `Company.websiteUrl` e: `CompanyExternalLink`

A plataforma já possui uma entidade dedicada para representar diferentes tipos de links externos.

Exemplos:

```
INSTAGRAM
WEBSITE
BLOG
FACEBOOK
WHATSAPP
YOUTUBE
TIKTOK
LINKEDIN
```

No MVP, será mantida a restrição: `UNIQUE(companyId, platform)`

Isso significa que uma `Company` poderá possuir no máximo um link por plataforma.

Por exemplo:

```
Company
├── WEBSITE → https://...
├── INSTAGRAM → https://...
└── WHATSAPP → https://...
```

mas não:

```
Company
├── WEBSITE → https://site-a.com
└── WEBSITE → https://site-b.com
```

A entidade `CompanyExternalLink` passa a ser a fonte de verdade para o website e demais links externos da `Company`.

---

## 10. Slug

O `slug` continuará sendo um identificador textual único utilizado para URLs públicas.

A constraint: `UNIQUE(slug)` continuará sendo garantida pelo banco de dados.

A aplicação deverá validar a estrutura do `slug` antes da persistência.

A unicidade definitiva será garantida pela combinação de:

```
validação da aplicação
        +
UNIQUE no banco
```

A aplicação não deverá confiar exclusivamente em uma consulta prévia para garantir unicidade.

Isso ocorre porque duas requisições concorrentes podem verificar simultaneamente que determinado `slug` está disponível.

A `constraint` do banco continua sendo a autoridade final.

Conceitualmente:

```
request
   ↓
validar formato
   ↓
tentar persistir
   ↓
UNIQUE(slug)
   ↓
┌───────────────┬───────────────┐
│ sucesso       │ conflito      │
│               │               │
│ 201/200       │ 409 Conflict  │
└───────────────┴───────────────┘
```

## 11. Slug durante o arquivamento

Quando uma `Company` for arquivada, seu `slug` público original será liberado para utilização futura.

Portanto:

```
ACTIVE

slug = "padaria-centro"
```

poderá tornar-se:

```
ARCHIVED

slug = "padaria-centro-archived"
```

Isso permite que uma nova `Company` utilize posteriormente:

`slug = "padaria-centro"`

quando o `slug` estiver disponível.

A alteração do `slug` fará parte da operação de arquivamento e deverá respeitar a `constraint` de unicidade.

### 11.1. Conflitos de slug arquivado

A aplicação não deverá assumir que: `<slug>-archived`

estará necessariamente disponível.

Caso já exista uma `Company` com esse `slug`, deverá ser utilizado um sufixo adicional conforme estratégia determinística da aplicação.

Exemplo:

```
padaria-centro
↓
padaria-centro-archived
```

se indisponível:

```
padaria-centro-archived-2
```

e assim sucessivamente.

A estratégia exata de geração do sufixo poderá ser refinada durante a implementação, desde que preserve:

- unicidade;
- determinismo;
- validade do slug;
- previsibilidade;
- ausência de colisões.

---

## 12. URLs públicas após arquivamento

O arquivamento pode alterar o `slug` público da `Company`.

Consequentemente, a URL: `/empresas/padaria-centro` poderá deixar de representar a `Company` arquivada.

A preservação de URLs históricas, redirects permanentes ou estratégias de SEO não faz parte do escopo do MVP.

Caso essa necessidade surja posteriormente, deverá ser tratada através de uma decisão específica sobre histórico de URLs e aliases de slug.

---

## 13. Criação da `Company`

A criação de uma `Company` deverá definir automaticamente: `status = ACTIVE`

O cliente não deverá controlar o status no `CreateCompanyDto`.

Portanto, uma requisição de criação não deverá aceitar livremente:

```
{
  "status": "SUSPENDED"
}
```

ou:

```
{
  "status": "ARCHIVED"
}

```

O estado inicial é uma regra de aplicação.

---

## 14. Status não é um campo comum de atualização

O campo `status` não deverá ser tratado como uma propriedade comum de: `UpdateCompanyDto`.

Isso evita permitir que um proprietário envie:

```
{
  "status": "SUSPENDED"
}
```

ou:

```
{
  "status": "ACTIVE"
}
```

e contorne as regras de autorização do lifecycle.

Alterações de estado deverão passar por operações que respeitem a autoridade correspondente.

Conceitualmente:

```
Owner
   │
   ├── activate
   ├── deactivate
   └── archive

Admin
   │
   ├── suspend
   ├── unsuspend
   └── restore
```

A forma definitiva de exposição dessas operações na API poderá ser definida durante a implementação do módulo e das futuras operações administrativas.

---

## 15. Ownership

A `Company` continuará possuindo exatamente um proprietário no MVP: `Company.owner_user_id`

A cardinalidade será: `User 1 ───── N Company`

O proprietário poderá controlar operações compatíveis com seu nível de autoridade.

Conhecer o `companyId` não é suficiente para modificar ou arquivar uma `Company`.

Toda operação protegida deverá validar ownership ou outra forma de autorização administrativa.

---

## 16. Consequências

### 16.1. Consequências positivas

- O lifecycle da Company passa a representar claramente diferentes situações de negócio.
- O proprietário consegue desativar temporariamente sua Company sem arquivá-la.
- Suspensões administrativas ficam semanticamente distintas de ações voluntárias.
- O arquivamento passa a representar uma retirada do ciclo operacional, e não uma exclusão física.
- O histórico da Company permanece persistido.
- O slug original pode ser reutilizado depois do arquivamento.
- O `personType` permite distinguir estruturalmente pessoas físicas e jurídicas.
- O modelo continua suportando profissionais autônomos sem criar uma entidade separada.
- `CompanyExternalLink` passa a ser a fonte única para links externos.
- A duplicidade entre `websiteUrl` e `CompanyExternalLink` é eliminada.
- A constraint de unicidade do banco continua protegendo o `slug` contra concorrência.
- As entidades relacionadas continuam responsáveis por seus próprios lifecycles.
- A API não precisa expor diretamente regras internas de persistência.

### 16.2. Consequências negativas

O lifecycle da Company tornou-se mais complexo do que o modelo original de três estados.
Operações administrativas precisarão de autorização distinta das operações do proprietário.
O arquivamento exige uma operação adicional para alterar o `slug`.
Slugs públicos podem mudar durante o arquivamento.
O tratamento seguro de documentos pessoais adicionará complexidade à persistência.
A recuperação de Companies arquivadas não poderá ser realizada normalmente pelo proprietário.
As políticas de lifecycle das entidades dependentes continuarão exigindo decisões próprias.
Consultas públicas precisarão considerar corretamente `ACTIVE`, `INACTIVE`, `SUSPENDED` e `ARCHIVED`.

---

## 17. O que esta decisão não define

Esta ADR não define:

- a política completa de lifecycle de `CompanyCategory`;
- a política completa de lifecycle de `CompanyCatalogItem`;
- a política de lifecycle de `Promotion`;
- a política de lifecycle de `JobVacancy`;
- a política de lifecycle de `News`;
- a política de lifecycle de `Event`;
- a política de lifecycle de `Coupon`;
- a política de lifecycle de `FeedPublication`;
- a política definitiva para `Favorite`;
- a política definitiva para `CompanyReview`;
- a política completa de lifecycle de `Media`;
- os períodos de retenção de dados;
- a política definitiva de `hard delete`;
- a política de aprovação/verificação de Companies;
- a política de múltiplos proprietários;
- regras futuras específicas para profissionais autônomos;
- a política de histórico de URLs;
- redirects ou aliases de `slug`;
- uma implementação criptográfica específica para documentos;
- a estratégia definitiva de busca por documentos protegidos;
- a obrigatoriedade futura de `document`.

Essas decisões deverão ser tratadas nas respectivas documentações ou ADRs quando necessário.

---

## 18. Hard Delete

A exclusão física de uma Company não faz parte do contrato inicial da API.

O endpoint: `DELETE /api/v1/companies/:id` não deverá ser alterado silenciosamente para executar: `prisma.company.delete(...)`

Caso futuramente exista uma necessidade legítima de exclusão permanente, a operação deverá ser avaliada separadamente considerando:

- requisitos de retenção;
- auditoria;
- privacidade;
- entidades dependentes;
- Media;
- integridade referencial;
- dados históricos;
- requisitos legais;
- impacto sobre URLs;
- impacto sobre outras entidades do domínio.

Uma futura operação de `hard delete` deverá possuir decisão arquitetural própria.

---

## 19. Relação com as Convenções Existentes

Esta decisão deve permanecer consistente com:

- `CON-001-architecture-conventions.md`;
- `CON-002-domain-and-data-modeling-conventions.md`;
- `CON-003-rest-api-conventions.md`;
- `CON-007-media-architecture-and-lifecycle-standards.md`;
- `CON-008-data-lifecycle-and-audit-standards.md`.

Também deve permanecer alinhada à especificação: `Company — Entity Specification`.

A especificação de Company descreve a estrutura e as regras específicas da entidade.

Esta ADR consolida as decisões arquiteturais e de domínio tomadas durante a preparação da implementação do `Company Module`.

Quando houver conflito entre esta ADR e a documentação da entidade, ambas deverão ser revisadas para manter consistência.

---

## 20. Resumo da Decisão

O modelo final de lifecycle da Company será:

```
                    ┌──────────────┐
                    │    ACTIVE    │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
         INACTIVE      SUSPENDED     ARCHIVED
              │            │            │
              │            │            │
              └───────► ACTIVE ◄────────┘
```

Com as seguintes regras:

```
ACTIVE
  ├── Owner → INACTIVE
  ├── Owner → ARCHIVED
  └── Admin → SUSPENDED

INACTIVE
  ├── Owner → ACTIVE
  └── Owner → ARCHIVED

SUSPENDED
  └── Admin → ACTIVE

ARCHIVED
  └── Admin → ACTIVE (excepcional)
```

A criação da Company resulta em:

```
Create Company
      ↓
status = ACTIVE
```

O arquivamento resulta em:

```
DELETE /api/v1/companies/:id
      ↓
authorization
      ↓
Company exists?
      │
      ├── No → 404
      │
      ▼
ARCHIVE
      │
      ├── status = ARCHIVED
      ├── Company permanece persistida
      ├── slug original é liberado
      ├── slug recebe sufixo de arquivamento
      ├── nenhuma cascata destrutiva
      └── auditoria conforme política central
```

A identidade estrutural da Company será:

```
Company
├── personType
│   ├── INDIVIDUAL
│   └── LEGAL_ENTITY
│
├── document (opcional)
│
├── name
├── slug
├── description
├── phone
├── email
│
├── CompanyExternalLink[]
│   └── máximo 1 por plataforma
│
└── status
    ├── ACTIVE
    ├── INACTIVE
    ├── SUSPENDED
    └── ARCHIVED
```

Portanto, a decisão consolidada é:

A Company possui um lifecycle explícito de quatro estados, com transições controladas por autoridade.
`DELETE /api/v1/companies/:id` representa o arquivamento da Company, não sua exclusão física. O arquivamento libera o `slug` original através de sua renomeação, sem realizar cascade destrutivo sobre entidades relacionadas.
A Company passa a distinguir estruturalmente pessoas físicas e jurídicas através de `personType`, mantém `document` opcional e utiliza `CompanyExternalLink` como fonte única para links externos, removendo `websiteUrl` da entidade.
