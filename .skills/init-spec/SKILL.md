# Skill: /init-spec
## Objetivo
Criar instantaneamente a estrutura documental completa baseada em Spec-Driven Development (SDD) para uma nova funcionalidade e atualizar o estado do projeto.

## Instruções de Execução
1. Ler o `roadmap.md` e o `project.md` para garantir o alinhamento estratégico.
2. Gerar a estrutura de pastas e ficheiros dentro de `.specs/<id-da-feature>/`:
   - `requirements.md` (Esqueleto com notação EARS e critérios de aceitação)
   - `architecture.md` (Mapeamento de componentes e contratos)
   - `tasks.md` (Fila de micro-tarefas atômicas geradas pelo PO)
3. Atualizar automaticamente o ficheiro `.specs/STATE.md` adicionando o novo épico/feature ao registo de estado ativo do projeto.