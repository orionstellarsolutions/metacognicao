<template>
  <main class="min-h-screen flex flex-col justify-between bg-[#0a0d14] text-white">
    <div class="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight font-['Montserrat',sans-serif]">
        Template SDD Orion
      </h1>
      <p class="mt-4 text-gray-400 max-w-md">
        Repositório modelo padronizado para desenvolvimento guiado por especificações (Spec-Driven Development).
      </p>
    </div>
    <OrionFooter />
  </main>
</template>

<script setup lang="ts">
import OrionFooter from './components/OrionFooter.vue';
</script>
