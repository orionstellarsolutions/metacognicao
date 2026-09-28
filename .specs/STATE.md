# Estado do Projeto e Histórico de Decisões (.specs/STATE.md)

## Estado Atual
- **Fase**: Migração Retroativa SDD / Implementação da Landing Page Neuro-Interativa (`REQ-LANDING-NEURO`)
- **Status Geral**: Especificação retroativa (.skills/retro-spec) e documentação macro concluídas. Conceito 1 (Neuro-Interativo) isolado no modelo de referência com eliminação dos conceitos 2 e 3. Quebra em 7 micro-tarefas atômicas estruturada pelo Agente PO para execução via Agente Desenvolvedor.

---

## Decisões Técnicas & Trade-offs (REQ-LANDING-NEURO)
- **Three.js WebGL com Eco-friendly Rendering:** 
  - *Decisão:* Adotar `three` com pausa dinâmica do loop de renderização via `IntersectionObserver` e detecção de visibilidade do documento.
  - *Razão:* Garantir orçamento móvel Lighthouse $\ge 90$ e $LCP \le 2.5\text{s}$, eliminando consumo desnecessário de bateria quando a seção hero não estiver na viewport.
  - *Trade-off:* Complexidade adicional no gerenciamento do ciclo de vida do canvas e necessidade de mocks precisos em testes unitários.
- **Biblioteca de Ícones Otimizada (Lucide Vue Next):**
  - *Decisão:* Substituir FontAwesome CDN por `lucide-vue-next`.
  - *Razão:* Eliminar render-blocking resources e dependências de CDN de terceiros, aproveitando tree-shaking moderno do Vite.
- **Navegação SPA Baseada em Âncoras Suaves:**
  - *Decisão:* Utilizar rolagem suave nativa via CSS (`scroll-smooth`) e âncoras semânticas (`#sobre`, `#pesquisas`, `#publicacoes`, `#grupos`, `#acervo`).

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
