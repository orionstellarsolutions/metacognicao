import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import BlogSection from '../BlogSection.vue';
import PostModal from '../PostModal.vue';
import { blogService } from '../../../services/blogService';

describe('Componentes Públicos do Blog', () => {
  const mockCategories = [
    { id: 'cat-geral', name: 'GERAL', slug: 'geral' },
    { id: 'cat-infantil', name: 'EDUCAÇÃO INFANTIL', slug: 'educacao-infantil' }
  ];

  const mockPosts = [
    {
      id: 'post-1',
      title: 'Aprendizagens Entre Redes',
      slug: 'aprendizagens-entre-redes',
      category_id: 'cat-geral',
      category_name: 'GERAL',
      date: '28/09/2026',
      excerpt: 'Resumo sobre a pesquisa do GAE',
      cover_url: 'https://images.unsplash.com/photo-1',
      cover_alt: 'Pesquisadores reunidos',
      content: '<p>Texto completo do post 1</p>'
    },
    {
      id: 'post-2',
      title: 'Educação Infantil e Novos Olhares',
      slug: 'educacao-infantil-novos-olhares',
      category_id: 'cat-infantil',
      category_name: 'EDUCAÇÃO INFANTIL',
      date: '25/09/2026',
      excerpt: 'Formação continuada docente',
      cover_url: 'https://images.unsplash.com/photo-2',
      cover_alt: 'Crianças em atividade',
      content: '<p>Texto completo do post 2</p>'
    }
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(blogService, 'getCategories').mockResolvedValue(mockCategories);
    vi.spyOn(blogService, 'getPosts').mockResolvedValue(mockPosts);
  });

  describe('BlogSection.vue', () => {
    it('TEST-PUB-01: deve renderizar artigos, pills de filtro e emitir leitura do artigo', async () => {
      const wrapper = mount(BlogSection);
      await flushPromises();

      expect(wrapper.text()).toContain('Publicações e Descobertas');
      expect(wrapper.find('[data-testid="post-card-post-1"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="post-card-post-2"]').exists()).toBe(true);

      // Filtragem por categoria
      const infantilPill = wrapper.find('[data-testid="pill-educacao-infantil"]');
      await infantilPill.trigger('click');

      expect(wrapper.find('[data-testid="post-card-post-2"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="post-card-post-1"]').exists()).toBe(false);

      // Clique em ler artigo
      await wrapper.find('[data-testid="btn-read-post-2"]').trigger('click');
      expect(wrapper.emitted('readPost')?.[0]?.[0]).toEqual(mockPosts[1]);

      // Clique em abrir admin
      await wrapper.find('[data-testid="btn-section-admin"]').trigger('click');
      expect(wrapper.emitted('openAdmin')).toBeTruthy();
    });
  });

  describe('PostModal.vue', () => {
    it('TEST-READ-01: deve renderizar detalhes do artigo e emitir close', async () => {
      const wrapper = mount(PostModal, {
        props: {
          post: mockPosts[0]
        }
      });

      expect(wrapper.text()).toContain('Aprendizagens Entre Redes');
      expect(wrapper.text()).toContain('28/09/2026');
      expect(wrapper.text()).toContain('GERAL');
      expect(wrapper.text()).toContain('Pesquisadores reunidos');
      expect(wrapper.find('[data-testid="post-full-content"]').html()).toContain('Texto completo do post 1');

      await wrapper.find('[data-testid="btn-close-reader"]').trigger('click');
      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('não deve renderizar nada se o post for nulo', () => {
      const wrapper = mount(PostModal, {
        props: {
          post: null
        }
      });

      expect(wrapper.find('[data-testid="post-modal"]').exists()).toBe(false);
    });
  });
});
