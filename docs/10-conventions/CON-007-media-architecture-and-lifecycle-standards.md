# CON-007 — Media Architecture and Lifecycle Standards

## 1. Objetivo

Este documento estabelece os padrões arquiteturais para armazenamento, gerenciamento e ciclo de vida das mídias utilizadas pelo Bairu.

Seu objetivo é definir um fluxo único para upload, persistência, associação, substituição e remoção de arquivos, mantendo o domínio da aplicação desacoplado do provedor de armazenamento.

Este documento complementa as convenções gerais de arquitetura e modelagem de dados da plataforma, bem como as convenções gerais de ciclo de vida, auditoria e proteção de dados.

---

## 2. Objetivos Arquiteturais

A arquitetura de mídias foi projetada para:

- centralizar o gerenciamento de arquivos;
- abstrair o provedor de armazenamento;
- evitar duplicação de lógica entre módulos;
- manter o domínio independente da infraestrutura;
- facilitar futuras migrações de provedor;
- controlar o ciclo de vida técnico das mídias;
- minimizar arquivos órfãos;
- manter consistência entre referências persistidas e arquivos físicos;
- permitir evolução futura para diferentes tipos de mídia;
- manter as regras específicas de cada entidade consumidoras fora do módulo de mídia.

---

## 3. Escopo

No MVP, o módulo de mídias atende:

- foto de perfil da empresa;
- capa da empresa;
- itens de catálogo;
- promoções;
- anúncios;
- cupons;
- eventos.

O suporte a vídeos e documentos será considerado em versões futuras.

Cada tipo de entidade possui suas próprias regras de cardinalidade, finalidade e uso da mídia.

O módulo de mídia é responsável pelo armazenamento e pelo lifecycle técnico dos arquivos.

As regras de negócio relacionadas ao uso de uma mídia permanecem nos respectivos módulos consumidores.

---

## 4. Arquitetura Geral

O fluxo geral segue:

```text
┌───────────────┐
│   Front-end   │
└───────┬───────┘
        │
        │ upload
        ▼
┌────────────────────┐
│    Media Module    │
│                    │
│ Upload / Validation│
│ Lifecycle / Policy │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Storage Provider   │
│    (Cloudinary)    │
└─────────┬──────────┘
          │
          │ metadata
          ▼
┌────────────────────┐
│       Media        │
│     PostgreSQL     │
└─────────┬──────────┘
          │
          │ media_id
          ▼
┌────────────────────┐
│   Domain Entity    │
│ Company / Event /  │
│ CatalogItem / etc. │
└────────────────────┘
```

O domínio da aplicação não deve conhecer detalhes específicos do Cloudinary.

---

## 5. Princípio de Abstração do Storage

O provedor de armazenamento é uma dependência de infraestrutura.

No MVP, o provedor utilizado será o Cloudinary.

A aplicação deve interagir com o provedor através de uma abstração de storage.

Conceitualmente:

```text
Media Module
      │
      ▼
Storage Interface
      │
      ▼
Cloudinary Adapter
```

O domínio não deve depender diretamente de:

- SDK do Cloudinary;
- URLs específicas do Cloudinary;
- credenciais;
- identificadores internos específicos do provedor;
- regras específicas de implementação do provedor.

Essa separação permite substituir o provedor futuramente sem alterar as regras de negócio.

---

## 6. Fluxo de Upload

O fluxo de upload deverá seguir uma sequência padronizada.

### 6.1. Fluxo principal

```text
1. Usuário seleciona imagem
        ↓
2. Frontend envia arquivo para API
        ↓
3. Backend valida arquivo
        ↓
4. Media Module envia arquivo ao storage
        ↓
5. Storage retorna metadados
        ↓
6. Media é persistida
        ↓
7. Entidade de domínio recebe media_id
```

Esse fluxo deve ser reutilizado por todos os módulos que suportam imagens.

