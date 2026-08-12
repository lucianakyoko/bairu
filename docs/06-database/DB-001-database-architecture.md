# DB-001 — Database Architecture

## 1. Objetivo

Este documento estabelece a arquitetura de banco de dados adotada pelo Bairu.

Seu objetivo é definir os princípios, tecnologias, responsabilidades e decisões estruturais que orientam a persistência dos dados da plataforma.

Este documento serve como referência para:

- definição do banco de dados;
- evolução do schema;
- criação e manutenção de migrations;
- configuração dos ambientes;
- integração com o backend;
- decisões relacionadas à persistência;
- evolução futura da infraestrutura de dados.

As convenções detalhadas de modelagem de entidades, nomenclatura, identificadores, relacionamentos, índices, dados derivados e demais regras de modelagem permanecem definidas em:

`CON-002-domain-and-data-modeling-conventions.md`

As regras relacionadas ao ciclo de vida, retenção, exclusão e auditoria permanecem definidas em:

`CON-008-data-lifecycle-and-audit-standards.md`

As regras específicas para armazenamento e lifecycle de mídias permanecem definidas em:

`CON-007-media-architecture-and-lifecycle-standards.md`

---

## 2. Escopo

Este documento trata da arquitetura de persistência do Bairu.

Estão incluídos:

- banco de dados relacional;
- PostgreSQL;
- Prisma ORM;
- organização lógica da persistência;
- ambientes de banco;
- migrations;
- integridade e consistência;
- transações;
- índices;
- evolução do schema;
- isolamento entre ambientes;
- integração com o backend;
- princípios de backup e recuperação;
- princípios de segurança da persistência;
- estratégias para evolução futura.

Não fazem parte deste documento:

- regras específicas de negócio das entidades;
- contratos da API;
- regras específicas do frontend;
- regras detalhadas de lifecycle e retenção;
- regras específicas de armazenamento de mídias.

Essas responsabilidades permanecem documentadas nos documentos correspondentes.

---

## 3. PostgreSQL

O Bairu utiliza PostgreSQL como banco de dados relacional principal.

A escolha por PostgreSQL está alinhada às características atuais do produto e aos requisitos da plataforma, incluindo:

- suporte robusto a relacionamentos;
- integridade referencial;
- constraints;
- transações ACID;
- índices;
- tipos estruturados;
- suporte a JSON/JSONB quando necessário;
- maturidade do ecossistema;
- ampla disponibilidade de provedores gerenciados;
- capacidade de evolução da infraestrutura sem alteração significativa do modelo de domínio.

O PostgreSQL é a fonte de verdade para os dados persistidos da aplicação.

Serviços externos podem armazenar recursos complementares, como arquivos de mídia, mas não substituem o PostgreSQL como fonte de verdade dos metadados e relacionamentos persistidos pela plataforma.

---

## 4. Prisma ORM

O Bairu utiliza Prisma como ORM para acesso ao PostgreSQL.

O Prisma é responsável por fornecer uma camada tipada de acesso aos dados e facilitar:

- definição do schema da aplicação;
- consultas;
- operações de persistência;
- migrations;
- integração com TypeScript;
- geração do Prisma Client.

O Prisma é considerado uma ferramenta de infraestrutura e persistência.

O uso do Prisma não deve transferir regras de negócio para a camada de persistência.

O modelo Prisma deve refletir as necessidades estruturais do domínio, mas não deve ser considerado, isoladamente, a definição completa do domínio.

---

## 5. Relação entre Domínio e Persistência

A arquitetura separa o significado dos dados dos detalhes técnicos de sua persistência.

De forma geral:

```text
HTTP
 │
 ▼
Controller
 │
 ▼
Application / Use Case
 │
 ▼
Domain
 │
 ▼
Persistence
 │
 ▼
Prisma Client
 │
 ▼
PostgreSQL
```

O domínio define:

- conceitos;
- regras de negócio;
- relacionamentos conceituais;
- invariantes;
- estados e comportamentos relevantes.

A camada de persistência é responsável por:

- armazenar dados;
- consultar dados;
- garantir integridade estrutural;
- executar operações transacionais;
- aplicar constraints;
- comunicar-se com o PostgreSQL.

