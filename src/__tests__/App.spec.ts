import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../App.vue';
import OrionFooter from '../components/OrionFooter.vue';

describe('App.vue', () => {
  it('renders title and description', () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain('Template SDD Orion');
    expect(wrapper.text()).toContain('Spec-Driven Development');
  });

  it('includes mandatory OrionFooter component', () => {
    const wrapper = mount(App);
    expect(wrapper.findComponent(OrionFooter).exists()).toBe(true);
  });
});
