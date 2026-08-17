# ADR-004 — Estratégia de Ambientes e PostgreSQL

**Status:** Accepted
**Date:** 2026-08-08

## Context

O Bairu necessita de uma estratégia de persistência que permita desenvolver, testar e executar a aplicação em ambientes isolados, mantendo simplicidade durante o MVP e evitando acoplamento desnecessário a um provedor específico de infraestrutura.

O backend utiliza PostgreSQL como banco de dados relacional e Prisma como ORM.

O projeto também pretende utilizar Docker como parte da estratégia de desenvolvimento, tanto para facilitar a reprodução do ambiente quanto para permitir o aprendizado e a adoção gradual de infraestrutura containerizada.

Para produção, o Supabase é considerado uma opção adequada para o MVP por oferecer PostgreSQL gerenciado, reduzindo a necessidade de administrar diretamente a infraestrutura do banco.

Entretanto, a aplicação não deve depender das características específicas do Supabase para operar com PostgreSQL.

---

## Decision

O Bairu adotará PostgreSQL como tecnologia de banco de dados relacional e manterá a aplicação desacoplada do provedor que hospeda o banco.

A estratégia inicial será composta por três contextos principais:

| Ambiente        | Infraestrutura                      | Objetivo              |
| --------------- | ----------------------------------- | --------------------- |
| Desenvolvimento | PostgreSQL em Docker                | Desenvolvimento local |
| Testes          | PostgreSQL isolado                  | Testes automatizados  |
| Produção        | PostgreSQL gerenciado pelo Supabase | Execução do MVP       |

A aplicação utilizará uma configuração baseada em `DATABASE_URL` para estabelecer a conexão com o PostgreSQL.

A aplicação não deverá depender diretamente do provedor de infraestrutura para executar operações básicas de persistência.

---

## Development

O ambiente de desenvolvimento utilizará PostgreSQL executado localmente através de Docker.

A infraestrutura será definida de forma reproduzível, permitindo que o banco seja criado e destruído sem depender de uma instalação local do PostgreSQL na máquina do desenvolvedor.

A princípio, o ambiente deverá conter apenas os serviços necessários para o desenvolvimento do Bairu.

Não serão adicionados containers ou serviços sem uma necessidade concreta.

### Objetivos

- facilitar o onboarding;
- tornar o ambiente reproduzível;
- permitir desenvolvimento offline;
- evitar dependência de infraestrutura externa;
- facilitar o aprendizado e adoção gradual de Docker;
- manter o ambiente local próximo da tecnologia utilizada em produção.

---

## Testing

O ambiente de testes não compartilhará o banco utilizado durante o desenvolvimento.

Os testes deverão utilizar uma instância de PostgreSQL isolada, evitando que operações realizadas pelos testes contaminem ou destruam dados utilizados durante o desenvolvimento.

A estratégia concreta de provisionamento do banco de testes será definida junto à infraestrutura de testes automatizados.

Durante o desenvolvimento local, Docker poderá ser utilizado para fornecer essa infraestrutura.

No CI, o PostgreSQL deverá ser provisionado de forma automatizada e reproduzível.

---

## Production

O MVP utilizará o Supabase como provedor de PostgreSQL gerenciado em produção.

Essa decisão reduz a necessidade de administrar diretamente:

- servidor PostgreSQL;
- atualizações do banco;
- disponibilidade da infraestrutura;
- backups;
- manutenção operacional da instância.

O Supabase será tratado como uma decisão de infraestrutura, e não como parte do domínio ou da lógica de negócio da aplicação.

---

## Portability

A aplicação deverá depender da interface fornecida pelo PostgreSQL e pelo Prisma, e não de APIs específicas do provedor de infraestrutura.

A conexão será configurada através de:

```env
DATABASE_URL="..."
```

A implementação não deverá assumir que o banco está hospedado no Supabase.

Dessa forma, uma futura migração para outro provedor compatível com PostgreSQL, como AWS RDS ou outro serviço gerenciado, deverá exigir principalmente alterações de infraestrutura e configuração.

Exemplo:

```text
Supabase
   │
   │ DATABASE_URL
   ▼
Bairu API
```