Detalhes específicos do PostgreSQL ou Prisma não devem se espalhar desnecessariamente pelas regras de domínio.

A arquitetura detalhada de responsabilidades entre essas camadas está definida em:

`CON-001-architecture-conventions.md`

---

## 6. PostgreSQL como Fonte de Verdade

O PostgreSQL é a fonte de verdade para os dados persistentes da aplicação.

Quando um dado também estiver presente em outro sistema, deve existir uma definição explícita de qual sistema é a fonte de verdade.

Exemplo:

```text
Company
   │
   └── PostgreSQL
          │
          └── fonte de verdade
```

Para mídias:

```text
Company Image
      │
      ├── PostgreSQL
      │      └── Media metadata / reference
      │
      └── Cloudinary
             └── Binary Asset
```

Nesse caso:

- PostgreSQL é a fonte de verdade da referência, metadados e relacionamento;
- Cloudinary é responsável pelo armazenamento do arquivo físico.

As regras específicas dessa integração estão definidas em:

`CON-007-media-architecture-and-lifecycle-standards.md`

---

## 7. Organização por Domínio

O banco deve refletir a organização conceitual do domínio da plataforma.

O Bairu utiliza Bounded Contexts para estabelecer limites conceituais entre responsabilidades.

Os principais contextos definidos atualmente são:

| Contexto       | Responsabilidade                                     |
| -------------- | ---------------------------------------------------- |
| Identity       | Usuários e identidade                                |
| Business       | Empresas e informações institucionais                |
| Discovery      | Categorias e descoberta                              |
| Content        | Conteúdos publicados                                 |
| Feed           | Distribuição e agregação de conteúdo                 |
| Community      | Interações da comunidade                             |
| Administration | Administração, auditoria e operações administrativas |

Esses contextos não representam bancos independentes.

No MVP, os contextos permanecem dentro de um banco PostgreSQL principal.

A separação é principalmente conceitual e arquitetural.

A organização física das tabelas não deve antecipar uma arquitetura distribuída que ainda não seja necessária.

---

## 8. Banco Único no MVP

O Bairu utilizará um banco PostgreSQL principal no MVP.

A adoção de múltiplos bancos, bancos por contexto ou bancos por serviço não faz parte da arquitetura inicial.

A decisão de utilizar um banco único reduz:

- complexidade operacional;
- custo de infraestrutura;
- dificuldade de desenvolvimento;
- complexidade transacional;
- necessidade de sincronização entre bancos.

Essa abordagem não impede uma futura separação física caso o crescimento da plataforma justifique essa mudança.

Uma eventual separação deverá ser tratada como decisão arquitetural específica e registrada como ADR quando representar impacto significativo.

---

## 9. Schemas do PostgreSQL

A arquitetura inicial não exige a criação de um schema PostgreSQL separado para cada Bounded Context.

Durante o MVP, as entidades podem permanecer no schema padrão utilizado pela aplicação, mantendo a separação principalmente através da organização do domínio e do código.

Exemplo conceitual:

```text
PostgreSQL
└── public
    ├── users
    ├── companies
    ├── categories
    ├── company_catalog_items
    ├── feed_publications
    ├── favorites
    ├── company_reviews
    └── ...
```

Schemas adicionais poderão ser considerados futuramente caso exista necessidade real de:

- isolamento;
- permissões diferenciadas;
- organização operacional;
- separação lógica;
- requisitos específicos de infraestrutura.

A criação de schemas adicionais não deve ocorrer apenas para reproduzir a separação conceitual dos Bounded Contexts.

---

## 10. Identificadores

Entidades persistentes utilizam UUID como identificador primário.

Exemplo:

```text
id UUID
```

A justificativa e as convenções detalhadas de identificadores estão definidas em:

`CON-002-domain-and-data-modeling-conventions.md`

O banco deve preservar o identificador como um valor técnico sem significado de negócio.

Identificadores funcionais, como slugs e códigos públicos, devem ser modelados separadamente quando necessários.

---

## 11. Integridade Referencial

