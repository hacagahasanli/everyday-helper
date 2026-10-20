/**
 * Converts a File or Blob object to a Base64-encoded data URL string.
 *
 * The resulting string will be in the format:
 * "data:[<mediatype>][;base64],<data>"
 *
 * @param file - The File or Blob object to convert
 * @returns A promise that resolves with the Base64 data URL string
 * @throws Will reject if an error occurs during reading (e.g. file system error)
 *
 * @example
 * ```ts
 * const base64 = await convertFileToBase64(selectedFile);
 * console.log(base64); // data:image/png;base64,iVBORw0KGgoAAA...
 * ```
 */
export const convertFileToBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

/**
 * Converts a Base64-encoded string (without the data URL prefix) back into a File object.
 *
 * Note: The input `base64` should be only the base64 part, NOT the full data URL.
 * If you have a full data URL (e.g. from convertFileToBase64), extract the base64 part first:
 * `base64String.split(',')[1]`
 *
 * @param base64 - Pure Base64-encoded string (without data: prefix)
 * @param fileName - Desired name for the resulting File
 * @param mimeType - MIME type of the file (e.g., "image/png", "application/pdf")
 * @returns A new File object reconstructed from the Base64 data
 *
 * @example
 * ```ts
 * const file = convertBase64ToFile(
 *   "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwACh...",
 *   "image.png",
 *   "image/png"
 * );
 *
 * // If you have a full data URL:
 * const dataUrl = "data:image/png;base64,iVBORw0KGgoAAA...";
 * const pureBase64 = dataUrl.split(',')[1];
 * const fileFromDataUrl = convertBase64ToFile(pureBase64, "image.png", "image/png");
 * ```
 */
export function convertBase64ToFile(
  base64: string,
  fileName: string,
  mimeType: string
): File {
  const bstr = atob(base64);
  let n = bstr.length;
  const buffer = new Uint8Array(n);

  while (n--) {
    buffer[n] = bstr.charCodeAt(n);
  }

  return new File([buffer], fileName, { type: mimeType });
}

/**
 * Extracts the pure Base64 string from a data URL (removes "data:...;base64," prefix)
 *
 * @param dataUrl - Full data URL string
 * @returns The base64-encoded part only
 */
export const extractBase64FromDataUrl = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:[\w/+]+;base64,(.+)$/);
  if (!match) throw new Error("Invalid data URL format");
  return match[1];
};

/**
 * Turns a raw Base64 string into a data URL. Values that are already a data URL
 * or an http(s) URL are returned unchanged. Inverse of `extractBase64FromDataUrl`.
 *
 * @param src - Raw Base64, data URL or http(s) URL
 * @param mimeType - MIME type for raw Base64 (default: "image/jpeg")
 * @returns Data URL / URL, or undefined for empty values
 *
 * @example
 * toDataUrl('/9j/4AAQSk...'); // 'data:image/jpeg;base64,/9j/4AAQSk...'
 * toDataUrl('https://cdn.example.com/a.png'); // unchanged
 */
export const toDataUrl = (
  src?: string | null,
  mimeType: string = 'image/jpeg',
): string | undefined => {
  if (!src) return undefined;
  if (src.startsWith('data:') || src.startsWith('http')) return src;
  return `data:${mimeType};base64,${src}`;
};

/** Convert File → Blob → ArrayBuffer */
export const fileToArrayBuffer = (file: File | Blob): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
