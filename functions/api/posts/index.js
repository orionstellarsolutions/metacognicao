const DEFAULT_POSTS = [
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
    content: '<h2>Duas Décadas de Investigação Educacional</h2><p>Fundado em 2004 por seis psicopedagogas pioneiras, o GAE (Grupo de Aprendizagem e Escrita) completou vinte anos dedicados a decifrar a fascinante mecânica do <em>aprender a aprender</em>.</p><p>Neste percurso, mais de 50 teses e dissertações foram defendidas, gerando pontes vitais entre a rigorosa investigação teórica e o cotidiano prático da sala de aula brasileira.</p><h3>A Teoria Social Cognitiva em Ação</h3><p>Através da lente da autorregulação e da metacognição, nossos pesquisadores constatam diariamente como a reflexão consciente do estudante sobre seu próprio processo de estudo transforma o rendimento e a autonomia acadêmica.</p>',
    created_at: '2026-09-28T10:00:00.000Z'
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
    content: '<h2>Plasticidade e Reconfiguração Cerebral</h2><p>Ao contrário dos sistemas digitais rígidos, o cérebro humano é um ecossistema dinâmico capaz de reconfigurar conexões neuronais a partir de cada nova experiência reflexiva.</p><p>A metacognição atua como o maestro desse circuito, permitindo monitorar erros, calibrar estratégias e consolidar memórias duradouras.</p>',
    created_at: '2026-09-25T14:30:00.000Z'
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
    content: '<h2>A Criança como Sujeito Epistêmico</h2><p>Observar a infância sob a ótica metacognitiva exige reconhecer a curiosidade inata da criança como ponto de partida da mediação pedagógica.</p><p>O professor não transfere conhecimento; ele arquiteta ambientes onde a descoberta guiada ganha sentido e expressividade.</p>',
    created_at: '2026-09-20T09:15:00.000Z'
  }
];

async function ensureTable(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      category_id TEXT NOT NULL,
      category_name TEXT NOT NULL,
      date TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      cover_url TEXT NOT NULL,
      cover_alt TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Se a tabela estiver vazia, faz o seed inicial
  const countRes = await db.prepare('SELECT COUNT(*) as count FROM blog_posts').first();
  if (countRes && countRes.count === 0) {
    for (const post of DEFAULT_POSTS) {
      await db.prepare(`
        INSERT INTO blog_posts (id, title, slug, category_id, category_name, date, excerpt, cover_url, cover_alt, content, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        post.id, post.title, post.slug, post.category_id, post.category_name,
        post.date, post.excerpt, post.cover_url, post.cover_alt, post.content, post.created_at
      ).run();
    }
  }
}

export async function onRequestGet(context) {
  const { env } = context;

  if (env && env.DB) {
    try {
      await ensureTable(env.DB);
      const { results } = await env.DB.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
      return new Response(JSON.stringify(results || []), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.warn('Erro ao consultar D1:', err);
    }
  }

  return new Response(JSON.stringify(DEFAULT_POSTS), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const postData = await request.json();
    const newPost = {
      ...postData,
      id: postData.id || `post-${Date.now()}`,
      created_at: postData.created_at || new Date().toISOString()
    };

    if (env && env.DB) {
      await ensureTable(env.DB);
      await env.DB.prepare(`
        INSERT INTO blog_posts (id, title, slug, category_id, category_name, date, excerpt, cover_url, cover_alt, content, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newPost.id, newPost.title, newPost.slug, newPost.category_id, newPost.category_name,
        newPost.date, newPost.excerpt, newPost.cover_url, newPost.cover_alt, newPost.content, newPost.created_at
      ).run();
    }

    return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID obrigatório' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (env && env.DB) {
    try {
      await ensureTable(env.DB);
      await env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run();
    } catch (err) {
      console.warn('Erro ao deletar do D1:', err);
    }
  }

  return new Response(JSON.stringify({ success: true, id }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