A integridade estrutural dos dados deve ser protegida pelo PostgreSQL sempre que possível.

Devem ser utilizadas, conforme a necessidade:

- `NOT NULL`;
- `FOREIGN KEY`;
- `UNIQUE`;
- `CHECK`;
- tipos apropriados;
- constraints;
- índices.

Exemplo:

```text
companies
    │
    └── id
          │
          ▼
company_catalog_items
    │
    └── company_id
```

Foreign Keys devem impedir referências inválidas sempre que a relação fizer parte da integridade estrutural do domínio.

Regras que dependam de contexto, autorização ou comportamento da aplicação permanecem na camada de domínio.

---

## 12. Integridade em Diferentes Camadas

A integridade dos dados é responsabilidade conjunta da aplicação e do banco.

### 12.1. Aplicação

A aplicação é responsável por:

- regras de negócio;
- autorização;
- validações contextuais;
- transições de estado;
- políticas de acesso;
- orquestração das operações.

### 12.2. Banco de Dados

O banco é responsável por:

- integridade referencial;
- unicidade;
- nulabilidade;
- constraints;
- tipos;
- integridade estrutural.

Nenhuma das camadas deve ser considerada substituta da outra.

A aplicação não deve depender exclusivamente de validações de código para garantir invariantes que o banco consiga proteger estruturalmente.

Da mesma forma, regras que dependem de contexto de negócio não devem ser transferidas indiscriminadamente para constraints do banco.

---

## 13. Transações

Operações que precisam manter consistência entre múltiplas alterações no banco devem utilizar transações.

Exemplo:

```text
BEGIN
    create review
    update company rating
COMMIT
```

Se uma etapa crítica falhar:

```text
BEGIN
    create review
    update company rating
ROLLBACK
```

O objetivo é impedir estados parcialmente persistidos quando as operações fizerem parte da mesma unidade de consistência.

As transações devem possuir escopo adequado e não devem permanecer abertas por períodos desnecessariamente longos.

---

## 14. Limites das Transações

Transações PostgreSQL não devem ser utilizadas para representar transações distribuídas envolvendo serviços externos.

Por exemplo:

```text
PostgreSQL
     +
Cloudinary
```

não constitui uma única transação ACID.

Operações envolvendo sistemas externos devem utilizar estratégias apropriadas de:

- ordenação;
- compensação;
- retry;
- recuperação;
- reconciliação.

As regras específicas para mídia estão definidas em:

`CON-007-media-architecture-and-lifecycle-standards.md`

---

## 15. Migrations

Alterações estruturais no banco devem ser realizadas através de migrations versionadas.

O schema do banco não deve ser alterado manualmente em ambientes compartilhados ou de produção sem uma estratégia de migration correspondente.

As migrations devem:

- possuir histórico versionado;
- ser revisáveis;
- ser aplicáveis de forma previsível;
- representar alterações estruturais reais;
- ser executadas de maneira controlada nos ambientes;
- permanecer versionadas no Git.

As migrations fazem parte do código-fonte do projeto.

---

## 16. Schema Prisma, Migration e Banco

A evolução estrutural do banco deve manter coerência entre diferentes representações do sistema.

A relação conceitual é:

```text
Domain Model
      ↓
Prisma Schema
      ↓
Migration
      ↓
PostgreSQL
```

Cada elemento possui uma responsabilidade diferente:

### Domain Model

Representa o significado e as regras do dado no domínio.

### Prisma Schema

Representa a estrutura necessária para a aplicação interagir com o banco através do Prisma.

### Migration

Representa uma alteração versionada na estrutura persistida.

### PostgreSQL

Representa o estado efetivamente persistido do banco.

Essas representações devem permanecer coerentes.

Uma alteração no domínio que impacte persistência deve ser refletida no Prisma Schema e, quando necessário, em uma migration.

---

## 17. Estratégia de Migrations

Durante o desenvolvimento, migrations podem evoluir conforme o modelo do domínio é refinado.

Depois que uma migration tiver sido aplicada em um ambiente compartilhado, ela não deve ser editada retroativamente para alterar seu significado.

Quando uma alteração for necessária, deve ser criada uma nova migration.

