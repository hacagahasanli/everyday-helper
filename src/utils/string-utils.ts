/**
 * Checks if two strings are similar within a maximum allowed number of differing characters.
 * It compares input and target strings character by character,
 * allowing up to `maxDiffCount` differences.
 *
 * Handles strings of different lengths by adjusting the comparison indexes.
 *
 * @param input - Input string to compare
 * @param target - Target string to compare against (default: 'dashboard')
 * @param maxDiffCount - Maximum allowed differing characters (default: 2)
 * @returns True if strings are similar within allowed differences, else false
 */
export const isStringSimilar = (
  input: string,
  target: string = "dashboard",
  maxDiffCount: number = 2
): boolean => {
  let diffCount = 0;

  for (let i = 0, j = 0; i < input.length && j < target.length; i++, j++) {
    if (input[i] !== target[j]) {
      diffCount++;
      if (diffCount > maxDiffCount) return false;

      // Adjust index if input and target lengths differ
      if (input.length > target.length) j--;
      else if (input.length < target.length) i--;
    }
  }

  return diffCount <= maxDiffCount;
};

/**
 * Conditionally concatenates two strings.
 *
 * @param s1 - First string
 * @param s2 - Second string to concatenate if condition is true
 * @param condition - Whether to concatenate s2
 * @returns Concatenated string or just s1
 */
export function concatIf(s1: string, s2: string, condition: boolean): string {
  return s1 + (condition ? s2 : "");
}

/**
 * Checks if a value is a string.
 *
 * @param v - Value to check
 * @returns True if value is a string, false otherwise
 */
export function isString(v: unknown): boolean {
  return typeof v === "string";
}

/**
 * Compares two strings for equality, ignoring case.
 *
 * @param s1 - First string
 * @param s2 - Second string
 * @returns True if strings are equal (case-insensitive), false otherwise
 */
export function eqIgnoreCase(s1: string, s2: string): boolean {
  return s1 && s2 ? s1.toLowerCase() === s2.toLowerCase() : false;
}

/**
 * Checks if first string includes second string, ignoring case.
 *
 * @param s1 - String to search in
 * @param s2 - String to search for
 * @returns True if s1 includes s2 (case-insensitive), false otherwise
 */
export function includesIgnoreCase(s1: string, s2: string): boolean {
  return s1 && s2 ? s1.toLowerCase().includes(s2.toLowerCase()) : false;
}

/**
 * Conditionally adds an asterisk to the end of a string.
 *
 * @param s - Input string
 * @param condition - Whether to add asterisk (default: false)
 * @returns String with asterisk appended if condition is true
 */
export function addAsteriskIf(s: string, condition = false): string {
  return s && `${s}${condition ? "*" : ""}`;
}

/**
 * Removes all whitespace from a string.
 *
 * @param s - Input string
 * @returns String with all whitespace removed
 */
export const compactStr = (s: string): string => s?.replace(/\s+/g, "");

/**
 * Converts a string to UPPER_SNAKE_CASE format.
 *
 * @param str - Input string
 * @returns String in UPPER_SNAKE_CASE format
 */
export const toUpperSnakeCase = (str: string): string => {
  return str
    .replace(/[A-Z]/g, (letter, index) => (index === 0 ? letter : `_${letter}`))
    .toUpperCase();
};

/**
 * Converts a string to lowercase snake_case format.
 *
 * @param str - Input string
 * @returns String in snake_case format
 */
export const toSnakeCase = (str: string): string => {
  return str
    .replace(/[A-Z]/g, (letter, index) => (index === 0 ? letter : `_${letter}`))
    .toLowerCase();
};

/**
 * Converts a string to camelCase format.
 *
 * @param str - Input string
 * @returns String in camelCase format
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
};

/**
 * Converts a string to PascalCase format.
 *
 * @param str - Input string
 * @returns String in PascalCase format
 */
export const toPascalCase = (str: string): string => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
    .replace(/^[a-z]/, (char) => char.toUpperCase());
};

/**
 * Converts a string to kebab-case format.
 *
 * @param str - Input string
 * @returns String in kebab-case format
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/[A-Z]/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : `-${letter.toLowerCase()}`
    )
    .replace(/[\s_]+/g, "-");
};

/**
 * Capitalizes the first letter of a string.
 *
 * @param str - Input string
 * @returns String with first letter capitalized
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Capitalizes the first letter of each word in a string.
 *
 * @param str - Input string
 * @returns String with each word capitalized
 */
export const capitalizeWords = (str: string): string => {
  if (!str) return str;
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Truncates a string to a specified length and adds ellipsis if needed.
 *
 * @param str - Input string
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: "...")
 * @returns Truncated string
 */
