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

      vi.spyOn(blogService, 'searchUnsplash').mockResolvedValue(mockImages);

      const wrapper = mount(UnsplashModal);
      await flushPromises();

      expect(wrapper.find('[data-testid="input-unsplash-query"]').exists()).toBe(true);

      const item = wrapper.find('[data-testid="unsplash-item-img-1"]');
      expect(item.exists()).toBe(true);
      expect(item.text()).toContain('Livros de Neurociência');

      await item.trigger('click');

      expect(wrapper.emitted('select')?.[0]?.[0]).toEqual(mockImages[0]);
      expect(wrapper.emitted('close')).toBeTruthy();
    });
  });
});
