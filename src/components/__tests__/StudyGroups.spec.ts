import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StudyGroups from '../StudyGroups.vue';

describe('StudyGroups.vue', () => {
  it('TEST-GRP-01: deve exibir o conteúdo institucional e as métricas de impacto', () => {
    const wrapper = mount(StudyGroups);

    expect(wrapper.text()).toContain('Comunidade Científica');
    expect(wrapper.text()).toContain('Grupos de Estudo');
    expect(wrapper.text()).toContain('Junte-se ao GAE (Pesquisa) ou GEA (Estudo)');
    expect(wrapper.text()).toContain('Participar de um Encontro');

    const ctaParticipar = wrapper.find('[data-testid="cta-participar"]');
    expect(ctaParticipar.exists()).toBe(true);
    expect(ctaParticipar.attributes('href')).toBe('#grupos');

    expect(wrapper.find('[data-testid="metric-0"]').text()).toContain('20+');
    expect(wrapper.find('[data-testid="metric-0"]').text()).toContain('Anos de História');

    expect(wrapper.find('[data-testid="metric-1"]').text()).toContain('50+');
    expect(wrapper.find('[data-testid="metric-1"]').text()).toContain('Mestres e Doutores');
  });
});
