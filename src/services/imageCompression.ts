export interface CompressedImageResult {
  dataUrl: string;
  sizeKb: number;
}

/**
 * Comprime uma imagem localmente no navegador utilizando HTML5 Canvas
 * garantindo limite máximo de tamanho em KB (padrão 500KB).
 */
export async function compressImage(
  file: File,
  maxKb: number = 500,
  maxWidth: number = 1600,
  maxHeight: number = 1200
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    // Validação básica do tipo
    if (!file.type.startsWith('image/')) {
      return reject(new Error('O arquivo selecionado não é uma imagem válida.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo de imagem.'));

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Erro ao carregar a imagem para compressão.'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Redimensionamento proporcional
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Contexto 2D do Canvas indisponível.'));
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        // Ajuste iterativo se ainda passar do limite de maxKb
        while (sizeKb > maxKb && quality > 0.4) {
          quality -= 0.15;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        }

        resolve({ dataUrl, sizeKb });
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
