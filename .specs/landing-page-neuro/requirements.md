# Especificação de Requisitos - Landing Page Neuro-Interativa (SDD)
**ID da Funcionalidade:** `REQ-LANDING-NEURO`  
**Origem:** Migração retroativa do Conceito 1 (`modelo/metacognicao_3_landing_page_concepts.html`)

---

## 1. Requisitos do Sistema (Notação EARS)

### [REQ-001] Navegação e Header Responsivo
- **Ubiquitous:** O sistema DEVE fornecer uma barra de navegação superior fixa com logotipo "Metacognição", links de âncora suave para as seções `#sobre`, `#pesquisas`, `#publicacoes`, `#grupos` e um botão de ação destacado para `#acervo`.
- **State-driven:** ENQUANTO o usuário rolar a página verticalmente além de 50 pixels (`scrollY > 50px`), o sistema DEVE adicionar sombra e reduzir o padding vertical da barra de navegação para otimizar a área útil visível.
- **Event-driven:** QUANDO o usuário clicar em qualquer item do menu ou botão de CTA, o sistema DEVE efetuar a rolagem suave (*smooth scroll*) até o elemento correspondente sem recarregar a página.

### [REQ-002] Hero Section e Visualização 3D Neuro-Interativa
- **Ubiquitous:** O sistema DEVE renderizar uma seção principal contendo o selo comemorativo *"Novidade: 20 Anos de GAE"*, a manchete *"Desvendando o processo de Aprender a Aprender"* com gradiente institucional, texto introdutório sobre neurociência e formação docente, e botões para *"Conheça as Pesquisas"* e *"Nossa História"*.
- **Ubiquitous:** O sistema DEVE instanciar um plano de fundo tridimensional com partículas conectadas por sinapses dinâmicas representando redes neurais cognitivas através de Three.js / WebGL.
- **Event-driven:** QUANDO o ponteiro do mouse se mover sobre a janela em desktop, o sistema DEVE atualizar suavemente a inclinação da câmera virtual no canvas 3D para gerar sensação de profundidade e interatividade.
- **State-driven:** ENQUANTO o canvas 3D estiver fora do campo de visão da tela (viewport) ou a aba do navegador estiver inativa (`document.hidden`), o sistema DEVE pausar o laço de renderização (`requestAnimationFrame`) para economizar recursos de CPU/GPU e preservar a bateria de dispositivos móveis.
- **Unwanted behaviour:** SE o navegador do cliente não suportar WebGL ou falhar ao inicializar o contexto 3D, o sistema DEVE manter a seção Hero visível e legível com degradê estilizado em CSS sem quebrar a renderização da página.

### [REQ-003] Seção de Linhas de Pesquisa
- **Ubiquitous:** O sistema DEVE apresentar a grade responsiva contendo os três pilares de investigação acadêmica:
  1. *Educação Infantil:* Representação social de professores e novos olhares sobre as infâncias.
  2. *Alfabetização:* Ação pedagógica como atividade sistematizada de construção de conhecimento novo.
  3. *Teoria Cognitiva:* Plasticidade cerebral, reconfiguração cognitiva e superação das máquinas.
- **Ubiquitous:** Cada card de pesquisa DEVE conter ícone representativo, descrição, efeito de elevação (*hover elevate*) e link para explorar a área.

### [REQ-004] Seção Grupos de Estudo (GAE e GEA)
- **Ubiquitous:** O sistema DEVE exibir bloco de destaque com apresentação institucional dos grupos GAE e GEA, botão de chamada para participação em encontros e métricas de impacto (*20+ Anos de História*, *50+ Mestres e Doutores*).

### [REQ-005] Rodapé Institucional Orion Stellar Solutions
- **Ubiquitous:** O sistema DEVE renderizar obrigatoriamente na base da interface o componente institucional [OrionFooter.vue](file:///d:/Projetos-Cassi/OrionStellarSolutions/Clientes/metacognicao/src/components/OrionFooter.vue), em conformidade com as regras de marca da Orion Stellar Solutions.

---

## 2. Critérios de Aceitação

1. **AC-01 (Fidelidade ao Conceito 1):** O design visual, tipografia, cores e disposições devem reproduzir integralmente o Conceito 1 aprovado do protótipo legado.
2. **AC-02 (Modularização Vue 3 SFC):** Todo o código deve ser decomposto em componentes limpos (`src/components/`) usando Vue 3 Composition API com `<script setup lang="ts">`.
3. **AC-03 (Performance e Economia de Bateria):** O Three.js deve ser montado via ciclo de vida Vue (`onMounted`/`onUnmounted`) e pausado dinamicamente com IntersectionObserver quando não estiver visível.
4. **AC-04 (Cobertura de Testes $\ge 95\%$):** Todos os componentes criados devem possuir suíte de testes unitários com Vitest e Vue Test Utils validando renderização, links, classes dinâmicas e desmontagem segura.
5. **AC-05 (Qualidade & Pipeline Local):** `npm run lint`, `npm run type-check`, `npm run test:coverage` e `npm run build` devem passar com código de saída 0 sem warnings ou erros de tipagem.
