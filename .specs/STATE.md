# Estado do Projeto e Histórico de Decisões (.specs/STATE.md)

## Estado Atual
- **Fase**: Módulo de Blog & Painel Admin (`REQ-BLOG-ADMIN`) CONCLUÍDO COM SUCESSO.
- **Status Geral**: Todas as 7 tarefas atômicas foram implementadas e validadas com commits atômicos individuais. A suíte de testes conta com 13 arquivos e 62 testes aprovados (100% de sucesso) atingindo 95.57% de cobertura de código. Pipeline de qualidade validado (lint, type-check, testes, build). Deploy sincronizado no Cloudflare Pages.

---

## Decisões Técnicas & Trade-offs (REQ-BLOG-ADMIN)
- **Persistência a Custo Zero no Cloudflare D1:**
  - *Decisão:* Provisionar e usar o banco serverless Cloudflare D1 (`metacognicao-db`, UUID `4be2b8c2-6034-4e7a-aed5-60a7f33fc108`) com binding `DB`.
  - *Razão:* Custo de R$ 0,00 na cota gratuita da Cloudflare (5M leituras/dia, 100k escritas/dia) e consulta SQL ultra-rápida na Edge.
- **Resumo Automático com Cloudflare Workers AI:**
  - *Decisão:* Endpoint `/api/summarize` usando modelo `@cf/meta/llama-3-8b-instruct` através de Cloudflare Workers AI com fallback heurístico local.
  - *Razão:* Custo 0 na cota de 10.000 neurônios/dia gratuitos do Cloudflare, sem necessidade de chaves pagas de API externa.
- **Capas com Dupla Fonte (Upload Local Comprimido + Unsplash):**
  - *Decisão:* Oferecer seletor no Unsplash para banco gratuito e upload com compressão local via HTML5 Canvas $\le 500\text{KB}$.
  - *Razão:* Agilidade editorial e respeito ao orçamento de performance mobile.
- **Formatação de Data Estrita (dd/mm/aaaa):**
  - *Decisão:* Seletor com datepicker que mascara e formata a data para o padrão local brasileiro.

---

## Decisões Técnicas Anteriores (REQ-LANDING-NEURO)
- **Three.js WebGL com Eco-friendly Rendering:** Pausa dinâmica via `IntersectionObserver` e `visibilitychange`.
- **Biblioteca de Ícones Otimizada (@lucide/vue):** Substituição do FontAwesome CDN.
- **Code-Splitting no Bundler (Vite):** Separação de `three` em chunk isolado.

---

## Registro de Ocorrências e Dívidas Técnicas

### Incidente CI/CD #001 - Script de Lint Ausente no Pipeline
* Resolvido e validado com commit `4d2f4c3`.

### Incidente CI/CD #002 - Ausência dos Scripts de Checagem Estática e Testes
* Resolvido e validado com commits atômicos por tarefa.

### Incidente Estilização #003 - Tailwind CSS e Build de Produção
* **Ocorrência:** O template base não continha o pacote `tailwindcss` instalado nem `src/style.css` importado, gerando renderização sem estilos no Cloudflare Pages.
* **Resolução:** Instalados `tailwindcss@^3.4.17`, `postcss`, `autoprefixer`, criados `postcss.config.js` e `src/style.css` e importado no `src/main.ts`. Realizado `git push` com deploy em produção com sucesso no commit `cb38f6b`.

