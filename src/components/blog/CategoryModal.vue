<script setup lang="ts">
import { ref } from 'vue';
import { X, FolderPlus } from '@lucide/vue';
import { blogService } from '../../services/blogService';
import type { Category } from '../../types/blog';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'created', category: Category): void;
}>();

const categoryName = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const handleSubmit = async () => {
  const name = categoryName.value.trim();
  if (!name) {
    errorMessage.value = 'Por favor, insira o nome da categoria.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const created = await blogService.createCategory(name);
    emit('created', created);
    emit('close');
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Erro ao criar categoria.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    data-testid="category-modal"
  >
    <div
      class="bg-[#121620] border border-gray-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl relative"
    >
      <!-- Header -->
      <div class="flex justify-between items-center pb-4 border-b border-gray-800">
        <div class="flex items-center gap-2">
          <FolderPlus class="w-5 h-5 text-brand-accent" />
          <h2 class="text-lg font-bold uppercase tracking-wider text-white">Nova Categoria</h2>
        </div>
        <button
          type="button"
          class="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          data-testid="btn-close-category"
          @click="emit('close')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Form -->
      <form class="mt-5 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
            Nome da Categoria *
          </label>
          <input
            v-model="categoryName"
            type="text"
            placeholder="Ex: NEUROCIÊNCIA COGNITIVA"
            class="w-full bg-[#0a0d14] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-sm uppercase"
            data-testid="input-category-name"
            autofocus
          />
        </div>

        <p v-if="errorMessage" class="text-xs text-red-400" data-testid="category-error">
          {{ errorMessage }}
        </p>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-3">
          <button
            type="button"
            class="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-brand-purple hover:bg-brand-light text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-purple-900/30 disabled:opacity-50"
            data-testid="btn-submit-category"
          >
            {{ isLoading ? 'Salvando...' : 'Salvar Categoria' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
