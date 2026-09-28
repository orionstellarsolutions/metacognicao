import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ResearchLines from '../ResearchLines.vue';

describe('ResearchLines.vue', () => {
  it('TEST-RES-01: deve renderizar os 3 pilares acadêmicos de pesquisa', () => {
    const wrapper = mount(ResearchLines);

    expect(wrapper.text()).toContain('Linhas de Pesquisa');
    expect(wrapper.text()).toContain('Onde a teoria encontra a prática educacional');

    // Card 1
    const cardInfantil = wrapper.find('[data-testid="card-infantil"]');
    expect(cardInfantil.exists()).toBe(true);
    expect(cardInfantil.text()).toContain('Educação Infantil');
    expect(cardInfantil.text()).toContain('Mapeamento da representação social de professores');

    // Card 2
    const cardAlfabetizacao = wrapper.find('[data-testid="card-alfabetizacao"]');
    expect(cardAlfabetizacao.exists()).toBe(true);
    expect(cardAlfabetizacao.text()).toContain('Alfabetização');
    expect(cardAlfabetizacao.text()).toContain('A ação pedagógica como atividade sistematizada');

    // Card 3
    const cardCognitiva = wrapper.find('[data-testid="card-cognitiva"]');
    expect(cardCognitiva.exists()).toBe(true);
    expect(cardCognitiva.text()).toContain('Teoria Cognitiva');
    expect(cardCognitiva.text()).toContain('Por que o cérebro supera qualquer máquina');
  });

  it('TEST-RES-02: os cards devem possuir a classe de estilização node-card e botão ver todas', () => {
    const wrapper = mount(ResearchLines);

    const cards = wrapper.findAll('.node-card');
    expect(cards.length).toBe(3);

    const linkVerTodas = wrapper.find('[data-testid="link-ver-todas"]');
    expect(linkVerTodas.exists()).toBe(true);
    expect(linkVerTodas.attributes('href')).toBe('#pesquisas');
  });
});
