/**
 * Remove formatação markdown ou HTML mantendo espaçamentos de parágrafo estruturados
 */
export function cleanText(rawText: string): string {
  return rawText
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#*_~`>[\]()]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/(\r\n|\r|\n)+/g, '\n')
    .trim();
}

/**
 * Extrai parágrafos limpos de um texto em formato HTML ou texto puro
 */
function extractParagraphs(rawText: string): string[] {
  // Se contiver tags de parágrafo ou divs, quebra por elas
  if (/<(p|div|h[1-6]|li)[\s>]/i.test(rawText)) {
    const rawParagraphs = rawText
      .replace(/<\/(p|div|h[1-6]|li)>/gi, '\n')
      .split('\n')
      .map((p) => cleanText(p))
      .filter((p) => p.length > 20);

    if (rawParagraphs.length > 0) {
      return rawParagraphs;
    }
  }

  // Divisão padrão por quebras de linha
  return rawText
    .split(/\n\s*\n/)
    .map((p) => cleanText(p))
    .filter((p) => p.length > 20);
}

/**
 * Extrai as frases de um parágrafo
 */
function extractSentences(paragraph: string): string[] {
  const matches = paragraph.match(/[^.!?]+[.!?]+/g);
  if (matches && matches.length > 0) {
    return matches.map((s) => s.trim());
  }
  return [paragraph.trim()];
}

/**
 * Algoritmo heurístico inteligente de síntese extrativa multi-parágrafo.
 * Em vez de apenas cortar o primeiro parágrafo, ele analisa o texto como um todo:
 * extrai a tese inicial, o desenvolvimento e a conclusão/desfecho, gerando
 * um resumo executivo abrangente do artigo.
 */
export function generateLocalSummary(text: string, maxLength: number = 320): string {
  const cleaned = cleanText(text);
  if (!cleaned) return '';

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  const paragraphs = extractParagraphs(text);

  // Se o texto tiver múltiplos parágrafos, sintetiza de forma panorâmica
  if (paragraphs.length >= 2) {
    const introSentences = extractSentences(paragraphs[0]);
    const firstSentence = introSentences[0] || '';

    // Pega a frase conclusiva do último parágrafo
    const lastParagraph = paragraphs[paragraphs.length - 1];
    const conclusionSentences = extractSentences(lastParagraph);
    const lastSentence = conclusionSentences[conclusionSentences.length - 1] || '';

    // Se houver parágrafos intermediários, busca um ponto-chave
    let middleSentence = '';
    if (paragraphs.length >= 3) {
      const middleParagraph = paragraphs[Math.floor(paragraphs.length / 2)];
      const midSentences = extractSentences(middleParagraph);
      middleSentence = midSentences[0] || '';
    }

    // Tenta montar combinação rica: [Introdução] + [Meio ou Conclusão]
    const candidates = [
      [firstSentence, middleSentence, lastSentence].filter(Boolean).join(' '),
      [firstSentence, lastSentence].filter(Boolean).join(' '),
      firstSentence
    ];

    for (const candidate of candidates) {
      if (candidate.length <= maxLength && candidate.length > 40) {
        return candidate;
      }
    }
  }

  // Fallback padrão por frases completas sequenciais
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length > 0) {
    let summary = '';
    for (const sentence of sentences) {
      if ((summary + (summary ? ' ' : '') + sentence.trim()).length <= maxLength) {
        summary += (summary ? ' ' : '') + sentence.trim();
      } else {
        break;
      }
    }
    if (summary) return summary;
  }

  // Truncamento no último espaço com reticências
  const truncated = cleaned.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

/**
 * Resume o texto de um artigo utilizando Cloudflare Workers AI com fallback local
 */
export async function summarizeArticle(content: string, title?: string): Promise<string> {
  const cleaned = cleanText(content);
  if (!cleaned) {
    throw new Error('Conteúdo insuficiente para gerar um resumo.');
  }

  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: cleaned,
        title: title ? cleanText(title) : undefined
      })
    });

    if (response.ok) {
      const data = (await response.json()) as { excerpt?: string };
      if (data.excerpt && data.excerpt.trim()) {
        return data.excerpt.trim();
      }
    }
  } catch {
    // Falha de rede ou ambiente local - aciona fallback local inteligente
  }

  return generateLocalSummary(content, 320);
}
