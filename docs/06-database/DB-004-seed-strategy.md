# DB-004 — Seed Strategy

## 1. Objetivo

Este documento define a estratégia de inicialização de dados do banco de dados do Bairu.

A estratégia diferencia:

- **Reference Data** — dados iniciais necessários ou úteis para o funcionamento da plataforma e que podem permanecer no ambiente de produção;
- **Development Fixtures** — dados artificiais destinados exclusivamente aos ambientes de desenvolvimento e testes locais.

O objetivo é permitir que novos ambientes sejam inicializados de forma previsível sem misturar dados operacionais fictícios com dados reais de produção.

---

## 2. Princípios

A estratégia de seed do Bairu deve seguir os seguintes princípios:

1. Migrations definem estrutura, não dados operacionais.
2. Seeds definem dados iniciais, quando necessário.
3. Dados administráveis pelo sistema continuam sendo armazenados normalmente no banco após o bootstrap inicial.
4. Reference Data pode existir em produção.
5. Development Fixtures nunca devem ser carregados acidentalmente em produção.
6. Seeds devem ser idempotentes sempre que possível.
7. O seed pode evoluir incrementalmente conforme novas necessidades do sistema surgirem.
8. A ausência de uma entidade no seed não significa que a entidade seja opcional no domínio.
9. Dados fictícios devem possuir características claramente identificáveis como dados de desenvolvimento.
10. A administração posterior de dados de negócio deve ocorrer pelo próprio sistema, especialmente pelo painel administrativo quando disponível.

---

## 3. Classificação dos dados

O Bairu utilizará duas categorias principais.

### 3.1. Reference Data

Reference Data representa dados iniciais que possuem utilidade além de simplesmente facilitar o desenvolvimento.

Podem ser carregados em:

```
development
test
staging
production
```

quando aplicável.

Exemplos:
`Category`
As categorias iniciais do Bairu são o principal exemplo dessa categoria.

### 3.2. Development Fixtures

Development Fixtures representam dados artificiais utilizados para tornar o desenvolvimento local mais produtivo.

Esses dados podem incluir:

```
usuário de desenvolvimento
empresa de exemplo
relações de exemplo
conteúdos de exemplo
favoritos de exemplo
avaliações de exemplo
```

Esses dados não devem ser carregados em produção.

---

## 4. Reference Data

### 4.1. Category

Category deve ser tratada como Reference Data.

Motivo:

- categorias são necessárias para estruturar a descoberta de empresas;
- o sistema pode iniciar com um conjunto mínimo de categorias;
- categorias podem existir em produção;
- categorias posteriormente serão administradas pelo painel administrativo;
- elas não representam dados fictícios de uma pessoa ou empresa específica.

Exemplo inicial:

```
Alimentação
Beleza
Construção
Educação
Saúde
Serviços
```

O conjunto definitivo deve permanecer pequeno no bootstrap inicial.

**Importante:**

O seed não deve assumir que essas categorias são imutáveis.

Depois que o painel administrativo existir, o fluxo normal será:

```
Seed
  ↓
Categorias iniciais
  ↓
Painel administrativo
  ↓
Criação / edição / desativação
```

O banco passa a ser a fonte da verdade operacional.

---

## 4.2. Outras entidades

As demais entidades do modelo atual não devem ser tratadas como Reference Data no MVP.

Isso inclui:

- User
- Company
- CompanyCategory
- CompanyExternalLink
- CompanySchedule
- CompanyScheduleOverride
- CompanyScheduleOverridePeriod
- CompanyCatalogItem
- Promotion
- JobVacancy
- News
- Event
- Coupon
- FeedPublication
- Favorite
- CompanyReview
- AuditLog
- Media

Essas entidades representam dados operacionais, relações, conteúdo ou infraestrutura.

Portanto, não devem ser criadas automaticamente em produção apenas como parte do bootstrap inicial.

---

## 5. Development Fixtures

O ambiente de desenvolvimento deve possuir um conjunto pequeno de dados artificiais para permitir desenvolvimento e testes manuais sem exigir cadastro completo a cada inicialização.

### 5.1. User

Um ou mais usuários de desenvolvimento podem ser criados.

Exemplo conceitual:

`dev.user@example.local`

O usuário deve ser claramente identificável como fixture.

Não devem ser utilizados dados reais.

### 5.2. Company

Uma empresa fictícia deve ser criada para representar o cenário principal do Bairu.

Exemplo:

`Bairu Café`

ou outro nome claramente identificado como fixture.

A empresa permitirá testar:

- perfil da empresa;
- categorias;
- links externos;
- horários;
- catálogo;
- conteúdos;
- favoritos;
- avaliações.

### 5.3. CompanyCategory

Deve existir pelo menos uma relação entre a empresa fixture e categorias fixture/reference.

Exemplo:

```
Bairu Café
   ├── Alimentação
   └── Serviços
```

Isso permite testar imediatamente as consultas de descoberta e relacionamento.

### 5.4. CompanyExternalLink

Pode possuir alguns links artificiais para validar a funcionalidade.

Por exemplo:

```
website
instagram
```