poderá futuramente tornar-se:

```text
AWS RDS
   │
   │ DATABASE_URL
   ▼
Bairu API
```

sem alteração da lógica de negócio.

---

## Provider-specific Features

O uso de funcionalidades específicas do Supabase não será proibido.

Entretanto, qualquer adoção de serviços como:

- Supabase Auth;
- Supabase Storage;
- Supabase Realtime;
- APIs específicas do Supabase;

deverá ser tratada como uma decisão arquitetural independente.

A adoção de uma funcionalidade específica do provedor não deverá ser considerada automaticamente parte da arquitetura de persistência PostgreSQL.

---

## Environment Isolation

Cada ambiente deverá possuir seus próprios recursos de infraestrutura e suas próprias credenciais.

Os ambientes não deverão compartilhar:

- banco de dados;
- credenciais;
- dados de aplicação;
- configurações sensíveis.

A princípio:

```text
Development
    └── PostgreSQL local

Testing
    └── PostgreSQL isolado

Production
    └── PostgreSQL gerenciado
```

---

## Configuration

As informações de conexão com o banco serão fornecidas por configuração de ambiente.

A aplicação não deverá possuir credenciais ou URLs de banco hardcoded no código-fonte.

A configuração será responsável por fornecer os valores necessários ao Prisma e à aplicação.

A estratégia completa de gerenciamento de variáveis de ambiente será detalhada na documentação da RF-010 — Database & Prisma.

---

## Migrations

As alterações estruturais do banco serão controladas por migrations do Prisma.

As migrations serão versionadas no repositório e deverão ser aplicáveis de maneira reproduzível nos ambientes suportados.

A execução das migrations em cada ambiente será definida na estratégia de banco e deployment.

---

## Consequences

### Positive

- ambientes isolados;
- desenvolvimento reproduzível;
- menor dependência de infraestrutura externa durante o desenvolvimento;
- facilidade para executar testes contra PostgreSQL real;
- produção utilizando banco gerenciado;
- menor acoplamento ao Supabase;
- possibilidade de migração futura para outro provedor PostgreSQL;
- aprendizado prático de Docker dentro do projeto.

### Negative

- necessidade de manter infraestrutura local com Docker;
- necessidade de administrar configurações diferentes entre ambientes;
- necessidade de manter ambientes de banco separados;
- introdução de uma pequena complexidade operacional;
- custos de infraestrutura em produção.

---

## Alternatives Considered

### Supabase em todos os ambientes

**Não adotado.**

Embora simplifique inicialmente a infraestrutura, criaria uma dependência desnecessária de um serviço externo durante o desenvolvimento e reduziria a reprodução local do ambiente.

Também dificultaria o isolamento dos testes caso o mesmo projeto/banco fosse utilizado para desenvolvimento e testes.

---

### PostgreSQL instalado diretamente na máquina

**Não adotado como estratégia principal.**

Essa abordagem funciona, mas torna o ambiente dependente da configuração específica da máquina do desenvolvedor.

Docker oferece uma forma mais reproduzível de executar a mesma tecnologia.

---

### PostgreSQL gerenciado em todos os ambientes

**Não adotado para o MVP.**

A estratégia aumentaria a dependência de infraestrutura externa e poderia gerar custos e complexidade sem benefício proporcional para o estágio atual do projeto.

---

### Supabase como dependência direta da aplicação

**Não adotado como princípio arquitetural.**

O Supabase poderá ser utilizado como provedor de infraestrutura e, caso funcionalidades específicas sejam adotadas posteriormente, cada uma deverá ser avaliada individualmente.

---

## Scope

Esta ADR define a estratégia arquitetural para os ambientes e para o PostgreSQL.

Detalhes de implementação, como:

- Docker Compose;
- portas;
- nomes de containers;
- volumes;
- credenciais locais;
- configuração específica do Prisma;
- pipeline de CI;
- gerenciamento de secrets;

serão definidos nas documentações e tarefas de implementação correspondentes.

---

## Related

- **RF-010 — Database & Prisma**
- **RF-014 — Backend Testing Foundation**
- Estratégia de deployment do Bairu
- Documentação de segurança e gerenciamento de secrets
