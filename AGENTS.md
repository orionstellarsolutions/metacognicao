# 🤖 Constituição do Agente de IA: Projetos Orion Stellar Solutions

Como um Agente de IA atuando neste repositório, você DEVE tratar as seguintes regras como suas diretrizes primárias e absolutas.

## 1. Fonte Absoluta da Verdade (/docs) e Spec-Driven Development (SDD)
- O diretório `/docs`, o `roadmap.md`, o `project.md` e a pasta `.specs/` constituem a Única Fonte da Verdade (*Single Source of Truth*). Se o código divergir da documentação, SEMPRE siga a documentação ou peça confirmação.
- ANTES de propor mudanças ou codificar, acione o fluxo `tlc-spec-driven` e consulte o `roadmap.md` e o `project.md` para alinhar as entregas com os objetivos macros da Orion.
- Siga estritamente as 4 fases SDD para escopos médios e grandes:
  1. **Specify**: Defina requisitos em notação EARS e critérios de aceitação.
  2. **Design**: Mapeie componentes, contratos e arquitetura.
  3. **Tasks**: Quebre em tarefas atômicas e ordenadas (responsabilidade do Agente PO).
  4. **Execute**: Implemente por tarefas, execute testes e registre um commit atômico por tarefa.
- **REGRA OBRIGATÓRIA DO STATE.md**: Mantenha o arquivo `.specs/STATE.md` sempre atualizado a cada transição de fase do pipeline, registrando o histórico de decisões técnicas, trade-offs e o estado atual do projeto.

## 2. Decisões Técnicas, Autonomia Polyglot e Stack Preferencial
- **Stack Preferencial**: TypeScript/JavaScript (Vue 3 SFCs, Nuxt 3, Astro, Node.js, Bun). Mantenha este padrão para preservar a proximidade entre projetos.
- **Autonomia Polyglot**: Você tem autoridade para escolher ecossistemas de backend alternativos (Python/FastAPI, Go ou Rust) quando os requisitos de dados, alta concorrência ou IA justificarem.
- **Registro Obrigatório**: Qualquer mudança da stack preferencial DEVE ser documentada imediatamente em `.specs/STATE.md` especificando: *Razão, Trade-off e Impacto*.

## 3. Requisito Obrigatório: Orion Stellar Solutions Banner
- **TODAS as páginas e telas principais** geradas no projeto DEVEM obrigatoriamente incluir o rodapé/banner padrão da **Orion Stellar Solutions** na parte inferior da interface.
- O componente deve ser importado de `src/components/OrionFooter` (ou equivalente na stack definida) e não pode sofrer alterações de estilo que prejudiquem os links e a marca visual da Orion.

## 4. Performance Mobile e Cloudflare
- **Plataforma de Hospedagem Padrão**: Cloudflare Pages / Cloudflare Workers.
- **Orçamento de Performance Mobile (PageSpeed Insights - form_factor=mobile)**:
  - LCP (Largest Contentful Paint) $\le 2.5\text{s}$
  - INP (Interaction to Next Paint) $\le 200\text{ms}$
  - CLS (Cumulative Layout Shift) $\le 0.1$
  - Pontuação Geral Mobile Lighthouse $\ge 90 / 100$
- Utilize os cabeçalhos de cache e compressão Brotli configurados em `public/_headers`.

## 5. Garantia de Qualidade e CI/CD
- **Validação Local**: Nunca finalize tarefas sem executar linters, verificação estática de tipos (`vue-tsc`/`tsc`), suíte de testes unitários (cobertura $\ge 95\%$) e emulação do Lighthouse CI.
- **Sensor de Discriminação**: Os testes criados devem passar por testes de mutação antes da validação final do lote.
- **Commits Atômicos por Tarefa**: Realize estritamente **um commit atômico por tarefa** quebrada no plano de implementação, vinculando-os aos IDs das especificações (ex: `feat(REQ-001-task1): ...`). No artefato `walkthrough.md`, **SEMPRE** inclua em destaque as mensagens e nomes dos commits gerados.

## 6. Automação por Skills (.skills/)
- Os agentes DEVEM priorizar a execução das rotinas modulares presentes no directório `.skills/` para inicialização documental, quebra de tarefas, validação de qualidade e fecho de release.
- **Automação de Commits e Sincronização**: Os agentes (em especial o Publisher) estão autorizados a preparar commits atômicos, gerar os walkthroughs e gerir o fluxo de git (`commit`, `pull`, `push`) de forma assistida para agilizar as entregas na versão desktop.