<script setup lang="ts">
import { ArrowRight } from '@lucide/vue';
import type { MetricItem } from '../types/landing';

const metrics: MetricItem[] = [
  { value: '20+', label: 'Anos de História' },
  { value: '50+', label: 'Mestres e Doutores' }
];
</script>

<template>
  <section
    id="grupos"
    class="py-24 bg-white relative z-10 border-t border-gray-100"
    data-testid="study-groups"
  >
    <div class="container mx-auto px-6 max-w-7xl">
      <div class="bg-brand-dark rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 text-white flex flex-col md:flex-row items-center justify-between overflow-hidden relative shadow-2xl">
        <!-- Decorative glowing shapes -->
        <div
          class="absolute -right-20 -top-20 w-96 h-96 bg-brand-purple rounded-full blur-3xl opacity-50 pointer-events-none"
          aria-hidden="true"
        />
        <div
          class="absolute -left-20 -bottom-20 w-72 h-72 bg-brand-teal rounded-full blur-3xl opacity-30 pointer-events-none"
          aria-hidden="true"
        />

        <!-- Text and CTA -->
        <div class="relative z-10 md:w-1/2 mb-8 md:mb-0">
          <span class="inline-block px-3.5 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-accent mb-4 border border-white/10">
            Comunidade Científica
          </span>
          <h2 class="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
            Grupos de Estudo
          </h2>
          <p class="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
            Junte-se ao GAE (Pesquisa) ou GEA (Estudo). Um espaço aberto para estudantes, professores e pesquisadores interessados no processo de aprendizagem.
          </p>
          <a
            href="#grupos"
            class="inline-flex items-center justify-center bg-brand-accent text-brand-dark px-8 py-3.5 rounded-full font-bold hover:bg-yellow-400 transition-colors shadow-lg text-base group"
            data-testid="cta-participar"
          >
            <span>Participar de um Encontro</span>
            <ArrowRight class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <!-- Metric Cards -->
        <div class="relative z-10 md:w-2/5 grid grid-cols-2 gap-4 w-full">
          <div
            v-for="(metric, idx) in metrics"
            :key="idx"
            class="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center"
            :data-testid="`metric-${idx}`"
          >
            <div class="text-3xl md:text-4xl font-extrabold text-brand-accent mb-1">
              {{ metric.value }}
            </div>
            <div class="text-xs md:text-sm text-gray-200 font-medium">
              {{ metric.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
