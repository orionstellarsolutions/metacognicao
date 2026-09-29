# Plano de Implementação: Módulo de Blog & Painel Admin (Tarefas Atômicas)

## Sequência de Tarefas para o Agente Desenvolvedor

- [ ] **Task 1: Tipos, Serviços de Blog, Compressão de Imagens, Resumo IA e wrangler.toml**
  - **Escopo:** Criar `src/types/blog.ts`. Implementar `src/services/imageCompression.ts` (compressão de fotos via canvas $\le 500\text{KB}$), `src/services/aiSummarizer.ts` (integração com IA e fallback heurístico) e `src/services/blogService.ts`. Configurar `wrangler.toml` com binding D1 (`metacognicao-db`) e Workers AI (`AI`). Criar testes unitários para os serviços.
  - **Commit:** `feat(REQ-BLOG-ADMIN-task1): servicos client-side, tipos do blog e config wrangler d1`

- [ ] **Task 2: Endpoints Serverless Cloudflare Functions (/api/*)**
  - **Escopo:** Criar as Cloudflare Pages Functions em `functions/api/`: `categories.ts` (listar e criar categorias no D1), `posts.ts` (listar, criar e excluir posts no D1), `summarize.ts` (execução do modelo Workers AI `@cf/meta/llama-3-8b-instruct`), e `unsplash.ts` (busca de imagens gratuitas com fallback).
  - **Commit:** `feat(REQ-BLOG-ADMIN-task2): endpoints serverless functions para d1, workers ai e unsplash`

- [ ] **Task 3: Modais Auxiliares: CategoryModal e UnsplashModal com Testes**
  - **Escopo:** Implementar `src/components/blog/CategoryModal.vue` para criação rápida de categoria com persistência. Implementar `src/components/blog/UnsplashModal.vue` com campo de busca em tempo real, grid de fotos com miniaturas e seleção de capa. Criar testes unitários correspondentes.
  - **Commit:** `feat(REQ-BLOG-ADMIN-task3): modais de categoria e busca no unsplash com testes`

- [ ] **Task 4: Componente NewPostModal (Modal "NOVO POST") Fiel ao Design e Testes**
  - **Escopo:** Implementar `src/components/blog/NewPostModal.vue` reproduzindo com fidelidade o design dark/clean fornecido:
    - Coluna esquerda: Título*, Categoria* (com opção + Nova Categoria), Data* (datepicker nativo com formatação `dd/mm/aaaa`), Resumo com botão "Gerar com IA", Seletor de Capa (Upload com compressão + Botão Unsplash), Alt Text*.
    - Coluna direita: Toolbar rica (B, I, H2, H3, Listas, Quote, Link, Alinhamentos, Vídeo, Imagem) e editor de texto.
    - Criar testes unitários em `src/components/blog/__tests__/NewPostModal.spec.ts`.
  - **Commit:** `feat(REQ-BLOG-ADMIN-task4): implementar NewPostModal fiel ao layout com testes`

- [ ] **Task 5: Componente AdminPanel (Painel Administrativo) e Testes**
  - **Escopo:** Implementar `src/components/blog/AdminPanel.vue` com listagem de posts cadastrados, botão para abrir `NewPostModal`, contadores de publicações por categoria e ações de exclusão. Criar testes unitários em `src/components/blog/__tests__/AdminPanel.spec.ts`.
  - **Commit:** `feat(REQ-BLOG-ADMIN-task5): implementar AdminPanel de gestao com testes`

- [ ] **Task 6: Componentes Públicos BlogSection e PostModal e Testes**
  - **Escopo:** Implementar `src/components/blog/BlogSection.vue` para exibição dos artigos na seção `#publicacoes` da Landing Page e `src/components/blog/PostModal.vue` para visualização e leitura completa do artigo pelo usuário. Criar testes em `src/components/blog/__tests__/BlogSection.spec.ts` e `PostModal.spec.ts`.
  - **Commit:** `feat(REQ-BLOG-ADMIN-task6): implementar BlogSection publica e leitor com testes`

- [ ] **Task 7: Integração Completa no App.vue, Validação de Qualidade e Deploy**
  - **Escopo:** Integrar a seção de blog e o acionamento do painel administrativo no `App.vue` e `NeuroNavbar.vue`. Atualizar os testes de integração `App.spec.ts`. Validar pipeline completo (`lint`, `type-check`, `test:coverage`, `build`) e realizar `git push`.
  - **Commit:** `feat(REQ-BLOG-ADMIN-task7): integrar blog e painel admin na aplicacao e validar qualidade`
