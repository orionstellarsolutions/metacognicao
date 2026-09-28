<script setup lang="ts">
import { ArrowRight, BookOpen, Cpu, Sparkles } from '@lucide/vue';
import type { Component } from 'vue';

interface ResearchCard {
  id: string;
  title: string;
  description: string;
  icon: Component;
  iconBg: string;
  iconColor: string;
  cornerBg: string;
  linkColor: string;
  linkHover: string;
}

const lines: ResearchCard[] = [
  {
    id: 'infantil',
    title: 'Educação Infantil',
    description: 'Mapeamento da representação social de professores e novos olhares sobre as infâncias.',
    icon: Sparkles,
    iconBg: 'bg-purple-50',
    iconColor: 'text-brand-purple',
    cornerBg: 'bg-purple-50',
    linkColor: 'text-brand-teal',
    linkHover: 'hover:text-teal-700'
  },
  {
    id: 'alfabetizacao',
    title: 'Alfabetização',
    description: 'A ação pedagógica como atividade sistematizada de construção de conhecimento novo.',
    icon: BookOpen,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    cornerBg: 'bg-blue-50',
    linkColor: 'text-blue-600',
    linkHover: 'hover:text-blue-800'
  },
  {
    id: 'cognitiva',
    title: 'Teoria Cognitiva',
    description: 'Por que o cérebro supera qualquer máquina: plasticidade e reconfiguração cerebral.',
    icon: Cpu,
    iconBg: 'bg-amber-50',
    iconColor: 'text-brand-accent',
    cornerBg: 'bg-amber-50',
    linkColor: 'text-amber-600',
    linkHover: 'hover:text-amber-800'
  }
];
</script>

<template>
  <section
    id="pesquisas"
    class="py-24 bg-gray-50 relative z-10"
    data-testid="research-lines"
  >
    <div class="container mx-auto px-6 max-w-7xl">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Linhas de Pesquisa</h2>
          <p class="text-gray-500">Onde a teoria encontra a prática educacional.</p>
        </div>
        <a
          href="#pesquisas"
          class="inline-flex items-center text-brand-purple font-semibold hover:text-brand-dark transition-colors"
          data-testid="link-ver-todas"
        >
          <span>Ver todas</span>
          <ArrowRight class="w-4 h-4 ml-2" />
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article
          v-for="card in lines"
          :key="card.id"
          class="node-card bg-white rounded-3xl p-8 border border-gray-100 relative overflow-hidden group shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
          :data-testid="`card-${card.id}`"
        >
          <!-- Decorative corner bubble -->
          <div
            :class="[
              'absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 pointer-events-none',
              card.cornerBg
            ]"
            aria-hidden="true"
          />

          <div>
            <!-- Icon box -->
            <div
              :class="[
                'w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl mb-6 relative z-10 border border-gray-50',
                card.iconColor
              ]"
            >
              <component :is="card.icon" class="w-7 h-7" />
            </div>

            <!-- Title & Description -->
            <h3 class="text-xl font-bold text-gray-900 mb-3 relative z-10">
              {{ card.title }}
            </h3>
            <p class="text-gray-600 mb-6 relative z-10 leading-relaxed text-sm md:text-base">
              {{ card.description }}
            </p>
          </div>

          <!-- Explore Link -->
          <a
            href="#pesquisas"
            :class="[
              'inline-flex items-center font-semibold relative z-10 transition-colors text-sm',
              card.linkColor,
              card.linkHover
            ]"
          >
            <span>Explorar área</span>
            <ArrowRight class="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
