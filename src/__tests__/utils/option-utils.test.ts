import { describe, it, expect } from 'vitest';

import { findLabel, toOptions, entriesToOptions } from '../../utils/option-utils';

describe('entriesToOptions', () => {
  it('maps keys to values and values to labels', () => {
    expect(entriesToOptions({ ACTIVE: 'Aktiv', CLOSED: 'Bağlı' })).toEqual([
      { value: 'ACTIVE', label: 'Aktiv' },
      { value: 'CLOSED', label: 'Bağlı' },
    ]);
  });

  it('merges extra fields from getExtra', () => {
    const options = entriesToOptions({ FINE: 'Cərimə', WORK: 'İş' }, (value) => ({
      disabled: value === 'FINE',
    }));

    expect(options).toEqual([
      { value: 'FINE', label: 'Cərimə', disabled: true },
      { value: 'WORK', label: 'İş', disabled: false },
    ]);
  });

  it('returns an empty list for an empty map', () => {
    expect(entriesToOptions({})).toEqual([]);
  });
});

describe('toOptions', () => {
  it('reads label and value keys and stringifies them', () => {
    const cities = [
      { id: 1, name: 'Bakı' },
      { id: 2, name: 'Gəncə' },
    ];

    expect(toOptions(cities, { labelKey: 'name', valueKey: 'id' })).toEqual([
      { label: 'Bakı', value: '1' },
      { label: 'Gəncə', value: '2' },
    ]);
  });
});

describe('findLabel', () => {
  const options = [
    { value: 'ACTIVE', label: 'Aktiv' },
    { value: '5', label: 'Beş' },
  ];
  const dictionary = [
    { id: 1, value: 'Bakı' },
    { id: 2, value: 'Gəncə' },
  ];

  it('finds a label with the default value/label keys', () => {
    expect(findLabel(options, 'ACTIVE')).toBe('Aktiv');
  });

  it('finds a label with custom keys', () => {
    expect(findLabel(dictionary, 2, { valueKey: 'id', labelKey: 'value' })).toBe('Gəncə');
  });

  it('compares values as strings', () => {
    expect(findLabel(options, 5)).toBe('Beş');
    expect(findLabel(dictionary, '1', { valueKey: 'id', labelKey: 'value' })).toBe('Bakı');
  });

  it('returns null when nothing matches and no fallback is given', () => {
    expect(findLabel(options, 'UNKNOWN')).toBeNull();
  });

  it('returns the fallback when nothing matches', () => {
    expect(findLabel(options, 'UNKNOWN', { fallback: 'UNKNOWN' })).toBe('UNKNOWN');
    expect(findLabel(null, 'ACTIVE', { fallback: '-' })).toBe('-');
  });

  it.each([null, undefined])('returns null for a %s value', (value) => {
    expect(findLabel(options, value, { fallback: '-' })).toBeNull();
  });
});
