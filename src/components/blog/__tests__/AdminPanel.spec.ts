import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import AdminPanel from '../AdminPanel.vue';
import { blogService } from '../../../services/blogService';

describe('AdminPanel.vue', () => {
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
      content: '<p>Texto completo</p>'
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
      content: '<p>Texto da infância</p>'
    }
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(blogService, 'getCategories').mockResolvedValue(mockCategories);
    vi.spyOn(blogService, 'getPosts').mockResolvedValue(mockPosts);
  });

  it('TEST-ADM-01: deve listar métricas e artigos com dados recuperados do blogService', async () => {
    const wrapper = mount(AdminPanel);
    await flushPromises();

    expect(wrapper.text()).toContain('Gestão Editorial do Blog Metacognição');
    expect(wrapper.find('[data-testid="metric-total-posts"]').text()).toBe('2');
    expect(wrapper.find('[data-testid="metric-total-categories"]').text()).toBe('2');

    expect(wrapper.find('[data-testid="admin-post-row-post-1"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="admin-post-row-post-2"]').exists()).toBe(true);
  });

  it('deve filtrar os artigos pelo campo de busca', async () => {
    const wrapper = mount(AdminPanel);
    await flushPromises();

    const searchInput = wrapper.find('[data-testid="input-admin-search"]');
    await searchInput.setValue('Infantil');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="admin-post-row-post-2"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="admin-post-row-post-1"]').exists()).toBe(false);
  });

  it('deve abrir o modal de confirmação e excluir o post', async () => {
    const deleteSpy = vi.spyOn(blogService, 'deletePost').mockResolvedValue(true);

    const wrapper = mount(AdminPanel);
    await flushPromises();

    // Clica no botão excluir do post-1
    await wrapper.find('[data-testid="btn-delete-post-post-1"]').trigger('click');
    expect(wrapper.find('[data-testid="delete-confirm-modal"]').exists()).toBe(true);

    // Confirma exclusão
    await wrapper.find('[data-testid="btn-confirm-delete"]').trigger('click');
    await flushPromises();

    expect(deleteSpy).toHaveBeenCalledWith('post-1');
    expect(wrapper.find('[data-testid="admin-post-row-post-1"]').exists()).toBe(false);
  });

  it('deve emitir viewPost ao clicar no botão de visualizar', async () => {
    const wrapper = mount(AdminPanel);
    await flushPromises();

    await wrapper.find('[data-testid="btn-view-post-post-1"]').trigger('click');
    expect(wrapper.emitted('viewPost')?.[0]?.[0]).toEqual(mockPosts[0]);
  });

  it('deve filtrar posts por categoria selecionada', async () => {
    const wrapper = mount(AdminPanel);
    await flushPromises();

    const categorySelect = wrapper.find('[data-testid="select-admin-filter"]');
    await categorySelect.setValue('cat-geral');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="admin-post-row-post-1"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="admin-post-row-post-2"]').exists()).toBe(false);
  });

  it('deve abrir modais de NewPost e Category a partir do painel admin', async () => {
    const wrapper = mount(AdminPanel);
    await flushPromises();

    // Novo Post
    await wrapper.find('[data-testid="btn-admin-new-post"]').trigger('click');
    expect(wrapper.text()).toContain('NOVO POST');

    const newPostModal = wrapper.findComponent({ name: 'NewPostModal' });
    await newPostModal.vm.$emit('save', mockPosts[0]);
    await flushPromises();

    // Nova Categoria
    await wrapper.find('[data-testid="btn-admin-new-cat"]').trigger('click');
    expect(wrapper.text()).toContain('NOVA CATEGORIA');

    const catModal = wrapper.findComponent({ name: 'CategoryModal' });
    await catModal.vm.$emit('created', { id: 'cat-3', name: 'PSICOPEDAGOGIA', slug: 'psicopedagogia' });
    await flushPromises();

    // Fechar painel
    await wrapper.find('[data-testid="btn-close-admin"]').trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });
});