### 6.2. Responsabilidade do Frontend

O frontend é responsável por:

- selecionar o arquivo;
- realizar validações básicas quando apropriado;
- exibir preview;
- enviar o arquivo à API;
- tratar estados de carregamento;
- tratar erros de upload.

O frontend não deve:

- persistir metadados de mídia;
- definir diretamente a referência persistida;
- enviar URLs para serem armazenadas como fonte de verdade;
- interagir diretamente com credenciais privadas do provedor.

---

## 7. Responsabilidade do Backend

O backend é responsável por:

- autenticar e autorizar a operação;
- validar o arquivo;
- validar tipo e tamanho;
- validar o conteúdo real do arquivo;
- enviar o arquivo ao storage;
- persistir metadados;
- associar a mídia à entidade de domínio;
- substituir mídias quando necessário;
- remover mídias quando necessário;
- tratar falhas e inconsistências.

Toda lógica relacionada ao armazenamento deve permanecer centralizada no módulo de mídia.

Nenhum módulo de domínio deve implementar seu próprio fluxo de upload.

---

## 8. Responsabilidade do Storage Provider

O provedor de armazenamento é responsável por:

- armazenar o arquivo físico;
- disponibilizar CDN quando aplicável;
- disponibilizar o arquivo para consumo;
- realizar transformações suportadas pelo provedor;
- permitir exclusão do arquivo;
- fornecer identificadores e metadados necessários.

No MVP, o Cloudinary é o provedor de armazenamento.

A plataforma não deve depender de comportamentos específicos do provedor além daqueles encapsulados pela abstração de storage.

---

## 9. Entidade `Media`

A entidade `Media` representa o registro persistido associado a um arquivo físico armazenado externamente.

Ela funciona como uma camada de abstração entre o domínio da aplicação e o provedor de armazenamento.

O conteúdo binário permanece exclusivamente no storage provider.

A entidade `Media` deve armazenar somente os metadados necessários para:

- identificar o arquivo;
- localizar o recurso no storage;
- determinar suas características;
- controlar seu lifecycle técnico;
- permitir sua remoção;
- manter a associação com a entidade consumidora.

Exemplos de metadados possíveis:

```text
id
provider
provider_asset_id
storage_key
mime_type
file_size
created_at
```

Os campos definitivos devem ser definidos conforme a implementação do módulo.

Informações específicas do provedor não devem se espalhar pelas entidades de domínio.

---

## 10. Relacionamento com o Domínio

Cada mídia pertence exclusivamente a uma entidade consumidora.

Não existe compartilhamento de uma mesma `Media` entre entidades de domínio no MVP.

Exemplos:

| Entidade              | Cardinalidade             |
| --------------------- | ------------------------- |
| `Company`             | 1 foto de perfil + 1 capa |
| `CompanyCatalogItem`  | 1 imagem                  |
| `CompanyPromotion`    | 1 imagem                  |
| `CompanyAnnouncement` | 1 imagem                  |
| `CompanyCoupon`       | 1 imagem                  |
| `CompanyEvent`        | 1 imagem                  |

No caso de `Company`, as duas referências representam papéis diferentes:

```text
Company
├── profile_media_id
└── cover_media_id
```

Não deve ser criada uma relação genérica de múltiplas mídias apenas para representar essas duas imagens no MVP.

---

## 11. Referência da Mídia

As entidades consumidoras devem armazenar a referência à mídia.

Exemplo:

```text
Company
├── profile_media_id
└── cover_media_id
```

ou:

```text
CompanyCatalogItem
└── media_id
```

As entidades de domínio não devem armazenar diretamente:

- URL pública;
- URL do CDN;
- credenciais;
- identificadores específicos do provedor;
- conteúdo binário.

A referência persistida deve permitir que o módulo de mídia determine como o recurso deve ser localizado e apresentado.

---

## 12. Validação de Arquivos

