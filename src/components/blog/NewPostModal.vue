<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  X,
  Sparkles,
  Search,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Video,
  Image as ImageIcon,
  Plus,
  Loader2,
  Calendar,
  Upload
} from '@lucide/vue';
import CategoryModal from './CategoryModal.vue';
import UnsplashModal from './UnsplashModal.vue';
import { blogService } from '../../services/blogService';
import { summarizeArticle } from '../../services/aiSummarizer';
import { compressImage } from '../../services/imageCompression';
import type { Category, BlogPost, UnsplashImage } from '../../types/blog';

const props = defineProps<{
  postToEdit?: BlogPost | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', post: BlogPost): void;
}>();

// Form State
const title = ref(props.postToEdit?.title || '');
const categoryId = ref(props.postToEdit?.category_id || 'cat-geral');
const rawDate = ref('');
const displayDate = ref(props.postToEdit?.date || '');
const excerpt = ref(props.postToEdit?.excerpt || '');
const coverUrl = ref(props.postToEdit?.cover_url || '');
const coverAlt = ref(props.postToEdit?.cover_alt || '');
const content = ref(props.postToEdit?.content || '');

// UI & Aux Modals State
const categories = ref<Category[]>([]);
const isCategoryModalOpen = ref(false);
const isUnsplashModalOpen = ref(false);
const isSummarizing = ref(false);
const isCompressing = ref(false);
const isSaving = ref(false);
const formError = ref('');
const coverFileName = ref('');

const editorRef = ref<HTMLDivElement | null>(null);

// Formatação estrita da data para dd/mm/aaaa
const handleDateInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const iso = target.value; // YYYY-MM-DD
  if (!iso) return;
  const [year, month, day] = iso.split('-');
  displayDate.value = `${day}/${month}/${year}`;
};

// Formatação manual se o usuário digitar
const handleDisplayDateChange = (val: string) => {
  displayDate.value = val;
};

// Carregar categorias
const loadCategories = async () => {
  categories.value = await blogService.getCategories();
  if (!categoryId.value && categories.value.length > 0) {
    categoryId.value = categories.value[0].id;
  }
};

const handleCategorySelectChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  if (value === '__new__') {
    isCategoryModalOpen.value = true;
    // Restaura temporariamente para a primeira válida
    categoryId.value = categories.value[0]?.id || 'cat-geral';
  } else {
    categoryId.value = value;
  }
};

const onCategoryCreated = (newCat: Category) => {
  categories.value.push(newCat);
  categoryId.value = newCat.id;
  isCategoryModalOpen.value = false;
};

// Resumo com IA
const handleGenerateSummary = async () => {
  updateContentFromEditor();
  const rawContent = editorRef.value?.innerText?.trim() || editorRef.value?.textContent?.trim() || content.value;
  const textToSummarize = rawContent || title.value;

  if (!textToSummarize.trim()) {
    formError.value = 'Preencha o conteúdo ou o título antes de gerar o resumo.';
    return;
  }

  isSummarizing.value = true;
  formError.value = '';

  try {
    const summary = await summarizeArticle(textToSummarize, title.value);
    excerpt.value = summary;
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Erro ao gerar resumo.';
  } finally {
    isSummarizing.value = false;
  }
};

// Upload e compressão de capa
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  coverFileName.value = file.name;
  isCompressing.value = true;
  formError.value = '';

  try {
    const result = await compressImage(file, 500);
    coverUrl.value = result.dataUrl;
    if (!coverAlt.value) {
      coverAlt.value = `Capa do artigo: ${title.value || file.name}`;
    }
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Erro ao comprimir imagem.';
  } finally {
    isCompressing.value = false;
  }
};

// Seleção via Unsplash
const onUnsplashSelect = (img: UnsplashImage) => {
  coverUrl.value = img.url;
  coverAlt.value = img.alt || `Imagem ilustrativa por ${img.author}`;
  coverFileName.value = `Unsplash (${img.author})`;
  isUnsplashModalOpen.value = false;
};

// Comandos da Toolbar Rica com retenção ativa de foco e seleção
const execCommand = (command: string, value: string | undefined = undefined) => {
  if (editorRef.value) {
    editorRef.value.focus();
  }
  document.execCommand(command, false, value);
  updateContentFromEditor();
};

const insertHeading = (level: 'h2' | 'h3') => {
  if (editorRef.value) {
    editorRef.value.focus();
  }
  try {
    document.execCommand('formatBlock', false, `<${level}>`);
  } catch {
    document.execCommand('formatBlock', false, level);
  }
  updateContentFromEditor();
};

const insertLink = () => {
  if (editorRef.value) {
    editorRef.value.focus();
  }
  const url = prompt('Insira a URL do link (ex: https://...):');
  if (url) {
    document.execCommand('createLink', false, url);
    updateContentFromEditor();
  }
};