Os valores devem ser claramente fictícios ou apontar para ambientes controlados.

Não devemos utilizar perfis reais de terceiros.

### 5.5. CompanySchedule

Deve possuir horários básicos para a empresa fixture.

Isso é particularmente útil porque permite testar imediatamente:

- abertura;
- fechamento;
- consulta de disponibilidade;
- representação dos horários.

### 5.6. CompanyScheduleOverride

Não considero necessário criar fixtures inicialmente.

Essa entidade pode receber fixtures posteriormente caso o desenvolvimento do módulo de horários precise testar:

- feriados;
- horários especiais;
- exceções.

Não devemos adicionar dados apenas para aumentar o volume do seed.

### 5.7. CompanyScheduleOverridePeriod

Também não precisa fazer parte do primeiro conjunto de fixtures.

Ela pode ser criada junto com fixtures de CompanyScheduleOverride quando houver necessidade concreta de desenvolver/testar esse comportamento.

---

## 6. Content Fixtures

Separação importante:

As entidades de conteúdo podem possuir fixtures de desenvolvimento, mas não devem ser Reference Data.

### 6.1. CompanyCatalogItem

Pode possuir alguns itens fictícios.

Exemplo:

- Café Expresso
- Bolo de Chocolate
- Pão de Queijo

Isso permite testar a apresentação de catálogo e a relação:

```
Company
   ↓
CompanyCatalogItem
```

### 6.2. Promotion

Pode possuir uma promoção fictícia.

Exemplo:

`10% de desconto no café`

Útil para testar:

- conteúdo;
- lifecycle;
- Feed;
- período de validade.

### 6.3. JobVacancy

Pode possuir uma vaga fictícia.

Exemplo:

Atendente

Isso permite validar a integração entre:

```
Company
   ↓
JobVacancy
   ↓
FeedPublication
```

### 6.4. News

Pode possuir uma notícia fictícia.

Exemplo:

`Novo horário de atendimento`

### 6.5. Event

Pode possuir um evento fictício.

Exemplo:

`Inauguração da nova unidade`

### 6.6. Coupon

Pode possuir um cupom fictício.

Exemplo:

`10% OFF`

Não devemos criar fixtures de controle de resgate, pois essa funcionalidade não faz parte do MVP.

---

## 7. Feed Fixtures

### FeedPublication

FeedPublication pode possuir fixtures de desenvolvimento.

Entretanto, ela deve ser criada somente para representar conteúdos que também existam como fixtures.

Não devemos criar:

```
FeedPublication
    ↓
conteúdo inexistente
```

O relacionamento deve representar um cenário real do modelo.

Por exemplo:

```
Promotion fixture
      ↓
FeedPublication fixture
```

ou:

```
News fixture
      ↓
FeedPublication fixture
```

Isso permite testar o Feed sem transformar o Feed em fonte de verdade dos conteúdos.

---

## 8. Interaction Fixtures

### 8.1. Favorite

Favorite pode possuir alguns registros fictícios.

Por exemplo:

```
Dev User
   ↓
favorite
   ↓
Bairu Café
```

Isso permite testar:

- favoritar;
- desfavoritar;
- contagem de favoritos;
- consultas por usuário;
- consultas por empresa.

### 8.2. CompanyReview

Também pode possuir algumas avaliações fictícias.

Por exemplo:

```
Dev User
   ↓
CompanyReview
   ↓
Bairu Café
   rating = 5
```

Isso permite validar:

- média;
- quantidade;
- listagem;
- atualização;
- remoção.

Não devemos criar uma grande quantidade de avaliações artificiais. Algumas poucas são suficientes para desenvolvimento.

---

## 9. Media Fixtures

Media merece um tratamento diferente.

Não criaria registros de Media arbitrariamente no seed.

Como a documentação de Media estabelece que o registro deve existir em conjunto com uma referência válida ao arquivo no storage:

```
Arquivo
   ↓
Storage
   ↓
Media
   ↓
Domain
```

uma fixture de `Media` somente deve existir se o ambiente de desenvolvimento possuir também um arquivo correspondente no storage.

Portanto, no primeiro seed podemos simplesmente deixar `Media` de fora.

Quando o fluxo de upload estiver implementado, poderemos criar fixtures de mídia de forma controlada.

---

## 10. AuditLog

`AuditLog` não deve ser criado artificialmente pelo seed.

Ele representa acontecimentos de auditoria:

```
Operation
   ↓
AuditLog
```

Criar registros fictícios no bootstrap confundiria o significado da auditoria.

Os registros devem surgir das operações reais realizadas durante o desenvolvimento.

Isso também permite testar a infraestrutura de auditoria de forma mais realista.

---

## 12. Mapa inicial

A classificação pode ser resumida assim:

