/**
 * Checks if a value is null or undefined.
 * @param v - Value to check
 * @returns true if null or undefined, else false
 */
export function isNulOrUndefined(v: unknown): boolean {
  return v === null || v === undefined;
}

/**
 * Checks if a value is an empty form value: `''`, `null` or `undefined`.
 * Unlike `isEmpty`, `0`, `false`, `[]` and `{}` are not considered empty.
 *
 * @param value - Value to check
 * @returns true for `''`, `null` or `undefined` (narrows the type)
 *
 * @example
 * isEmptyValue(''); // true
 * isEmptyValue(0); // false
 */
export const isEmptyValue = (value: unknown): value is '' | null | undefined =>
  value === '' || value === null || value === undefined;

/**
 * Checks if a value is "empty".
 * Empty means:
 * - null or undefined
 * - NaN
 * - empty string ''
 * - empty array []
 * - empty object {}
 *
 * @param o - Value to check
 * @returns true if empty, else false
 */
export function isEmpty(o: unknown): boolean {
  if (Number.isNaN(o)) return true;
  if (isNulOrUndefined(o)) return true;
  if (typeof o === "string") return o === "";
  if (Array.isArray(o)) return o.length === 0;
  if (typeof o === "object") return !Object.keys(o !== null ? o : {}).length;
  return false;
}

/**
 * Checks if a value is NOT empty (opposite of isEmpty).
 * @param o - Value to check
 * @returns true if NOT empty, else false
 */
export function isNotEmpty(o: unknown): boolean {
  return !isEmpty(o);
}

export const getImageUrl = (id: string | number, baseUrl: string) => {
  const finalBaseUrl = baseUrl || window.location.href;
  return `${finalBaseUrl}/fs/v1/files/${id}/download`;
};
