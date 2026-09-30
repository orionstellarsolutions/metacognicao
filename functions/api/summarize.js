export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json().catch(() => ({}));
    const content = body.content ? String(body.content).trim() : '';
    const title = body.title ? String(body.title).trim() : '';

    if (!content) {
      return new Response(JSON.stringify({ error: 'Conteúdo obrigatório para geração de resumo.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (env && env.AI) {
      const systemPrompt = `Você é um editor acadêmico sênior do grupo Metacognição (PUCPR).
Sua missão é produzir um resumo executivo fluido, culto e atrativo para publicação no blog institucional.
Regras:
1. Escreva de 2 a 3 frases completas e coesas em português do Brasil (entre 220 e 320 caracteres).
2. Sintetize a tese central, os achados ou reflexões principais e a conclusão pedagógica.
3. Não use tópicos ou listas com marcadores.
4. Jamais comece com frases vazias como "Este artigo discute" ou "O texto apresenta". Vá direto ao argumento nuclear.`;

      const userContent = title
        ? `Título: ${title}\n\nConteúdo completo do artigo:\n${content.slice(0, 4000)}`
        : `Conteúdo completo do artigo:\n${content.slice(0, 4000)}`;

      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        max_tokens: 180,
        temperature: 0.3
      });

      const rawExcerpt = aiResponse?.response?.trim() || '';
      // Limpeza de possíveis aspas extras da resposta do modelo
      const excerpt = rawExcerpt.replace(/^["'\s]+|["'\s]+$/g, '');

      if (excerpt && excerpt.length > 20) {
        return new Response(JSON.stringify({ excerpt }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ excerpt: null, message: 'Workers AI binding indisponível' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
