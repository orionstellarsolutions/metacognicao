import { describe, it, expect, vi } from 'vitest';
import { compressImage } from '../imageCompression';

describe('imageCompression.ts', () => {
  it('deve rejeitar se o arquivo não for imagem', async () => {
    const file = new File(['text'], 'test.txt', { type: 'text/plain' });
    await expect(compressImage(file)).rejects.toThrow('O arquivo selecionado não é uma imagem válida.');
  });

  it('deve rejeitar se houver erro no FileReader', async () => {
    const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' });
    vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function (this: FileReader) {
      setTimeout(() => {
        if (this.onerror) {
          this.onerror(new ProgressEvent('error') as any);
        }
      }, 0);
    });

    await expect(compressImage(file)).rejects.toThrow('Erro ao ler o arquivo de imagem.');
  });

  it('deve comprimir uma imagem válida proporcionalmente dentro do limite', async () => {
    const file = new File(['img-binary'], 'banner.jpg', { type: 'image/jpeg' });

    vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function (this: FileReader) {
      setTimeout(() => {
        Object.defineProperty(this, 'result', { value: 'data:image/jpeg;base64,sample' });
        if (this.onload) {
          this.onload({ target: this } as any);
        }
      }, 0);
    });

    // Mock Image
    const originalImage = globalThis.Image;
    vi.stubGlobal('Image', class {
      width = 2000;
      height = 1000;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
    });

    // Mock Canvas
    const mockCtx = {
      drawImage: vi.fn()
    };
    const mockToDataURL = vi.fn().mockReturnValue('data:image/jpeg;base64,' + 'A'.repeat(5000));
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: () => mockCtx,
          toDataURL: mockToDataURL
        } as any;
      }
      return document.createElement(tag);
    });

    const result = await compressImage(file, 500, 1600, 1200);
    expect(result.dataUrl).toContain('data:image/jpeg;base64');
    expect(result.sizeKb).toBeGreaterThan(0);
    expect(mockCtx.drawImage).toHaveBeenCalled();

    vi.stubGlobal('Image', originalImage);
  });

  it('deve redimensionar imagem vertical e iterar qualidade quando excede limite', async () => {
    const file = new File(['img-binary'], 'portrait.jpg', { type: 'image/jpeg' });

    vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function (this: FileReader) {
      setTimeout(() => {
        Object.defineProperty(this, 'result', { value: 'data:image/jpeg;base64,sample' });
        if (this.onload) this.onload({ target: this } as any);
      }, 0);
    });

    const originalImage = globalThis.Image;
    vi.stubGlobal('Image', class {
      width = 1000;
      height = 3000; // Imagem muito vertical
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
    });

    let calls = 0;
    const mockCtx = { drawImage: vi.fn() };
    const mockToDataURL = vi.fn().mockImplementation(() => {
      calls++;
      // Inicialmente grande, depois menor
      return calls === 1
        ? 'data:image/jpeg;base64,' + 'B'.repeat(3000000)
        : 'data:image/jpeg;base64,' + 'B'.repeat(10000);
    });

    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: () => mockCtx,
          toDataURL: mockToDataURL
        } as any;
      }
      return document.createElement(tag);
    });

    const result = await compressImage(file, 100, 1600, 1200);
    expect(result.sizeKb).toBeLessThanOrEqual(100);
    expect(calls).toBeGreaterThan(1);

    vi.stubGlobal('Image', originalImage);
  });

  it('deve rejeitar se getContext 2d retornar nulo', async () => {
    const file = new File(['img-binary'], 'portrait.jpg', { type: 'image/jpeg' });

    vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function (this: FileReader) {
      setTimeout(() => {
        Object.defineProperty(this, 'result', { value: 'data:image/jpeg;base64,sample' });
        if (this.onload) this.onload({ target: this } as any);
      }, 0);
    });

    const originalImage = globalThis.Image;
    vi.stubGlobal('Image', class {
      width = 500;
      height = 500;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
    });

    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: () => null
        } as any;
      }
      return document.createElement(tag);
    });

    await expect(compressImage(file)).rejects.toThrow('Contexto 2D do Canvas indisponível.');

    vi.stubGlobal('Image', originalImage);
  });
});

