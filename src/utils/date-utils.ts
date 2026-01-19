import { DateFormats } from '../constants/DateFormats';

export type DateInput = Date | string | number | null | undefined;

/* ----------------------------- Helper ----------------------------- */

const toDate = (date: DateInput): Date | undefined => {
  if (!date) return undefined;
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? undefined : d;
};

const pad = (n: number) => String(n).padStart(2, '0');

/* ----------------------------- formatDate() ----------------------------- */
export const formatDate = (
  date: DateInput,
  format: DateFormats | string = DateFormats.DD_MMM_YYYY_WITH_SPACE,
): string | undefined => {
  const d = toDate(date);
  if (!d) return undefined;

  if (format === DateFormats.DD_MMM_YYYY_WITH_SPACE) {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
      .format(d)
      .replace(',', '');
  }

  const tokens: Record<string, string> = {
    YYYY: d.getFullYear().toString(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
  };

  return Object.entries(tokens).reduce(
    (acc, [token, value]) => acc.replaceAll(token, value),
    format,
  );
};

/* ----------------------------- formatRelativeTime() ----------------------------- */
export const formatRelativeTime = (date: DateInput, baseDate?: DateInput): string | undefined => {
  const d = toDate(date);
  const base = toDate(baseDate) ?? new Date();
  if (!d) return undefined;

  const diff = d.getTime() - base.getTime();
  const abs = Math.abs(diff);

  if (abs < 60000) return diff < 0 ? 'seconds ago' : 'in seconds';

  const minutes = Math.round(abs / 60000);
  if (minutes < 60) return diff < 0 ? `${minutes} minutes ago` : `in ${minutes} minutes`;

  const hours = Math.round(abs / 3600000);
  if (hours < 24) return diff < 0 ? `${hours} hours ago` : `in ${hours} hours`;

  const days = Math.round(abs / 86400000);
  return diff < 0 ? `${days} days ago` : `in ${days} days`;
};

/* ----------------------------- Validators ----------------------------- */
export const isValidDate = (date: DateInput): boolean => !!toDate(date);

export const isPast = (date: DateInput): boolean => {
  const d = toDate(date);
  return d ? d.getTime() < Date.now() : false;
};

export const isFuture = (date: DateInput): boolean => {
  const d = toDate(date);
  return d ? d.getTime() > Date.now() : false;
};

export const isToday = (date: DateInput): boolean => {
  const d = toDate(date);
  if (!d) return false;
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

export const isYesterday = (date: DateInput): boolean => {
  const d = toDate(date);
  if (!d) return false;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return d.toDateString() === y.toDateString();
};

export const isTomorrow = (date: DateInput): boolean => {
  const d = toDate(date);
  if (!d) return false;
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return d.toDateString() === t.toDateString();
};

export const isSameDay = (date1: DateInput, date2: DateInput): boolean => {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  return d1 && d2 ? d1.toDateString() === d2.toDateString() : false;
};

/* ----------------------------- Between ----------------------------- */
export const isBetweenDates = (
  date: DateInput,
  startDate: DateInput,
  endDate: DateInput,
): boolean => {
  const d = toDate(date);
  const s = toDate(startDate);
  const e = toDate(endDate);
  if (!d || !s || !e) return false;
  const t = d.getTime();
  return t >= s.getTime() && t <= e.getTime();
};

/* ----------------------------- Diff ----------------------------- */
export const getDateDifference = (
  date1: DateInput,
  date2: DateInput,
  unit: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' = 'day',
): number | undefined => {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return undefined;

  const diff = d1.getTime() - d2.getTime();

  switch (unit) {
    case 'millisecond':
      return diff;
    case 'second':
      return diff / 1000;
    case 'minute':
      return diff / 60000;
    case 'hour':
      return diff / 3600000;
    default:
      return diff / 86400000;
  }
};

/* ----------------------------- Add/Subtract ----------------------------- */
export const addToDate = (
  date: DateInput,
  amount: number,
  unit: 'day' | 'hour' | 'minute' | 'second' = 'day',
): Date | undefined => {
  const d = toDate(date);
  if (!d) return undefined;

  const copy = new Date(d);

  if (unit === 'second') copy.setSeconds(copy.getSeconds() + amount);
  else if (unit === 'minute') copy.setMinutes(copy.getMinutes() + amount);
  else if (unit === 'hour') copy.setHours(copy.getHours() + amount);
  else copy.setDate(copy.getDate() + amount);

  return copy;
};

export const subtractFromDate = (
  date: DateInput,
  amount: number,
  unit: 'day' | 'hour' | 'minute' | 'second' = 'day',
): Date | undefined => addToDate(date, -amount, unit);

/* ----------------------------- Start/End ----------------------------- */
export const startOf = (
  date: DateInput,
  unit: 'day' | 'month' | 'year' = 'day',
): Date | undefined => {
  const d = toDate(date);
  if (!d) return undefined;

  const copy = new Date(d);

  if (unit === 'day') copy.setHours(0, 0, 0, 0);
  else if (unit === 'month') {
    copy.setDate(1);
    copy.setHours(0, 0, 0, 0);
  } else if (unit === 'year') {
    copy.setMonth(0, 1);
    copy.setHours(0, 0, 0, 0);
  }

  return copy;
};

export const endOf = (
  date: DateInput,
  unit: 'day' | 'month' | 'year' = 'day',
): Date | undefined => {
  const d = toDate(date);
  if (!d) return undefined;

  const copy = new Date(d);

  if (unit === 'day') copy.setHours(23, 59, 59, 999);
  else if (unit === 'month') {
    copy.setMonth(copy.getMonth() + 1, 0);
    copy.setHours(23, 59, 59, 999);
  } else if (unit === 'year') {
    copy.setMonth(11, 31);
    copy.setHours(23, 59, 59, 999);
  }

  return copy;
};

/* ----------------------------- Range formatting ----------------------------- */
export const formatDateRange = (
  startDate: DateInput,
  endDate: DateInput,
  format: DateFormats | string = DateFormats.DD_MMM_YYYY_WITH_SPACE,
  separator: string = ' - ',
): string | undefined => {
  const s = formatDate(startDate, format);
  const e = formatDate(endDate, format);
  return s && e ? `${s}${separator}${e}` : undefined;
};

/* ----------------------------- Age ----------------------------- */
export const getAge = (birthdate: DateInput): number | undefined => {
  const d = toDate(birthdate);
  if (!d) return undefined;

  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();

  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;

  return age;
};

/* ----------------------------- parseDate ----------------------------- */
export const parseDate = (dateString: string, format: string): Date | undefined => {
  if (format === 'DD/MM/YYYY') {
    const [dd, mm, yyyy] = dateString.split('/').map(Number);
    return new Date(yyyy, mm - 1, dd);
  }
  return toDate(dateString);
};

/* ----------------------------- ISO & Unix ----------------------------- */
export const toISOString = (date: DateInput): string | undefined => {
  const d = toDate(date);
  return d?.toISOString();
};

export const toUnixTimestamp = (date: DateInput): number | undefined => {
  const d = toDate(date);
  return d ? Math.floor(d.getTime() / 1000) : undefined;
};

/* ----------------------------- now() ----------------------------- */
export const now = (): Date => new Date();

/* ----------------------------- compareDates() ----------------------------- */
export const compareDates = (date1: DateInput, date2: DateInput): -1 | 0 | 1 | undefined => {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return undefined;

  if (d1.getTime() < d2.getTime()) return -1;
  if (d1.getTime() > d2.getTime()) return 1;
  return 0;
};
