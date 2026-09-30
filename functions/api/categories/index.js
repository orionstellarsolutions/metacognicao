const DEFAULT_CATEGORIES = [
  { id: 'cat-geral', name: 'GERAL', slug: 'geral' },
  { id: 'cat-infantil', name: 'EDUCAÇÃO INFANTIL', slug: 'educacao-infantil' },
  { id: 'cat-alfabetizacao', name: 'ALFABETIZAÇÃO', slug: 'alfabetizacao' },
  { id: 'cat-cognitiva', name: 'TEORIA COGNITIVA', slug: 'teoria-cognitiva' },
  { id: 'cat-grupos', name: 'GAE / GEA', slug: 'gae-gea' }
];

async function ensureTable(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS blog_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL
    );
  `);

  const countRes = await db.prepare('SELECT COUNT(*) as count FROM blog_categories').first();
  if (countRes && countRes.count === 0) {
    for (const cat of DEFAULT_CATEGORIES) {
      await db.prepare('INSERT INTO blog_categories (id, name, slug) VALUES (?, ?, ?)')
        .bind(cat.id, cat.name, cat.slug)
        .run();
    }
  }
}

export async function onRequestGet(context) {
  const { env } = context;

  if (env && env.DB) {
    try {
      await ensureTable(env.DB);
      const { results } = await env.DB.prepare('SELECT * FROM blog_categories ORDER BY name ASC').all();
      return new Response(JSON.stringify(results || []), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.warn('Erro ao consultar D1 categorias:', err);
    }
  }

  return new Response(JSON.stringify(DEFAULT_CATEGORIES), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const name = data.name ? String(data.name).trim().toUpperCase() : '';

    if (!name) {
      return new Response(JSON.stringify({ error: 'Nome obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newCat = {
      id: `cat-${Date.now()}`,
      name,
      slug
    };

    if (env && env.DB) {
      await ensureTable(env.DB);
      await env.DB.prepare('INSERT INTO blog_categories (id, name, slug) VALUES (?, ?, ?)')
        .bind(newCat.id, newCat.name, newCat.slug)
        .run();
    }

    return new Response(JSON.stringify(newCat), {
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
