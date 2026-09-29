<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ArrowRight, Calendar, BookOpen, Settings } from '@lucide/vue';
import { blogService } from '../../services/blogService';
import type { BlogPost, Category } from '../../types/blog';

const emit = defineEmits<{
  (e: 'readPost', post: BlogPost): void;
  (e: 'openAdmin'): void;
}>();

const posts = ref<BlogPost[]>([]);
const categories = ref<Category[]>([]);
const selectedCategory = ref<string>('ALL');

const loadData = async () => {
  const [fetchedPosts, fetchedCategories] = await Promise.all([
    blogService.getPosts(),
    blogService.getCategories()
  ]);
  posts.value = fetchedPosts;
  categories.value = fetchedCategories;
};

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'ALL') {
    return posts.value;
  }
  return posts.value.filter((p) => p.category_id === selectedCategory.value);
});

onMounted(() => {
  loadData();
});
</script>

<template>
  <section
    id="publicacoes"
    class="py-24 bg-white relative z-10 border-t border-gray-100"
    data-testid="blog-section"
  >
    <div class="container mx-auto px-6 max-w-7xl">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-brand-purple text-xs font-bold uppercase tracking-wider mb-3 border border-purple-100">
            <BookOpen class="w-3.5 h-3.5" /> Produção Científica & Artigos
          </div>
          <h2 class="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Publicações e Descobertas
          </h2>
          <p class="text-gray-600 mt-2 text-base md:text-lg max-w-2xl">
            Artigos, reflexões e ensaios acadêmicos produzidos pela comunidade de pesquisadores do GAE e GEA.
          </p>
        </div>

        <!-- Admin trigger button -->
        <button
          type="button"
          class="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full bg-gray-100 hover:bg-brand-purple hover:text-white text-gray-700 transition shadow-sm border border-gray-200"
          data-testid="btn-section-admin"
          @click="emit('openAdmin')"
        >
          <Settings class="w-3.5 h-3.5 text-brand-accent" />
          <span>Painel Editorial (Admin)</span>
        </button>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex flex-wrap gap-2 mb-10" data-testid="category-filter-pills">
        <button
          type="button"
          :class="[
            'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border',
            selectedCategory === 'ALL'
              ? 'bg-brand-purple text-white border-brand-purple shadow-md'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
          ]"
          data-testid="pill-all"
          @click="selectedCategory = 'ALL'"
        >
          Todas as Categorias
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          :class="[
            'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border',
            selectedCategory === cat.id
              ? 'bg-brand-purple text-white border-brand-purple shadow-md'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
          ]"
          :data-testid="`pill-${cat.slug}`"
          @click="selectedCategory = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Articles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="blog-grid">
        <article
          v-for="post in filteredPosts"
          :key="post.id"
          class="node-card bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group"
          :data-testid="`post-card-${post.id}`"
        >
          <!-- Cover -->
          <div class="relative aspect-video overflow-hidden bg-gray-100">
            <img
              :src="post.cover_url"
              :alt="post.cover_alt"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div class="absolute top-4 left-4 bg-brand-dark/90 backdrop-blur-md text-brand-accent px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow">
              {{ post.category_name }}
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-3">
                <Calendar class="w-3.5 h-3.5" />
                <span>{{ post.date }}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 group-hover:text-brand-purple transition-colors mb-3 leading-snug">
                {{ post.title }}
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                {{ post.excerpt }}
              </p>
            </div>

            <!-- Read Action -->
            <button
              type="button"
              class="inline-flex items-center text-sm font-bold text-brand-purple hover:text-brand-dark transition-colors self-start group/btn"
              :data-testid="`btn-read-${post.id}`"
              @click="emit('readPost', post)"
            >
              <span>Ler Artigo Completo</span>
              <ArrowRight class="w-4 h-4 ml-1.5 transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
