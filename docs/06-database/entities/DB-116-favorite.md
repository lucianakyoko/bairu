# DB-116 — Favorite

## 1. Objetivo

`Favorite` representa a relação entre um usuário e uma empresa que ele escolheu salvar como favorita.

A entidade permite que usuários autenticados mantenham uma lista pessoal de empresas de interesse.

---

## 2. Responsabilidade

`Favorite` é responsável por:

- registrar que um usuário favoritou uma empresa;
- impedir que o mesmo usuário favorite a mesma empresa mais de uma vez;
- permitir a remoção do favorito;
- servir como fonte da verdade para a quantidade de favoritos de uma empresa, quando esse indicador for utilizado.

`Favorite` não representa uma avaliação, recomendação ou interação pública.

---

## 3. Estrutura

Campos previstos para o MVP:

| Campo        | Tipo        | Obrigatório | Descrição                            |
| ------------ | ----------- | ----------: | ------------------------------------ |
| `id`         | UUID        |         Sim | Identificador do favorito            |
| `user_id`    | UUID        |         Sim | Usuário que realizou o favorito      |
| `company_id` | UUID        |         Sim | Empresa favoritada                   |
| `created_at` | TIMESTAMPTZ |         Sim | Momento em que o favorito foi criado |

Não é necessário `updated_at`, pois o relacionamento não possui atualização de atributos no MVP.

Também não será utilizado `deleted_at`.

---

## 4. Relacionamentos

```text
User
  │
  │ 1:N
  ▼
Favorite
  │
  │ N:1
  ▼
Company
```

Um usuário pode favoritar várias empresas.

Uma empresa pode ser favoritada por vários usuários.

Cada `Favorite` pertence obrigatoriamente a exatamente um usuário e a uma empresa.

`Favorite` não possui significado independente de `User` e `Company`.

---

## 5. Unicidade

Um usuário não pode possuir mais de um favorito para a mesma empresa.

A combinação:

```text
(user_id, company_id)
```

deve possuir constraint `UNIQUE`.

Exemplo:

```text
UNIQUE (user_id, company_id)
```

Essa regra deve ser garantida pelo banco, além da validação realizada pela aplicação.

Isso evita duplicidades mesmo quando duas operações ocorrerem simultaneamente.

---

## 6. Criação

A criação de um favorito exige:

- usuário autenticado;
- usuário autorizado a realizar a operação;
- empresa existente;
- ausência de favorito existente para a mesma combinação.

Fluxo:

```text
User
  ↓
Favorite Company
  ↓
Favorite criado
```

Usuários não autenticados não podem criar favoritos.

---

## 7. Remoção

O usuário pode remover uma empresa de seus favoritos.

No MVP, a remoção representa o fim do relacionamento e será realizada através de Hard Delete.

```text
Favorite
   ↓
Hard Delete
```

Não existe necessidade de preservar um histórico de favoritos removidos neste momento.

---

## 8. Hard Delete

`Favorite` utilizará Hard Delete no MVP.

A entidade representa uma relação ativa entre usuário e empresa e não possui, inicialmente, valor histórico independente.

A remoção do favorito não deve alterar ou remover a empresa.

---

## 9. Integridade Referencial

As Foreign Keys devem garantir que:

```text
Favorite.user_id
      ↓
User.id
```

e:

```text
Favorite.company_id
      ↓
Company.id
```

sempre apontem para registros existentes.

Como `Favorite` representa uma relação dependente entre `User` e `Company`, a remoção do usuário ou da empresa deve remover os respectivos registros de `Favorite`.

As Foreign Keys devem utilizar `ON DELETE CASCADE`.

A exclusão de um `Favorite` não deve afetar o `User` nem a `Company`.

A relação fica:

```
 User
 │
 └── CASCADE → Favorite ← CASCADE ── Company
```

Essa é uma situação em que CASCADE é semanticamente adequado: o `Favorite` não possui significado próprio depois que um dos objetos relacionados deixa de existir.

---

## 10. Índices

A constraint: `UNIQUE (user_id, company_id)` deve ser utilizada para garantir a unicidade da relação e também fornece suporte às consultas que utilizem `user_id` como primeiro critério.

Portanto, não é necessário um índice adicional isolado para: `user_id`

Deve existir um índice separado para: `company_id`

Esse índice suporta consultas como:

- quantidade de favoritos de uma empresa;
- usuários que favoritaram uma empresa;
- cálculo de indicadores derivados relacionados à empresa.

Estrutura esperada:

```
UNIQUE (user_id, company_id)
INDEX (company_id)
```

Não devem ser adicionados índices adicionais sem necessidade de consulta identificada.

---

## 11. Dados Derivados

`Favorite` é a fonte da verdade para a quantidade de favoritos de uma empresa.

Caso o Bairu utilize:

```text
Company.favorites_count
```

esse campo será considerado um dado derivado.

A relação será:

```text
Favorite
    ↓
fonte da verdade
    ↓
Company.favorites_count
```

O indicador deve poder ser recalculado a partir dos registros de `Favorite`.

A existência desse campo não é obrigatória no MVP e deverá depender da necessidade real de desempenho.

---

## 12. Concorrência

A criação de favoritos deve considerar condições de corrida.

A aplicação pode verificar previamente se o favorito já existe, mas essa verificação não substitui a constraint de unicidade.

Exemplo:

```text
Request A ──┐
            ├── (user_id, company_id)
Request B ──┘
```

O banco deve garantir que somente uma das operações consiga criar o relacionamento.

---

## 13. Decisões Importantes

| Decisão                           | Justificativa                                                      |
| --------------------------------- | ------------------------------------------------------------------ |
| `Favorite` é uma entidade própria | Representa uma relação com comportamento e uso direto pelo domínio |
| Relação entre `User` e `Company`  | Permite que usuários mantenham empresas de interesse               |
| `user_id + company_id` é único    | Impede favoritos duplicados                                        |
| Hard Delete                       | Remover favorito significa remover o relacionamento                |
| Cascade nas relações dependentes  | Favorite não possui significado independente de User ou Company    |
| Sem `updated_at`                  | O relacionamento não possui atributos alteráveis no MVP            |
| Sem `deleted_at`                  | Não há necessidade de Soft Delete                                  |
| `Favorite` é fonte da verdade     | Permite derivar `favorites_count` quando necessário                |
| Usuário precisa estar autenticado | Favoritos são uma funcionalidade pessoal                           |

---

## 14. Relação com Outras Convenções

Este documento deve ser utilizado em conjunto com:

- `CON-001-architecture-conventions.md`;
- `CON-002-domain-and-data-modeling-conventions.md`;
- `CON-008-data-lifecycle-and-audit-standards.md`;
- documentação de `User`;
- documentação de `Company`.

As regras gerais de identificadores, Foreign Keys, exclusão, índices e dados derivados não devem ser duplicadas neste documento.

---

## 15. Manutenção

Este documento deve ser atualizado quando houver alteração relevante no comportamento de favoritos.

Funcionalidades como:

- histórico de favoritos;
- notificações;
- favoritos de outros tipos de entidade;
- listas personalizadas;
- compartilhamento de favoritos;

não fazem parte do MVP e deverão ser avaliadas separadamente caso surja necessidade concreta.
