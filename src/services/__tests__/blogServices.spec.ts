import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanText, generateLocalSummary, summarizeArticle } from '../aiSummarizer';
import { blogService } from '../blogService';
import { compressImage } from '../imageCompression';

describe('Serviços do Blog & Admin', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('aiSummarizer.ts', () => {
    it('TEST-SRV-01: deve limpar tags HTML e marcações markdown', () => {
      const raw = '<h1>Título</h1>\n<p>Este é um **texto** com <em>marcação</em> e [link](http://teste.com).</p>';
      const cleaned = cleanText(raw);

      expect(cleaned).not.toContain('<h1>');
      expect(cleaned).not.toContain('**');
      expect(cleaned).toContain('Título');
      expect(cleaned).toContain('texto com marcação');
    });

    it('TEST-SRV-02: deve gerar resumo extrativo local baseado em frases completas', () => {
      const text = 'A metacognição é a capacidade de monitorar a própria cognição. Ela transforma o aprendizado dos estudantes em algo consciente e ativo. Pesquisadores de todo o mundo estudam esse fenômeno com rigor.';
      const summary = generateLocalSummary(text, 120);

      expect(summary.length).toBeLessThanOrEqual(125);
      expect(summary).toContain('A metacognição é a capacidade');
    });

    it('TEST-SRV-03: deve consumir endpoint /api/summarize quando disponível', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ excerpt: 'Resumo gerado pelo modelo Llama 3 da Cloudflare.' })
        })
      );

      const result = await summarizeArticle('Conteúdo completo do artigo de pesquisa sobre metacognição.');
      expect(result).toBe('Resumo gerado pelo modelo Llama 3 da Cloudflare.');
    });

    it('TEST-SRV-04: deve acionar fallback local caso /api/summarize falhe', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      const result = await summarizeArticle('A neurociência estuda o cérebro humano. Ela oferece subsídios valiosos para a educação.');
      expect(result).toContain('A neurociência estuda o cérebro humano');
    });

    it('deve rejeitar conteúdo vazio ao tentar resumir', async () => {
      await expect(summarizeArticle('   ')).rejects.toThrow('Conteúdo insuficiente');
    });
  });

  describe('blogService.ts', () => {
    it('TEST-SRV-05: deve retornar categorias padrão e criar nova categoria', async () => {
      const categories = await blogService.getCategories();
      expect(categories.length).toBeGreaterThanOrEqual(4);
      expect(categories.some((c) => c.name === 'GERAL')).toBe(true);

      const created = await blogService.createCategory('Neuroaprendizagem');
      expect(created.name).toBe('NEUROAPRENDIZAGEM');
      expect(created.slug).toBe('neuroaprendizagem');

      const updated = await blogService.getCategories();
      expect(updated.some((c) => c.slug === 'neuroaprendizagem')).toBe(true);
    });

    it('deve rejeitar nome de categoria vazio', async () => {
      await expect(blogService.createCategory('   ')).rejects.toThrow('Nome da categoria é obrigatório.');
    });

    it('TEST-SRV-06: deve retornar posts iniciais, criar novo post e excluir post', async () => {
      const initialPosts = await blogService.getPosts();
      const initialCount = initialPosts.length;
      expect(initialCount).toBeGreaterThanOrEqual(1);

      const newPost = await blogService.createPost({
        title: 'Novo Estudo sobre Metacognição',
        slug: 'novo-estudo-sobre-metacognicao',
        category_id: 'cat-cognitiva',
        category_name: 'TEORIA COGNITIVA',
        date: '29/09/2026',
        excerpt: 'Resumo do novo estudo publicado pelo grupo.',
        cover_url: 'https://images.unsplash.com/photo-test',
        cover_alt: 'Imagem ilustrativa do cérebro',
        content: '<p>Artigo completo de pesquisa.</p>'
      });

      expect(newPost.id).toBeDefined();
      expect(newPost.title).toBe('Novo Estudo sobre Metacognição');

      const afterAdd = await blogService.getPosts();
      expect(afterAdd.length).toBe(initialCount + 1);

      // Exclui o post
      const deleted = await blogService.deletePost(newPost.id);
      expect(deleted).toBe(true);

      const afterDelete = await blogService.getPosts();
      expect(afterDelete.length).toBe(initialCount);
    });

    it('TEST-SRV-07: deve buscar imagens no Unsplash com galeria padrão', async () => {
      const images = await blogService.searchUnsplash('educacao');
      expect(images.length).toBeGreaterThan(0);
      expect(images[0].url).toContain('unsplash.com');
      expect(images[0].alt).toBeDefined();
    });
  });

  describe('imageCompression.ts', () => {
    it('deve rejeitar arquivo que não seja do tipo imagem', async () => {
      const file = new File(['dummy'], 'arquivo.pdf', { type: 'application/pdf' });
      await expect(compressImage(file)).rejects.toThrow('não é uma imagem válida');
    });
  });
});