export const truncate = (
  str: string,
  maxLength: number,
  suffix: string = "..."
): string => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Reverses a string.
 *
 * @param str - Input string
 * @returns Reversed string
 */
export const reverse = (str: string): string => {
  return str.split("").reverse().join("");
};

/**
 * Counts the occurrences of a substring in a string.
 *
 * @param str - String to search in
 * @param substr - Substring to count
 * @returns Number of occurrences
 */
export const countOccurrences = (str: string, substr: string): number => {
  if (!str || !substr) return 0;
  return str.split(substr).length - 1;
};

/**
 * Removes leading and trailing whitespace and extra spaces between words.
 *
 * @param str - Input string
 * @returns String with normalized whitespace
 */
export const normalizeWhitespace = (str: string): string => {
  return str?.trim().replace(/\s+/g, " ");
};

/**
 * Pads a string to a specified length from the start.
 *
 * @param str - Input string
 * @param length - Target length
 * @param char - Character to pad with (default: " ")
 * @returns Padded string
 */
export const padStart = (
  str: string,
  length: number,
  char: string = " "
): string => {
  return str.padStart(length, char);
};

/**
 * Pads a string to a specified length from the end.
 *
 * @param str - Input string
 * @param length - Target length
 * @param char - Character to pad with (default: " ")
 * @returns Padded string
 */
export const padEnd = (
  str: string,
  length: number,
  char: string = " "
): string => {
  return str.padEnd(length, char);
};

/**
 * Removes specified characters from the beginning of a string.
 *
 * @param str - Input string
 * @param chars - Characters to remove (default: whitespace)
 * @returns String with characters trimmed from start
 */
export const trimStart = (str: string, chars?: string): string => {
  if (!chars) return str.trimStart();
  const pattern = new RegExp(`^[${chars}]+`);
  return str.replace(pattern, "");
};

/**
 * Removes specified characters from the end of a string.
 *
 * @param str - Input string
 * @param chars - Characters to remove (default: whitespace)
 * @returns String with characters trimmed from end
 */
export const trimEnd = (str: string, chars?: string): string => {
  if (!chars) return str.trimEnd();
  const pattern = new RegExp(`[${chars}]+$`);
  return str.replace(pattern, "");
};

/**
 * Removes specified characters from both ends of a string.
 *
 * @param str - Input string
 * @param chars - Characters to remove (default: whitespace)
 * @returns String with characters trimmed from both ends
 */
export const trim = (str: string, chars?: string): string => {
  if (!chars) return str.trim();
  return trimEnd(trimStart(str, chars), chars);
};

/**
 * Checks if a string starts with a specified substring (case-insensitive option).
 *
 * @param str - String to check
 * @param search - Substring to search for
 * @param ignoreCase - Whether to ignore case (default: false)
 * @returns True if string starts with search substring
 */
export const startsWith = (
  str: string,
  search: string,
  ignoreCase: boolean = false
): boolean => {
  if (ignoreCase) {
    return str.toLowerCase().startsWith(search.toLowerCase());
  }
  return str.startsWith(search);
};

/**
 * Checks if a string ends with a specified substring (case-insensitive option).
 *
 * @param str - String to check
 * @param search - Substring to search for
 * @param ignoreCase - Whether to ignore case (default: false)
 * @returns True if string ends with search substring
 */
export const endsWith = (
  str: string,
  search: string,
  ignoreCase: boolean = false
): boolean => {
  if (ignoreCase) {
    return str.toLowerCase().endsWith(search.toLowerCase());
  }
  return str.endsWith(search);
};

/**
 * Repeats a string n times.
 *
 * @param str - String to repeat
 * @param count - Number of times to repeat
 * @returns Repeated string
 */
export const repeat = (str: string, count: number): string => {
  return str.repeat(count);
};

/**
 * Slugifies a string (converts to URL-friendly format).
 *
 * @param str - Input string
 * @returns Slugified string
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export function getInitials(name: string, limit = 2): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, limit)
    .toUpperCase();
}

 export const normalizeAzText = (text: string): string => {
  const charMap: { [key: string]: string } = {
    ə: "e",
    Ə: "E",
    ı: "i",
    İ: "I",
    ş: "s",
    Ş: "S",
    ç: "c",
    Ç: "C",
    ğ: "g",
    Ğ: "G",
    ü: "u",
    Ü: "U",
    ö: "o",
    Ö: "O",
  };

  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[əıüşçğüöƏIŞÇĞÜÖ]/g, (match) => charMap[match] || match)
    .toLowerCase();
};
