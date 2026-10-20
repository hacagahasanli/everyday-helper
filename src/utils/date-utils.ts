import { DateFormats } from '../constants/DateFormats';
import { DateLangLabels } from '../constants/DateLangLabels';
import { AZ_MONTHS, AZ_MONTHS_SHORT } from '../constants/AzMonths';

export type DateInput = Date | string | number | null | undefined;

export type FormatLang = "az" | "en" | "ru";

export type DaysFormatOrder = 'YMD' | 'DMY' | 'MDY';

export type PluralLabel = { one: string; other?: string; few?: string; many?: string };

export interface GenerateOrderedDateTextModel {
  lang?: FormatLang;
  order: DaysFormatOrder;
  date: {
    days: number;
    years: number;
    months: number;
  };
}

export interface DaysToYMDDaysOptionsModel {
  asText?: boolean;
  lang?: FormatLang;
  order?: DaysFormatOrder;
}

export interface DaysToYMDParams {
  endDate: DateInput;
  startDate: DateInput;
  options?: DaysToYMDDaysOptionsModel;
}

export interface ComputeAnchorParams {
  startDate: Date;
  totalMonths: number;
}

export interface DaysToYMDOutputModel {
  dayCount: number;
  yearCount: number;
  monthCount: number;
}

/* ----------------------------- Helper ----------------------------- */

