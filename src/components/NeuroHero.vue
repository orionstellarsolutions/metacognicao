<script setup lang="ts">
import { ArrowRight, ChevronRight, Play, ArrowDown } from '@lucide/vue';
import NeuroCanvas from './NeuroCanvas.vue';
</script>

<template>
  <section
    id="sobre"
    class="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden"
    data-testid="neuro-hero"
  >
    <!-- Background 3D Canvas -->
    <NeuroCanvas />

    <!-- Content overlay -->
    <div class="container mx-auto px-6 text-center relative z-10">
      <!-- Badge -->
      <div
        class="inline-flex items-center gap-1.5 mb-6 px-4 py-1.5 rounded-full bg-purple-100 text-brand-purple font-semibold text-sm border border-purple-200 shadow-sm"
        data-testid="hero-badge"
      >
        <span>Novidade: 20 Anos de GAE</span>
        <ArrowRight class="w-4 h-4" />
      </div>

      <!-- Main Headline -->
      <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
        Desvendando o processo de <br>
        <span class="bg-gradient-to-r from-brand-purple to-brand-light bg-clip-text text-transparent">
          Aprender a Aprender
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Exploramos a aprendizagem humana, a neurociência e a formação docente através de 20 anos de pesquisa acadêmica aplicada.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="#pesquisas"
          class="px-8 py-4 bg-brand-purple text-white rounded-full font-bold text-base md:text-lg hover:bg-brand-dark transition shadow-xl shadow-purple-500/20 flex items-center justify-center group"
          data-testid="cta-pesquisas"
        >
          <span>Conheça as Pesquisas</span>
          <ChevronRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </a>
        <a
          href="#historia"
          class="px-8 py-4 bg-white text-brand-purple border border-gray-200 rounded-full font-bold text-base md:text-lg hover:bg-gray-50 hover:border-purple-300 transition flex items-center justify-center"
          data-testid="cta-historia"
        >
          <Play class="w-5 h-5 mr-2 text-brand-accent fill-brand-accent" />
          <span>Nossa História</span>
        </a>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div
      class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10 text-gray-400 select-none pointer-events-none"
      aria-hidden="true"
    >
      <span class="text-[11px] uppercase tracking-widest mb-1 font-semibold">Explore</span>
      <ArrowDown class="w-4 h-4 animate-bounce" />
    </div>
  </section>
</template>
