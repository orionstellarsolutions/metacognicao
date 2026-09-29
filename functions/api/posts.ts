interface Env {
  DB?: {
    prepare: (query: string) => {
      bind: (...args: unknown[]) => {
        all: () => Promise<{ results: unknown[] }>;
        run: () => Promise<unknown>;
      };
      all: () => Promise<{ results: unknown[] }>;
      run: () => Promise<unknown>;
    };
  };
}

export const onRequestGet = async (context: { env: Env }) => {
  if (!context.env.DB) {
    return Response.json([]);
  }

  try {
    const { results } = await context.env.DB
      .prepare('SELECT * FROM posts ORDER BY created_at DESC')
      .all();
    return Response.json(results || []);
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  if (!context.env.DB) {
    return Response.json({ error: 'Database binding não configurado' }, { status: 500 });
  }

  try {
    const body = (await context.request.json()) as {
      id: string;
      title: string;
      slug: string;
      category_id: string;
      category_name: string;
      date: string;
      excerpt: string;
      cover_url?: string;
      cover_alt?: string;
      content: string;
    };

    if (!body.title || !body.category_id || !body.date) {
      return Response.json({ error: 'Título, categoria e data são obrigatórios' }, { status: 400 });
    }

    const id = body.id || `post-${Date.now()}`;
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    await context.env.DB
      .prepare(
        'INSERT INTO posts (id, title, slug, category_id, category_name, date, excerpt, cover_url, cover_alt, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .bind(
        id,
        body.title,
        slug,
        body.category_id,
        body.category_name || 'GERAL',
        body.date,
        body.excerpt || '',
        body.cover_url || '',
        body.cover_alt || '',
        body.content || ''
      )
      .run();

    return Response.json({ ...body, id, slug }, { status: 201 });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
};

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  if (!context.env.DB) {
    return Response.json({ error: 'Database binding não configurado' }, { status: 500 });
  }

  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'ID do post é obrigatório' }, { status: 400 });
    }

    await context.env.DB
      .prepare('DELETE FROM posts WHERE id = ?')
      .bind(id)
      .run();

    return Response.json({ success: true, id });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
};