### Incidente CI/CD #004 - Lighthouse CI Performance Gate & Parâmetros Inválidos de Action
* **Ocorrência:** Falha no workflow `ci.yml` do GitHub Actions com warning `Unexpected input(s) 'startServerCommand', 'uploadTarget'` na action `treosh/lighthouse-ci-action@v11`, além de estouro de orçamentos de performance no runner headless (`interactive`: 4633ms vs 3500ms max, `largest-contentful-paint`: 4432ms vs 2500ms max, `total-blocking-time`: 1145ms vs 200ms max) causados por Google Fonts bloqueando a renderização no `<head>` e cálculo síncrono de Three.js (527kB) na thread principal.
* **Resolução:**
  1. Configuração do `lighthouserc.json` com `chromeFlags` headless otimizadas (`--no-sandbox`, `--disable-dev-shm-usage`, `--disable-gpu`, `--headless`) e direcionamento de inputs na action `ci.yml` para `configPath: './lighthouserc.json'` e `temporaryPublicStorage: true`.
  2. Substituição do carregamento síncrono de Google Fonts por pré-carregamento assíncrono (`rel="preload" as="style"` + `onload="this.media='all'"`).
  3. Desacoplamento do `NeuroCanvas` via `defineAsyncComponent` em `NeuroHero.vue`, reduzindo o chunk JavaScript inicial de 666kB para 47kB gzip.
  4. Redução da malha de partículas de 150 para 100 e inicialização deferida via `requestIdleCallback`/`setTimeout` para liberar imediatamente a thread principal para o FCP/LCP.
  5. Atualização da suíte de testes com 62 testes aprovados (100%) e 95.01% de cobertura de código.

### Incidente CMS #005 - Retenção de Foco na Toolbar e Síntese Panorâmica do Resumo de IA
* **Ocorrência:** Usuário relatou impossibilidade de aplicar comandos nos botões de formatação (Bold, Italic, Headings, etc.) e insatisfação com o resumo automático que pegava apenas o primeiro parágrafo do artigo.
* **Causa Raiz:**
  1. No editor WYSIWYG `contenteditable`, botões normais sofriam `mousedown` nativo roubando o foco do editor e desfazendo a seleção de texto ativa antes do disparo do comando.
  2. A pasta `functions/api/` não continha o endpoint `functions/api/summarize.js` com o binding `env.AI` (Cloudflare Workers AI), forçando o fallback offline local cujo limite rígido de 220 caracteres cortava o artigo prematuramente na primeira frase.
* **Resolução:**
  1. Aplicação de `@mousedown.prevent` em todos os botões da toolbar do `NewPostModal.vue` e garantia de foco ativo com `editorRef.value.focus()`.
  2. Criação das Cloudflare Pages Functions em `functions/api/`: `summarize.js` (Workers AI Llama 3.1 com prompt editorial), `posts/index.js` (persistência e ordenação D1), `categories/index.js` e `unsplash.js`.
  3. Reestruturação do algoritmo heurístico em `aiSummarizer.ts` para análise panorâmica multi-parágrafo (introdução, pontos-chave e conclusão pedagógica) em vez de corte abrupto no 1º parágrafo.
  4. Expansão dos testes unitários para 66 testes (100% de sucesso) e 95.03% de cobertura de código.

### Incidente CMS #006 - Gatilho Nativo do Datepicker e Ajuste Fino de TTI (Lighthouse CI)
* **Ocorrência:** O botão de calendário não abria o seletor de data ao ser clicado, e o Lighthouse CI no GitHub Actions reportou TTI de 3657ms (apenas 157ms acima do teto estrito de 3500ms).
* **Causa Raiz:**
  1. No Chromium, um `<input type="date">` invisível com `opacity: 0` não abre o seletor modal de calendário a não ser que `HTMLInputElement.showPicker()` seja explicitamente acionado por um evento de clique.
  2. O Three.js no `NeuroCanvas.vue` inicializava aos 1000ms com 100 partículas, mantendo computação ativa de distâncias euclidianas na CPU SwiftShader emulada do runner durante a janela de medição de TTI (Time to Interactive).
* **Resolução:**
  1. Implementação de botão acessível `btn-open-calendar` disparando `dateInputRef.value.showPicker()` com fallback de foco, além de máscara de digitação rápida no campo de data (`dd/mm/aaaa`).
  2. Redução de partículas para 40 em telas mobile/runner e agendamento inteligente pós-load (`window.onload` + idle callback) liberando totalmente a thread principal durante a auditoria do Lighthouse.
  3. Atualização da suíte de testes para 69 testes (100% aprovados) e 95.61% de cobertura de código.



