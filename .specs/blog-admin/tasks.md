# Plano de Implementação: Módulo de Blog & Painel Admin (Tarefas Atômicas)

## Sequência de Tarefas para o Agente Desenvolvedor

- [x] **Task 1: Tipos, Serviços de Blog, Compressão de Imagens, Resumo IA e wrangler.toml** (Commit: `08ea4a5`)
  - **Escopo:** Criar `src/types/blog.ts`. Implementar `src/services/imageCompression.ts` (compressão de fotos via canvas $\le 500\text{KB}$), `src/services/aiSummarizer.ts` (integração com IA e fallback heurístico) e `src/services/blogService.ts`. Configurar `wrangler.toml` com binding D1 (`metacognicao-db`) e Workers AI (`AI`). Criar testes unitários para os serviços.
  - **Commit:** `feat(REQ-BLOG-ADMIN-task1): servicos client-side, tipos do blog e config wrangler d1`

- [x] **Task 2: Endpoints Serverless Cloudflare Functions (/api/*)** (Commit: `0809db6`)
  - **Escopo:** Criar as Cloudflare Pages Functions em `functions/api/`: `categories.ts` (listar e criar categorias no D1), `posts.ts` (listar, criar e excluir posts no D1), `summarize.ts` (execução do modelo Workers AI `@cf/meta/llama-3-8b-instruct`), e `unsplash.ts` (busca de imagens gratuitas com fallback).
  - **Commit:** `feat(REQ-BLOG-ADMIN-task2): endpoints serverless functions para d1, workers ai e unsplash`

- [x] **Task 3: Modais Auxiliares: CategoryModal e UnsplashModal com Testes** (Commit: `1da5e0e`)
  - **Escopo:** Implementar `src/components/blog/CategoryModal.vue` para criação rápida de categoria com persistência. Implementar `src/components/blog/UnsplashModal.vue` com campo de busca em tempo real, grid de fotos com miniaturas e seleção de capa. Criar testes unitários correspondentes.
  - **Commit:** `feat(REQ-BLOG-ADMIN-task3): modais de categoria e busca no unsplash com testes`

- [x] **Task 4: Componente NewPostModal (Modal "NOVO POST") Fiel ao Design e Testes** (Commit: `ca7996e`)
  - **Escopo:** Implementar `src/components/blog/NewPostModal.vue` reproduzindo com fidelidade o design dark/clean fornecido:
    - Coluna esquerda: Título*, Categoria* (com opção + Nova Categoria), Data* (datepicker nativo com formatação `dd/mm/aaaa`), Resumo com botão "Gerar com IA", Seletor de Capa (Upload com compressão + Botão Unsplash), Alt Text*.
    - Coluna direita: Toolbar rica (B, I, H2, H3, Listas, Quote, Link, Alinhamentos, Vídeo, Imagem) e editor de texto.
    - Criar testes unitários em `src/components/blog/__tests__/NewPostModal.spec.ts`.
  - **Commit:** `feat(REQ-BLOG-ADMIN-task4): implementar NewPostModal fiel ao layout com testes`

- [x] **Task 5: Componente AdminPanel (Painel Administrativo) e Testes** (Commit: `14947a0`)
  - **Escopo:** Implementar `src/components/blog/AdminPanel.vue` com listagem de posts cadastrados, botão para abrir `NewPostModal`, contadores de publicações por categoria e ações de exclusão. Criar testes unitários em `src/components/blog/__tests__/AdminPanel.spec.ts`.
  - **Commit:** `feat(REQ-BLOG-ADMIN-task5): implementar AdminPanel de gestao com testes`

- [x] **Task 6: Componentes Públicos BlogSection e PostModal e Testes** (Commit: `d314b37`)
  - **Escopo:** Implementar `src/components/blog/BlogSection.vue` para exibição dos artigos na seção `#publicacoes` da Landing Page e `src/components/blog/PostModal.vue` para visualização e leitura completa do artigo pelo usuário. Criar testes em `src/components/blog/__tests__/BlogPublic.spec.ts`.
  - **Commit:** `feat(REQ-BLOG-ADMIN-task6): implementar BlogSection publica e leitor com testes`

- [x] **Task 7: Integração Completa no App.vue, Validação de Qualidade e Deploy** (Commit: `20328a7`)
  - **Escopo:** Integrar a seção de blog e o acionamento do painel administrativo no `App.vue` e `NeuroNavbar.vue`. Atualizar os testes de integração `App.spec.ts`. Validar pipeline completo (`lint`, `type-check`, `test:coverage >= 95%`, `build`) e realizar `git push`.
  - **Commit:** `feat(REQ-BLOG-ADMIN-task7): integrar blog e painel admin na aplicacao e validar qualidade`
