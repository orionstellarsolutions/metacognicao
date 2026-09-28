import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../App.vue';
import NeuroNavbar from '../components/NeuroNavbar.vue';
import NeuroHero from '../components/NeuroHero.vue';
import ResearchLines from '../components/ResearchLines.vue';
import StudyGroups from '../components/StudyGroups.vue';
import OrionFooter from '../components/OrionFooter.vue';

describe('App.vue (Landing Page Integration)', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    vi.stubGlobal(
      'IntersectionObserver',
      class MockIntersectionObserver {
        observe = vi.fn();
        disconnect = vi.fn();
        unobserve = vi.fn();
      }
    );
  });

  it('TEST-APP-01: deve montar a SPA completa com todas as seções da landing page', () => {
    const wrapper = mount(App);

    expect(wrapper.findComponent(NeuroNavbar).exists()).toBe(true);
    expect(wrapper.findComponent(NeuroHero).exists()).toBe(true);
    expect(wrapper.findComponent(ResearchLines).exists()).toBe(true);
    expect(wrapper.findComponent(StudyGroups).exists()).toBe(true);
  });

  it('TEST-APP-02: deve conter obrigatoriamente o componente OrionFooter institucional', () => {
    const wrapper = mount(App);

    const footer = wrapper.findComponent(OrionFooter);
    expect(footer.exists()).toBe(true);
    expect(footer.text()).toContain('Orion Stellar Solutions');
  });

  it('deve conter as âncoras e textos principais da Metacognição', () => {
    const wrapper = mount(App);

    expect(wrapper.text()).toContain('Metacognição');
    expect(wrapper.text()).toContain('Aprender a Aprender');
    expect(wrapper.text()).toContain('Linhas de Pesquisa');
    expect(wrapper.text()).toContain('Grupos de Estudo');
  });
});
