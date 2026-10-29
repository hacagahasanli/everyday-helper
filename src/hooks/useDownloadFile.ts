import { downloadBlob } from '../utils/file-utils';

const MIME_EXTENSIONS: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

const DEFAULT_EXTENSION = 'png';

export interface UseDownloadFileOptions {
  errorMessage?: string;
  onError?: (error: unknown) => void;
}

/**
 * Downloads a file from a URL. The extension is taken from the response MIME type
 * (pdf, png, jpg, gif, webp, svg), falling back to "png".
 *
 * @param options - `onError` handles failures (non-2xx response or network error);
 *   without it, `errorMessage` is shown via `alert` (default: "Endirmə uğursuz oldu.")
 * @returns `downloadImage(src, filename)` — spaces in `filename` become underscores
 *
 * @example
 * const { downloadImage } = useDownloadFile({ onError: () => toast.error('Xəta') });
 * downloadImage(fileUrl, 'Qərar arayışı'); // saves "Qərar_arayışı.pdf" for a PDF response
 */
export const useDownloadFile = ({
  errorMessage = 'Endirmə uğursuz oldu.',
  onError,
}: UseDownloadFileOptions = {}) => {
  const downloadImage = async (src: string, filename: string) => {
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`Download failed with status ${response.status}`);

      const blob = await response.blob();
      const mimeType = blob.type.split(';')[0].trim();
      const extension = MIME_EXTENSIONS[mimeType] ?? DEFAULT_EXTENSION;

      downloadBlob(blob, `${filename.replace(/\s+/g, '_')}.${extension}`);
    } catch (error) {
      if (onError) onError(error);
      else alert(errorMessage);
    }
  };

  return { downloadImage };
};
