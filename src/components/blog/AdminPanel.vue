<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  X,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  Database,
  FileText,
  FolderTree,
  AlertCircle
} from '@lucide/vue';
import NewPostModal from './NewPostModal.vue';
import CategoryModal from './CategoryModal.vue';
import { blogService } from '../../services/blogService';
import type { BlogPost, Category } from '../../types/blog';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'viewPost', post: BlogPost): void;
}>();

const posts = ref<BlogPost[]>([]);
const categories = ref<Category[]>([]);
const isNewPostModalOpen = ref(false);
const isCategoryModalOpen = ref(false);
const searchQuery = ref('');
const selectedCategoryFilter = ref('ALL');
const postToDelete = ref<BlogPost | null>(null);
const isDeleting = ref(false);

const loadData = async () => {
  const [fetchedPosts, fetchedCategories] = await Promise.all([
    blogService.getPosts(),
    blogService.getCategories()
  ]);
  posts.value = fetchedPosts;
  categories.value = fetchedCategories;
};

const filteredPosts = computed(() => {
  return posts.value.filter((p) => {
    const matchesCategory =
      selectedCategoryFilter.value === 'ALL' || p.category_id === selectedCategoryFilter.value;
    const matchesSearch =
      !searchQuery.value.trim() ||
      p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });
});

const onPostSaved = (saved: BlogPost) => {
  const idx = posts.value.findIndex((p) => p.id === saved.id);
  if (idx >= 0) {
    posts.value[idx] = saved;
  } else {
    posts.value.unshift(saved);
  }
};

const onCategoryCreated = (cat: Category) => {
  categories.value.push(cat);
};

const confirmDelete = async (post: BlogPost) => {
  postToDelete.value = post;
};

