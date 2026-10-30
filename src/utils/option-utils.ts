export interface SelectOption {
  label: string;
  value: string;
}

/**
 * Converts a `{ value: label }` map (e.g. an enum label map) into select options.
 *
 * @param map - Object whose keys become values and whose values become labels
 * @param getExtra - Optional extra fields merged into each option
 * @returns Options in the map's key order
 *
 * @example
 * entriesToOptions({ ACTIVE: 'Aktiv', CLOSED: 'Bağlı' });
 * // [{ value: 'ACTIVE', label: 'Aktiv' }, { value: 'CLOSED', label: 'Bağlı' }]
 *
 * entriesToOptions({ FINE: 'Cərimə' }, (value) => ({ disabled: value === 'FINE' }));
 * // [{ value: 'FINE', label: 'Cərimə', disabled: true }]
 */
export const entriesToOptions = <E extends object = object>(
  map: Record<string, string>,
  getExtra?: (value: string, label: string) => E,
): Array<SelectOption & E> =>
  Object.entries(map).map(
    ([value, label]) => ({ value, label, ...getExtra?.(value, label) }) as SelectOption & E,
  );

export interface ToOptionsKeys<T> {
  labelKey: keyof T;
  valueKey: keyof T;
}

/**
 * Converts a list of objects into select options. Label and value are stringified.
 *
 * @param items - Source objects
 * @param keys - `labelKey` and `valueKey` to read from each object
 * @returns Options in the list order
 *
 * @example
 * toOptions([{ id: 1, name: 'Bakı' }], { labelKey: 'name', valueKey: 'id' });
 * // [{ label: 'Bakı', value: '1' }]
 */
export const toOptions = <T extends object>(
  items: readonly T[],
  { labelKey, valueKey }: ToOptionsKeys<T>,
): SelectOption[] =>
  items.map((item) => ({
    label: String(item[labelKey]),
    value: String(item[valueKey]),
  }));

export interface FindLabelOptions<T> {
  valueKey?: keyof T;
  labelKey?: keyof T;
  fallback?: string | null;
}

/**
 * Finds an item by a key and returns its label. Values are compared as strings,
 * so `5` matches `'5'`.
 *
 * @param list - Items to search (options, dictionary entries, ...)
 * @param value - Value to look up
 * @param options - `valueKey` (default: "value"), `labelKey` (default: "label") and
 *   `fallback` returned when nothing matches (default: null)
 * @returns Label, `null` for a `null`/`undefined` value, or the fallback
 *
 * @example
 * findLabel(options, 'ACTIVE'); // 'Aktiv'
 * findLabel(dictionary, 5, { valueKey: 'id', labelKey: 'value' }); // 'Bakı'
 * findLabel(options, 'UNKNOWN', { fallback: 'UNKNOWN' }); // 'UNKNOWN'
 */
export const findLabel = <T extends object>(
  list: readonly T[] | null | undefined,
  value: unknown,
  {
    valueKey = 'value' as keyof T,
    labelKey = 'label' as keyof T,
    fallback = null,
  }: FindLabelOptions<T> = {},
): string | null => {
  if (value === null || value === undefined) return null;

  const match = list?.find((item) => String(item[valueKey]) === String(value));
  const label = match?.[labelKey];

  return label === null || label === undefined ? fallback : String(label);
};
