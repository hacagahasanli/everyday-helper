import { describe, it, expect } from 'vitest';

import { clamp, formatNumber, toNumberOrUndef } from '../../utils/number-utils';

describe('clamp', () => {
  it('keeps a value inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('returns min when min is greater than max (index into an empty list)', () => {
    expect(clamp(3, 0, -1)).toBe(0);
  });
});

describe('formatNumber', () => {
  it('uses Azerbaijani separators by default', () => {
    expect(formatNumber(12842)).toBe('12.842');
    expect(formatNumber(1284250.5)).toBe('1.284.250,5');
  });

  it('passes Intl.NumberFormat options through', () => {
    expect(formatNumber(12.5, { minimumFractionDigits: 2 })).toBe('12,50');
  });

  it('accepts another locale', () => {
    expect(formatNumber(12842, { locale: 'en-US' })).toBe('12,842');
  });
});

describe('toNumberOrUndef', () => {
  it('converts numeric strings and keeps numbers', () => {
    expect(toNumberOrUndef('42')).toBe(42);
    expect(toNumberOrUndef('0')).toBe(0);
    expect(toNumberOrUndef('-1.5')).toBe(-1.5);
    expect(toNumberOrUndef(7)).toBe(7);
  });

  it.each([undefined, null, '', '   ', 'abc', Number.NaN])('returns undefined for %s', (value) => {
    expect(toNumberOrUndef(value)).toBeUndefined();
  });
});