No MVP, deverão ser aceitos apenas formatos de imagem definidos pela plataforma.

Tipos inicialmente suportados:

- JPEG;
- PNG;
- WebP.

A plataforma deverá validar:

- tipo MIME informado;
- conteúdo real do arquivo;
- tamanho máximo;
- integridade do upload;
- formato permitido.

A extensão do arquivo não deve ser considerada suficiente para determinar seu tipo.

Os limites específicos de tamanho deverão ser definidos através de configuração da aplicação.

---

## 13. Segurança

O backend deve tratar qualquer arquivo recebido como entrada não confiável.

As validações devem ocorrer antes da persistência da referência.

Devem ser observados:

- validação do MIME;
- validação do conteúdo;
- limite de tamanho;
- rejeição de formatos não suportados;
- autenticação;
- autorização;
- proteção das credenciais do storage;
- não exposição de credenciais privadas ao frontend.

As credenciais do provedor devem permanecer exclusivamente no backend através de variáveis de ambiente ou mecanismo seguro equivalente.

Regras gerais de segurança, proteção de dados pessoais e requisitos de privacidade são tratadas nas convenções correspondentes da plataforma.

---

## 14. Criação da Mídia

A criação de uma mídia segue:

```text
Arquivo recebido
      ↓
Validação
      ↓
Upload no storage
      ↓
Metadados retornados
      ↓
Media persistida
      ↓
Referência associada ao domínio
```

A associação ao domínio somente deve ocorrer quando o backend possuir uma referência válida à mídia persistida.

---

## 15. Tratamento de Falhas no Upload

Caso a validação falhe:

```text
Arquivo
  ↓
Validação ✗
  ↓
Nenhum upload
```

Nenhuma mídia deve ser persistida.

Caso o upload no storage falhe:

```text
Upload
  ↓
Storage ✗
  ↓
Nenhuma referência persistida
```

Caso o upload no storage seja concluído, mas a persistência no banco falhe:

```text
Storage ✓
    ↓
Database ✗
```

o backend deve tentar remover o arquivo recém-criado do storage.

O objetivo é minimizar a existência de arquivos órfãos.

Caso a remoção compensatória também falhe, a inconsistência deverá ser tratada conforme a estratégia operacional definida para identificação e limpeza de mídias órfãs.

---

## 16. Consistência entre Banco e Storage

PostgreSQL e o provedor de armazenamento são sistemas independentes.

Portanto, uma operação envolvendo ambos não deve ser tratada como uma única transação ACID.

Podem ocorrer situações como:

```text
Storage ✓
Database ✗
```

ou:

```text
Database ✓
Storage ✗
```

A arquitetura deve utilizar operações compensatórias e mecanismos de recuperação quando necessário.

O objetivo é manter o sistema convergente, evitando referências inválidas e arquivos órfãos.

---

## 17. Atualização e Substituição

Ao substituir uma mídia:

```text
Mídia antiga
      │
      │ ainda válida
      ▼
Nova mídia enviada
      │
      ▼
Nova Media criada
      │
      ▼
Entidade passa a referenciar nova Media
      │
      ▼
Mídia antiga removida
```

A nova mídia deve ser criada antes que a referência antiga seja removida.

Isso reduz o risco de a entidade ficar temporariamente sem uma mídia válida caso o novo upload falhe.

### 17.1. Ordem Recomendada

```text
1. Validar nova imagem
2. Upload da nova imagem
3. Persistir nova Media
4. Atualizar entidade consumidora
5. Remover mídia anterior
```

Caso uma etapa crítica falhe antes da atualização da entidade, a referência anterior deve permanecer válida.

Após a atualização bem-sucedida da entidade, a mídia anterior deixa de possuir uso no domínio e deve seguir o fluxo de remoção definido pelo Media Module.

---

## 18. Exclusão de Mídia

A remoção de uma mídia envolve dois recursos:

