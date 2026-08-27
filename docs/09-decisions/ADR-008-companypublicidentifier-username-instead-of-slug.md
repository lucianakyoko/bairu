# ADR-008 — Company Public Identifier: Username instead of Slug

## 1. Status

Accepted

## 2. Data

2026-08-27

## 3. Contexto

A entidade `Company` precisa possuir uma identidade pública utilizada para descoberta e acesso à sua página pública.

Inicialmente, essa identidade seria representada por um `slug`. Durante a evolução da modelagem da entidade, foi definido que a identidade pública deve ser representada por um `username`.

A especificação atual de `Company` já adota `username`, porém a decisão arquitetural ainda não estava registrada em uma ADR.

## 4. Decisão

O `slug` não será utilizado como identificador público da `Company`.

A `Company` utilizará `username` como sua identidade pública.

O `username` será:

- único;
- público;
- escolhido pelo usuário;
- armazenado em lowercase;
- validado conforme as regras definidas na especificação da entidade `Company`.

A identificação interna e os relacionamentos entre entidades continuarão utilizando `Company.id`.

O `username` não deve ser utilizado como chave estrangeira ou identificador de relacionamento interno.

## 5. Consequências

### Positivas

- Mantém uma identidade pública explícita para cada `Company`.
- Evita manter `slug` e `username` com responsabilidades sobrepostas.
- Permite que a identidade pública seja escolhida pelo proprietário.
- Mantém os relacionamentos internos independentes da identidade pública.
- Simplifica a modelagem da entidade `Company`.

### Trade-offs

- Alterações de `username` podem afetar URLs públicas e referências externas.
- A política de alteração e reutilização de usernames deve ser definida pela especificação da `Company`.
- Histórico, aliases ou redirecionamentos de usernames não fazem parte desta decisão inicial.

## 6. Escopo da Decisão

Esta decisão afeta principalmente:

- entidade `Company`;
- persistência e constraints;
- API pública;
- URLs públicas;
- descoberta de Companies.

As regras detalhadas de validação, alteração, unicidade e lifecycle do `username` permanecem definidas em:

`DB-102-company.md`

## 7. Decisões Relacionadas

- `DB-102-company.md` — especificação da entidade `Company`.
- `CON-002-domain-and-data-modeling-conventions.md` — convenções de domínio e modelagem.
- `CON-003-rest-api-conventions.md` — convenções da API REST.
