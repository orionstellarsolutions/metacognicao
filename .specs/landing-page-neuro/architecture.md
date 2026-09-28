# Arquitetura e Contratos de Componentes - Landing Page Neuro-Interativa

## 1. Árvore de Componentes

```
src/
├── App.vue                         # Layout principal agrupando seções e OrionFooter
└── components/
    ├── NeuroNavbar.vue             # Header fixo, menu de navegação, scroll indicator
    ├── NeuroHero.vue               # Headline, badges, CTAs e container do 3D
    ├── NeuroCanvas.vue             # Motor WebGL Three.js com IntersectionObserver
    ├── ResearchLines.vue           # Grid com as 3 linhas de pesquisa acadêmica
    ├── StudyGroups.vue             # Apresentação dos grupos GAE e GEA com métricas
    └── OrionFooter.vue             # Rodapé institucional oficial da Orion
```

## 2. Contratos e Interfaces de Dados

### `src/types/landing.ts`
```typescript
export interface NavItem {
  label: string;
  href: string;
}

export interface ResearchLine {
  id: string;
  title: string;
  description: string;
  icon: string;
  accentColor: 'purple' | 'blue' | 'amber';
  href: string;
}

export interface MetricItem {
  value: string;
  label: string;
}
```

## 3. Estratégia de Three.js no `NeuroCanvas.vue`
- Utilizar `three` instalado como dependência do projeto.
- Inicialização sob demanda dentro de `onMounted` com verificação de suporte a WebGL.
- Implementação de `IntersectionObserver` vinculado ao elemento canvas:
  - `isIntersecting === true`: retoma `animate()`
  - `isIntersecting === false`: cancela `cancelAnimationFrame` e pausa o clock.
- Limpeza rigorosa no hook `onUnmounted`: destruição de geometrias, materiais, texturas e chamada a `renderer.dispose()`.

## 4. Estilos e Paleta Tailwind
As variáveis e utilitários de cor foram padronizados em `tailwind.config.js`:
- `brand-purple`: `#4a148c`
- `brand-light`: `#7c43bd`
- `brand-dark`: `#12005e`
- `brand-accent`: `#ffb300`
- `brand-teal`: `#00897b`
- `brand-bg`: `#f8fafc`
