<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { X, Search, Image as ImageIcon, Check, Loader2 } from '@lucide/vue';
import { blogService } from '../../services/blogService';
import type { UnsplashImage } from '../../types/blog';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select', image: UnsplashImage): void;
}>();

const searchQuery = ref('educacao');
const images = ref<UnsplashImage[]>([]);
const isLoading = ref(false);
const selectedId = ref<string | null>(null);

const quickTags = ['Educação', 'Neurociência', 'Crianças', 'Livros', 'Tecnologia'];

const loadImages = async (query: string) => {
  isLoading.value = true;
  try {
    images.value = await blogService.searchUnsplash(query);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    loadImages(searchQuery.value.trim());
  }
};

const applyTag = (tag: string) => {
  searchQuery.value = tag;
  loadImages(tag);
};

const selectImage = (img: UnsplashImage) => {
  selectedId.value = img.id;
  emit('select', img);
  emit('close');
};

onMounted(() => {
  loadImages(searchQuery.value);
});
</script>

<template>
  <div
    class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    data-testid="unsplash-modal"
  >
    <div
      class="bg-[#121620] border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col text-white shadow-2xl overflow-hidden"
    >
      <!-- Header -->
      <div class="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <div class="flex items-center gap-2">
          <ImageIcon class="w-5 h-5 text-emerald-400" />
          <h2 class="text-base font-bold uppercase tracking-wider text-white">
            Buscar Capa Gratuita no Unsplash
          </h2>
        </div>
        <button
          type="button"
          class="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          data-testid="btn-close-unsplash"
          @click="emit('close')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Search & Tags -->
      <div class="p-6 border-b border-gray-800 space-y-3 bg-[#0a0d14]/50">
        <form class="flex gap-2" @submit.prevent="handleSearch">
          <div class="relative flex-1">
            <Search class="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Digite um termo (ex: educação, leitura, cérebro)..."
              class="w-full bg-[#0a0d14] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
              data-testid="input-unsplash-query"
            />
          </div>
          <button
            type="submit"
            class="bg-brand-purple hover:bg-brand-light text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow"
            data-testid="btn-search-unsplash"
          >
            Buscar
          </button>
        </form>

        <div class="flex flex-wrap gap-2 pt-1 items-center">
          <span class="text-xs text-gray-400">Sugestões:</span>
          <button
            v-for="tag in quickTags"
            :key="tag"
            type="button"
            class="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-brand-purple/30 text-gray-300 hover:text-white border border-gray-800 transition-colors"
            @click="applyTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Grid Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
          <Loader2 class="w-8 h-8 animate-spin text-brand-purple" />
          <p class="text-sm">Buscando imagens em alta resolução...</p>
        </div>

        <div
          v-else-if="images.length > 0"
          class="grid grid-cols-2 md:grid-cols-3 gap-4"
          data-testid="unsplash-grid"
        >
          <div
            v-for="img in images"
            :key="img.id"
            class="group relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-800 cursor-pointer hover:border-brand-purple transition-all"
            :data-testid="`unsplash-item-${img.id}`"
            @click="selectImage(img)"
          >
            <img
              :src="img.thumb"
              :alt="img.alt"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end"
            >
              <p class="text-xs text-white font-medium line-clamp-1">{{ img.alt }}</p>
              <p class="text-[10px] text-gray-300">Foto por {{ img.author }}</p>
            </div>

            <div
              v-if="selectedId === img.id"
              class="absolute top-2 right-2 bg-brand-accent text-brand-dark p-1 rounded-full shadow"
            >
              <Check class="w-4 h-4" />
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 text-gray-500">
          Nenhuma imagem encontrada para "{{ searchQuery }}".
        </div>
      </div>
    </div>
  </div>
</template>
