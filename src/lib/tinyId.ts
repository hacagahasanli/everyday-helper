// Tiny ID Generator (~150 bytes minified)

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

/**
 * Generate a unique ID
 * @param {number} size - Length of the ID (default: 21)
 * @returns {string} Random ID
 */
export const tinyId = (size: number = 21): string => {
  let id = '';
  const bytes = crypto.getRandomValues(new Uint8Array(size));

  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i] & 63]; // 63 = 0b111111 (mask to 0-63 range)
  }

  return id;
};


/**
 * Generate a unique ID
 * @param {number} size - Length of the ID (default: 21)
 * @returns {string} Random ID
 */

// Alternative: Timestamp-based ID (sortable)
export const timeId = (size: number = 16): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = tinyId(size - timestamp.length);
  return timestamp + randomPart;
};