const insertVideo = () => {
  if (editorRef.value) {
    editorRef.value.focus();
  }
  const url = prompt('Insira a URL do vídeo do YouTube:');
  if (url) {
    const embed = `<div class="aspect-video my-4"><iframe class="w-full h-full rounded-xl" src="${url.replace('watch?v=', 'embed/')}" frameborder="0" allowfullscreen></iframe></div><p></p>`;
    document.execCommand('insertHTML', false, embed);
    updateContentFromEditor();
  }
};

const insertInlineImage = () => {
  if (editorRef.value) {
    editorRef.value.focus();
  }
  const url = prompt('Insira a URL da imagem:');
  if (url) {
    const imgHtml = `<img src="${url}" alt="Imagem no corpo do artigo" class="rounded-xl my-4 max-w-full h-auto" /><p></p>`;
    document.execCommand('insertHTML', false, imgHtml);
    updateContentFromEditor();
  }
};

const updateContentFromEditor = () => {
  if (editorRef.value) {
    content.value = editorRef.value.innerHTML;
  }
};

// Submissão do post
const handleSave = async () => {
  updateContentFromEditor();

  if (!title.value.trim()) {
    formError.value = 'O título do post é obrigatório.';
    return;
  }
  if (!categoryId.value) {
    formError.value = 'Selecione uma categoria para o post.';
    return;
  }
  if (!displayDate.value.trim()) {
    formError.value = 'A data do post é obrigatória.';
    return;
  }

  isSaving.value = true;
  formError.value = '';

  const selectedCategory = categories.value.find((c) => c.id === categoryId.value);
  const categoryName = selectedCategory ? selectedCategory.name : 'GERAL';

  try {
    const postData = {
      title: title.value.trim(),
      slug: title.value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      category_id: categoryId.value,
      category_name: categoryName,
      date: displayDate.value.trim(),
      excerpt: excerpt.value.trim() || title.value.trim(),
      cover_url: coverUrl.value || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      cover_alt: coverAlt.value.trim() || 'Capa do artigo Metacognição',
      content: content.value || '<p>Conteúdo do post em elaboração.</p>'
    };

    const saved = await blogService.createPost(postData);
    emit('save', saved);
    emit('close');
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Erro ao salvar o post.';
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  loadCategories();
  if (editorRef.value && content.value) {
    editorRef.value.innerHTML = content.value;
  }
  if (!displayDate.value) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    displayDate.value = `${day}/${month}/${year}`;
  }
});
</script>

