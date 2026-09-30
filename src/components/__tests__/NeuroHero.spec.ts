import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import NeuroHero from '../NeuroHero.vue';

// Mock NeuroCanvas to isolate NeuroHero tests
vi.mock('../NeuroCanvas.vue', () => ({
  __esModule: true,
  default: {
    name: 'NeuroCanvas',
    template: '<div data-testid="mock-neuro-canvas"></div>'
  }
}));

describe('NeuroHero.vue', () => {
  it('TEST-HERO-01: deve renderizar badge, headline, copy explicativo e botões CTA com links corretos', async () => {
    const wrapper = mount(NeuroHero);
    await flushPromises();

    expect(wrapper.find('[data-testid="hero-badge"]').text()).toContain('Novidade: 20 Anos de GAE');
    expect(wrapper.text()).toContain('Desvendando o processo de');
    expect(wrapper.text()).toContain('Aprender a Aprender');
    expect(wrapper.text()).toContain('Exploramos a aprendizagem humana, a neurociência e a formação docente');

    const ctaPesquisas = wrapper.find('[data-testid="cta-pesquisas"]');
    expect(ctaPesquisas.exists()).toBe(true);
    expect(ctaPesquisas.attributes('href')).toBe('#pesquisas');

    const ctaHistoria = wrapper.find('[data-testid="cta-historia"]');
    expect(ctaHistoria.exists()).toBe(true);
    expect(ctaHistoria.attributes('href')).toBe('#historia');
  });

  it('TEST-HERO-02: deve conter o canvas neural integrado em background', async () => {
    const wrapper = mount(NeuroHero);
    await flushPromises();

    expect(wrapper.find('[data-testid="mock-neuro-canvas"]').exists()).toBe(true);
  });
});
