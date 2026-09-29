import { vi } from 'vitest';

// Previne tentativas de socket de rede em ambiente de teste headless
if (!globalThis.fetch || typeof globalThis.fetch === 'function') {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = vi.fn().mockImplementation(async (url: string | URL | Request, init?: RequestInit) => {
    // Se o teste já sobrescreveu ou se for mock
    return {
      ok: false,
      status: 404,
      json: async () => ({}),
      text: async () => ''
    } as Response;
  });
}

// Mock de prompt para happy-dom
if (!globalThis.prompt) {
  globalThis.prompt = vi.fn().mockReturnValue('https://example.com');
}

