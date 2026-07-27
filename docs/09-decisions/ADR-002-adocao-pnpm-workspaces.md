# ADR-002 — Adoção do pnpm Workspaces

## Status

Accepted

## Data

2026-07-23

---

# Contexto

Após a decisão de adotar uma arquitetura baseada em monorepo (ADR-001), tornou-se necessário definir a estratégia de gerenciamento de dependências e organização dos diferentes projetos que compõem o Bairu.

A plataforma poderá possuir múltiplas aplicações e pacotes compartilhados, incluindo:

- aplicação web;
- API backend;
- painel administrativo;
- aplicações móveis;
- bibliotecas internas;
- configurações compartilhadas.

Dessa forma, tornou-se necessário escolher uma solução capaz de:

- gerenciar múltiplos projetos dentro de um único repositório;
- compartilhar dependências de forma eficiente;
- garantir consistência entre ambientes;
- reduzir duplicação de pacotes;
- oferecer uma experiência adequada para desenvolvimento local e integração contínua.

Foram consideradas as seguintes alternativas:

- npm Workspaces;
- Yarn Workspaces;
- pnpm Workspaces.

---

# Decisão

Adotaremos **pnpm Workspaces** como solução oficial para gerenciamento do monorepo Bairu.

O pnpm será responsável por:

- gerenciamento das dependências;
- instalação dos pacotes;
- organização dos workspaces;
- controle do lockfile;
- comunicação entre aplicações e pacotes internos.

A configuração inicial será realizada através do arquivo:
==> `pnpm-workspace.yaml` com a seguinte estrutura:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Essa configuração define que: `apps/` contém aplicações executáveis.

Exemplos:

- aplicações web;
- APIs;
- aplicações administrativas.

==> `packages/` contém bibliotecas e recursos compartilhados.

Exemplos:

- componentes;
- configurações;
- utilitários;
- tipos compartilhados.

---

# Motivações

## Eficiência no gerenciamento de dependências

O pnpm utiliza uma abordagem baseada em armazenamento global e links simbólicos, evitando duplicação desnecessária de pacotes entre projetos.

Isso proporciona:

- instalações mais rápidas;
- menor consumo de espaço em disco;
- maior consistência entre projetos.

## Melhor experiência em monorepos

A escolha pelo pnpm Workspaces não elimina a responsabilidade de definir limites claros entre aplicações e pacotes. A organização arquitetural continuará sendo guiada por domínio e responsabilidade, conforme definido no ADR-001.

O pnpm possui suporte nativo a workspaces, permitindo:

- gerenciamento centralizado;
- comandos executados a partir da raiz;
- compartilhamento controlado entre pacotes.

## Integração com Turborepo

O pnpm possui excelente integração com Turborepo, ferramenta escolhida no Bairu para:

- orquestração de tarefas;
- cache;
- pipelines de desenvolvimento.

A combinação:

```
pnpm
 +
Turborepo
```

fornece uma base moderna para construção e manutenção do monorepo.

## Reprodutibilidade dos ambientes

O arquivo: `pnpm-lock.yaml` garante que todos os ambientes utilizem versões consistentes das dependências.

Isso reduz problemas como:

- "funciona na minha máquina";
- divergência entre ambientes;
- instalações inconsistentes.

---

# Alternativas Consideradas

## npm Workspaces

### Descrição

Solução nativa do npm para gerenciamento de múltiplos pacotes dentro de um único repositório.

### Motivos para não escolher

Apesar de atender aos requisitos básicos, apresenta limitações quando comparado ao pnpm em cenários de monorepo maiores:

- menor eficiência no armazenamento;
- menor otimização para grandes estruturas;
- experiência menos madura em projetos complexos.

## Yarn Workspaces

### Descrição

Solução amplamente utilizada para gerenciamento de monorepos JavaScript/TypeScript.

### Motivos para não escolher

Embora seja uma solução consolidada, o pnpm apresentou vantagens consideradas mais adequadas ao cenário do Bairu:

- melhor eficiência de armazenamento;
- abordagem moderna de gerenciamento;
- excelente integração com ferramentas atuais de monorepo.

---

# Consequências Positivas

A adoção do pnpm Workspaces permite:

- gerenciamento centralizado de dependências;
- instalação mais eficiente;
- redução de duplicação;
- maior previsibilidade dos ambientes;
- integração natural com Turborepo;
- padronização do fluxo de desenvolvimento.

---

# Consequências Negativas

A decisão também apresenta alguns custos:

- necessidade de conhecimento específico sobre pnpm;
- equipe precisa seguir convenções de workspace;
- algumas ferramentas podem exigir configurações adicionais.

---

# Considerações Futuras

Caso o Bairu cresça significativamente, novas necessidades poderão surgir, como:

- pipelines avançados de CI/CD;
- estratégias específicas de cache;
- gerenciamento de versões independentes;
- publicação de pacotes internos.

Essas evoluções deverão ser avaliadas através de novos ADRs.

---

# Referências

- pnpm Documentation
- pnpm Workspaces Documentation
- Turborepo Documentation
