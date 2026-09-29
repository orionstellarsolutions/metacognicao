import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import NewPostModal from '../NewPostModal.vue';
import { blogService } from '../../../services/blogService';
import * as aiSummarizer from '../../../services/aiSummarizer';

describe('NewPostModal.vue', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(blogService, 'getCategories').mockResolvedValue([
      { id: 'cat-geral', name: 'GERAL', slug: 'geral' },
      { id: 'cat-infantil', name: 'EDUCAÇÃO INFANTIL', slug: 'educacao-infantil' }
    ]);
  });

  it('TEST-POST-01: deve renderizar todos os campos da coluna esquerda e toolbar da coluna direita', async () => {
    const wrapper = mount(NewPostModal);
    await flushPromises();

    expect(wrapper.text()).toContain('NOVO POST');
    expect(wrapper.find('[data-testid="input-post-title"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="select-post-category"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="input-display-date"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="textarea-post-excerpt"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="editor-toolbar"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="rich-editor-content"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="btn-save-post"]').exists()).toBe(true);
  });

  it('TEST-POST-02: deve formatar a data para o padrão dd/mm/aaaa a partir do input nativo', async () => {
    const wrapper = mount(NewPostModal);
    await flushPromises();

    const nativeDateInput = wrapper.find('[data-testid="input-native-date"]');
    await nativeDateInput.setValue('2026-10-22');
    await nativeDateInput.trigger('change');

    const displayInput = wrapper.find<HTMLInputElement>('[data-testid="input-display-date"]');
    expect(displayInput.element.value).toBe('22/10/2026');
  });

  it('TEST-POST-03: deve preencher o resumo ao acionar o botão de IA', async () => {
    vi.spyOn(aiSummarizer, 'summarizeArticle').mockResolvedValue('Síntese gerada por IA sobre aprendizagem.');

    const wrapper = mount(NewPostModal);
    await flushPromises();

    // Preenche título
    await wrapper.find('[data-testid="input-post-title"]').setValue('Pesquisa em Metacognição');

    // Clica no botão de IA
    await wrapper.find('[data-testid="btn-generate-ai"]').trigger('click');
    await flushPromises();

    const textarea = wrapper.find<HTMLTextAreaElement>('[data-testid="textarea-post-excerpt"]');
    expect(textarea.element.value).toBe('Síntese gerada por IA sobre aprendizagem.');
  });

  it('TEST-POST-04: deve validar campos obrigatórios e submeter o post com sucesso', async () => {
    const createSpy = vi.spyOn(blogService, 'createPost').mockResolvedValue({
      id: 'post-123',
      title: 'Educação do Futuro',
      slug: 'educacao-do-futuro',
      category_id: 'cat-geral',
      category_name: 'GERAL',
      date: '29/09/2026',
      excerpt: 'Resumo do artigo',
      cover_url: 'https://images.unsplash.com/photo-1',
      cover_alt: 'Capa do artigo',
      content: '<p>Conteúdo de estudo</p>'
    });

    const wrapper = mount(NewPostModal);
    await flushPromises();

    // Tenta salvar sem título
    await wrapper.find('[data-testid="btn-save-post"]').trigger('click');
    expect(wrapper.find('[data-testid="form-error"]').text()).toContain('título do post é obrigatório');
    expect(createSpy).not.toHaveBeenCalled();

    // Preenche campos
    await wrapper.find('[data-testid="input-post-title"]').setValue('Educação do Futuro');
    await wrapper.find('[data-testid="input-display-date"]').setValue('29/09/2026');
    await wrapper.find('[data-testid="textarea-post-excerpt"]').setValue('Resumo do artigo');
    await wrapper.find('[data-testid="input-cover-alt"]').setValue('Capa do artigo');

    await wrapper.find('[data-testid="btn-save-post"]').trigger('click');
    await flushPromises();

    expect(createSpy).toHaveBeenCalled();
    expect(wrapper.emitted('save')).toBeTruthy();
    expect(wrapper.emitted('close')).toBeTruthy();
  });
});
