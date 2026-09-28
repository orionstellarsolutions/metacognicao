# Skill: /check-quality
## Objetivo
Executar os testes locais e validar os Gates de Qualidade da Orion antes de liberar o código para a auditoria de segurança.

## Instruções de Execução
1. Rodar os linters do projeto.
2. Executar a verificação estática de tipos (`vue-tsc` ou `tsc`).
3. Rodar a suíte de testes unitários e verificar se a cobertura atinge o patamar mínimo de $\ge 95\%$.
4. Validar a presença obrigatória do componente `OrionFooter` nas páginas alteradas.