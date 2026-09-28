# Skill: /retro-spec
## Objetivo
Gerar de forma retroativa a documentação de Especificação Baseada em Design (SDD) para uma funcionalidade, tela ou componente legado que já existe (como um ficheiro HTML de migração), garantindo a conformidade com a Única Fonte da Verdade.

## Instruções de Execução
1. **Análise do Legado:** Inspecionar o código de origem existente (ex: `modelos/[NOME_DO_ARQUIVO].html` ou componente legado) para mapear o comportamento visual e funcional atual.
2. **Geração de Requisitos EARS (Retroativo):** Criar a documentação em `.specs/[nome-da-feature]/requirements.md` traduzindo o comportamento observado em requisitos formais com critérios de aceitação claros.
3. **Mapeamento de Arquitetura:** Documentar a estrutura esperada do novo componente em `.specs/[nome-da-feature]/architecture.md`.
4. **Registo de Estado:** Atualizar o ficheiro `.specs/STATE.md` inserindo este épico/migração no histórico ativo do projeto, assinalando que se trata de uma especificação retroativa baseada em legado.