# Plano de Implementação: Landing Page Neuro-Interativa (Tarefas Atômicas)

## Sequência de Tarefas para o Agente Desenvolvedor

- [x] **Task 1: Setup de Dependências e Configuração de Estilos Tailwind**
  - **Escopo:** Instalar `three`, `@types/three` e `@lucide/vue`. Atualizar `tailwind.config.js` para registrar as cores institucionais (`brand.purple`, `brand.light`, `brand.dark`, `brand.accent`, `brand.teal`, `brand.bg`).
  - **Commit:** `feat(REQ-LANDING-NEURO-task1): setup de dependencias three, lucide e cores tailwind`

- [x] **Task 2: Tipos Base e Componente NeuroNavbar com Testes Unitários**
  - **Escopo:** Criar `src/types/landing.ts`. Implementar `src/components/NeuroNavbar.vue` com detecção de scroll para sombra compacta, logo e âncoras suaves. Criar testes unitários em `src/components/__tests__/NeuroNavbar.spec.ts`.
  - **Commit:** `feat(REQ-LANDING-NEURO-task2): implementar NeuroNavbar e testes unitarios`

- [x] **Task 3: Componente NeuroCanvas (Three.js WebGL + IntersectionObserver) e Testes**
  - **Escopo:** Criar `src/components/NeuroCanvas.vue` com o motor tridimensional de nós e sinapses neurais, rotação contínua, inclinação com mouse, pausa automática via `IntersectionObserver` quando fora da viewport e cleanup no unmount. Criar testes unitários em `src/components/__tests__/NeuroCanvas.spec.ts`.
  - **Commit:** `feat(REQ-LANDING-NEURO-task3): implementar NeuroCanvas 3D com Three.js e testes`

- [x] **Task 4: Componente NeuroHero e Testes Unitários**
  - **Escopo:** Criar `src/components/NeuroHero.vue` montando o badge dos 20 anos do GAE, manchete com gradiente, copy institucional, botões de ação e o canvas tridimensional em background. Criar testes em `src/components/__tests__/NeuroHero.spec.ts`.
  - **Commit:** `feat(REQ-LANDING-NEURO-task4): implementar NeuroHero e testes unitarios`

- [x] **Task 5: Componente ResearchLines e Testes Unitários**
  - **Escopo:** Criar `src/components/ResearchLines.vue` exibindo os 3 cards das linhas de pesquisa (Educação Infantil, Alfabetização e Teoria Cognitiva) com ícones do Lucide e hover com elevação. Criar testes em `src/components/__tests__/ResearchLines.spec.ts`.
  - **Commit:** `feat(REQ-LANDING-NEURO-task5): implementar ResearchLines e testes unitarios`

- [x] **Task 6: Componente StudyGroups e Testes Unitários**
  - **Escopo:** Criar `src/components/StudyGroups.vue` com banner escuro para os grupos GAE e GEA, botão de participação e cards de métricas (20+ anos, 50+ mestres e doutores). Criar testes em `src/components/__tests__/StudyGroups.spec.ts`.
  - **Commit:** `feat(REQ-LANDING-NEURO-task6): implementar StudyGroups e testes unitarios`

- [x] **Task 7: Integração na App.vue com OrionFooter e Validação Completa de Qualidade**
  - **Escopo:** Integrar todos os componentes na página principal `src/App.vue` mantendo o rodapé obrigatório `OrionFooter.vue`. Atualizar os testes `src/__tests__/App.spec.ts` garantindo 100% de cobertura. Executar suite completa (`lint`, `type-check`, `test:coverage`, `build`).
  - **Commit:** `feat(REQ-LANDING-NEURO-task7): integrar landing page no App.vue e validar pipeline de qualidade`
