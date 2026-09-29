<script setup lang="ts">
import { ref } from 'vue';
import NeuroNavbar from './components/NeuroNavbar.vue';
import NeuroHero from './components/NeuroHero.vue';
import ResearchLines from './components/ResearchLines.vue';
import StudyGroups from './components/StudyGroups.vue';
import BlogSection from './components/blog/BlogSection.vue';
import PostModal from './components/blog/PostModal.vue';
import AdminPanel from './components/blog/AdminPanel.vue';
import OrionFooter from './components/OrionFooter.vue';
import type { BlogPost } from './types/blog';

const isAdminOpen = ref(false);
const activeReadingPost = ref<BlogPost | null>(null);

const handleReadPost = (post: BlogPost) => {
  activeReadingPost.value = post;
};

const handleViewFromAdmin = (post: BlogPost) => {
  activeReadingPost.value = post;
};
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-brand-purple selection:text-white">
    <!-- Navbar com trigger para Admin -->
    <NeuroNavbar @open-admin="isAdminOpen = true" />
    
    <main class="flex-1">
      <NeuroHero />
      <ResearchLines />
      <!-- Seção Pública do Blog -->
      <BlogSection @read-post="handleReadPost" @open-admin="isAdminOpen = true" />
      <StudyGroups />
    </main>

    <!-- Rodapé Institucional Obrigatório Orion Stellar Solutions -->
    <OrionFooter />

    <!-- Modal de Leitura Pública do Artigo -->
    <PostModal
      :post="activeReadingPost"
      @close="activeReadingPost = null"
    />

    <!-- Painel Administrativo de Gestão do Blog -->
    <AdminPanel
      v-if="isAdminOpen"
      @close="isAdminOpen = false"
      @view-post="handleViewFromAdmin"
    />
  </div>
</template>
