import type { Category, BlogPost, UnsplashImage } from '../types/blog';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-geral', name: 'GERAL', slug: 'geral' },
  { id: 'cat-infantil', name: 'EDUCAÇÃO INFANTIL', slug: 'educacao-infantil' },
  { id: 'cat-alfabetizacao', name: 'ALFABETIZAÇÃO', slug: 'alfabetizacao' },
  { id: 'cat-cognitiva', name: 'TEORIA COGNITIVA', slug: 'teoria-cognitiva' },
  { id: 'cat-grupos', name: 'GAE / GEA', slug: 'gae-gea' }
];

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Aprendizagens Entre Redes: A Jornada de 20 Anos de Pesquisa do GAE',
    slug: 'aprendizagens-entre-redes-20-anos-gae',
    category_id: 'cat-grupos',
    category_name: 'GAE / GEA',
    date: '28/09/2026',
    excerpt: 'Uma análise profunda sobre a metaformação em pesquisa e as conquistas de duas décadas investigando o desenvolvimento cognitivo e a formação docente na PUCPR.',
    cover_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    cover_alt: 'Grupo de pesquisadores reunidos em mesa de estudos acadêmicos',
    content: `
      <h2>Duas Décadas de Investigação Educacional</h2>
      <p>Fundado em 2004 por seis psicopedagogas pioneiras, o GAE (Grupo de Aprendizagem e Escrita) completou vinte anos dedicados a decifrar a fascinante mecânica do <em>aprender a aprender</em>.</p>
      <p>Neste percurso, mais de 50 teses e dissertações foram defendidas, gerando pontes vitais entre a rigorosa investigação teórica e o cotidiano prático da sala de aula brasileira.</p>
      <h3>A Teoria Social Cognitiva em Ação</h3>
      <p>Através da lente da autorregulação e da metacognição, nossos pesquisadores constatam diariamente como a reflexão consciente do estudante sobre seu próprio processo de estudo transforma o rendimento e a autonomia acadêmica.</p>
    `
  },
  {
    id: 'post-2',
    title: 'É Assim Que Aprendemos: Por Que o Cérebro Humano Supera Qualquer Máquina',
    slug: 'por-que-o-cerebro-humano-supera-maquinas',
    category_id: 'cat-cognitiva',
    category_name: 'TEORIA COGNITIVA',
    date: '25/09/2026',
    excerpt: 'Descubra a complexidade inigualável da neuroplasticidade e como os mecanismos de adaptação neural continuam superiores aos algoritmos mais avançados.',
    cover_url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80',
    cover_alt: 'Representação abstrata de redes neurais e sinapses cognitivas',
    content: `
      <h2>Plasticidade e Reconfiguração Cerebral</h2>
      <p>Ao contrário dos sistemas digitais rígidos, o cérebro humano é um ecossistema dinâmico capaz de reconfigurar conexões neuronais a partir de cada nova experiência reflexiva.</p>
      <p>A metacognição atua como o maestro desse circuito, permitindo monitorar erros, calibrar estratégias e consolidar memórias duradouras.</p>
    `
  },
  {
    id: 'post-3',
    title: 'Formação Continuada de Professores e os Novos Olhares sobre as Infâncias',
    slug: 'formacao-continuada-novos-olhares-infancias',
    category_id: 'cat-infantil',
    category_name: 'EDUCAÇÃO INFANTIL',
    date: '20/09/2026',
    excerpt: 'Resultados recentes de pesquisa mapeando a representação social de docentes e a integração entre práticas pedagógicas tradicionais e inovadoras.',
    cover_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    cover_alt: 'Crianças em atividade de aprendizagem lúdica em sala de aula',
    content: `
      <h2>A Criança como Sujeito Epistêmico</h2>
      <p>Observar a infância sob a ótica metacognitiva exige reconhecer a curiosidade inata da criança como ponto de partida da mediação pedagógica.</p>
      <p>O professor não transfere conhecimento; ele arquiteta ambientes onde a descoberta guiada ganha sentido e expressividade.</p>
    `
  }
];

class BlogService {
  private localCategories: Category[] = [...DEFAULT_CATEGORIES];
  private localPosts: BlogPost[] = [...DEFAULT_POSTS];

  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = (await res.json()) as Category[];
        if (Array.isArray(data) && data.length > 0) {
          this.localCategories = data;
          return data;
        }
      }
    } catch {
      // Fallback local
    }
    return this.localCategories;
  }

  async createCategory(name: string): Promise<Category> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Nome da categoria é obrigatório.');

    const slug = trimmed
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: trimmed.toUpperCase(),
      slug
    };

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });
      if (res.ok) {
        const created = (await res.json()) as Category;
        this.localCategories.push(created);
        return created;
      }
    } catch {
      // Fallback local
    }

    this.localCategories.push(newCategory);
    return newCategory;
  }

  async getPosts(): Promise<BlogPost[]> {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = (await res.json()) as BlogPost[];
        if (Array.isArray(data)) {
          this.localPosts = data;
          return data;
        }
      }
    } catch {
      // Fallback local
    }
    return this.localPosts;
  }

  async createPost(postData: Omit<BlogPost, 'id' | 'created_at'>): Promise<BlogPost> {
    const newPost: BlogPost = {
      ...postData,
      id: `post-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      if (res.ok) {
        const created = (await res.json()) as BlogPost;
        this.localPosts.unshift(created);
        return created;
      }
    } catch {
      // Fallback local
    }

    this.localPosts.unshift(newPost);
    return newPost;
  }

  async deletePost(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/posts?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        this.localPosts = this.localPosts.filter((p) => p.id !== id);
        return true;
      }
    } catch {
      // Fallback local
    }

    this.localPosts = this.localPosts.filter((p) => p.id !== id);
    return true;
  }

  async searchUnsplash(query: string): Promise<UnsplashImage[]> {
    const q = query.trim() || 'educacao neurociencia';
    try {
      const res = await fetch(`/api/unsplash?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = (await res.json()) as UnsplashImage[];
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Fallback
    }

    // Galeria de imagens gratuitas com alta resolução selecionadas
    return [
      {
        id: 'uns-1',
        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80',
        alt: 'Grupo de estudantes universitários em discussão de projeto',
        author: 'Brooke Cagle',
        author_url: 'https://unsplash.com/@brookecagle'
      },
      {
        id: 'uns-2',
        url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=400&q=80',
        alt: 'Conceito científico de cérebro e sinapses',
        author: 'Milad Fakurian',
        author_url: 'https://unsplash.com/@fakurian'
      },
      {
        id: 'uns-3',
        url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80',
        alt: 'Crianças em processo de alfabetização com livros coloridos',
        author: 'Element5 Digital',
        author_url: 'https://unsplash.com/@element5digital'
      },
      {
        id: 'uns-4',
        url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
        alt: 'Pilha de livros acadêmicos em biblioteca universitária',
        author: 'Kimberly Farmer',
        author_url: 'https://unsplash.com/@frostroomhead'
      },
      {
        id: 'uns-5',
        url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80',
        alt: 'Laboratório de pesquisa científica e análise metodológica',
        author: 'National Cancer Institute',
        author_url: 'https://unsplash.com/@nci'
      },
      {
        id: 'uns-6',
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
        alt: 'Tecnologia digital e conectividade em educação contemporânea',
        author: 'John Schnobrich',
        author_url: 'https://unsplash.com/@johnschno'
      }
    ];
  }
}

export const blogService = new BlogService();