Exemplo:

```text
Migration 001
    ↓
create companies

Migration 002
    ↓
add company status

Migration 003
    ↓
add company slug
```

Essa abordagem preserva o histórico de evolução do banco.

Migrations devem ser pequenas o suficiente para serem compreendidas e revisadas, mas não devem ser fragmentadas artificialmente em alterações sem significado próprio.

---

## 18. Desenvolvimento e Migrations

O ambiente de desenvolvimento deve permitir a evolução controlada do schema através de migrations.

Alterações experimentais podem ocorrer durante o desenvolvimento inicial, desde que o histórico de migrations ainda não tenha sido tratado como compartilhado ou definitivo.

Uma vez que uma migration faça parte do histórico compartilhado do projeto, alterações estruturais devem ser realizadas por novas migrations.

A estratégia específica de execução de migrations em cada ambiente deve ser definida conforme o fluxo de deployment.

---

## 19. Ambientes de Banco de Dados

O Bairu deve manter ambientes de banco isolados conforme a necessidade do ciclo de desenvolvimento.

A arquitetura considera:

```text
Development
     │
     ▼
Test
     │
     ▼
Staging
     │
     ▼
Production
```

Cada ambiente deve possuir banco ou instância logicamente isolada.

Dados de produção não devem ser utilizados diretamente em desenvolvimento ou testes sem estratégia apropriada de proteção, anonimização e autorização.

---

## 20. Banco de Desenvolvimento

O ambiente de desenvolvimento é destinado à implementação e experimentação controlada.

Características esperadas:

- dados não produtivos;
- migrations aplicáveis localmente;
- possibilidade de recriação do banco;
- liberdade controlada para testes de desenvolvimento.

O banco de desenvolvimento não deve ser tratado como fonte de verdade para dados de negócio.

---

## 21. Banco de Testes

O ambiente de testes deve possuir isolamento suficiente para permitir execução repetível dos testes.

Os testes não devem depender de dados persistidos por execuções anteriores.

Sempre que necessário, o ambiente deve permitir:

- criação do banco;
- execução de migrations;
- preparação de dados de teste;
- limpeza;
- recriação.

O objetivo é evitar testes dependentes de estado residual.

---

## 22. Staging

O ambiente de staging deve representar, dentro do possível, as características estruturais de produção.

Seu objetivo é validar:

- migrations;
- integração entre aplicações;
- comportamento de persistência;
- configurações;
- operações de deploy;
- mudanças estruturais do banco.

Staging não deve compartilhar dados de produção de forma indiscriminada.

---

## 23. Produção

O banco de produção contém os dados oficiais da plataforma.

Operações em produção devem ser controladas e rastreáveis.

Alterações estruturais devem ocorrer através do processo de migration adotado pelo projeto.

Acesso direto ao banco de produção deve ser restrito e utilizado apenas quando houver necessidade operacional legítima.

---

## 24. Prisma Client

O acesso da aplicação ao PostgreSQL deve ocorrer através do Prisma Client, salvo casos específicos que justifiquem uma abordagem diferente.

Consultas SQL raw poderão ser utilizadas quando:

- a operação não puder ser representada adequadamente pelo ORM;
- houver benefício significativo de performance;
- existir necessidade específica do PostgreSQL.

SQL raw não deve ser utilizado indiscriminadamente.

Quando utilizado, deve:

- permanecer encapsulado na camada apropriada;
- ser revisado;
- utilizar parâmetros seguros;
- evitar exposição a SQL Injection;
- possuir justificativa quando representar uma exceção à abordagem padrão.

---

## 25. Consultas e Performance

A arquitetura deve considerar performance desde o desenho das consultas.

Devem ser evitados:

- N+1 queries;
- carregamento desnecessário de relacionamentos;
- consultas sem filtros em grandes coleções;
- paginações ineficientes;
- índices sem justificativa;
- recuperação de campos que não são utilizados.

Índices devem ser definidos conforme os padrões de consulta relevantes.

A criação de índices deve considerar o equilíbrio entre:

```text
Read Performance
        ↕
Write Cost
        ↕
Storage Cost
```

