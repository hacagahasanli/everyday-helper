import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  parseDate,
  formatDate,
  reformatDate,
  computeAnchor,
  formatAzDate,
  isAfterToday,
  isBeforeToday,
  formatIsoDate,
  formatIfIsoDate,
  isIsoDateString,
  formatAzDateTime,
  formatAzDateShort,
  disabledBeforeDay,
  combineDateAndTime,
  getDisabledPastTime,
  disabledOutsideRange,
  disabledOnOrBeforeDay,
  generateOrderedDateText,
} from '../../utils/date-utils';

const dayjsLike = (date: Date) => ({ valueOf: () => date.getTime() });

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 20, 10, 15));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('formatDate', () => {
  it('supports the ss token', () => {
    expect(formatDate(new Date(2026, 9, 5, 14, 30, 7), 'YYYY-MM-DDTHH:mm:ss')).toBe(
      '2026-10-05T14:30:07',
    );
  });
});

describe('isIsoDateString', () => {
  it('returns true for ISO date and date-time strings', () => {
    expect(isIsoDateString('2026-10-05')).toBe(true);
    expect(isIsoDateString('2026-10-05T14:30:00')).toBe(true);
  });

  it.each(['05-10-2026', '2015', 42, null])('returns false for %s', (value) => {
    expect(isIsoDateString(value)).toBe(false);
  });
});

describe('formatIsoDate', () => {
  it('formats a date-only value as a local date', () => {
    expect(formatIsoDate('2026-10-05', 'DD-MM-YYYY')).toBe('05-10-2026');
  });

  it('formats a date-time value', () => {
    expect(formatIsoDate('2026-10-05T14:07:00', 'DD-MM-YYYY HH:mm')).toBe('05-10-2026 14:07');
  });

  it.each([null, undefined, ''])('returns null for %s', (value) => {
    expect(formatIsoDate(value, 'DD-MM-YYYY')).toBeNull();
  });

  it.each(['2015', 'Yoxdur', '3 ay'])('returns a non-date value unchanged (%s)', (value) => {
    expect(formatIsoDate(value, 'DD-MM-YYYY')).toBe(value);
  });
});

describe('formatIfIsoDate', () => {
  it('formats ISO date strings', () => {
    expect(formatIfIsoDate('1990-01-01', 'DD-MM-YYYY')).toBe('01-01-1990');
  });

  it.each(['Bakı', 7, null])('returns other values unchanged (%s)', (value) => {
    expect(formatIfIsoDate(value, 'DD-MM-YYYY')).toBe(value);
  });
});

describe('formatAzDate', () => {
  it('formats with the full Azerbaijani month name', () => {
    expect(formatAzDate('2026-10-05')).toBe('5 Oktyabr 2026');
    expect(formatAzDate('2026-06-01')).toBe('1 İyun 2026');
  });

  it('returns the fallback for empty values', () => {
    expect(formatAzDate(null)).toBe('—');
    expect(formatAzDate('', '-')).toBe('-');
  });

  it('returns an unparseable value as is', () => {
    expect(formatAzDate('not-a-date')).toBe('not-a-date');
  });
});

describe('formatAzDateTime', () => {
  it('formats date and time', () => {
    expect(formatAzDateTime('2026-10-05T09:05:00')).toBe('5 Oktyabr 2026, 09:05');
  });

  it('returns the fallback for empty values', () => {
    expect(formatAzDateTime(undefined)).toBe('—');
  });
});

describe('formatAzDateShort', () => {
  it('formats with a padded day and the short month name', () => {
    expect(formatAzDateShort('2026-10-05')).toBe('05 Okt 2026');
  });

  it('returns the fallback for empty values', () => {
    expect(formatAzDateShort(null)).toBe('—');
  });
});

describe('combineDateAndTime', () => {
  it('takes the day from the first value and the time from the second', () => {
    expect(combineDateAndTime('2026-10-05', '2026-01-01T14:30:45')).toBe('2026-10-05T14:30:00');
  });

  it('accepts date-library objects and a custom format', () => {
    const day = dayjsLike(new Date(2026, 9, 5));
    const time = dayjsLike(new Date(2020, 0, 1, 8, 5));
    expect(combineDateAndTime(day, time, 'DD-MM-YYYY HH:mm')).toBe('05-10-2026 08:05');
  });

  it('returns an empty string when a value is missing', () => {
    expect(combineDateAndTime('', '2026-01-01T14:30:00')).toBe('');
    expect(combineDateAndTime('2026-10-05', null)).toBe('');
  });
});

describe('isBeforeToday / isAfterToday', () => {
  it('compares by calendar day', () => {
    expect(isBeforeToday('2026-10-19')).toBe(true);
    expect(isBeforeToday(new Date(2026, 9, 20, 0, 0))).toBe(false);
    expect(isAfterToday('2026-10-21')).toBe(true);
    expect(isAfterToday(new Date(2026, 9, 20, 23, 59))).toBe(false);
  });

  it('returns false for empty values', () => {
    expect(isBeforeToday(null)).toBe(false);
    expect(isAfterToday(undefined)).toBe(false);
  });
});