const executeDelete = async () => {
  if (!postToDelete.value) return;
  isDeleting.value = true;
  try {
    await blogService.deletePost(postToDelete.value.id);
    posts.value = posts.value.filter((p) => p.id !== postToDelete.value?.id);
    postToDelete.value = null;
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
    data-testid="admin-panel"
  >
    <div
      class="bg-[#0b0f17] border border-gray-800 rounded-3xl w-full max-w-7xl max-h-[92vh] flex flex-col text-white shadow-2xl overflow-hidden my-auto"
    >
      <!-- Admin Topbar -->
      <div class="px-6 py-5 border-b border-gray-800 bg-[#070a10] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-accent/20 text-brand-accent border border-brand-accent/30 tracking-wider uppercase">
              Área Administrativa
            </span>
            <span class="text-xs text-gray-400 flex items-center gap-1.5">
              <Database class="w-3.5 h-3.5 text-emerald-400" /> Cloudflare D1 Native
            </span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Gestão Editorial do Blog Metacognição
          </h1>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            class="bg-brand-purple hover:bg-brand-light text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-purple-950/40"
            data-testid="btn-admin-new-post"
            @click="isNewPostModalOpen = true"
          >
            <Plus class="w-4 h-4" /> Novo Post
          </button>
          <button
            type="button"
            class="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition"
            data-testid="btn-close-admin"
            aria-label="Fechar"
            @click="emit('close')"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 py-4 bg-[#090d14] border-b border-gray-800/80">
        <div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <div class="w-10 h-10 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-light">
            <FileText class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-gray-400 font-medium">Publicações Registradas</div>
            <div class="text-lg font-bold text-white" data-testid="metric-total-posts">{{ posts.length }}</div>
          </div>
        </div>

        <div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <div class="w-10 h-10 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent">
            <FolderTree class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-gray-400 font-medium">Categorias Ativas</div>
            <div class="text-lg font-bold text-white" data-testid="metric-total-categories">{{ categories.length }}</div>
          </div>
        </div>

        <div class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
          <div>
            <div class="text-xs text-gray-400 font-medium">Sincronização Cloudflare</div>
            <div class="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Edge D1 Online
            </div>
          </div>
          <button
            type="button"
            class="text-xs text-gray-400 hover:text-brand-accent transition flex items-center gap-1"
            @click="isCategoryModalOpen = true"
          >
            <Plus class="w-3.5 h-3.5" /> Adicionar Categoria
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="p-6 border-b border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0a0e16]">
        <div class="relative w-full md:w-96">
          <Search class="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Pesquisar por título ou resumo..."
            class="w-full bg-[#06080d] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
            data-testid="input-admin-search"
          />
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <label class="text-xs text-gray-400 whitespace-nowrap">Filtrar Categoria:</label>
          <select
            v-model="selectedCategoryFilter"
            class="bg-[#06080d] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-brand-purple"
            data-testid="select-admin-filter"
          >
            <option value="ALL">TODAS AS CATEGORIAS</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Posts List Table / Cards -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="filteredPosts.length === 0" class="text-center py-16 text-gray-500">
          Nenhum artigo encontrado com os filtros aplicados.
        </div>

        <div v-else class="space-y-3" data-testid="admin-posts-list">
          <div
            v-for="post in filteredPosts"
            :key="post.id"
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#0e131d] border border-gray-800/80 rounded-2xl hover:border-gray-700 transition gap-4 group"
            :data-testid="`admin-post-row-${post.id}`"
          >
            <div class="flex items-center gap-4 min-w-0 flex-1">
              <img
                :src="post.cover_url"
                :alt="post.cover_alt"
                class="w-16 h-12 object-cover rounded-xl border border-gray-800 flex-shrink-0"
              />
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-purple/20 text-brand-light">
                    {{ post.category_name }}
                  </span>
                  <span class="text-xs text-gray-400">{{ post.date }}</span>
                </div>
                <h3 class="text-sm font-bold text-white truncate group-hover:text-brand-accent transition-colors">
                  {{ post.title }}
                </h3>
                <p class="text-xs text-gray-400 line-clamp-1 mt-0.5">
                  {{ post.excerpt }}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition"
                title="Visualizar Artigo"
                :data-testid="`btn-view-post-${post.id}`"
                @click="emit('viewPost', post)"
              >
                <ExternalLink class="w-4 h-4" />
              </button>
              <button
                type="button"
                class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition"
                title="Excluir Artigo"
                :data-testid="`btn-delete-post-${post.id}`"
                @click="confirmDelete(post)"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div
      v-if="postToDelete"
      class="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      data-testid="delete-confirm-modal"
    >
      <div class="bg-[#121620] border border-gray-800 rounded-2xl max-w-sm w-full p-6 text-center text-white shadow-2xl">
        <AlertCircle class="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h3 class="text-base font-bold mb-2">Excluir este artigo?</h3>
        <p class="text-xs text-gray-400 mb-6">
          Você tem certeza que deseja remover "{{ postToDelete.title }}"? Esta ação não pode ser desfeita.
        </p>
        <div class="flex justify-center gap-3">
          <button
            type="button"
            class="px-4 py-2 text-xs text-gray-400 hover:text-white rounded-xl transition"
            @click="postToDelete = null"
          >
            Cancelar
          </button>
          <button
            type="button"
            :disabled="isDeleting"
            class="px-5 py-2 text-xs bg-red-600 hover:bg-red-500 font-bold text-white rounded-xl transition disabled:opacity-50"
            data-testid="btn-confirm-delete"
            @click="executeDelete"
          >
            {{ isDeleting ? 'Excluindo...' : 'Sim, Excluir' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modais Aninhados -->
    <NewPostModal
      v-if="isNewPostModalOpen"
      @close="isNewPostModalOpen = false"
      @save="onPostSaved"
    />

    <CategoryModal
      v-if="isCategoryModalOpen"
      @close="isCategoryModalOpen = false"
      @created="onCategoryCreated"
    />
  </div>
</template>
