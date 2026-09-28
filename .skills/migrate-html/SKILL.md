# Skill: /migrate-html
## Objetivo
Executar o pipeline completo de engenharia para converter um ficheiro HTML legado num componente Vue 3 moderno, com testes, documentação e registo de dívidas técnicas.

## Instruções de Execução (Pipeline)
1. **Refatoração para Vue.js:** Converta o HTML/Vanilla JS de `modelos/[NOME_DO_ARQUIVO].html` num Single File Component (SFC) estruturado em Vue 3 utilizando Composition API (`<script setup>`).
2. **Organização de Pastas:** Salve o novo componente em `/src/components/...` removendo dependências imperativas antigas do DOM.
3. **Criação de Testes Unitários:** Crie o ficheiro de teste correspondente usando Vitest e Vue Test Utils, cobrindo comportamento inicial, eventos e reatividade.
4. **Documentação Automática:** Crie uma nota em `/docs/arquitetura/` descrevendo a responsabilidade do novo componente.
5. **Registo de Dívidas Técnicas:** Insira imediatamente qualquer pendência ou código complexo no ficheiro `/docs/tarefas/dividas_tecnicas.md` no formato `- [ ] Tarefa [status:: pendente] [prioridade:: ...]`.
6. **Limpeza da Origem:** Após validar que tudo funciona e que os testes passam, delete o ficheiro HTML original localizado em `modelos/`.