```text
Media
  └── Database record

Storage Asset
  └── Physical file
```

A remoção deve coordenar:

1. remoção da referência da entidade consumidora;
2. remoção do registro `Media`;
3. remoção do arquivo no storage.

A ordem exata deve ser definida pelo caso de uso considerando a possibilidade de falhas.

O sistema deve evitar deixar:

- entidades apontando para mídias inexistentes;
- registros `Media` sem arquivo físico;
- arquivos físicos sem referência persistida.

Quando a entidade consumidora possuir uma estratégia própria de arquivamento, a remoção da mídia deverá respeitar o lifecycle definido para aquela entidade.

---

## 19. Estratégia de Exclusão da Entidade `Media`

A entidade `Media` utiliza Hard Delete no MVP.

A justificativa é que o registro representa um recurso técnico associado a um arquivo físico externo.

Quando o arquivo deixa de possuir uso válido no domínio, manter indefinidamente o registro não oferece benefício operacional suficiente para justificar sua permanência.

Portanto:

```text
Media
  ↓
Hard Delete
```

O arquivo físico também deve ser removido do storage.

A aplicação deve tratar a remoção do registro e a remoção do arquivo como operações coordenadas, considerando que não existe uma transação distribuída entre PostgreSQL e o storage.

### 19.1. Auditoria da Exclusão

O Hard Delete da entidade `Media` não impede que a operação seja auditada.

Quando a operação estiver sujeita à auditoria, o fato de sua ocorrência poderá ser registrado no mecanismo de auditoria da plataforma.

Exemplo:

```text
Media
   ↓
HARD DELETE

AuditLog
   ↓
MEDIA_DELETED
```

O registro de auditoria não deve armazenar o conteúdo binário do arquivo.

As regras gerais sobre quais operações devem ser auditadas, retenção dos registros de auditoria e proteção dos dados de auditoria são definidas pelo `CON-008`.

---

## 20. Mídias Órfãs

Uma mídia órfã pode ocorrer quando:

```text
Storage
   ↓
arquivo existente
   ↓
nenhum Media correspondente
```

ou:

```text
Media
   ↓
registro existente
   ↓
nenhum arquivo correspondente no storage
```

A arquitetura deve considerar essas situações como inconsistências operacionais a serem tratadas.

No MVP, o sistema deve:

- utilizar operações compensatórias durante falhas;
- evitar criar referências antes da mídia estar válida;
- permitir identificação futura de inconsistências;
- permitir processos de limpeza quando necessário.

Uma rotina automatizada de limpeza de órfãos poderá ser introduzida posteriormente caso o volume ou a frequência dessas inconsistências justifique sua implementação.

---

## 21. Lifecycle Técnico da Mídia

O lifecycle técnico padrão de uma mídia é:

```text
                  ┌───────────────┐
                  │    Upload     │
                  └───────┬───────┘
                          ↓
                  ┌───────────────┐
                  │   Persisted   │
                  └───────┬───────┘
                          ↓
                  ┌───────────────┐
                  │    In Use     │
                  └───────┬───────┘
                          ↓
                  ┌───────────────┐
                  │   Replaced    │
                  │      or       │
                  │    Removed    │
                  └───────┬───────┘
                          ↓
                  ┌───────────────┐
                  │ Hard Deleted  │
                  └───────────────┘
```

Esse lifecycle representa o ciclo de vida técnico do recurso de mídia.

Ele não substitui o lifecycle de negócio da entidade consumidora.

Por exemplo, uma `Company` pode ser arquivada enquanto uma mídia associada permanece tecnicamente armazenada durante o período definido pelas regras do domínio.

O módulo de mídia não deve criar estados artificiais apenas para representar operações que podem ser determinadas pelo relacionamento e pelo lifecycle técnico.

---

## 22. Remoção da Entidade Consumidora

Quando uma entidade de domínio que possui mídia for removida, o lifecycle da mídia deverá ser tratado explicitamente.

