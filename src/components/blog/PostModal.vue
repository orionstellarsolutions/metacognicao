<script setup lang="ts">
import { X, Calendar, Folder, ArrowLeft } from '@lucide/vue';
import type { BlogPost } from '../../types/blog';

defineProps<{
  post: BlogPost | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div
    v-if="post"
    class="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    data-testid="post-modal"
  >
    <article
      class="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto border border-gray-100"
    >
      <!-- Modal Top Action Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/70">
        <button
          type="button"
          class="text-xs font-bold text-gray-500 hover:text-brand-purple flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          data-testid="btn-back-post"
          @click="emit('close')"
        >
          <ArrowLeft class="w-4 h-4" /> Voltar ao Acervo
        </button>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          data-testid="btn-close-reader"
          aria-label="Fechar artigo"
          @click="emit('close')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Reader Body Content -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
        <!-- Metadata -->
        <div class="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-brand-purple uppercase tracking-wider font-bold">
            <Folder class="w-3.5 h-3.5" /> {{ post.category_name }}
          </span>
          <span class="flex items-center gap-1.5">
            <Calendar class="w-4 h-4 text-brand-accent" /> {{ post.date }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {{ post.title }}
        </h1>

        <!-- Excerpt Callout -->
        <div class="p-5 bg-purple-50/70 border-l-4 border-brand-purple rounded-r-2xl">
          <p class="text-base sm:text-lg text-brand-dark italic font-medium leading-relaxed">
            "{{ post.excerpt }}"
          </p>
        </div>

        <!-- Cover Image -->
        <div v-if="post.cover_url" class="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <img
            :src="post.cover_url"
            :alt="post.cover_alt"
            class="w-full max-h-[460px] object-cover"
          />
          <p v-if="post.cover_alt" class="p-3 text-xs text-gray-500 bg-gray-50 text-center italic">
            {{ post.cover_alt }}
          </p>
        </div>

        <!-- Full HTML/Markdown Content -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div
          class="prose prose-purple max-w-none text-gray-700 leading-relaxed space-y-4 pt-4"
          data-testid="post-full-content"
          v-html="post.content"
        />
      </div>

      <!-- Reader Footer -->
      <div class="px-8 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
        <span>Publicação oficial • Metacognição (PUCPR / GAE / GEA)</span>
        <button
          type="button"
          class="bg-brand-purple hover:bg-brand-dark text-white font-bold text-xs px-5 py-2 rounded-full transition"
          @click="emit('close')"
        >
          Concluir Leitura
        </button>
      </div>
    </article>
  </div>
</template>
