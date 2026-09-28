# Skill: /git-flow
## Objetivo
Automatizar o ciclo de fecho de uma tarefa ou release, gerando o commit atômico no padrão Conventional Commits, atualizando o `walkthrough.md` e permitindo a sincronização segura (pull/push).

## Instruções de Execução
1. Analisar o `git diff` atual para identificar exatamente quais ficheiros foram alterados.
2. Cruzar as alterações com a task correspondente em `.specs/tasks.md`.
3. Gerar a mensagem de commit seguindo estritamente o padrão Conventional Commits (ex: `feat(modulo-task1): ...`).
4. Atualizar o artefato `walkthrough.md` com o resumo técnico e o nome do commit gerado.
5. Executar os comandos de git associados (ex: `git add`, `git commit -m "..."` e `git pull`) conforme a instrução direta do Agente Publisher ou do utilizador.