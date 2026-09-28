import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import NeuroNavbar from '../NeuroNavbar.vue';

describe('NeuroNavbar.vue', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('TEST-NAV-01: deve renderizar a marca Metacognição e os links de navegação principais', () => {
    const wrapper = mount(NeuroNavbar);

    expect(wrapper.text()).toContain('Metacognição');
    expect(wrapper.text()).toContain('Sobre');
    expect(wrapper.text()).toContain('Pesquisas');
    expect(wrapper.text()).toContain('Publicações');
    expect(wrapper.text()).toContain('Grupos (GAE/GEA)');
    expect(wrapper.text()).toContain('Acessar Acervo');

    const acervoLink = wrapper.find('a[href="#acervo"]');
    expect(acervoLink.exists()).toBe(true);
  });

  it('TEST-NAV-02: deve alternar classes ao rolar a página verticalmente', async () => {
    const wrapper = mount(NeuroNavbar);
    const nav = wrapper.find('[data-testid="neuro-navbar"]');

    expect(nav.classes()).toContain('py-4');
    expect(nav.classes()).not.toContain('shadow-md');

    // Simula scroll acima de 50px
    Object.defineProperty(window, 'scrollY', { value: 60, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    await wrapper.vm.$nextTick();

    expect(nav.classes()).toContain('shadow-md');
    expect(nav.classes()).toContain('py-2');

    // Retorna scroll para o topo
    Object.defineProperty(window, 'scrollY', { value: 10, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    await wrapper.vm.$nextTick();

    expect(nav.classes()).not.toContain('shadow-md');
    expect(nav.classes()).toContain('py-4');
  });

  it('TEST-NAV-03: deve remover o listener de scroll ao ser desmontado', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const wrapper = mount(NeuroNavbar);

    wrapper.unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('deve alternar a visibilidade do menu mobile ao clicar no botão', async () => {
    const wrapper = mount(NeuroNavbar);

    expect(wrapper.find('[data-testid="mobile-menu"]').exists()).toBe(false);

    const toggleButton = wrapper.find('button[aria-label="Abrir menu"]');
    await toggleButton.trigger('click');

    expect(wrapper.find('[data-testid="mobile-menu"]').exists()).toBe(true);

    // Fecha ao clicar em um link mobile
    const mobileLink = wrapper.find('[data-testid="mobile-menu"] a');
    await mobileLink.trigger('click');

    expect(wrapper.find('[data-testid="mobile-menu"]').exists()).toBe(false);
  });
});
