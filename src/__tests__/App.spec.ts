import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../App.vue';
import NeuroNavbar from '../components/NeuroNavbar.vue';
import NeuroHero from '../components/NeuroHero.vue';
import ResearchLines from '../components/ResearchLines.vue';
import StudyGroups from '../components/StudyGroups.vue';
import BlogSection from '../components/blog/BlogSection.vue';
import AdminPanel from '../components/blog/AdminPanel.vue';
import PostModal from '../components/blog/PostModal.vue';
import OrionFooter from '../components/OrionFooter.vue';
import type { BlogPost } from '../types/blog';

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

  it('TEST-APP-01: deve montar a SPA completa com todas as seções da landing page incluindo Blog', () => {
    const wrapper = mount(App);

    expect(wrapper.findComponent(NeuroNavbar).exists()).toBe(true);
    expect(wrapper.findComponent(NeuroHero).exists()).toBe(true);
    expect(wrapper.findComponent(ResearchLines).exists()).toBe(true);
    expect(wrapper.findComponent(BlogSection).exists()).toBe(true);
    expect(wrapper.findComponent(StudyGroups).exists()).toBe(true);
  });

  it('TEST-APP-02: deve conter obrigatoriamente o componente OrionFooter institucional', () => {
    const wrapper = mount(App);

    const footer = wrapper.findComponent(OrionFooter);
    expect(footer.exists()).toBe(true);
    expect(footer.text()).toContain('Orion Stellar Solutions');
  });

  it('TEST-APP-03: deve abrir e fechar o Painel Admin ao receber evento do NeuroNavbar ou BlogSection', async () => {
    const wrapper = mount(App);

    expect(wrapper.findComponent(AdminPanel).exists()).toBe(false);

    // Abre via NeuroNavbar
    const navbar = wrapper.findComponent(NeuroNavbar);
    await navbar.vm.$emit('openAdmin');
    expect(wrapper.findComponent(AdminPanel).exists()).toBe(true);

    // Fecha via evento close do AdminPanel
    const adminPanel = wrapper.findComponent(AdminPanel);
    await adminPanel.vm.$emit('close');
    expect(wrapper.findComponent(AdminPanel).exists()).toBe(false);

    // Abre via BlogSection
    const blogSection = wrapper.findComponent(BlogSection);
    await blogSection.vm.$emit('openAdmin');
    expect(wrapper.findComponent(AdminPanel).exists()).toBe(true);
  });

  it('TEST-APP-04: deve abrir e fechar o PostModal ao ler um post da seção pública ou do admin', async () => {
    const wrapper = mount(App);

    const dummyPost: BlogPost = {
      id: 'test-p1',
      title: 'Post de Teste Integração',
      slug: 'post-de-teste',
      category_id: 'cat-neuro',
      category_name: 'NEUROCIÊNCIA',
      date: '29/09/2026',
      excerpt: 'Resumo do teste de integração',
      content: '<p>Conteúdo completo do artigo</p>',
      cover_url: 'https://images.unsplash.com/test.jpg',
      cover_alt: 'Imagem de teste',
      created_at: '2026-09-29T10:00:00Z'
    };

    const blogSection = wrapper.findComponent(BlogSection);
    await blogSection.vm.$emit('readPost', dummyPost);

    const postModal = wrapper.findComponent(PostModal);
    expect(postModal.props('post')).toEqual(dummyPost);

    // Fecha o modal
    await postModal.vm.$emit('close');
    expect(postModal.props('post')).toBeNull();
  });

  it('TEST-APP-05: deve abrir o PostModal a partir do evento viewPost do AdminPanel', async () => {
    const wrapper = mount(App);
    const navbar = wrapper.findComponent(NeuroNavbar);
    await navbar.vm.$emit('openAdmin');

    const dummyPost: BlogPost = {
      id: 'test-p2',
      title: 'Post Admin View',
      slug: 'post-admin-view',
      category_id: 'cat-neuro',
      category_name: 'NEUROCIÊNCIA',
      date: '29/09/2026',
      excerpt: 'Resumo',
      content: '<p>Admin view test</p>',
      cover_url: 'https://images.unsplash.com/test2.jpg',
      cover_alt: 'Alt 2',
      created_at: '2026-09-29T10:00:00Z'
    };

    const adminPanel = wrapper.findComponent(AdminPanel);
    await adminPanel.vm.$emit('viewPost', dummyPost);

    const postModal = wrapper.findComponent(PostModal);
    expect(postModal.props('post')).toEqual(dummyPost);
  });

  it('deve conter as âncoras e textos principais da Metacognição', () => {
    const wrapper = mount(App);

    expect(wrapper.text()).toContain('Metacognição');
    expect(wrapper.text()).toContain('Aprender a Aprender');
    expect(wrapper.text()).toContain('Linhas de Pesquisa');
    expect(wrapper.text()).toContain('Grupos de Estudo');
  });
});