<template>
  <div
    class="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    data-testid="new-post-modal"
  >
    <div
      class="bg-[#0e121a] border border-gray-800 rounded-3xl w-full max-w-6xl max-h-[95vh] flex flex-col text-white shadow-2xl overflow-hidden my-auto"
    >
      <!-- Top Bar Header -->
      <div class="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-[#0a0d14]">
        <h1 class="text-lg font-black tracking-wider uppercase text-white flex items-center gap-2">
          <span>NOVO POST</span>
        </h1>
        <button
          type="button"
          class="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          data-testid="btn-close-modal"
          aria-label="Fechar"
          @click="emit('close')"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Main Columns Body -->
      <div class="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- LEFT COLUMN (Metadata & Settings) -->
        <div class="lg:col-span-4 space-y-6">
          <!-- TÍTULO -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              TÍTULO *
            </label>
            <input
              v-model="title"
              type="text"
              placeholder="Digite o título do artigo..."
              class="w-full bg-[#07090e] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple text-sm"
              data-testid="input-post-title"
            />
          </div>

          <!-- CATEGORIA -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-300">
                CATEGORIA *
              </label>
              <button
                type="button"
                class="text-[11px] text-brand-accent hover:underline flex items-center gap-1 font-semibold"
                data-testid="btn-open-category-modal"
                @click="isCategoryModalOpen = true"
              >
                <Plus class="w-3 h-3" /> Nova Categoria
              </button>
            </div>
            <select
              :value="categoryId"
              class="w-full bg-[#07090e] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple text-sm uppercase appearance-none"
              data-testid="select-post-category"
              @change="handleCategorySelectChange"
            >
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
              <option value="__new__">+ ADICIONAR NOVA CATEGORIA...</option>
            </select>
          </div>

          <!-- DATA -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              DATA * (FORMATO DD/MM/AAAA)
            </label>
            <div class="relative flex items-center">
              <input
                :value="displayDate"
                type="text"
                placeholder="Ex: 22/10/2026"
                class="w-full bg-[#07090e] border border-gray-800 rounded-xl pl-4 pr-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple text-sm"
                data-testid="input-display-date"
                @input="handleDisplayDateChange(($event.target as HTMLInputElement).value)"
              />
              <!-- Datepicker Trigger Nativo escondido sobre o ícone de calendário -->
              <div class="absolute right-3 flex items-center cursor-pointer">
                <input
                  v-model="rawDate"
                  type="date"
                  class="absolute inset-0 opacity-0 cursor-pointer w-8 h-8"
                  data-testid="input-native-date"
                  @change="handleDateInput"
                />
                <Calendar class="w-5 h-5 text-gray-400 hover:text-brand-accent transition-colors" />
              </div>
            </div>
          </div>

          <!-- RESUMO (EXCERPT) COM IA -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-300">
                RESUMO (EXCERPT)
              </label>
              <button
                type="button"
                :disabled="isSummarizing"
                class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-purple/20 text-brand-light hover:bg-brand-purple hover:text-white border border-brand-purple/40 transition-colors disabled:opacity-50"
                data-testid="btn-generate-ai"
                title="Gera resumo automático com Cloudflare Workers AI"
                @click="handleGenerateSummary"
              >
                <Loader2 v-if="isSummarizing" class="w-3.5 h-3.5 animate-spin" />
                <Sparkles v-else class="w-3.5 h-3.5 text-brand-accent" />
                <span>{{ isSummarizing ? 'Sintetizando...' : 'Gerar com IA' }}</span>
              </button>
            </div>
            <textarea
              v-model="excerpt"
              rows="4"
              placeholder="Breve resumo informativo sobre a pesquisa ou artigo..."
              class="w-full bg-[#07090e] border border-gray-800 rounded-xl p-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple text-sm leading-relaxed resize-none"
              data-testid="textarea-post-excerpt"
            />
          </div>

          <!-- CAPA DO POST -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              CAPA DO POST *
            </label>
            <p class="text-[11px] text-gray-400 mb-3">
              Será comprimida localmente (Max 500KB).
            </p>

            <div class="flex flex-col sm:flex-row gap-2.5">
              <!-- Upload Local Button -->
              <label
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs uppercase cursor-pointer transition shadow"
              >
                <Upload class="w-4 h-4" />
                <span>Escolher arquivo</span>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  data-testid="input-file-cover"
                  @change="handleFileUpload"
                />
              </label>

              <!-- Unsplash Button -->
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition border border-gray-800"
                data-testid="btn-open-unsplash"
                @click="isUnsplashModalOpen = true"
              >
                <Search class="w-4 h-4 text-brand-accent" />
                <span>Unsplash</span>
              </button>
            </div>

            <!-- Preview / Nome do arquivo -->
            <div v-if="coverUrl" class="mt-3 flex items-center gap-3 p-2 bg-[#07090e] border border-gray-800 rounded-xl">
              <img :src="coverUrl" alt="Preview da capa" class="w-12 h-10 object-cover rounded-lg" />
              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-200 truncate font-medium">{{ coverFileName || 'Capa selecionada' }}</p>
                <p class="text-[10px] text-emerald-400">Pronta para publicação</p>
              </div>
            </div>
            <p v-else class="text-xs text-gray-500 mt-2 italic">Nenhum arquivo escolhido</p>
          </div>

          <!-- TEXTO ALTERNATIVO (ALT TEXT) DA CAPA -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              TEXTO ALTERNATIVO (ALT TEXT) DA CAPA *
            </label>
            <p class="text-[11px] text-gray-400 leading-relaxed mb-2.5">
              Descreva de forma clara e objetiva o que a imagem representa para garantir a acessibilidade (leitores de tela para pessoas com deficiência visual) e indexação por mecanismos de busca (SEO). Exemplo: “Estudante programando um jogo de computador no laboratório da GAMEscola”.
            </p>
            <input
              v-model="coverAlt"
              type="text"
              placeholder="Ex: Pesquisadores analisando gráficos de neurociência cognitiva"
              class="w-full bg-[#07090e] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple text-sm"
              data-testid="input-cover-alt"
            />
          </div>
        </div>

        <!-- RIGHT COLUMN (Rich Editor & Content) -->
        <div class="lg:col-span-8 flex flex-col space-y-3">
          <!-- Editor Toolbar -->
          <div
            class="bg-[#0a0d14] border border-gray-800 rounded-2xl p-2.5 flex flex-wrap items-center gap-1.5 shadow-sm select-none"
            data-testid="editor-toolbar"
          >
            <!-- Formatações básicas -->
            <button
              type="button"
              class="p-2 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 rounded-lg transition"
              title="Negrito (Ctrl+B)"
              @mousedown.prevent
              @click="execCommand('bold')"
            >
              <Bold class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-2 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 rounded-lg transition"
              title="Itálico (Ctrl+I)"
              @mousedown.prevent
              @click="execCommand('italic')"
            >
              <Italic class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-2 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 rounded-lg transition font-bold text-xs"
              title="Subtítulo H2"
              @mousedown.prevent
              @click="insertHeading('h2')"
            >
              <Heading2 class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-2 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 rounded-lg transition font-bold text-xs"
              title="Subtítulo H3"
              @mousedown.prevent
              @click="insertHeading('h3')"
            >
              <Heading3 class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-2 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 rounded-lg transition"
              title="Lista com marcadores"
              @mousedown.prevent
              @click="execCommand('insertUnorderedList')"
            >
              <List class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-2 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 rounded-lg transition"
              title="Lista numerada"
              @mousedown.prevent
              @click="execCommand('insertOrderedList')"
            >
              <ListOrdered class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-2 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 rounded-lg transition"
              title="Citação"
              @mousedown.prevent
              @click="execCommand('formatBlock', 'blockquote')"
            >
              <Quote class="w-4 h-4" />
            </button>

            <div class="w-[1px] h-5 bg-gray-800 mx-1" />

            <!-- Links -->
            <button
              type="button"
              class="p-2 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 rounded-lg transition"
              title="Inserir Link"
              @mousedown.prevent
              @click="insertLink"
            >
              <Link class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-2 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 rounded-lg transition"
              title="Remover Link"
              @mousedown.prevent
              @click="execCommand('unlink')"
            >
              <Unlink class="w-4 h-4" />
            </button>

            <div class="w-[1px] h-5 bg-gray-800 mx-1" />

            <!-- Alinhamentos -->
            <button
              type="button"
              class="p-2 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 rounded-lg transition"
              title="Alinhar à Esquerda"
              @mousedown.prevent
              @click="execCommand('justifyLeft')"
            >
              <AlignLeft class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-2 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 rounded-lg transition"
              title="Centralizar"
              @mousedown.prevent
              @click="execCommand('justifyCenter')"
            >
              <AlignCenter class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-2 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 rounded-lg transition"
              title="Alinhar à Direita"
              @mousedown.prevent
              @click="execCommand('justifyRight')"
            >
              <AlignRight class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-2 text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 rounded-lg transition"
              title="Justificar"
              @mousedown.prevent
              @click="execCommand('justifyFull')"
            >
              <AlignJustify class="w-4 h-4" />
            </button>

            <div class="w-[1px] h-5 bg-gray-800 mx-1" />

            <!-- Mídia -->
            <button
              type="button"
              class="p-2 text-red-400 hover:text-red-300 hover:bg-white/10 active:scale-95 rounded-lg transition"
              title="Inserir Vídeo do YouTube"
              @mousedown.prevent
              @click="insertVideo"
            >
              <Video class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-white/10 active:scale-95 rounded-lg transition"
              title="Inserir Imagem via URL"
              @mousedown.prevent
              @click="insertInlineImage"
            >
              <ImageIcon class="w-4 h-4" />
            </button>
          </div>

          <!-- Área de Edição Rica -->
          <div
            ref="editorRef"
            contenteditable="true"
            class="flex-1 min-h-[380px] bg-[#07090e] border border-gray-800 rounded-2xl p-6 text-gray-100 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple text-base leading-relaxed overflow-y-auto prose prose-invert max-w-none"
            data-testid="rich-editor-content"
            placeholder="Comece a redigir o corpo completo do artigo..."
            @input="updateContentFromEditor"
          />
        </div>
      </div>

      <!-- Bottom Bar & Submission -->
      <div class="px-6 py-4 border-t border-gray-800 bg-[#0a0d14] flex flex-col sm:flex-row justify-between items-center gap-4">
        <p v-if="formError" class="text-xs text-red-400 font-medium" data-testid="form-error">
          {{ formError }}
        </p>
        <span v-else class="text-xs text-gray-500">
          Metacognição CMS • Cloudflare D1 Native Sync
        </span>

        <div class="flex gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            class="px-5 py-2.5 text-sm text-gray-400 hover:text-white rounded-xl transition-colors"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            type="button"
            :disabled="isSaving"
            class="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2 disabled:opacity-50"
            data-testid="btn-save-post"
            @click="handleSave"
          >
            <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
            <span>{{ isSaving ? 'Salvando...' : 'Salvar e Publicar Post' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modais Aninhados -->
    <CategoryModal
      v-if="isCategoryModalOpen"
      @close="isCategoryModalOpen = false"
      @created="onCategoryCreated"
    />

    <UnsplashModal
      v-if="isUnsplashModalOpen"
      @close="isUnsplashModalOpen = false"
      @select="onUnsplashSelect"
    />
  </div>
</template>

<style scoped>
[contenteditable]:empty:before {
  content: attr(placeholder);
  color: #4b5563;
  cursor: text;
}
</style>
