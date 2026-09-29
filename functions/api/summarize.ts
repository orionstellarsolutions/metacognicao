interface Env {
  AI?: {
    run: (
      model: string,
      inputs: {
        messages?: Array<{ role: string; content: string }>;
        prompt?: string;
        max_tokens?: number;
      }
    ) => Promise<{ response?: string }>;
  };
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = (await context.request.json()) as { content?: string };
    const content = body.content?.trim();

    if (!content) {
      return Response.json({ error: 'Conteúdo é obrigatório' }, { status: 400 });
    }

    if (context.env.AI) {
      const aiResponse = await context.env.AI.run('@cf/meta/llama-3-8b-instruct', {
        messages: [
          {
            role: 'system',
            content:
              'Você é um assistente acadêmico especializado em síntese científica. Gere um resumo (excerpt) claro, fluido e objetivo em português do Brasil de no máximo 2 a 3 frases para o artigo fornecido. Não inclua títulos, aspas ou saudações, apenas o texto do resumo.'
          },
          {
            role: 'user',
            content
          }
        ],
        max_tokens: 180
      });

      const excerpt = aiResponse.response?.trim() || '';
      return Response.json({ excerpt });
    }

    return Response.json({ excerpt: '' });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
};