Otimizações mais complexas devem ser introduzidas somente quando houver necessidade observável.

As convenções gerais de índices permanecem definidas em:

`CON-002-domain-and-data-modeling-conventions.md`

---

## 26. Paginação

Coleções potencialmente grandes devem possuir estratégia de paginação.

A escolha entre paginação baseada em offset e cursor deve considerar:

- volume esperado;
- padrão de consulta;
- necessidade de ordenação;
- estabilidade dos resultados;
- custo da consulta.

No MVP, a estratégia pode ser escolhida de acordo com cada caso de uso, desde que seja consistente com as convenções da API e adequada ao volume esperado.

A paginação por cursor não deve ser aplicada indiscriminadamente a todas as operações apenas por antecipação de escala.

---

## 27. Dados Derivados

Dados derivados podem ser persistidos quando houver benefício significativo de leitura.

Exemplos:

```text
Company
├── rating_average
├── rating_count
└── favorites_count
```

Esses valores não são fontes de verdade.

Sua fonte permanece nas entidades de origem.

Os dados derivados devem:

- ser recalculáveis;
- não ser editáveis diretamente pelos usuários;
- ser atualizados de forma consistente;
- possuir estratégia de recuperação caso fiquem inconsistentes.

As regras detalhadas estão definidas em:

`CON-002-domain-and-data-modeling-conventions.md`

---

## 28. JSON e Dados Semiestruturados

O PostgreSQL suporta dados JSON/JSONB.

O uso de JSONB poderá ser considerado quando:

- a estrutura for genuinamente variável;
- o dado não representar uma entidade relacional importante;
- não houver necessidade de relacionamentos complexos;
- a flexibilidade justificar a perda de estrutura relacional.

JSONB não deve ser utilizado apenas para evitar modelar corretamente uma entidade.

Informações que possuem:

- relacionamentos;
- regras de negócio;
- constraints;
- consultas frequentes;
- ciclo de vida próprio;

devem preferencialmente possuir modelagem relacional adequada.

---

## 29. Armazenamento de Mídias

O banco não deve armazenar conteúdo binário de imagens ou outros arquivos de mídia.

O PostgreSQL deve armazenar apenas:

- identificadores;
- referências;
- metadados;
- relacionamentos necessários.

O arquivo físico permanece em storage externo.

No MVP:

```text
PostgreSQL
    │
    └── Media metadata
             │
             ▼
        Cloudinary
             │
             └── Binary Asset
```

As regras específicas de mídia estão definidas em:

`CON-007-media-architecture-and-lifecycle-standards.md`

---

## 30. Auditoria e Lifecycle

A arquitetura de banco deve suportar as políticas gerais de:

- lifecycle;
- retenção;
- auditoria;
- exclusão;
- anonimização.

Essas regras não devem ser redefinidas individualmente neste documento.

A referência normativa é:

`CON-008-data-lifecycle-and-audit-standards.md`

O banco deverá fornecer os mecanismos necessários para implementar essas políticas, como:

- timestamps;
- foreign keys;
- constraints;
- registros de auditoria;
- índices;
- transações.

---

## 31. Exclusão e Integridade Referencial

A exclusão de registros deve respeitar as regras definidas para cada entidade.

As estratégias possíveis incluem:

- Hard Delete;
- Soft Delete quando explicitamente justificado;
- Cascade;
- Restrict;
- remoção explícita;
- anonimização.

O banco não deve aplicar `CASCADE` indiscriminadamente.

Uma exclusão em cascata somente deve existir quando a remoção dos registros dependentes fizer sentido semântico.

As regras gerais estão definidas em:

- `CON-002-domain-and-data-modeling-conventions.md`;
- `CON-008-data-lifecycle-and-audit-standards.md`.

---

## 32. Backup e Recuperação

O banco de produção deve possuir estratégia de backup compatível com a criticidade dos dados da plataforma.

A estratégia deve considerar:

- frequência dos backups;
- retenção;
- recuperação point-in-time quando disponível;
- armazenamento separado;
- controle de acesso;
- testes periódicos de restauração.

Backup não deve ser considerado suficiente apenas por existir.