const toDate = (date: DateInput): Date | undefined => {
  if (!date) return undefined;
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? undefined : d;
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Adds whole months to a date, clamping the day to the last day of the target month
 * (Jan 31 + 1 month → Feb 28, not Mar 3). Works on UTC calendar fields.
 *
 * @param params - `startDate` and the number of months to add (`totalMonths`)
 * @returns New date at UTC midnight
 *
 * @example
 * computeAnchor({ startDate: new Date(Date.UTC(2026, 0, 31)), totalMonths: 1 }); // 2026-02-28
 */
export const computeAnchor = ({ totalMonths, startDate }: ComputeAnchorParams): Date => {
  const anchorYear =
    startDate.getUTCFullYear() + Math.floor((startDate.getUTCMonth() + totalMonths) / 12);
  const anchorMonth = (startDate.getUTCMonth() + totalMonths) % 12;
  const daysInMonth = new Date(Date.UTC(anchorYear, anchorMonth + 1, 0)).getUTCDate();
  return new Date(Date.UTC(anchorYear, anchorMonth, Math.min(startDate.getUTCDate(), daysInMonth)));
}

/**
 * Builds a localized "years months days" text. Zero parts are skipped;
 * when every part is zero, "0 <day>" is returned.
 *
 * @param params - `order` (YMD, DMY, MDY), `lang` (default: "az") and the `date` parts
 * @returns e.g. "1 il 3 ay 9 gün"
 *
 * @example
 * generateOrderedDateText({ order: 'YMD', date: { years: 1, months: 3, days: 9 } }); // '1 il 3 ay 9 gün'
 * generateOrderedDateText({ order: 'DMY', lang: 'en', date: { years: 1, months: 0, days: 2 } }); // '2 days 1 year'
 */
export const generateOrderedDateText = ({
  order,
  lang = 'az',
  date,
}: GenerateOrderedDateTextModel): string => {
  let ordered: (string | null)[] = [];
  const { years, days, months } = date;

  const labels = getLabels(lang, years, months, days);

  const yearPart = years > 0 ? `${years} ${labels.year}` : null;
  const monthPart = months > 0 ? `${months} ${labels.month}` : null;
  const dayPart = days > 0 || (!yearPart && !monthPart) ? `${days} ${labels.day}` : null;

  switch (order) {
    case 'YMD':
      ordered = [yearPart, monthPart, dayPart];
      break;

    case 'DMY':
      ordered = [dayPart, monthPart, yearPart];
      break;

    case 'MDY':
      ordered = [monthPart, dayPart, yearPart];
      break;
  }

  return ordered.filter(Boolean).join(' ');
}


const pluralRulesCache = new Map<FormatLang, Intl.PluralRules>();

const pluralize = (lang: FormatLang, n: number, label: PluralLabel): string => {
  let rules = pluralRulesCache.get(lang);
  if (!rules) {
    rules = new Intl.PluralRules(lang);
    pluralRulesCache.set(lang, rules);
  }
  const category = rules.select(n) as keyof PluralLabel;
  return label[category] ?? label.one;
}

const getLabels = (lang: GenerateOrderedDateTextModel['lang'], years: number, months: number, days: number) => {
  switch (lang) {
    case 'az': {
      const azLabel = DateLangLabels.AZ;
      return { year: azLabel.year, month: azLabel.month, day: azLabel.day };
    }
    case 'en': {
      const enLabel = DateLangLabels.EN;
      return {
        day: pluralize(lang, days, enLabel.day),
        year: pluralize(lang, years, enLabel.year),
        month: pluralize(lang, months, enLabel.month),
      };
    }
    case 'ru': {
      const ruLabel = DateLangLabels.RU;
      return {
        day: pluralize(lang, days, ruLabel.day),
        year: pluralize(lang, years, ruLabel.year),
        month: pluralize(lang, months, ruLabel.month),
      };
    }
    default: {
      throw new Error(`Unsupported lang: ${lang}`);
    }
  }
}

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
    ss: pad(d.getSeconds()),
  };

  return Object.entries(tokens).reduce(
    (acc, [token, value]) => acc.replace(new RegExp(token, 'g'), value),
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
const PARSE_TOKEN_PATTERN = /YYYY|MM|DD|HH|mm|ss/g;

type ParseToken = 'YYYY' | 'MM' | 'DD' | 'HH' | 'mm' | 'ss';

const matchFormat = (value: string, format: string): Record<ParseToken, number> | undefined => {
  const tokenOrder: ParseToken[] = [];
  const pattern = format
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(PARSE_TOKEN_PATTERN, (token) => {
      tokenOrder.push(token as ParseToken);
      return token === 'YYYY' ? '(\\d{4})' : '(\\d{1,2})';
    });

  const match = new RegExp(`^${pattern}$`).exec(value.trim());
  if (!match) return undefined;

  const parts: Record<ParseToken, number> = { YYYY: 1970, MM: 1, DD: 1, HH: 0, mm: 0, ss: 0 };
  tokenOrder.forEach((token, index) => {
    parts[token] = Number(match[index + 1]);
  });

  return parts;
};

const toValidLocalDate = (parts: Record<ParseToken, number>): Date | undefined => {
  const date = new Date(parts.YYYY, parts.MM - 1, parts.DD, parts.HH, parts.mm, parts.ss);
  const isOverflow =
    date.getFullYear() !== parts.YYYY ||
    date.getMonth() !== parts.MM - 1 ||
    date.getDate() !== parts.DD ||
    date.getHours() !== parts.HH ||
    date.getMinutes() !== parts.mm;

  return isOverflow ? undefined : date;
};

const parseByFormat = (value: string, format: string): Date | undefined => {
  const parts = matchFormat(value, format);
  return parts && toValidLocalDate(parts);
};

/**
 * Parses a date string by format, in local time (tokens: YYYY, MM, DD, HH, mm, ss).
 * Date-only values never shift a day because of the time zone.
 * Falls back to the native parser only when the value does not match the format at all.
 *
 * @param dateString - Date string
 * @param format - Format of the input (default: "YYYY-MM-DD")
 * @returns Parsed date, or undefined when invalid (e.g. "2026-02-31")
 *
 * @example
 * parseDate('2026-10-05'); // 5 Oct 2026, 00:00 local
 * parseDate('05/10/2026 14:30', 'DD/MM/YYYY HH:mm'); // 5 Oct 2026, 14:30 local
 */
export const parseDate = (
  dateString: string,
  format: DateFormats | string = DateFormats.YYYY_MM_DD_WITH_HYPEN,
): Date | undefined => {
  const parts = matchFormat(dateString, format);
  return parts ? toValidLocalDate(parts) : toDate(dateString);
};

/**
 * Converts a date string from one format to another (tokens: YYYY, MM, DD, HH, mm, ss).
 *
 * @param value - Date string
 * @param fromFormat - Format of the input
 * @param toFormat - Format of the output
 * @returns Reformatted string, or undefined when the input does not match `fromFormat`
 *
 * @example
 * reformatDate('05-10-2026', 'DD-MM-YYYY', 'YYYY-MM-DD'); // '2026-10-05'
 * reformatDate('2026-10-05T14:30', 'YYYY-MM-DDTHH:mm', 'DD.MM.YYYY HH:mm'); // '05.10.2026 14:30'
 */
export const reformatDate = (
  value: string,
  fromFormat: DateFormats | string,
  toFormat: DateFormats | string,
): string | undefined => {
  const date = parseByFormat(value, fromFormat);
  return date ? formatDate(date, toFormat) : undefined;
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

/* ----------------------------- getDaysDiffAsText() ----------------------------- */

/**
 * Calculates the difference between two dates broken down into years, months, and days.
 *
 * By default returns a localized human-readable string (e.g. `"1 il 3 ay 9 gün"`).
 * Pass `options.asText: false` to receive a structured object instead.
 *
 * @param startDate - The earlier date. Accepts `Date`, ISO string, or Unix timestamp (ms).
 * @param endDate - The later date. Must be greater than or equal to `startDate`.
 * @param options - Optional formatting options.
 *   - `asText` (default `true`): if `true`, returns a formatted string; if `false`, returns `DaysToYMDOutputModel`.
 *   - `lang` (default `'az'`): output language — `'az'`, `'en'`, or `'ru'`.
 *   - `order` (default `'YMD'`): component order — `'YMD'`, `'DMY'`, or `'MDY'`.
 *
 * @returns A formatted string when `asText` is true, otherwise `{ yearCount, monthCount, dayCount }`.
 *
 * @throws {Error} If either `startDate` or `endDate` is invalid / unparseable.
 * @throws {Error} If `endDate` is earlier than `startDate`.
 *
 * @example
 * // Default usage — Azerbaijani text
 * getDaysDiffAsText({
 *   startDate: '2026-03-01',
 *   endDate: '2027-06-10',
 * });
 * // → "1 il 3 ay 9 gün"
 *
 * @example
 * // English output, day-month-year order
 * getDaysDiffAsText({
 *   startDate: new Date('2026-03-01'),
 *   endDate: new Date('2027-06-10'),
 *   options: { lang: 'en', order: 'DMY' },
 * });
 * // → "9 days 3 months 1 year"
 *
 * @example
 * // Structured output instead of string
 * getDaysDiffAsText({
 *   startDate: '2026-01-01',
 *   endDate: '2027-01-01',
 *   options: { asText: false },
 * });
 * // → { yearCount: 1, monthCount: 0, dayCount: 0 }
 */

export function getDaysDiffAsText({
  options, endDate, startDate,
}: DaysToYMDParams): DaysToYMDOutputModel | string {
  const { asText = true, lang = 'az', order = 'YMD' } = options ?? {};

  const startParsed = toDate(startDate);
  const endParsed = toDate(endDate);

  if (!startParsed || !endParsed) {
    throw new Error('Invalid date provided');
  }

  const start = new Date(Date.UTC(startParsed.getUTCFullYear(), startParsed.getUTCMonth(), startParsed.getUTCDate()));
  const end = new Date(Date.UTC(endParsed.getUTCFullYear(), endParsed.getUTCMonth(), endParsed.getUTCDate()));

  if (end < start) {
    throw new Error('endDate must be greater than startDate');
  }

  const diffYears = end.getUTCFullYear() - start.getUTCFullYear();
  const diffMonths = end.getUTCMonth() - start.getUTCMonth();
  let totalMonths = diffYears * 12 + diffMonths;

  let anchor = computeAnchor({ totalMonths, startDate: start });
  if (anchor > end) {
    totalMonths--;
    anchor = computeAnchor({ totalMonths, startDate: start });
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const days = Math.floor((end.getTime() - anchor.getTime()) / (1000 * 60 * 60 * 24));

  if (asText) {
    return generateOrderedDateText({
      order,
      lang,
      date: {
        days,
        years,
        months,
      },
    });
  }

  return {
    yearCount: years,
    monthCount: months,
    dayCount: days,
  };
}

/* ----------------------------- Local date helpers ----------------------------- */

/**
 * Any date value, including date-library objects (e.g. Dayjs, Moment)
 * that convert to a timestamp via `valueOf()`.
 */
export type DateLike = DateInput | { valueOf(): number };

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}/;
const ISO_DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const toLocalDate = (date: DateLike): Date | undefined => {
  if (date === null || date === undefined || date === '') return undefined;

  if (typeof date === 'string') {
    const match = ISO_DATE_ONLY_PATTERN.exec(date);
    if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  const d = date instanceof Date ? date : new Date(date.valueOf());
  return isNaN(d.getTime()) ? undefined : d;
};

const toDayTime = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/* ----------------------------- ISO date strings ----------------------------- */

/**
 * Checks whether a value is a string starting with an ISO date (`YYYY-MM-DD…`).
 *
 * @param value - Value to check
 * @returns True for strings like "2026-10-05" or "2026-10-05T14:30:00"
 */
export const isIsoDateString = (value: unknown): value is string =>
  typeof value === 'string' && ISO_DATE_PATTERN.test(value);

/**
 * Formats an ISO date string. Date-only values ("2026-10-05") are read as local dates,
 * so they never shift a day because of the time zone.
 *
 * @param value - Value to format
 * @param format - Output format (tokens: YYYY, MM, DD, HH, mm, ss)
 * @returns Formatted date, `null` for empty values, the value as a string when it is not
 *   an ISO date (e.g. "2015", "3 ay")
 *
 * @example
 * formatIsoDate('2026-10-05', 'DD-MM-YYYY'); // '05-10-2026'
 * formatIsoDate('2015', 'DD-MM-YYYY'); // '2015'
 */
export const formatIsoDate = (value: unknown, format: DateFormats | string): string | null => {
  if (value === null || value === undefined || value === '') return null;
  if (!isIsoDateString(value)) return String(value);

  const date = toLocalDate(value);

  return (date && formatDate(date, format)) ?? value;
};

/**
 * Formats a value only when it is an ISO date string, otherwise returns it unchanged.
 * Useful when looping over mixed values (lookups, history entries).
 *
 * @param value - Any value
 * @param format - Output format (tokens: YYYY, MM, DD, HH, mm, ss)
 * @returns Formatted date or the original value
 */
export const formatIfIsoDate = <T>(value: T, format: DateFormats | string): T | string =>
  isIsoDateString(value) ? (formatIsoDate(value, format) ?? value) : value;

/* ----------------------------- Azerbaijani date formatting ----------------------------- */

/**
 * Formats a date with the full Azerbaijani month name.
 *
 * @param value - Date value
 * @param fallback - Text returned for empty values (default: "—")
 * @returns e.g. "5 Oktyabr 2026"; the value as a string when it cannot be parsed
 */
export const formatAzDate = (value: DateLike, fallback: string = '—'): string => {
  if (value === null || value === undefined || value === '') return fallback;

  const date = toLocalDate(value);
  if (!date) return String(value);

  return `${date.getDate()} ${AZ_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Formats a date and time with the full Azerbaijani month name.
 *
 * @param value - Date value
 * @param fallback - Text returned for empty values (default: "—")
 * @returns e.g. "5 Oktyabr 2026, 14:30"; the value as a string when it cannot be parsed
 */
export const formatAzDateTime = (value: DateLike, fallback: string = '—'): string => {
  if (value === null || value === undefined || value === '') return fallback;

  const date = toLocalDate(value);
  if (!date) return String(value);

  return `${formatAzDate(date)}, ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * Formats a date with the short Azerbaijani month name and a zero-padded day.
 *
 * @param value - Date value
 * @param fallback - Text returned for empty values (default: "—")
 * @returns e.g. "05 Okt 2026"; the value as a string when it cannot be parsed
 */
export const formatAzDateShort = (value: DateLike, fallback: string = '—'): string => {
  if (value === null || value === undefined || value === '') return fallback;

  const date = toLocalDate(value);
  if (!date) return String(value);

  return `${pad(date.getDate())} ${AZ_MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
};

/* ----------------------------- combineDateAndTime() ----------------------------- */

/**
 * Takes the calendar day from one value and the hours/minutes from another (local time).
 * Seconds and milliseconds are reset to zero.
 *
 * @param date - Value providing the day
 * @param time - Value providing hours and minutes
 * @param format - Output format (default: "YYYY-MM-DDTHH:mm:ss")
 * @returns Combined, formatted date-time, or `''` when either value is missing/invalid
 *
 * @example
 * combineDateAndTime('2026-10-05', '2026-01-01T14:30:00'); // '2026-10-05T14:30:00'
 */
export const combineDateAndTime = (
  date: DateLike,
  time: DateLike,
  format: DateFormats | string = 'YYYY-MM-DDTHH:mm:ss',
): string => {
  const day = toLocalDate(date);
  const clock = toLocalDate(time);
  if (!day || !clock) return '';

  const combined = new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    clock.getHours(),
    clock.getMinutes(),
  );

  return formatDate(combined, format) ?? '';
};

/* ----------------------------- Day comparisons ----------------------------- */

/**
 * Checks whether a date falls on a day before today (time of day is ignored).
 *
 * @param date - Date value
 * @returns True for yesterday or earlier
 */
export const isBeforeToday = (date: DateLike): boolean => {
  const d = toLocalDate(date);
  return d ? toDayTime(d) < toDayTime(new Date()) : false;
};

/**
 * Checks whether a date falls on a day after today (time of day is ignored).
 * Can be passed directly as a date picker's `disabledDate`.
 *
 * @param date - Date value
 * @returns True for tomorrow or later
 */
export const isAfterToday = (date: DateLike): boolean => {
  const d = toLocalDate(date);
  return d ? toDayTime(d) > toDayTime(new Date()) : false;
};

/* ----------------------------- Date picker predicates ----------------------------- */

/**
 * Creates a predicate that disables days before a reference day.
 * Nothing is disabled when the reference is empty.
 *
 * @param referenceDate - First selectable day
 * @returns `(date) => boolean`, usable as a date picker's `disabledDate`
 */
export const disabledBeforeDay =
  (referenceDate?: DateLike) =>
  (date: DateLike): boolean => {
    const reference = toLocalDate(referenceDate);
    const d = toLocalDate(date);
    return !!reference && !!d && toDayTime(d) < toDayTime(reference);
  };

/**
 * Creates a predicate that disables the reference day and every day before it.
 * Nothing is disabled when the reference is empty.
 *
 * @param referenceDate - Last disabled day
 * @returns `(date) => boolean`, usable as a date picker's `disabledDate`
 */
export const disabledOnOrBeforeDay =
  (referenceDate?: DateLike) =>
  (date: DateLike): boolean => {
    const reference = toLocalDate(referenceDate);
    const d = toLocalDate(date);
    return !!reference && !!d && toDayTime(d) <= toDayTime(reference);
  };

export interface DisabledOutsideRangeParams {
  min?: DateLike;
  max?: DateLike;
}

/**
 * Creates a predicate that disables days outside `[min, max]` (both inclusive).
 * An empty bound is ignored.
 *
 * @param params - `min` and `max` selectable days
 * @returns `(date) => boolean`, usable as a date picker's `disabledDate`
 *
 * @example
 * // only today up to the end date
 * disabledOutsideRange({ min: new Date(), max: endDate });
 */
export const disabledOutsideRange =
  ({ min, max }: DisabledOutsideRangeParams) =>
  (date: DateLike): boolean => {
    const d = toLocalDate(date);
    if (!d) return false;

    const minDate = toLocalDate(min);
    const maxDate = toLocalDate(max);
    const day = toDayTime(d);

    return (!!minDate && day < toDayTime(minDate)) || (!!maxDate && day > toDayTime(maxDate));
  };

export interface DisabledTimeConfig {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
}

const rangeFromZero = (length: number): number[] => Array.from({ length }, (_, i) => i);

/**
 * Creates a time picker `disabledTime` callback that disables past hours and minutes
 * when the selected day is today. Other days are fully selectable.
 *
 * @param selectedDate - Currently selected day
 * @returns Function returning `{ disabledHours, disabledMinutes }`, or `{}` for other days
 */
export const getDisabledPastTime = (selectedDate?: DateLike) => (): DisabledTimeConfig => {
  const selected = toLocalDate(selectedDate);
  const current = new Date();

  if (!selected || toDayTime(selected) !== toDayTime(current)) return {};

  const currentHour = current.getHours();
  const currentMinute = current.getMinutes();

  return {
    disabledHours: () => rangeFromZero(currentHour),
    disabledMinutes: (selectedHour: number) =>
      selectedHour === currentHour ? rangeFromZero(currentMinute) : [],
  };
};
