# Estado do Projeto e Histórico de Decisões (.specs/STATE.md)

## Estado Atual
- **Fase**: Conclusão da Migração e Integração da Landing Page Neuro-Interativa (`REQ-LANDING-NEURO`)
- **Status Geral**: Todas as 7 tarefas atômicas foram implementadas e validadas com sucesso. Cobertura de testes unitários atingiu 97.59% (meta $\ge 95\%$). Remoção do template legado de `modelo/` executada em conformidade com a skill `/migrate-html`. Pipeline completo de build, lint e type-check 100% aprovado.

---

## Decisões Técnicas & Trade-offs (REQ-LANDING-NEURO)
- **Three.js WebGL com Eco-friendly Rendering:** 
  - *Decisão:* Adotar `three` com pausa dinâmica do loop de renderização via `IntersectionObserver`, `visibilitychange` e descarte completo de geometrias/materiais no `onUnmounted`.
  - *Razão:* Garantir orçamento móvel Lighthouse $\ge 90$ e $LCP \le 2.5\text{s}$, economizando bateria móvel e processamento de GPU.
  - *Trade-off:* Isolamento do canvas em componente autônomo com fallback para ambientes sem suporte a WebGL.
- **Biblioteca de Ícones Otimizada (@lucide/vue):**
  - *Decisão:* Substituição do FontAwesome CDN por `@lucide/vue`.
  - *Razão:* Eliminar requisições bloqueantes de CDN externo, aproveitando tree-shaking moderno do Vite.
- **Navegação SPA Baseada em Âncoras Suaves:**
  - *Decisão:* Utilizar rolagem suave nativa via CSS (`scroll-smooth`) e âncoras semânticas (`#sobre`, `#pesquisas`, `#publicacoes`, `#grupos`, `#acervo`).
- **Code-Splitting no Bundler (Vite):**
  - *Decisão:* Separação do pacote `three` em chunk isolado (`dist/assets/three-*.js`), mantendo o bundle inicial da aplicação em apenas 80 kB (31 kB gzip).

---

## Registro de Ocorrências e Dívidas Técnicas

### Incidente CI/CD #001 - Script de Lint Ausente no Pipeline
* **Ocorrência:** Ausência do script `lint` no `package.json` provocando a falha no pipeline de CI/CD (GitHub Actions `npm run lint`).
* **Resolução:** Adicionado o comando de lint (`"lint": "eslint ."`) aos scripts do `package.json`, configurado `eslint.config.mjs` compatível com a stack e instaladas as dependências de desenvolvimento necessárias (`eslint`).
* **Estado:** Resolvido e validado com commit atômico (`4d2f4c3`).
* **Validação Local:** `npm run lint` executado com código de retorno 0.

### Incidente CI/CD #002 - Ausência dos Scripts de Checagem Estática, Testes, Build e Orçamento Lighthouse
* **Ocorrência:** Falha crítica na etapa `npm run type-check` por script inexistente, com risco subsequente de quebras em `test:coverage`, `build` e na auditoria Lighthouse CI.
* **Resolução:** 
  1. Adicionados scripts `type-check` (`vue-tsc --noEmit`), `test:coverage` (`vitest run --coverage`), `build` (`vite build`) e `preview` (`vite preview --port 3000`) ao `package.json`.
  2. Configurado `tsconfig.json` e suporte estrito para TypeScript e SFCs Vue 3.
  3. Configurado Vitest com provedor de cobertura v8 (`vitest.config.ts`), criando testes unitários com cobertura de 100% para componentes (`OrionFooter.spec.ts` e `App.spec.ts`).
  4. Configurado bundler Vite (`vite.config.ts`), ponto de entrada SPA (`main.ts`, `App.vue` com `OrionFooter`) e montagem HTML.
  5. Criado arquivo de orçamento de performance móvel (`lighthouse-budget.json`) e adicionado `startServerCommand: npm run preview` no workflow `.github/workflows/ci.yml`.
* **Estado:** Resolvido e validado com commits atômicos por tarefa.
* **Validação Local:** `npm run lint`, `npm run type-check`, `npm run test:coverage` e `npm run build` executados com 100% de aprovação.
