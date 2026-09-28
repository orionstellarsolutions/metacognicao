import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import OrionFooter from '../OrionFooter.vue';

describe('OrionFooter.vue', () => {
  it('renders the Orion Stellar Solutions brand text', () => {
    const wrapper = mount(OrionFooter);
    expect(wrapper.text()).toContain('Orion Stellar Solutions');
    expect(wrapper.text()).toContain('Desenvolvido por');
  });

  it('contains link targeting official Orion Stellar Solutions domain', () => {
    const wrapper = mount(OrionFooter);
    const link = wrapper.find('a');
    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toBe('https://orionstellarsolutions.com.br/');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toBe('noopener noreferrer');
  });
});
