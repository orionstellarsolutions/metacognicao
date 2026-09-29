# Especificação de Requisitos - Módulo de Blog & Painel Admin (SDD)
**ID da Funcionalidade:** `REQ-BLOG-ADMIN`  
**Origem:** Solicitação do usuário para sistema de blog com editor rico, categorias dinâmicas, datepicker formatado, capas (upload/Unsplash), resumo via IA e persistência a custo zero via Cloudflare D1.

---

## 1. Requisitos do Sistema (Notação EARS)

### [REQ-BLOG-001] Painel Administrativo e Gatilho de Acesso
- **Ubiquitous:** O sistema DEVE fornecer um painel administrativo discreto acessível via rota `/admin` ou botão administrativo de gestão na barra de navegação.
- **Ubiquitous:** O sistema DEVE listar todos os posts cadastrados com opção de criar novo post, visualizar ou excluir.

### [REQ-BLOG-002] Modal de Criação / Edição de Post ("NOVO POST")
- **Ubiquitous:** O modal DEVE replicar a arquitetura visual especificada:
  - **Coluna Esquerda:** Título*, Categoria*, Data*, Resumo (Excerpt), Capa do Post*, Texto Alternativo (Alt Text)*.
  - **Coluna Direita:** Toolbar de formatação rica (Negrito, Itálico, H2, H3, Listas, Citação, Link, Alinhamentos, Vídeo, Imagem) e área de edição de conteúdo.
- **Event-driven:** QUANDO o usuário clicar no botão "X" ou fora do modal, o sistema DEVE confirmar o fechamento sem perda acidental se houver conteúdo preenchido.

### [REQ-BLOG-003] Gerenciamento Dinâmico de Categorias
- **Ubiquitous:** O seletor de Categoria DEVE listar as categorias cadastradas ("GERAL", "EDUCAÇÃO INFANTIL", "ALFABETIZAÇÃO", "TEORIA COGNITIVA", "GAE / GEA") e incluir a opção rápida "+ Nova Categoria".
- **Event-driven:** QUANDO o usuário optar por adicionar uma categoria, o sistema DEVE permitir informar o nome, persistir no Cloudflare D1 (tabela `categories`) e selecionar automaticamente a nova categoria criada.

### [REQ-BLOG-004] Seleção de Data com Calendário (dd/mm/aaaa)
- **Ubiquitous:** O campo de Data DEVE integrar um seletor de data (datepicker nativo estilizado) que armazena e exibe a data rigorosamente no formato brasileiro `dd/mm/aaaa` (ex: `29/09/2026`).

### [REQ-BLOG-005] Seleção e Compressão de Capa (Upload Local + Busca Unsplash)
- **Ubiquitous:** O sistema DEVE permitir a escolha da capa por duas vias complementares:
  1. *Upload Local:* Seleção de arquivo de imagem do computador com compressão automática via HTML5 Canvas para garantir que o tamanho final não ultrapasse 500KB.
  2. *Busca no Unsplash:* Modal/gaveta de pesquisa em tempo real no banco gratuito de imagens Unsplash por palavras-chave (ex: "educação", "cérebro", "pesquisa"), com seleção de imagem e preenchimento automático da URL da capa e sugestão de texto alternativo.
- **Ubiquitous:** O campo de Texto Alternativo (ALT TEXT) DEVE ser obrigatório para conformidade estrita com acessibilidade e SEO da Orion Stellar Solutions.

### [REQ-BLOG-006] Geração Automática de Resumo (Excerpt) com IA (Custo 0)
- **Event-driven:** QUANDO o usuário clicar no botão "Gerar Resumo com IA" ao lado do campo Resumo, o sistema DEVE enviar o conteúdo do post para a Cloudflare Function `/api/summarize` (Cloudflare Workers AI com modelo `@cf/meta/llama-3-8b-instruct`), sintetizar o texto em um parágrafo conciso de 2 a 3 frases e preencher o campo Resumo automaticamente com custo R$ 0,00.
- **Unwanted behaviour:** SE a rede estiver offline ou a API de IA indisponível, o sistema DEVE acionar um algoritmo heurístico extrativo local no navegador para extrair as frases mais relevantes do primeiro parágrafo sem travar o editor.

### [REQ-BLOG-007] Persistência no Cloudflare D1
- **Ubiquitous:** O sistema DEVE persistir e consultar as categorias e artigos na base de dados serverless Cloudflare D1 (`metacognicao-db`), mantendo custo de infraestrutura de R$ 0,00 dentro da cota gratuita da Cloudflare.

### [REQ-BLOG-008] Exibição Pública dos Posts na Landing Page
- **Ubiquitous:** A Landing Page pública DEVE exibir uma grade de artigos recentes na seção `#publicacoes`, apresentando imagem de capa, categoria, data formatada (`dd/mm/aaaa`), título, resumo e botão para ler o artigo completo.

---

## 2. Critérios de Aceitação
- **AC-01:** O modal "NOVO POST" reproduz o design solicitado com coluna dupla responsiva e paleta da Metacognição.
- **AC-02:** Criação de nova categoria funciona em tempo real e fica disponível no dropdown.
- **AC-03:** Campo de data seleciona no calendário e formata como `dd/mm/aaaa`.
- **AC-04:** Usuário pode enviar arquivo local (comprimido < 500KB) OU buscar e escolher capa via Unsplash.
- **AC-05:** Botão de IA resume o texto do post e preenche o Excerpt.
- **AC-06:** Dados persistem no Cloudflare D1 através das endpoints `/api/posts` e `/api/categories`.
- **AC-07:** Cobertura de testes unitários $\ge 95\%$ e 100% de aprovação nos linters e type-check.
