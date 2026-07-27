# ENG-000 — Convenções de Documentação

## Status

Aprovado

## Versão

1.0

## Última atualização

24/07/2026

---

# 1. Objetivo

Este documento estabelece as convenções utilizadas para toda a documentação técnica do projeto Bairu.

Seu objetivo é garantir consistência, clareza e previsibilidade na forma como decisões, arquiteturas, processos e conhecimentos são registrados ao longo do desenvolvimento da plataforma.

Toda documentação criada no projeto deverá seguir as convenções descritas neste documento.

---

# 2. Princípios

A documentação do Bairu deve seguir cinco princípios fundamentais.

## Clareza

Todo documento deve ser compreensível por qualquer desenvolvedor que entre no projeto.

A documentação deve explicar decisões, não apenas descrever arquivos ou código.

---

## Consistência

A mesma informação deve ser apresentada sempre da mesma forma.

Convenções de nomenclatura, estrutura e organização devem ser mantidas em todos os documentos.

---

## Objetividade

Os documentos devem conter informações suficientes para orientar decisões futuras, evitando excesso de detalhes desnecessários.

---

## Evolução Contínua

A documentação faz parte do produto.

Sempre que uma decisão arquitetural ou de engenharia for alterada, sua documentação deverá ser atualizada.

---

## Fonte de Verdade

A documentação oficial do projeto está armazenada dentro do próprio repositório.

Ferramentas externas, como Jira ou Confluence, podem complementar a documentação, mas nunca substituí-la.

---

# 3. Idioma Oficial

O idioma oficial da documentação do projeto é:

**Português (Brasil).**

Esta decisão foi tomada considerando que:

- o projeto nasceu no Brasil;
- a equipe principal utiliza português como idioma nativo;
- o domínio de negócio é brasileiro;
- a documentação deve ser facilmente compreendida pelos mantenedores do projeto.

---

# 4. Idioma por Contexto

Cada tipo de conteúdo utiliza um idioma específico.

| Contexto                       | Idioma                             |
| ------------------------------ | ---------------------------------- |
| Código-fonte                   | Inglês                             |
| Classes, funções e variáveis   | Inglês                             |
| Commits                        | Inglês                             |
| README                         | Inglês                             |
| ADRs                           | Português                          |
| Documentos de Engenharia       | Português                          |
| Documentos de Arquitetura      | Português                          |
| Documentação de Banco de Dados | Português                          |
| Documentação de APIs           | Português                          |
| Comentários de código          | Evitar; quando necessários, Inglês |

---

# 5. Convenção de Nomenclatura

Os nomes dos arquivos devem:

- utilizar letras minúsculas;
- utilizar hífen como separador;
- não utilizar espaços;
- não utilizar acentos;
- ser descritivos.

Exemplos:

```
ADR-001-adocao-monorepo.md
ENG-000-convencoes-de-documentacao.md
ENG-001-organizacao-de-packages.md
```

---

# 6. Estrutura dos Documentos

Sempre que aplicável, documentos técnicos devem seguir a seguinte estrutura:

1. Título
2. Status
3. Versão
4. Última atualização
5. Objetivo
6. Conteúdo principal
7. Referências
8. Notas de Engenharia (opcional)

Nem todos os documentos precisam conter exatamente todas as seções, mas a organização deve permanecer consistente.

---

# 7. Escrita

A documentação deve ser escrita utilizando linguagem técnica, objetiva e profissional.

Evitar:

- abreviações desnecessárias;
- linguagem informal;
- ambiguidades;
- opiniões pessoais sem justificativa técnica.

Sempre que uma decisão for registrada, sua motivação deve ser explicitada.

---

# 8. Diagramas

Sempre que um diagrama contribuir para o entendimento do documento, ele deve ser incluído.

Priorizar diagramas simples utilizando:

- Mermaid;
- diagramas ASCII;
- fluxogramas.

Imagens devem ser utilizadas apenas quando agregarem valor ao entendimento.

---

# 9. Evolução da Documentação

Novos documentos deverão ser adicionados respeitando a estrutura estabelecida neste documento.

Alterações significativas nas convenções deverão ser registradas por meio de um novo ADR.

---

# Referências

- ADR-001 — Adoção do Monorepo
- ADR-002 — Adoção do pnpm Workspaces

---

# Notas de Engenharia

A documentação do Bairu existe para registrar conhecimento, e não apenas informações.

Uma boa documentação reduz dependência entre pessoas, facilita a entrada de novos colaboradores e torna decisões técnicas compreensíveis mesmo anos após terem sido tomadas.

Nosso objetivo não é produzir muitos documentos, mas produzir documentos que permaneçam úteis durante todo o ciclo de vida do projeto.
