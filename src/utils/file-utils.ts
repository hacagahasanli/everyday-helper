const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

export interface FormatFileSizeOptions {
  decimals?: number;
  separator?: string;
}

/**
 * Formats a byte count into a human-readable size (1024-based).
 *
 * @param bytes - Size in bytes
 * @param options - `decimals` (default: 1) and `separator` between value and unit (default: "")
 * @returns e.g. "1.5KB", or "0B" for empty / non-positive values
 *
 * @example
 * formatFileSize(1536); // '1.5KB'
 * formatFileSize(1048576, { separator: ' ' }); // '1 MB'
 */
export const formatFileSize = (
  bytes?: number | null,
  { decimals = 1, separator = '' }: FormatFileSizeOptions = {},
): string => {
  if (!bytes || bytes <= 0) return `0${separator}${FILE_SIZE_UNITS[0]}`;

  const exponent = Math.min(
    Math.max(0, Math.floor(Math.log(bytes) / Math.log(1024))),
    FILE_SIZE_UNITS.length - 1,
  );
  const value = Number((bytes / 1024 ** exponent).toFixed(decimals));

  return `${value}${separator}${FILE_SIZE_UNITS[exponent]}`;
};

export interface GetFileExtensionOptions {
  uppercase?: boolean;
}

/**
 * Returns the extension of a file name.
 *
 * @param fileName - File name or path
 * @param options - `uppercase` (default: true)
 * @returns e.g. "PDF", or "" when the name has no extension
 *
 * @example
 * getFileExtension('report.final.pdf'); // 'PDF'
 * getFileExtension('photo.JPG', { uppercase: false }); // 'jpg'
 * getFileExtension('README'); // ''
 */
export const getFileExtension = (
  fileName?: string | null,
  { uppercase = true }: GetFileExtensionOptions = {},
): string => {
  if (!fileName) return '';

  const dotIndex = fileName.lastIndexOf('.');
  if (dotIndex <= 0 || dotIndex === fileName.length - 1) return '';

  const extension = fileName.slice(dotIndex + 1);

  return uppercase ? extension.toUpperCase() : extension.toLowerCase();
};

/**
 * Triggers a browser download for a URL by clicking a temporary `<a download>` link.
 *
 * @param url - File URL (http, data or object URL)
 * @param filename - Suggested file name
 */
export const downloadUrl = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Triggers a browser download for a Blob (e.g. an exported PDF or XLSX).
 * The temporary object URL is revoked afterwards.
 *
 * @param blob - File content
 * @param filename - Suggested file name
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const objectUrl = URL.createObjectURL(blob);

  downloadUrl(objectUrl, filename);
  URL.revokeObjectURL(objectUrl);
};

export interface FetchAndDownloadOptions {
  onError?: (error: unknown) => void;
}

/**
 * Fetches a URL and downloads the response as a file. Useful for cross-origin files,
 * where a plain `<a download>` would open the file instead of saving it.
 *
 * @param url - File URL
 * @param filename - Suggested file name
 * @param options - `onError` is called when the request fails or returns a non-2xx status
 */
export const fetchAndDownload = async (
  url: string,
  filename: string,
  { onError }: FetchAndDownloadOptions = {},
): Promise<void> => {
  if (!url) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Download failed with status ${response.status}`);

    downloadBlob(await response.blob(), filename);
  } catch (error) {
    onError?.(error);
  }
};
