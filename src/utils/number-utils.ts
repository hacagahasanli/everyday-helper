/**
 * Restricts a number to the `[min, max]` range. When `min` is greater than `max`
 * (e.g. an index into an empty list), `min` wins.
 *
 * @param value - Number to restrict
 * @param min - Lower bound
 * @param max - Upper bound
 * @returns Clamped number
 *
 * @example
 * clamp(15, 0, 10); // 10
 * clamp(index, 0, items.length - 1); // safe list index
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, max));

export interface FormatNumberOptions extends Intl.NumberFormatOptions {
  locale?: string;
}

/**
 * Formats a number with locale-aware grouping and decimal separators.
 *
 * @param value - Number to format
 * @param options - `locale` (default: "az-AZ") plus any `Intl.NumberFormat` option
 * @returns Formatted number
 *
 * @example
 * formatNumber(1234567.5); // '1.234.567,5'
 * formatNumber(12.5, { minimumFractionDigits: 2 }); // '12,50'
 * formatNumber(12842, { locale: 'en-US' }); // '12,842'
 */
export const formatNumber = (
  value: number,
  { locale = 'az-AZ', ...options }: FormatNumberOptions = {},
): string => new Intl.NumberFormat(locale, options).format(value);

/**
 * Converts a value to a number, returning `undefined` instead of `NaN`
 * for empty or non-numeric input. Useful for form and query values.
 *
 * @param value - String or number
 * @returns Number, or undefined for `null`, `undefined`, blank or non-numeric values
 *
 * @example
 * toNumberOrUndef('42'); // 42
 * toNumberOrUndef(''); // undefined
 * toNumberOrUndef('abc'); // undefined
 */
export const toNumberOrUndef = (value?: string | number | null): number | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string' && value.trim() === '') return undefined;

  const parsed = typeof value === 'number' ? value : Number(value);

  return Number.isNaN(parsed) ? undefined : parsed;
};
