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
      .prepare('SELECT * FROM categories ORDER BY name ASC')
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
    const body = (await context.request.json()) as { id: string; name: string; slug: string };
    if (!body.name || !body.slug) {
      return Response.json({ error: 'Nome e slug são obrigatórios' }, { status: 400 });
    }

    const id = body.id || `cat-${Date.now()}`;
    await context.env.DB
      .prepare('INSERT OR IGNORE INTO categories (id, name, slug) VALUES (?, ?, ?)')
      .bind(id, body.name.toUpperCase(), body.slug)
      .run();

    return Response.json({ id, name: body.name.toUpperCase(), slug: body.slug }, { status: 201 });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
};