Exemplo:

```text
Company
   │
   ├── profile_media_id
   └── cover_media_id
```

A remoção da empresa deve avaliar:

1. quais mídias estão associadas;
2. se as mídias possuem outras referências;
3. se a política da entidade permite remoção imediata;
4. se os arquivos devem ser removidos;
5. se a operação deve ser auditada.

Como o MVP não permite compartilhamento de uma mesma `Media` entre entidades, a mídia pode ser removida quando sua entidade consumidora deixar de existir, respeitando o fluxo de exclusão definido para o domínio.

Quando a entidade for apenas arquivada, a mídia não deverá ser removida automaticamente apenas por causa do arquivamento, salvo se a regra específica do domínio determinar o contrário.

---

## 23. Proibição de Compartilhamento

No MVP, uma mesma `Media` não deve ser associada a múltiplas entidades de domínio.

Exemplo não permitido:

```text
Company A ──┐
            ├── Media X
Company B ──┘
```

A relação esperada é:

```text
Company A ── Media A
Company B ── Media B
```

Essa decisão simplifica:

- lifecycle;
- exclusão;
- substituição;
- ownership;
- auditoria;
- limpeza de arquivos.

Suporte a compartilhamento poderá ser considerado futuramente caso exista necessidade concreta.

---

## 24. Responsabilidade pelo Lifecycle

O módulo de mídia é responsável pelos aspectos técnicos da mídia.

O módulo de domínio consumidor é responsável pelas regras de negócio relacionadas ao uso da mídia.

Exemplo:

```text
Company Module
    │
    └── decide:
        "Company pode possuir foto de perfil?"

Media Module
    │
    └── decide:
        "Como a imagem é armazenada?"
```

Essa separação evita que o módulo de mídia passe a conhecer regras específicas de empresas, eventos, catálogo ou promoções.

O módulo consumidor também é responsável por determinar quando uma mídia deixa de ser necessária do ponto de vista do negócio.

O Media Module é responsável por executar o lifecycle técnico correspondente.

---

## 25. Transações

Operações exclusivamente relacionadas ao banco devem utilizar transações quando necessário.

Operações envolvendo banco e storage devem reconhecer que o storage não participa da transação do PostgreSQL.

Por exemplo:

```text
Database Transaction
       │
       ├── create Media
       └── update Company
```

pode ser uma transação do banco.

Porém:

```text
Cloudinary Upload
       +
PostgreSQL Transaction
```

não constitui uma transação distribuída.

Quando uma operação envolver ambos, devem ser utilizadas estratégias compensatórias e ordenação das operações para minimizar inconsistências.

---

## 26. Performance

A arquitetura deve considerar:

- tamanho dos arquivos;
- otimização de imagens;
- CDN;
- formatos modernos;
- compressão;
- dimensões adequadas;
- carregamento sob demanda.

No MVP, não devem ser introduzidos pipelines complexos de processamento sem necessidade real.

O Cloudinary poderá ser utilizado para otimizações e transformações quando isso trouxer benefício concreto.

---

## 27. Limites

Os limites de mídia devem ser configuráveis.

Exemplos:

```text
MAX_IMAGE_SIZE
ALLOWED_IMAGE_TYPES
```

Os limites não devem ser espalhados pelos módulos consumidores.

A validação deve ser centralizada no módulo de mídia.

Regras específicas relacionadas à quantidade de imagens por entidade permanecem nos módulos de domínio.

Exemplo:

```text
Company
→ 1 profile image
→ 1 cover image

CatalogItem
→ 1 image
```

---

## 28. Evoluções Futuras

A arquitetura foi planejada para suportar, quando houver necessidade:

- múltiplas imagens por entidade;
- galerias;
- vídeos;
- documentos PDF;
- geração automática de miniaturas;
- compressão e conversão para WebP/AVIF;
- processamento assíncrono;
- processamento em fila;
- otimização por dispositivo;
- armazenamento em múltiplos provedores;
- versionamento de arquivos;
- limpeza automática de mídias órfãs.

