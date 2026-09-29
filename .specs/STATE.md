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
