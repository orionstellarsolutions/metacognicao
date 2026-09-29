/**
 * Remove formatação markdown ou HTML básico de um texto
 */
export function cleanText(rawText: string): string {
  return rawText
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#*_~`>[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fallback heurístico inteligente para geração de resumo extrativo local
 * quando a rede ou a API de IA estiverem indisponíveis.
 */
export function generateLocalSummary(text: string, maxLength: number = 220): string {
  const cleaned = cleanText(text);
  if (!cleaned) return '';

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  // Tenta quebrar na primeira ou segunda frase
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length > 0) {
    let summary = '';
    for (const sentence of sentences) {
      if ((summary + sentence).length <= maxLength) {
        summary += (summary ? ' ' : '') + sentence.trim();
      } else {
        break;
      }
    }
    if (summary) return summary;
  }

  // Quebra por palavras com reticências
  const truncated = cleaned.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

/**
 * Resume o texto de um artigo utilizando Cloudflare Workers AI com fallback local
 */
export async function summarizeArticle(content: string): Promise<string> {
  const cleaned = cleanText(content);
  if (!cleaned) {
    throw new Error('Conteúdo insuficiente para gerar um resumo.');
  }

  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: cleaned })
    });

    if (response.ok) {
      const data = (await response.json()) as { excerpt?: string };
      if (data.excerpt && data.excerpt.trim()) {
        return data.excerpt.trim();
      }
    }
  } catch {
    // Falha de rede ou ambiente local - aciona fallback local
  }

  return generateLocalSummary(cleaned);
}