A capacidade de restauração deve ser validada periodicamente.

Os detalhes operacionais dependem do provedor PostgreSQL utilizado em cada ambiente e devem ser documentados conforme a infraestrutura de deployment for definida.

---

## 33. Monitoramento

A infraestrutura de banco deverá possuir mecanismos de observabilidade adequados ao ambiente.

Devem ser considerados:

- disponibilidade;
- latência;
- utilização de CPU;
- memória;
- armazenamento;
- conexões;
- queries lentas;
- erros;
- locks;
- crescimento do banco.

No MVP, a observabilidade deve permanecer proporcional ao tamanho e à criticidade da infraestrutura.

Ferramentas específicas serão definidas na documentação de deployment e operação.

---

## 34. Segurança

O acesso ao banco deve seguir o princípio do menor privilégio.

As aplicações devem utilizar credenciais apropriadas para seu ambiente.

Credenciais não devem:

- ser armazenadas no código;
- ser commitadas no Git;
- ser expostas ao frontend;
- ser compartilhadas desnecessariamente.

O acesso administrativo ao banco deve ser restrito.

Conexões devem utilizar mecanismos seguros disponibilizados pelo ambiente de infraestrutura.

As políticas gerais de segurança da plataforma estão documentadas em:

`07-security`

---

## 35. Dados Pessoais

Dados pessoais devem ser armazenados somente quando houver finalidade legítima e necessidade para o funcionamento da plataforma.

A arquitetura do banco deve considerar:

- minimização de dados;
- controle de acesso;
- retenção;
- auditoria;
- anonimização;
- exclusão quando aplicável.

A arquitetura de banco não deve ser utilizada como justificativa para armazenar informações desnecessárias.

As regras relacionadas ao lifecycle, retenção e auditoria estão definidas em:

`CON-008-data-lifecycle-and-audit-standards.md`

---

## 36. Evolução do Banco

O banco deve evoluir incrementalmente junto com o produto.

Novas estruturas devem ser introduzidas quando existir necessidade concreta.

Não devem ser criados antecipadamente:

- tabelas sem uso previsto;
- índices sem padrão de consulta;
- campos especulativos;
- abstrações de persistência sem necessidade;
- schemas PostgreSQL apenas para reproduzir conceitos arquiteturais.

A arquitetura deve permitir evolução sem exigir reestruturações profundas sempre que uma nova funcionalidade for adicionada.

---

## 37. Preparação para Escala

A arquitetura inicial deve permanecer simples, mas não deve impedir evolução futura.

Possíveis evoluções incluem:

- read replicas;
- particionamento;
- caching;
- filas;
- processamento assíncrono;
- otimização de índices;
- separação de workloads;
- bancos especializados;
- múltiplas instâncias;
- separação física de contextos.

Essas estratégias somente devem ser adotadas quando houver necessidade técnica ou de produto.

A possibilidade de crescimento futuro não constitui motivo suficiente para implementar infraestrutura distribuída antecipadamente.

---

## 38. Relação com o Backend

O backend NestJS é responsável por utilizar a camada de persistência para executar operações relacionadas ao domínio.

A estrutura conceitual é:

```text
HTTP
 │
 ▼
Controller
 │
 ▼
Application / Use Case
 │
 ▼
Domain
 │
 ▼
Repository / Persistence
 │
 ▼
Prisma Client
 │
 ▼
PostgreSQL
```

Os detalhes de organização dos módulos backend estão definidos em:

`CON-001-architecture-conventions.md`

O banco não deve determinar sozinho a estrutura dos módulos de domínio.

---

## 39. Documentação do Modelo de Dados

A arquitetura do banco deve ser documentada em conjunto com o modelo de domínio.

A documentação deve permitir relacionar:

```text
Business Concept
       ↓
Domain Entity
       ↓
Database Table
       ↓
Prisma Model
```

O significado de uma entidade deve permanecer documentado no contexto de domínio e dados apropriado.

Este documento estabelece os princípios arquiteturais comuns da persistência.

As convenções específicas de entidades permanecem em:

`CON-002-domain-and-data-modeling-conventions.md`

---

