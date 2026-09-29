# Matriz de Testes Automatizados - Módulo de Blog & Painel Admin
**ID da Funcionalidade:** `REQ-BLOG-ADMIN`  
**Responsável:** Test Planner (Orion Stellar Solutions)

---

## 1. 📋 Estratégia de Cobertura
- **Meta de Cobertura:** $\ge 95\%$ para linhas, funções e branches.
- **Ferramental:** Vitest v5, `@vue/test-utils` v2, `@vitest/coverage-v8`, Happy DOM.
- **Zero Testes Manuais:** Todos os comportamentos (validação de formulário, formatação de data `dd/mm/aaaa`, compressão de imagens via Canvas, chamada de IA para resumo com fallback, seleção no Unsplash, criação de categoria e persistência no D1) são validados por suítes unitárias e de integração.

---

## 2. 🧪 Matriz de Testes Automatizados

### Módulo: Serviços (`src/services/__tests__/`)
| ID | Cenário de Teste | Critério de Aceite |
|---|---|---|
| `TEST-SRV-01` | Compressão de imagens (`imageCompression.ts`) | Reduz arquivo mantendo formato e valida limites de 500KB. |
| `TEST-SRV-02` | Resumo de IA (`aiSummarizer.ts`) | Aciona endpoint de IA e aciona fallback heurístico sem quebrar quando a API estiver indisponível. |
| `TEST-SRV-03` | CRUD de Blog e Categorias (`blogService.ts`) | Realiza chamadas com sucesso e mantém cache em memória/local. |

### Módulo: Modais Auxiliares (`src/components/blog/__tests__/`)
| ID | Cenário de Teste | Critério de Aceite |
|---|---|---|
| `TEST-CAT-01` | Criação de categoria (`CategoryModal.vue`) | Valida campo obrigatório, emite evento de criação e persiste nova categoria. |
| `TEST-UNS-01` | Busca Unsplash (`UnsplashModal.vue`) | Exibe resultados de fotos, permite busca por palavra-chave e emite seleção com URL e Alt Text. |

### Módulo: Formulário "NOVO POST" (`NewPostModal.spec.ts`)
| ID | Cenário de Teste | Critério de Aceite |
|---|---|---|
| `TEST-POST-01` | Renderização dos campos da coluna esquerda e direita | Título, categoria, datepicker, excerpt, capa, alt text, toolbar e textarea. |
| `TEST-POST-02` | Formatação de data no formato `dd/mm/aaaa` | Seleção de data formata rigorosamente como dia/mês/ano brasileiro. |
| `TEST-POST-03` | Botão "Gerar com IA" | Preenche o campo de resumo com a síntese do conteúdo textual. |
| `TEST-POST-04` | Upload local comprimido vs Seleção Unsplash | Suporta ambos os métodos de definição de capa com preenchimento de alt text. |
| `TEST-POST-05` | Validação de campos obrigatórios e submissão | Impede submissão sem título, categoria ou data e emite evento `save`. |

### Módulo: Admin e Blog Público (`AdminPanel.spec.ts`, `BlogSection.spec.ts`, `PostModal.spec.ts`)
| ID | Cenário de Teste | Critério de Aceite |
|---|---|---|
| `TEST-ADM-01` | Listagem e exclusão de posts no painel admin | Renderiza tabela/cards de posts cadastrados com botão de exclusão e criação. |
| `TEST-PUB-01` | Grade pública de artigos na Landing Page | Renderiza cards na seção `#publicacoes` com imagem, categoria e data formatada. |
| `TEST-READ-01`| Leitura de artigo no PostModal | Abre modal com o conteúdo formatado do post selecionado. |
