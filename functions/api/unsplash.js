const CURATED_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Grupo de acadêmicos estudando em mesa compartilhada',
    author: 'Brooke Cagle'
  },
  {
    url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80',
    alt: 'Representação abstrata de redes neurais e sinapses cognitivas',
    author: 'Alina Grubnyak'
  },
  {
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Crianças em atividade interativa de aprendizagem',
    author: 'CDC'
  },
  {
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Tecnologia educacional e conectividade digital',
    author: 'John Schnobrich'
  },
  {
    url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    alt: 'Livros de estudo e cadernos acadêmicos abertos em mesa de pesquisa',
    author: 'Aaron Burden'
  },
  {
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    alt: 'Pessoa escrevendo reflexões em diário de bordo metacognitivo',
    author: 'Unsplash'
  }
];

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').toLowerCase().trim();

  let filtered = CURATED_IMAGES;
  if (q) {
    filtered = CURATED_IMAGES.filter(
      (img) => img.alt.toLowerCase().includes(q) || img.author.toLowerCase().includes(q)
    );
    if (filtered.length === 0) {
      filtered = CURATED_IMAGES;
    }
  }

  return new Response(JSON.stringify(filtered), {
    headers: { 'Content-Type': 'application/json' }
  });
}