## 40. Decisões Arquiteturais Consolidadas

As seguintes decisões fazem parte da arquitetura atual:

| Decisão                            | Justificativa                                                  |
| ---------------------------------- | -------------------------------------------------------------- |
| PostgreSQL                         | Banco relacional robusto e adequado ao domínio                 |
| Prisma                             | Integração tipada com TypeScript e gerenciamento de migrations |
| Banco único no MVP                 | Reduz complexidade operacional e de infraestrutura             |
| Organização conceitual por domínio | Mantém limites claros entre responsabilidades                  |
| UUID                               | Identificadores técnicos adequados à evolução da plataforma    |
| Migrations versionadas             | Mantém histórico controlado da evolução estrutural             |
| Integridade no banco               | Reduz inconsistências estruturais                              |
| Transações PostgreSQL              | Garante consistência em operações relacionadas                 |
| Storage externo para mídias        | Evita armazenamento de binários no banco                       |
| Separação de ambientes             | Reduz risco de interferência entre ciclos de desenvolvimento   |
| Evolução incremental               | Evita complexidade prematura                                   |

---

## 41. Decisões Ainda Não Definidas

Algumas decisões dependem da evolução da infraestrutura e não devem ser antecipadas.

Entre elas:

- provedor definitivo de PostgreSQL em produção;
- estratégia final de backup;
- política definitiva de Point-in-Time Recovery;
- ferramentas de monitoramento;
- estratégia de read replicas;
- particionamento;
- eventual utilização de múltiplos schemas PostgreSQL;
- estratégia de alta disponibilidade;
- política definitiva de disaster recovery;
- sizing de produção.

Essas decisões devem ser documentadas quando houver informações suficientes para justificá-las.

Não devem ser transformadas em decisões arquiteturais definitivas apenas por antecipação.

---

## 42. Critérios para Alterações no Banco

Antes de realizar uma alteração estrutural relevante, deve-se avaliar:

1. Qual problema a alteração resolve?
2. Existe impacto no modelo de domínio?
3. A alteração é compatível com as convenções de modelagem?
4. Existe impacto nos relacionamentos?
5. Existem novas constraints?
6. Existem novos índices?
7. Existe impacto em performance?
8. Existe impacto no lifecycle?
9. Existe impacto em auditoria?
10. Existe impacto em segurança?
11. A migration pode ser executada com segurança?
12. Existe necessidade de migração de dados?
13. Existe impacto em ambientes existentes?
14. A alteração precisa ser registrada como ADR?
15. A documentação correspondente precisa ser atualizada?

Para alterações pequenas, essa avaliação pode ser simplificada.

O objetivo é preservar coerência arquitetural, não criar burocracia.

---

## 43. Relação com Outras Documentações

Este documento deve ser utilizado em conjunto com:

- `CON-001-architecture-conventions.md` — princípios arquiteturais;
- `CON-002-domain-and-data-modeling-conventions.md` — convenções de modelagem;
- `CON-007-media-architecture-and-lifecycle-standards.md` — arquitetura e lifecycle de mídias;
- `CON-008-data-lifecycle-and-audit-standards.md` — lifecycle, retenção e auditoria;
- `09-decisions/` — decisões arquiteturais registradas como ADRs;
- documentação específica do modelo de domínio e dados;
- documentação de segurança;
- documentação de deployment.

Quando houver conflito entre documentos, a decisão deve ser avaliada considerando a especificidade do documento e, quando necessário, registrada ou atualizada como ADR.

---

## 44. Manutenção

Este documento deve ser atualizado quando houver mudança relevante na arquitetura de persistência do Bairu.

Mudanças que alterem significativamente:

- banco de dados;
- estratégia de persistência;
- isolamento de ambientes;
- migrations;
- integridade;
- transações;
- estratégia de escala;
- backup;
- recuperação;
- infraestrutura;

devem ser avaliadas como decisões arquiteturais.

Quando representarem uma mudança relevante, estrutural ou potencialmente irreversível, devem ser registradas também como ADR.

Este documento deve refletir o estado real da arquitetura do projeto e não uma infraestrutura hipotética para o futuro.
