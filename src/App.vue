<script setup lang="ts">
import NeuroNavbar from './components/NeuroNavbar.vue';
import NeuroHero from './components/NeuroHero.vue';
import ResearchLines from './components/ResearchLines.vue';
import StudyGroups from './components/StudyGroups.vue';
import OrionFooter from './components/OrionFooter.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-brand-purple selection:text-white">
    <NeuroNavbar />
    
    <main class="flex-1">
      <NeuroHero />
      <ResearchLines />
      <StudyGroups />
    </main>

    <!-- Rodapé Institucional Obrigatório Orion Stellar Solutions -->
    <OrionFooter />
  </div>
</template>
