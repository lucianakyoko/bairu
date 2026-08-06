# ENG-007 — Testing Strategy

## Objetivo

Definir a estratégia de testes adotada pelo projeto Bairu.

Este documento estabelece responsabilidades, níveis de testes, ferramentas, convenções e critérios para garantir a qualidade da aplicação durante todo o desenvolvimento.

---

# Filosofia

Testes não existem para provar que o sistema funciona.

Eles existem para alertar quando algo deixa de funcionar.

Toda nova funcionalidade deve considerar sua estratégia de testes desde o início do desenvolvimento, permitindo evoluir o projeto com segurança e reduzir regressões.

---

# Escopo

Este documento cobre:

- Front-end
- Back-end
- Mobile
- Packages compartilhados
- Testes automatizados
- Testes manuais

---

# Objetivos

O processo de testes busca:

- reduzir regressões;
- aumentar confiança durante refatorações;
- documentar o comportamento esperado do sistema;
- garantir estabilidade entre versões;
- facilitar manutenção e evolução da aplicação.

---

# Pirâmide de Testes

A estratégia de testes do Bairu seguirá o conceito da Pirâmide de Testes.

```text
                End-to-End
             Integration Tests
              Unit Tests
```

Quanto mais próxima da base:

- maior quantidade de testes;
- execução mais rápida;
- menor custo de manutenção.

Quanto mais próxima do topo:

- menor quantidade;
- execução mais lenta;
- maior custo.

O objetivo é manter a maior parte da cobertura em testes unitários.

---

# Estratégia por tipo

## Testes Unitários

### Objetivo

Validar uma única unidade de código de forma isolada.

Exemplos:

- funções utilitárias;
- hooks;
- componentes reutilizáveis;
- regras de negócio;
- serviços.

### Ferramentas

- Vitest
- Testing Library

---

## Testes de Integração

### Objetivo

Garantir que múltiplas partes do sistema funcionem corretamente em conjunto.

Exemplos:

- componente + formulário;
- página + componentes;
- service + repository;
- API + banco de dados.

---

## Testes End-to-End (E2E)

### Objetivo

Simular o comportamento real do usuário navegando pela aplicação.

Exemplos:

- cadastrar um negócio;
- editar perfil;
- pesquisar uma empresa;
- concluir um fluxo completo.

### Ferramenta prevista

- Playwright

---

## Testes Manuais

Mesmo com automação, sempre deverão ser realizados testes manuais para validar:

- layout;
- responsividade;
- acessibilidade;
- experiência do usuário;
- animações;
- comportamento em diferentes navegadores.

---

# Estratégia por camada

## Packages

Cada package é responsável pelos próprios testes.

Exemplos:

- componentes compartilhados;
- utilitários;
- hooks;
- funções auxiliares.

---

## Front-end

Priorizar testes para:

- componentes reutilizáveis;
- lógica de interface;
- formulários;
- renderização condicional.

Evitar testar:

- estilos do Tailwind;
- HTML estático;
- comportamento interno de bibliotecas externas.

---

## Back-end

Priorizar testes para:

- regras de negócio;
- services;
- use cases;
- repositories;
- validações.

---

## Mobile

Quando o aplicativo mobile existir:

Priorizar:

- componentes;
- hooks;
- navegação;
- armazenamento local;
- integração com APIs.

---

# Organização dos testes

Cada projeto será responsável pelos próprios testes.

Estrutura sugerida:

```text
apps/
  web/
    tests/

  admin/
    tests/

  api/
    tests/

packages/
  ui/
    tests/

  utils/
    tests/
```

Os testes deverão permanecer próximos do código que validam.

Não existirão testes centralizados em um package específico.

---

# Convenções

Arquivos deverão seguir o padrão:

```text
Button.test.tsx

Hero.test.tsx

formatCurrency.test.ts

createSlug.test.ts
```

Os nomes deverão refletir exatamente o componente ou função testada.

---

# Cobertura

O objetivo **não** é alcançar 100% de cobertura.

A prioridade será testar:

- regras de negócio;
- componentes compartilhados;
- funções críticas;
- fluxos principais da aplicação.

Cobertura é consequência de uma boa estratégia, não um objetivo isolado.

---

# Quando escrever testes

Sempre que:

- uma regra de negócio for criada;
- um bug for corrigido;
- um componente compartilhado for desenvolvido;
- uma funcionalidade crítica for implementada.

---

# Ferramentas

## Atual

- Vitest
- Testing Library

## Futuras

- Playwright
- MSW (Mock Service Worker)
- Storybook Interaction Tests
- Testes visuais

---

# Boas práticas

- escrever testes simples;
- testar comportamento, não implementação;
- evitar duplicação;
- manter testes independentes;
- evitar mocks desnecessários;
- medir antes de otimizar a suíte de testes.

---

# Evoluções futuras

- execução automática na CI;
- relatório de cobertura;
- snapshots;
- testes visuais;
- testes automatizados de acessibilidade;
- testes de performance;
- monitoramento contínuo da qualidade.

---

# Revisão

Este documento deverá ser revisado sempre que novas ferramentas, camadas ou estratégias de testes forem incorporadas ao projeto.