| Entidade                        | Classificação       |
| ------------------------------- | ------------------- |
| `Category`                      | **Reference Data**  |
| `User`                          | Development Fixture |
| `Company`                       | Development Fixture |
| `CompanyCategory`               | Development Fixture |
| `CompanyExternalLink`           | Development Fixture |
| `CompanySchedule`               | Development Fixture |
| `CompanyScheduleOverride`       | Sem seed inicial    |
| `CompanyScheduleOverridePeriod` | Sem seed inicial    |
| `CompanyCatalogItem`            | Development Fixture |
| `Promotion`                     | Development Fixture |
| `JobVacancy`                    | Development Fixture |
| `News`                          | Development Fixture |
| `Event`                         | Development Fixture |
| `Coupon`                        | Development Fixture |
| `FeedPublication`               | Development Fixture |
| `Favorite`                      | Development Fixture |
| `CompanyReview`                 | Development Fixture |
| `AuditLog`                      | Não gerar no seed   |
| `Media`                         | Sem seed inicial    |

---

## 13. Ordem de criação

Como existem dependências entre as entidades, o seed deve respeitar a ordem lógica:

```
Category
   ↓
User
   ↓
Company
   ↓
CompanyCategory
   ↓
CompanyExternalLink
   ↓
CompanySchedule
   ↓
CompanyCatalogItem
   ↓
Promotion
   ↓
JobVacancy
   ↓
News
   ↓
Event
   ↓
Coupon
   ↓
FeedPublication
   ↓
Favorite
   ↓
CompanyReview
```

`AuditLog` e `Media` ficam fora desse fluxo inicial.

---

### 14. Idempotência

O seed deve poder ser executado mais de uma vez sem produzir duplicações indevidas.

Para entidades com identificadores naturais ou combinações únicas, devem ser utilizadas estratégias como:

`upsert`

ou buscas por identificadores estáveis.

Particularmente:

`Category.slug`

é um bom candidato para identificação estável das categorias iniciais.

Para fixtures:

`dev.user@example.local`

e identificadores equivalentes podem ser utilizados para garantir que o seed permaneça repetível.

---

## 15. Evolução Incremental

O seed não precisa ser criado integralmente de uma única vez.

A estratégia pode evoluir junto com o produto:

```
Seed v1
  ↓
Category
  ↓
User + Company
  ↓
Seed v2
  ↓
Content fixtures
  ↓
Seed v3
  ↓
Feed / interactions
```

Cada evolução deve continuar respeitando a classificação:

```
Reference Data
Development Fixtures
```

e não deve transformar dados fictícios em dependências obrigatórias da aplicação.

---

## 16. Produção

Em produção, somente dados classificados como **Reference Data** devem ser considerados para bootstrap.

No estado atual:

```
Production Seed
      ↓
Category
```

Não devem ser criados automaticamente:

- Dev User
- Dev Company
- Fake Promotion
- Fake News
- Fake Event
- Fake Coupon
- Fake Review
- Fake Favorite

A produção deve começar limpa em relação aos dados operacionais.

---

## 17. Desenvolvimento

Em desenvolvimento, o ambiente poderá utilizar:

```
Reference Data
       +
Development Fixtures
```

resultando em algo como:

```
Categories
    +
Dev User
    +
Dev Company
    +
Dev Company relationships
    +
Sample Content
    +
Sample Feed
    +
Sample interactions
```

Isso fornece uma experiência de desenvolvimento bastante mais natural sem contaminar a produção.

---

## 18. Relação com Migrations

Seeds e migrations possuem responsabilidades diferentes.

```
Migration
   ↓
estrutura do banco

Seed
   ↓
dados iniciais
```

A criação de uma tabela `Category` pertence à migration.

A criação das categorias iniciais pertence ao seed.

Da mesma forma:

`CREATE TABLE company`

é migration, enquanto:

`INSERT Development Company

é fixture.
`
---

## 19. Decisões Importantes

| Decisão                                    | Justificativa                                                      |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `Category` é Reference Data                | É necessária para o bootstrap funcional e pode existir em produção |
| Categorias são administráveis              | O seed fornece apenas o estado inicial                             |
| Fixtures não vão para produção             | Evita dados artificiais no ambiente real                           |
| Seed é incremental                         | Permite evolução conforme o produto cresce                         |
| Migrations não carregam fixtures           | Mantém estrutura e dados separados                                 |
| `AuditLog` não recebe fixtures             | Auditoria deve representar operações reais                         |
| `Media` não recebe fixture arbitrária      | Deve existir uma referência real no storage                        |
| Conteúdos podem possuir fixtures           | Facilitam o desenvolvimento e teste do Content                     |
| Feed fixtures dependem de Content fixtures | Feed não é fonte da verdade                                        |
| Interações podem possuir fixtures          | Permitem testar comportamento da comunidade                        |
| Dados administráveis não são imutáveis     | O painel administrativo será a forma operacional de gerenciamento  |

---

## 20. Manutenção

Este documento deve ser atualizado quando:

- uma nova entidade precisar de dados iniciais;
- uma entidade mudar de classificação;
- novos dados de referência forem introduzidos;
- novas fixtures forem necessárias;
- o processo de bootstrap de produção mudar;
- o painel administrativo assumir o gerenciamento de novos dados.

Mudanças relevantes na estratégia de seed devem ser avaliadas quanto ao impacto nas migrations, ambientes e processo de deploy.
