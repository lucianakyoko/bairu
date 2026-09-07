# ADR-009 — Company Username Lifecycle and History

## 1. Contexto

O `username` é utilizado como identificador público da `Company` e compõe sua URL pública.

A alteração de um `username` pode invalidar URLs anteriormente compartilhadas e, caso o valor seja disponibilizado imediatamente, permitir que outra Company reivindique rapidamente um username anteriormente associado a outra empresa.

Esse comportamento pode causar:

- quebra de links públicos;
- perda de continuidade das URLs compartilhadas;
- risco de impersonation;
- redirecionamentos incorretos após reutilização de usernames;
- alterações repetitivas de username para contornar as regras da plataforma.

É necessário, portanto, definir um ciclo de vida específico para usernames anteriormente utilizados por uma Company.

---

## 2. Decisão

O Bairu adotará um mecanismo de histórico de usernames associado à `Company`.

Quando uma Company alterar seu `username`:

1. o username anterior será registrado no histórico;
2. o username anterior entrará em período de cooldown para novas Companies;
3. durante o cooldown, a Company original poderá recuperar o username sem aguardar o término do período;
4. a Company estará sujeita a um rate limit para novas alterações de username;
5. caso outra Company reivindique o username após o cooldown, a prioridade da Company original será perdida definitivamente.

O histórico de usernames não substitui o identificador da entidade.

Relacionamentos internos continuarão utilizando `Company.id`.

---

## 3. Histórico de Usernames

Toda alteração de username deve preservar o valor anteriormente utilizado pela Company em uma estrutura de histórico.

O histórico deve permitir determinar:

- qual Company utilizou o username;
- quando o username foi liberado;
- se o período de cooldown terminou;
- se outra Company posteriormente reivindicou o username;
- se o vínculo histórico ainda permite redirecionamento.

O histórico não deve ser utilizado como identificador principal da Company.

---

## 4. Cooldown

Um username liberado por uma Company não poderá ser imediatamente reivindicado por outra Company.

O período inicial definido para o MVP será de:

**30 dias.**

Durante o cooldown:

- a Company original poderá recuperar o username;
- outras Companies não poderão reivindicá-lo.

Após o término do cooldown, o username poderá ser reivindicado por outra Company conforme as regras de disponibilidade.

O período de cooldown é uma política do produto e poderá ser alterado futuramente mediante decisão documentada.

---

## 5. Prioridade da Company Original

A Company que anteriormente utilizava um username terá prioridade para recuperá-lo enquanto nenhuma outra Company tiver reivindicado o valor.

Essa prioridade não é permanente.

Quando outra Company reivindicar o username após o cooldown:

- a Company original perde sua prioridade;
- o vínculo anterior deixa de ser considerado válido para recuperação;
- a Company original passa a estar sujeita às mesmas regras aplicáveis às demais Companies caso queira utilizar esse username novamente.

---

## 6. Rate Limit

Uma Company não poderá alterar seu username indefinidamente.

O limite inicial definido para o MVP será de:

**1 alteração a cada 7 dias.**

O objetivo é reduzir:

- alterações repetitivas;
- abuso do mecanismo de histórico;
- tentativas de reservar usernames;
- crescimento desnecessário do histórico.

O rate limit poderá ser ajustado futuramente conforme comportamento real do produto.

---

## 7. Resolução de URLs Antigas

Quando uma URL pública utilizar um username que não corresponde ao username atual de uma Company, a aplicação deverá consultar o histórico.

A resolução seguirá:

```text
username atual
    ↓
Company encontrada
    ↓
HTTP 200
```

```
username não encontrado como atual
    ↓
histórico encontrado
    ↓
vínculo histórico válido
    ↓
HTTP 301 → username atual da Company

```

```
username não encontrado como atual
    ↓
histórico encontrado
    ↓
vínculo histórico perdido
    ↓
HTTP 404
```

```
username não encontrado
    ↓
nenhum histórico válido
    ↓
HTTP 404
```

O redirect histórico somente será permitido enquanto o vínculo entre o username e a Company original permanecer válido.

---

## 8. Perda do Vínculo Histórico

Quando uma segunda Company reivindicar um `username` anteriormente utilizado por outra Company, o vínculo histórico da Company anterior será considerado encerrado para fins de resolução da URL.

Isso impede que uma URL histórica da Company anterior continue redirecionando para seu perfil depois que o username tiver sido atribuído a uma nova Company.

Exemplo:

```
Company A
    |
    └── padariacentral
            |
            └── alteração
                    ↓
            Company A → padariadocentro
```

Enquanto o vínculo histórico for válido:

```
/padariacentral
        ↓ 301
/padariadocentro
```

Após Company B reivindicar o username: `Company B → padariacentral`

O username passa a representar Company B.

O histórico de Company A não deve mais redirecionar /padariacentral para Company A.

Nesse caso, a resolução do vínculo histórico anterior deverá resultar em 404.

---

## 9. Consequências

**Positivas**

- preserva URLs antigas durante o período em que o vínculo histórico permanece válido;
- reduz o risco de impersonation;
- evita reutilização imediata de usernames;
- permite recuperação pelo proprietário original durante o cooldown;
- impede que a prioridade histórica seja permanente;
- limita alterações abusivas de username;
- mantém Company.id como identificador estável das relações internas.

**Negativas**

- adiciona uma estrutura de histórico ao modelo de dados;
- aumenta a complexidade da resolução das URLs públicas;
- exige controle de cooldown e rate limit;
- exige tratamento específico quando um username muda de proprietário;
- aumenta a quantidade de dados relacionados ao lifecycle do username.

Esses custos são considerados aceitáveis diante dos riscos de segurança, integridade e experiência causados pela reutilização imediata de usernames.

---

## 10. Escopo do MVP

Fazem parte desta decisão:

- histórico de usernames;
- cooldown de 30 dias;
- prioridade temporária da Company original;
- perda do vínculo após reivindicação por terceiro;
- rate limit de 1 alteração a cada 7 dias;
- redirect 301 para históricos ainda válidos;
- 404 para vínculos históricos que perderam sua validade.

A estrutura física da tabela, nomes definitivos de campos, índices e detalhes de implementação devem ser definidos na documentação de banco e durante a implementação correspondente.

---

## 11. Relação com Outras Decisões

Esta decisão complementa:

- `ADR-008-company-public-identifier-username-instead-of-slug.md`
- `DB-102-company.md`

A `ADR-008` define a adoção de `username` como identificador público da Company.

Esta ADR define o lifecycle e o comportamento histórico desse identificador.

---

## 12. Status

Accepted

A decisão deve ser considerada referência para a implementação do lifecycle de usernames da Company.
