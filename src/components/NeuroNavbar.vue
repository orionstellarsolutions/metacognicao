<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Brain, Menu, X } from '@lucide/vue';
import type { NavItem } from '../types/landing';

const navItems: NavItem[] = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Pesquisas', href: '#pesquisas' },
  { label: 'Publicações', href: '#publicacoes' },
  { label: 'Grupos (GAE/GEA)', href: '#grupos' }
];

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <nav
    :class="[
      'fixed top-0 w-full z-50 px-6 md:px-8 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-white/20',
      isScrolled ? 'py-2 shadow-md' : 'py-4'
    ]"
    data-testid="neuro-navbar"
  >
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <!-- Logo -->
      <a href="#sobre" class="flex items-center gap-2 group" @click="closeMobileMenu">
        <Brain class="w-8 h-8 text-brand-purple transition-transform group-hover:scale-105" />
        <span class="text-2xl font-bold text-brand-dark tracking-tight">Metacognição</span>
      </a>

      <!-- Desktop Links -->
      <div class="hidden md:flex gap-8 text-sm font-medium text-gray-600">
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          class="hover:text-brand-purple transition-colors"
        >
          {{ item.label }}
        </a>
      </div>

      <!-- Action Button -->
      <div class="hidden md:block">
        <a
          href="#acervo"
          class="bg-brand-purple text-white px-6 py-2 rounded-full font-medium hover:bg-brand-dark transition transform hover:scale-105 shadow-lg shadow-purple-500/30 inline-block text-sm"
        >
          Acessar Acervo
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <button
        type="button"
        class="md:hidden p-2 text-gray-700 hover:text-brand-purple focus:outline-none"
        aria-label="Abrir menu"
        @click="toggleMobileMenu"
      >
        <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
        <X v-else class="w-6 h-6" />
      </button>
    </div>

    <!-- Mobile Dropdown -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden mt-3 pt-3 border-t border-gray-100 flex flex-col gap-3 pb-2"
      data-testid="mobile-menu"
    >
      <a
        v-for="item in navItems"
        :key="item.href"
        :href="item.href"
        class="text-gray-700 hover:text-brand-purple font-medium text-sm py-1"
        @click="closeMobileMenu"
      >
        {{ item.label }}
      </a>
      <a
        href="#acervo"
        class="bg-brand-purple text-white px-5 py-2 rounded-full font-medium text-center text-sm shadow mt-1"
        @click="closeMobileMenu"
      >
        Acessar Acervo
      </a>
    </div>
  </nav>
</template>
