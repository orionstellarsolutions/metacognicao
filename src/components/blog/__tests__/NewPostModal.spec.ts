import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import NewPostModal from '../NewPostModal.vue';
import { blogService } from '../../../services/blogService';
import * as aiSummarizer from '../../../services/aiSummarizer';
import * as imageCompressionModule from '../../../services/imageCompression';

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

  it('TEST-POST-02: deve formatar a data para o padrão dd/mm/aaaa a partir do input nativo e abrir picker pelo botão', async () => {
    const wrapper = mount(NewPostModal);
    await flushPromises();

    // Digitação manual com máscara
    const displayInput = wrapper.find<HTMLInputElement>('[data-testid="input-display-date"]');
    await displayInput.setValue('15112026');
    await displayInput.trigger('input');
    expect(displayInput.element.value).toBe('15/11/2026');

    // Botão de abrir calendário
    const openCalendarBtn = wrapper.find('[data-testid="btn-open-calendar"]');
    expect(openCalendarBtn.exists()).toBe(true);

    const nativeDateInput = wrapper.find<HTMLInputElement>('[data-testid="input-native-date"]');
    nativeDateInput.element.showPicker = vi.fn();

    await openCalendarBtn.trigger('click');
    expect(nativeDateInput.element.showPicker).toHaveBeenCalled();

    // Seleção de nova data pelo input nativo
    await nativeDateInput.setValue('2026-10-22');
    await nativeDateInput.trigger('change');
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

  it('TEST-POST-05: deve executar comandos da toolbar e inserção de cabeçalhos', async () => {
    (document as any).execCommand = vi.fn().mockReturnValue(true);
    const wrapper = mount(NewPostModal);
    await flushPromises();

    // Bold, Italic, Headings, Lists
    const buttons = wrapper.findAll('[data-testid="editor-toolbar"] button');
    for (const btn of buttons) {
      await btn.trigger('click');
    }

    expect((document as any).execCommand).toHaveBeenCalledWith('bold', false, undefined);
    expect((document as any).execCommand).toHaveBeenCalledWith('italic', false, undefined);
  });

  it('TEST-POST-06: deve abrir e integrar com UnsplashModal e CategoryModal', async () => {
    const wrapper = mount(NewPostModal);
    await flushPromises();

    // Categoria modal
    await wrapper.find('[data-testid="btn-open-category-modal"]').trigger('click');
    expect(wrapper.findComponent({ name: 'CategoryModal' }).exists()).toBe(true);

    // Simula emissão de categoria criada
    const categoryModal = wrapper.findComponent({ name: 'CategoryModal' });
    await categoryModal.vm.$emit('created', { id: 'cat-new', name: 'NEUROBIOLOGIA', slug: 'neurobiologia' });
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'CategoryModal' }).exists()).toBe(false);

    // Unsplash modal
    await wrapper.find('[data-testid="btn-open-unsplash"]').trigger('click');
    expect(wrapper.findComponent({ name: 'UnsplashModal' }).exists()).toBe(true);

    const unsplashModal = wrapper.findComponent({ name: 'UnsplashModal' });
    await unsplashModal.vm.$emit('select', {
      url: 'https://images.unsplash.com/photo-brain',
      alt: 'Cérebro brilhante'
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'UnsplashModal' }).exists()).toBe(false);
  });

  it('TEST-POST-07: deve exibir erro se a gravação do post falhar', async () => {
    vi.spyOn(blogService, 'createPost').mockRejectedValue(new Error('Erro de conexão com D1'));

    const wrapper = mount(NewPostModal);
    await flushPromises();

    await wrapper.find('[data-testid="input-post-title"]').setValue('Post com Falha');
    await wrapper.find('[data-testid="input-display-date"]').setValue('29/09/2026');
    await wrapper.find('[data-testid="textarea-post-excerpt"]').setValue('Resumo');

    await wrapper.find('[data-testid="btn-save-post"]').trigger('click');
    await flushPromises();

    expect(wrapper.find('[data-testid="form-error"]').text()).toContain('Erro de conexão com D1');
  });

  it('TEST-POST-08: deve aceitar upload de arquivo local e comprimir imagem', async () => {
    vi.spyOn(imageCompressionModule, 'compressImage').mockResolvedValue({
      dataUrl: 'data:image/jpeg;base64,mockvalidbase64',
      sizeKb: 120
    });

    const wrapper = mount(NewPostModal);
    await flushPromises();

    const file = new File(['mock-img'], 'pesquisa-capa.jpg', { type: 'image/jpeg' });
    const fileInput = wrapper.find('[data-testid="input-file-cover"]');
    Object.defineProperty(fileInput.element, 'files', {
      value: [file]
    });
    await fileInput.trigger('change');
    await flushPromises();

    expect(wrapper.text()).toContain('pesquisa-capa.jpg');
    expect(wrapper.find('img[alt="Preview da capa"]').exists()).toBe(true);
  });

  it('TEST-POST-09: deve disparar comandos de formatação com retenção de foco', async () => {
    const execCommandSpy = vi.spyOn(document, 'execCommand').mockImplementation(() => true);

    const wrapper = mount(NewPostModal);
    await flushPromises();

    const boldBtn = wrapper.find('button[title*="Negrito"]');
    expect(boldBtn.exists()).toBe(true);
    await boldBtn.trigger('click');
    expect(execCommandSpy).toHaveBeenCalledWith('bold', false, undefined);

    const italicBtn = wrapper.find('button[title*="Itálico"]');
    await italicBtn.trigger('click');
    expect(execCommandSpy).toHaveBeenCalledWith('italic', false, undefined);

    const h2Btn = wrapper.find('button[title*="H2"]');
    await h2Btn.trigger('click');
    expect(execCommandSpy).toHaveBeenCalledWith('formatBlock', false, '<h2>');

    const h3Btn = wrapper.find('button[title*="H3"]');
    await h3Btn.trigger('click');
    expect(execCommandSpy).toHaveBeenCalledWith('formatBlock', false, '<h3>');

    const listBtn = wrapper.find('button[title*="Lista com marcadores"]');
    await listBtn.trigger('click');
    expect(execCommandSpy).toHaveBeenCalledWith('insertUnorderedList', false, undefined);

    const orderedBtn = wrapper.find('button[title*="Lista numerada"]');
    await orderedBtn.trigger('click');
    expect(execCommandSpy).toHaveBeenCalledWith('insertOrderedList', false, undefined);

    const quoteBtn = wrapper.find('button[title*="Citação"]');
    await quoteBtn.trigger('click');
    expect(execCommandSpy).toHaveBeenCalledWith('formatBlock', false, 'blockquote');

    const unlinkBtn = wrapper.find('button[title*="Remover Link"]');
    await unlinkBtn.trigger('click');
    expect(execCommandSpy).toHaveBeenCalledWith('unlink', false, undefined);
  });

  it('TEST-POST-10: deve inserir link, vídeo e imagem com prompt preenchido', async () => {
    const execCommandSpy = vi.spyOn(document, 'execCommand').mockImplementation(() => true);
    vi.stubGlobal('prompt', vi.fn().mockReturnValue('https://teste.com/conteudo'));

    const wrapper = mount(NewPostModal);
    await flushPromises();

    const linkBtn = wrapper.find('button[title*="Inserir Link"]');
    await linkBtn.trigger('click');
    expect(execCommandSpy).toHaveBeenCalledWith('createLink', false, 'https://teste.com/conteudo');

    const videoBtn = wrapper.find('button[title*="Vídeo"]');
    await videoBtn.trigger('click');
    expect(execCommandSpy).toHaveBeenCalledWith('insertHTML', false, expect.stringContaining('iframe'));

    const imgBtn = wrapper.find('button[title*="Inserir Imagem"]');
    await imgBtn.trigger('click');
    expect(execCommandSpy).toHaveBeenCalledWith('insertHTML', false, expect.stringContaining('img'));
  });

  it('TEST-POST-11: deve fechar pelo botão X e validar erros de validação ao salvar', async () => {
    const wrapper = mount(NewPostModal);
    await flushPromises();

    // Fecha pelo X
    await wrapper.find('[data-testid="btn-close-modal"]').trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();

    // Tenta salvar sem título
    await wrapper.find('[data-testid="input-post-title"]').setValue('');
    await wrapper.find('[data-testid="btn-save-post"]').trigger('click');
    expect(wrapper.find('[data-testid="form-error"]').text()).toContain('O título do post é obrigatório');

    // Preenche título mas apaga data
    await wrapper.find('[data-testid="input-post-title"]').setValue('Título Válido');
    await wrapper.find('[data-testid="input-display-date"]').setValue('');
    await wrapper.find('[data-testid="btn-save-post"]').trigger('click');
    expect(wrapper.find('[data-testid="form-error"]').text()).toContain('A data do post é obrigatória');

    // Preenche data mas limpa categoria
    await wrapper.find('[data-testid="input-display-date"]').setValue('22/10/2026');
    const select = wrapper.find('[data-testid="select-post-category"]');
    await select.setValue('');
    await wrapper.find('[data-testid="btn-save-post"]').trigger('click');
    expect(wrapper.find('[data-testid="form-error"]').text()).toContain('Selecione uma categoria');
  });

  it('TEST-POST-12: deve inicializar com postToEdit preexistente', async () => {
    const samplePost = {
      id: 'post-edit',
      title: 'Artigo Existente',
      slug: 'artigo-existente',
      category_id: 'cat-geral',
      category_name: 'GERAL',
      date: '10/10/2026',
      excerpt: 'Resumo existente',
      cover_url: 'https://exemplo.com/capa.jpg',
      cover_alt: 'Alt existente',
      content: '<p>Conteúdo existente.</p>'
    };

    const wrapper = mount(NewPostModal, {
      props: { postToEdit: samplePost }
    });
    await flushPromises();

    expect(wrapper.find<HTMLInputElement>('[data-testid="input-post-title"]').element.value).toBe('Artigo Existente');
    expect(wrapper.find<HTMLInputElement>('[data-testid="input-display-date"]').element.value).toBe('10/10/2026');
  });
});