Essas capacidades não devem ser implementadas antecipadamente apenas porque foram previstas.

---

## 29. Decisões Arquiteturais

As seguintes decisões fazem parte da arquitetura atual:

| Decisão                                            | Justificativa                                                |
| -------------------------------------------------- | ------------------------------------------------------------ |
| Storage externo                                    | Evita armazenar conteúdo binário no PostgreSQL               |
| Cloudinary no MVP                                  | Fornece armazenamento, CDN e processamento de imagens        |
| `Media` como abstração                             | Mantém o domínio independente do provedor                    |
| Upload centralizado                                | Evita duplicação de lógica entre módulos                     |
| Uma mídia por entidade no MVP                      | Reduz complexidade                                           |
| `Company` possui perfil e capa                     | Atende à necessidade de apresentação visual da empresa       |
| Mídias não são compartilhadas                      | Simplifica ownership e lifecycle                             |
| Hard Delete de `Media`                             | Evita registros técnicos órfãos desnecessários               |
| Operações compensatórias                           | Banco e storage não participam da mesma transação            |
| Nova mídia antes da remoção da antiga              | Reduz risco durante substituições                            |
| Validação no backend                               | Evita confiar em validações do cliente                       |
| Conteúdo binário fora do domínio                   | Mantém domínio independente da infraestrutura                |
| Lifecycle técnico separado do lifecycle de negócio | Evita misturar regras de armazenamento com regras do domínio |

---

## 30. Relação com Outras Convenções

Este documento deve ser utilizado em conjunto com:

- `CON-001-architecture-conventions.md` — princípios arquiteturais;
- `CON-002-domain-and-data-modeling-conventions.md` — modelagem e persistência;
- `CON-003-rest-api-conventions.md` — contratos HTTP e APIs REST;
- `CON-008-data-lifecycle-and-audit-standards.md` — ciclo de vida dos dados, auditoria, retenção e exclusão;
- convenções específicas dos módulos consumidores de mídia.

Este documento define as regras específicas de mídia.

Ele não deve duplicar regras gerais de:

- auditoria;
- retenção;
- proteção de dados;
- exclusão de entidades de domínio;
- compliance;
- solicitações relacionadas a dados pessoais.

---

## 31. Checklist para Novas Integrações de Mídia

Antes de adicionar suporte a mídia em uma nova entidade, deve-se avaliar:

- A entidade realmente precisa de mídia?
- Qual é a cardinalidade?
- Existe apenas uma mídia ou uma coleção?
- A mídia possui papel específico, como `profile` ou `cover`?
- A mídia pode ser compartilhada?
- Qual é a finalidade da mídia?
- Qual é a política de lifecycle técnico?
- Qual é a estratégia de exclusão da entidade consumidora?
- A remoção da entidade implica remoção da mídia?
- O arquivamento da entidade altera o lifecycle da mídia?
- A operação precisa ser auditada?
- Existem limites específicos?
- O arquivo precisa de processamento adicional?
- Existe impacto de performance?
- A mídia deve ser pública ou protegida?
- A entidade possui autorização adequada para alterar a mídia?
- O módulo consumidor está utilizando o Media Module em vez de implementar upload próprio?
- Existem impactos sobre retenção ou proteção de dados?

---

## 32. Manutenção

Este documento deve ser atualizado quando houver alteração na arquitetura de armazenamento ou no lifecycle técnico das mídias.

Mudanças significativas na estratégia de storage, ownership, compartilhamento ou exclusão devem ser avaliadas como decisões arquiteturais.

Quando a alteração representar uma mudança relevante ou potencialmente irreversível, deve ser registrada também como ADR.

As convenções devem refletir o estado real da implementação e não apenas uma arquitetura desejada para o futuro.
