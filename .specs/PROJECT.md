# Metacognição - Projeto Institucional

## 1. Visão do Produto
A plataforma **Metacognição** é o portal institucional e científico dedicado a divulgar a produção acadêmica, projetos de pesquisa e eventos dos grupos **GAE (Grupo de Aprendizagem e Escrita)** e **GEA (Grupo de Estudos da Aprendizagem)**, vinculados à PUCPR. Com mais de 20 anos de trajetória e mais de 50 mestres e doutores formados, o portal conecta a neurociência, a teoria social cognitiva e a formação docente com o cotidiano escolar.

## 2. Objetivos Principais
- **Divulgação Científica e Acervo:** Disponibilizar teses, dissertações, artigos e livros (como a obra comemorativa *Aprendizagens Entre Redes*).
- **Engajamento Acadêmico e Comunitário:** Facilitar a participação de professores, pesquisadores e estudantes nos encontros e projetos do GAE e GEA.
- **Experiência Visual Imersiva:** Transmitir o conceito de "Aprender a Aprender" por meio de representação visual neuro-interativa com nós e sinapses 3D de alta performance.
- **Conformidade Orion Stellar Solutions:** Garantir padrões estritos de mobile performance ($LCP \le 2.5\text{s}$, $INP \le 200\text{ms}$, Lighthouse Mobile $\ge 90$), acessibilidade e chancela institucional da Orion.

## 3. Público-Alvo
- Educadores e gestores da Educação Infantil, Ensino Fundamental, Médio e Superior.
- Pesquisadores, pós-graduandos e comunidade científica em Psicopedagogia, Educação e Neurociência.
- Estudantes e interessados em teorias da aprendizagem e metacognição.

## 4. Stack Tecnológica Primária
- **Frontend Framework:** Vue 3 (Composition API com `<script setup>`) + TypeScript.
- **Estilização:** Tailwind CSS.
- **Animação Gráfica 3D:** Three.js com IntersectionObserver / RAF pausável para economia de bateria e performance móvel.
- **Ícones:** Lucide Vue Next.
- **Testes & Qualidade:** Vitest, Vue Test Utils, Happy DOM, ESLint, TypeScript (`vue-tsc`).
- **Infraestrutura:** Cloudflare Pages com compressão Brotli e headers de cache.
