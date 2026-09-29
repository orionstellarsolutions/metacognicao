import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import CategoryModal from '../CategoryModal.vue';
import UnsplashModal from '../UnsplashModal.vue';
import { blogService } from '../../../services/blogService';

describe('Modais Auxiliares do Blog', () => {
  describe('CategoryModal.vue', () => {
    it('TEST-CAT-01: deve validar campo obrigatório e emitir created ao salvar com sucesso', async () => {
      const createSpy = vi.spyOn(blogService, 'createCategory').mockResolvedValue({
        id: 'cat-nova',
        name: 'NEUROPSICOPEDAGOGIA',
        slug: 'neuropsicopedagogia'
      });

      const wrapper = mount(CategoryModal);

      // Tenta submeter vazio
      await wrapper.find('form').trigger('submit.prevent');
      expect(wrapper.find('[data-testid="category-error"]').text()).toContain('insira o nome da categoria');
      expect(createSpy).not.toHaveBeenCalled();

      // Preenche nome
      const input = wrapper.find('[data-testid="input-category-name"]');
      await input.setValue('Neuropsicopedagogia');
      await wrapper.find('form').trigger('submit.prevent');

      expect(createSpy).toHaveBeenCalledWith('Neuropsicopedagogia');
      expect(wrapper.emitted('created')?.[0]?.[0]).toEqual({
        id: 'cat-nova',
        name: 'NEUROPSICOPEDAGOGIA',
        slug: 'neuropsicopedagogia'
      });
      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('deve emitir close ao clicar no botão fechar ou cancelar', async () => {
      const wrapper = mount(CategoryModal);
      await wrapper.find('[data-testid="btn-close-category"]').trigger('click');
      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('deve exibir mensagem de erro se a criação falhar', async () => {
      vi.spyOn(blogService, 'createCategory').mockRejectedValue(new Error('Falha no banco D1'));
      const wrapper = mount(CategoryModal);
      await wrapper.find('[data-testid="input-category-name"]').setValue('Neurociência');
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();

      expect(wrapper.find('[data-testid="category-error"]').text()).toContain('Falha no banco D1');
    });
  });

  describe('UnsplashModal.vue', () => {
    it('TEST-UNS-01: deve carregar imagens, permitir busca e emitir select ao clicar em uma foto', async () => {
      const mockImages = [
        {
          id: 'img-1',
          url: 'https://images.unsplash.com/photo-1',
          thumb: 'https://images.unsplash.com/photo-1-thumb',
          alt: 'Livros de Neurociência',
          author: 'Dra. Ana',
          author_url: 'https://unsplash.com/@ana'
        }
      ];

      const searchSpy = vi.spyOn(blogService, 'searchUnsplash').mockResolvedValue(mockImages);

      const wrapper = mount(UnsplashModal);
      await flushPromises();

      expect(wrapper.find('[data-testid="input-unsplash-query"]').exists()).toBe(true);

      // Executa busca com nova query
      await wrapper.find('[data-testid="input-unsplash-query"]').setValue('neurologia');
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();

      expect(searchSpy).toHaveBeenCalledWith('neurologia');

      // Clica em uma tag rápida
      const quickTagBtn = wrapper.findAll('button').find(b => b.text().includes('Neurociência'));
      await quickTagBtn?.trigger('click');
      await flushPromises();
      expect(searchSpy).toHaveBeenCalledWith('Neurociência');

      const item = wrapper.find('[data-testid="unsplash-item-img-1"]');
      expect(item.exists()).toBe(true);
      expect(item.text()).toContain('Livros de Neurociência');

      await item.trigger('click');

      expect(wrapper.emitted('select')?.[0]?.[0]).toEqual(mockImages[0]);
      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('deve lidar com erro na busca do Unsplash e fechar modal', async () => {
      vi.spyOn(blogService, 'searchUnsplash').mockRejectedValue(new Error('Erro de API'));

      const wrapper = mount(UnsplashModal);
      await flushPromises();

      expect(wrapper.text()).toContain('Erro de API');

      // Botão fechar
      await wrapper.find('[data-testid="btn-close-unsplash"]').trigger('click');
      expect(wrapper.emitted('close')).toBeTruthy();
    });
  });
});
