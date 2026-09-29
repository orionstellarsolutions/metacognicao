const CURATED_IMAGES = [
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

export const onRequestGet = async (context: { request: Request }) => {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get('q') || '').toLowerCase().trim();

  if (!q) {
    return Response.json(CURATED_IMAGES);
  }

  // Filtra por termo nas imagens curadas
  const filtered = CURATED_IMAGES.filter((img) =>
    img.alt.toLowerCase().includes(q) || img.author.toLowerCase().includes(q)
  );

  return Response.json(filtered.length > 0 ? filtered : CURATED_IMAGES);
};
