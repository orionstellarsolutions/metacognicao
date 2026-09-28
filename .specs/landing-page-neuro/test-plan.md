# Matriz de Testes Automatizados - Landing Page Neuro-Interativa
**ID da Funcionalidade:** `REQ-LANDING-NEURO`  
**Responsável:** Test Planner (Orion Stellar Solutions)

---

## 1. 📋 Estratégia de Cobertura
- **Meta de Cobertura Global:** $\ge 95\%$ para linhas, funções, branches e statements.
- **Ferramental:** Vitest v5, `@vue/test-utils` v2, `@vitest/coverage-v8`, Happy DOM.
- **Diretriz Zero Testes Manuais:** Todos os estados de interação (scroll, mousemove, resize, links de navegação, unmount do WebGL e visibilidade via IntersectionObserver) são validados por suítes automatizadas.

---

## 2. 🛑 Impedimentos e Devoluções ao PO
- **Status:** **NENHUM IMPEDIMENTO IDENTIFICADO**. Os requisitos EARS em `requirements.md` e a arquitetura em `architecture.md` possuem contratos limpos, sem ambiguidades, com estados bem delimitados para teste de componentes. O plano de implementação está **APROVADO** para avanço do Desenvolvedor.

---

## 3. 🧪 Matriz de Testes Automatizados

### Módulo: `NeuroNavbar.vue` (`src/components/__tests__/NeuroNavbar.spec.ts`)
| ID | Cenário de Teste | Tipo | Critério de Aceite |
|---|---|---|---|
| `TEST-NAV-01` | Renderizar logotipo e links de navegação | Unitário | Contém texto "Metacognição", links `#sobre`, `#pesquisas`, `#publicacoes`, `#grupos` e botão `#acervo`. |
| `TEST-NAV-02` | Alternar padding e sombra no scroll da janela | Unitário / DOM | Dispara evento `scroll` com `window.scrollY > 50` e verifica inclusão das classes `shadow-md` e `py-2`. Retorna com `scrollY <= 50`. |
| `TEST-NAV-03` | Desconectar listener de scroll no unmount | Unitário / Ciclo | `window.removeEventListener` é chamado ao desmontar o componente, prevenindo vazamentos de memória. |

### Módulo: `NeuroCanvas.vue` (`src/components/__tests__/NeuroCanvas.spec.ts`)
| ID | Cenário de Teste | Tipo | Critério de Aceite |
|---|---|---|---|
| `TEST-CANVAS-01` | Instanciação e montagem segura do canvas | Unitário | Canvas HTML5 é referenciado e Three.js inicializa cena, câmera e renderizador sem exceções. |
| `TEST-CANVAS-02` | Pausa e retomada via IntersectionObserver | Unitário / Mock | Quando o observador reporta `isIntersecting: false`, o loop `requestAnimationFrame` é pausado; retoma ao entrar na viewport. |
| `TEST-CANVAS-03` | Rotação e reação ao movimento do mouse | Unitário / Evento | Evento `mousemove` na janela atualiza coordenadas da câmera sem erros em runtime. |
| `TEST-CANVAS-04` | Cleanup seguro e descarte no `onUnmounted` | Unitário / Ciclo | Chama `renderer.dispose()`, desconecta observers e remove event listeners sem memory leaks. |

### Módulo: `NeuroHero.vue` (`src/components/__tests__/NeuroHero.spec.ts`)
| ID | Cenário de Teste | Tipo | Critério de Aceite |
|---|---|---|---|
| `TEST-HERO-01` | Renderização de headline, badge e CTAs | Unitário | Renderiza badge "20 Anos de GAE", título principal, copy explicativo e botões de ação `#pesquisas` e `#historia`. |
| `TEST-HERO-02` | Integração do canvas 3D no container | Integração | Componente filho `NeuroCanvas` é montado corretamente sob o container com z-index adequado. |

### Módulo: `ResearchLines.vue` (`src/components/__tests__/ResearchLines.spec.ts`)
| ID | Cenário de Teste | Tipo | Critério de Aceite |
|---|---|---|---|
| `TEST-RES-01` | Renderização dos 3 pilares acadêmicos | Unitário | Exibe cards "Educação Infantil", "Alfabetização" e "Teoria Cognitiva" com ícones e links associados. |
| `TEST-RES-02` | Efeito de elevação visual dos cards | Unitário | Cards possuem a classe `node-card` e transições visuais compatíveis com o design system. |

### Módulo: `StudyGroups.vue` (`src/components/__tests__/StudyGroups.spec.ts`)
| ID | Cenário de Teste | Tipo | Critério de Aceite |
|---|---|---|---|
| `TEST-GRP-01` | Exibição de conteúdo institucional e métricas | Unitário | Apresenta textos sobre GAE e GEA, botão de participação e métricas "20+ Anos de História" e "50+ Mestres e Doutores". |

### Módulo: `App.vue` (`src/__tests__/App.spec.ts`)
| ID | Cenário de Teste | Tipo | Critério de Aceite |
|---|---|---|---|
| `TEST-APP-01` | Montagem e integração completa da SPA | Integração | App monta todas as seções (Navbar, Hero, Linhas de Pesquisa, Grupos) e inclui obrigatoriamente `OrionFooter`. |
| `TEST-APP-02` | Banner Orion Obrigatório | Integração | Valida presença de `OrionFooter` com links e branding institucional intactos. |