describe('disabledBeforeDay', () => {
  it('disables days before the reference day', () => {
    const isDisabled = disabledBeforeDay('2026-10-10');
    expect(isDisabled('2026-10-09')).toBe(true);
    expect(isDisabled('2026-10-10')).toBe(false);
    expect(isDisabled(dayjsLike(new Date(2026, 9, 11)))).toBe(false);
  });

  it('disables nothing when the reference is empty', () => {
    expect(disabledBeforeDay(null)('2000-01-01')).toBe(false);
  });
});

describe('disabledOnOrBeforeDay', () => {
  it('disables the reference day and days before it', () => {
    const isDisabled = disabledOnOrBeforeDay('2026-10-10');
    expect(isDisabled('2026-10-10')).toBe(true);
    expect(isDisabled('2026-10-11')).toBe(false);
  });

  it('disables nothing when the reference is empty', () => {
    expect(disabledOnOrBeforeDay(undefined)('2000-01-01')).toBe(false);
  });
});

describe('disabledOutsideRange', () => {
  it('disables days outside [min, max]', () => {
    const isDisabled = disabledOutsideRange({ min: new Date(), max: '2026-10-25' });
    expect(isDisabled('2026-10-19')).toBe(true);
    expect(isDisabled('2026-10-20')).toBe(false);
    expect(isDisabled('2026-10-25')).toBe(false);
    expect(isDisabled('2026-10-26')).toBe(true);
  });

  it('ignores empty bounds', () => {
    expect(disabledOutsideRange({ min: '2026-10-20' })('2030-01-01')).toBe(false);
    expect(disabledOutsideRange({})('2000-01-01')).toBe(false);
  });
});

describe('getDisabledPastTime', () => {
  it('disables past hours and minutes when the selected day is today', () => {
    const config = getDisabledPastTime('2026-10-20')();
    expect(config.disabledHours?.()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(config.disabledMinutes?.(10)).toHaveLength(15);
    expect(config.disabledMinutes?.(11)).toEqual([]);
  });

  it('returns an empty config for other days or no selection', () => {
    expect(getDisabledPastTime('2026-10-21')()).toEqual({});
    expect(getDisabledPastTime(null)()).toEqual({});
  });
});

describe('parseDate', () => {
  it('parses YYYY-MM-DD as a local date by default', () => {
    expect(parseDate('2026-10-05')).toEqual(new Date(2026, 9, 5));
  });

  it('parses a custom format with time', () => {
    expect(parseDate('05/10/2026 14:30', 'DD/MM/YYYY HH:mm')).toEqual(new Date(2026, 9, 5, 14, 30));
  });

  it('keeps parsing DD/MM/YYYY', () => {
    expect(parseDate('05/10/2026', 'DD/MM/YYYY')).toEqual(new Date(2026, 9, 5));
  });

  it('returns undefined for an impossible date', () => {
    expect(parseDate('2026-02-31')).toBeUndefined();
  });

  it('falls back to the native parser when the format does not match', () => {
    expect(parseDate('2026-10-05T14:30:00', 'DD/MM/YYYY')).toEqual(new Date(2026, 9, 5, 14, 30));
  });
});

describe('reformatDate', () => {
  it('converts between formats', () => {
    expect(reformatDate('05-10-2026', 'DD-MM-YYYY', 'YYYY-MM-DD')).toBe('2026-10-05');
    expect(reformatDate('2026-10-05T14:30', 'YYYY-MM-DDTHH:mm', 'DD.MM.YYYY HH:mm')).toBe(
      '05.10.2026 14:30',
    );
  });

  it('returns undefined when the value does not match the input format', () => {
    expect(reformatDate('2026-10-05', 'DD-MM-YYYY', 'YYYY-MM-DD')).toBeUndefined();
    expect(reformatDate('31-02-2026', 'DD-MM-YYYY', 'YYYY-MM-DD')).toBeUndefined();
  });
});

describe('computeAnchor', () => {
  it('adds months and clamps to the end of a shorter month', () => {
    const startDate = new Date(Date.UTC(2026, 0, 31));
    expect(computeAnchor({ startDate, totalMonths: 1 })).toEqual(new Date(Date.UTC(2026, 1, 28)));
    expect(computeAnchor({ startDate, totalMonths: 3 })).toEqual(new Date(Date.UTC(2026, 3, 30)));
  });

  it('rolls over to the next year', () => {
    const startDate = new Date(Date.UTC(2026, 10, 15));
    expect(computeAnchor({ startDate, totalMonths: 3 })).toEqual(new Date(Date.UTC(2027, 1, 15)));
  });
});

describe('generateOrderedDateText', () => {
  it('builds Azerbaijani text by default and skips zero parts', () => {
    expect(generateOrderedDateText({ order: 'YMD', date: { years: 1, months: 3, days: 9 } })).toBe(
      '1 il 3 ay 9 gün',
    );
    expect(generateOrderedDateText({ order: 'YMD', date: { years: 2, months: 0, days: 0 } })).toBe(
      '2 il',
    );
  });

  it('returns zero days when every part is zero', () => {
    expect(generateOrderedDateText({ order: 'YMD', date: { years: 0, months: 0, days: 0 } })).toBe(
      '0 gün',
    );
  });

  it('respects order and language', () => {
    expect(
      generateOrderedDateText({ order: 'DMY', lang: 'en', date: { years: 1, months: 0, days: 2 } }),
    ).toBe('2 days 1 year');
  });
});
