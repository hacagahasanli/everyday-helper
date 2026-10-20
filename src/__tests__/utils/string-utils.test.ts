import { describe, it, expect } from 'vitest';

import {
  toStr,
  toDative,
  boolLabel,
  dativeSuffix,
  toStrOrUndef,
  toLocaleUpper,
  ablativeSuffix,
  toStrWithSuffix,
  toStrWithFallback,
  prettifySnakeCase,
} from '../../utils/string-utils';

describe('toStr', () => {
  it('returns null for empty values', () => {
    expect(toStr(null)).toBeNull();
    expect(toStr(undefined)).toBeNull();
    expect(toStr('')).toBeNull();
  });

  it('stringifies other values including 0 and false', () => {
    expect(toStr(0)).toBe('0');
    expect(toStr(false)).toBe('false');
    expect(toStr('abc')).toBe('abc');
  });
});

describe('toStrWithFallback', () => {
  it('returns "-" by default for empty values', () => {
    expect(toStrWithFallback(null)).toBe('-');
    expect(toStrWithFallback(undefined)).toBe('-');
    expect(toStrWithFallback('')).toBe('-');
  });

  it('returns a custom fallback', () => {
    expect(toStrWithFallback(null, '—')).toBe('—');
  });

  it('keeps 0 instead of falling back', () => {
    expect(toStrWithFallback(0)).toBe('0');
  });
});

describe('toStrOrUndef', () => {
  it('returns undefined for null and undefined', () => {
    expect(toStrOrUndef(null)).toBeUndefined();
    expect(toStrOrUndef(undefined)).toBeUndefined();
  });

  it('keeps empty string and stringifies numbers', () => {
    expect(toStrOrUndef('')).toBe('');
    expect(toStrOrUndef(12)).toBe('12');
  });
});

describe('toStrWithSuffix', () => {
  it('appends the suffix', () => {
    expect(toStrWithSuffix(5, ' ay')).toBe('5 ay');
    expect(toStrWithSuffix(0, '%')).toBe('0%');
  });

  it('returns undefined for null and undefined', () => {
    expect(toStrWithSuffix(null, ' ay')).toBeUndefined();
    expect(toStrWithSuffix(undefined, ' ay')).toBeUndefined();
  });
});

describe('boolLabel', () => {
  it('uses Azerbaijani labels by default', () => {
    expect(boolLabel(true)).toBe('Bəli');
    expect(boolLabel(false)).toBe('Xeyr');
  });

  it('uses custom labels', () => {
    expect(boolLabel(true, { yes: 'Yes', no: 'No' })).toBe('Yes');
    expect(boolLabel(false, { no: 'No' })).toBe('No');
  });

  it('returns null for null and undefined', () => {
    expect(boolLabel(null)).toBeNull();
    expect(boolLabel(undefined)).toBeNull();
  });
});

describe('toLocaleUpper', () => {
  it('uses Azerbaijani rules by default', () => {
    expect(toLocaleUpper('istintaq')).toBe('İSTİNTAQ');
  });

  it('accepts another locale', () => {
    expect(toLocaleUpper('istintaq', 'en')).toBe('ISTINTAQ');
  });
});

describe('prettifySnakeCase', () => {
  it('converts UPPER_SNAKE_CASE to title case', () => {
    expect(prettifySnakeCase('IN_PROGRESS')).toBe('In Progress');
    expect(prettifySnakeCase('not_started')).toBe('Not Started');
  });

  it('handles non-Latin letters', () => {
    expect(prettifySnakeCase('ƏLAVƏ_MƏLUMAT')).toBe('Əlavə Məlumat');
    expect(prettifySnakeCase('şərti_cəza')).toBe('Şərti Cəza');
  });

  it('does not capitalize a letter that follows a digit', () => {
    expect(prettifySnakeCase('STEP_2A')).toBe('Step 2a');
  });

  it('returns an empty string for non-string input', () => {
    expect(prettifySnakeCase(null as unknown as string)).toBe('');
  });
});

describe('ablativeSuffix', () => {
  it('picks the suffix by the last vowel', () => {
    expect(ablativeSuffix('Bakı')).toBe('dan');
    expect(ablativeSuffix('Gəncə')).toBe('dən');
    expect(ablativeSuffix('məhkəmə')).toBe('dən');
    expect(ablativeSuffix('idarə')).toBe('dən');
    expect(ablativeSuffix('şöbə')).toBe('dən');
    expect(ablativeSuffix('Quba')).toBe('dan');
  });

  it('treats a dotless capital I as a back vowel', () => {
    expect(ablativeSuffix('BAKI')).toBe('dan');
  });
});

describe('dativeSuffix', () => {
  it('picks the suffix by the last vowel', () => {
    expect(dativeSuffix('Bakı')).toBe('a');
    expect(dativeSuffix('Şəki')).toBe('ə');
  });
});

describe('toDative', () => {
  it('adds the buffer "y" after a trailing vowel', () => {
    expect(toDative('Bakı')).toBe('Bakı-ya');
    expect(toDative('Gəncə')).toBe('Gəncə-yə');
  });

  it('adds the suffix directly after a consonant', () => {
    expect(toDative('Şəmkir')).toBe('Şəmkir-ə');
    expect(toDative('Naxçıvan')).toBe('Naxçıvan-a');
  });
});
