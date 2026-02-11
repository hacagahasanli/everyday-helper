import * as react from 'react';
import { ComponentType, EffectCallback, RefObject, DependencyList, CSSProperties } from 'react';

/** Defines the allowed types for class names input */
type ClassValue = string | undefined | null | boolean | {
    /** Object with keys as class names and values indicating inclusion */
    [key: string]: boolean | string | number;
};
/**
 * Utility function to conditionally combine class names into a single string.
 *
 * Accepts any number of arguments of various types:
 * - Strings: added directly
 * - Arrays: recursively flattened and processed
 * - Objects: keys included if their value is truthy
 * - Falsy values (undefined, null, false): ignored
 *
 * @param {...ClassValue[]} args - List of class names or structures
 * @returns {string} Combined class names separated by spaces
 *
 * Example:
 * classnames('btn', { active: isActive, disabled: isDisabled }, ['extra', ['nested']])
 *    returns 'btn active extra nested' if isActive is true and isDisabled is false
 */
declare function cn(...args: ClassValue[]): string;

/**
 * Options for setting cookies.
 */
interface CookieOptions {
    path?: string;
    domain?: string;
    secure?: boolean;
    expires?: number | string | Date;
    sameSite?: "Strict" | "Lax" | "None";
}
/**
 * Utility object for setting, getting, and removing cookies.
 */
declare const CookieManager: {
    /**
     * Sets a cookie with optional settings.
     * @param name - Cookie name
     * @param value - Cookie value
     * @param options - Cookie options (domain, path, expiry, etc.)
     */
    set: (name: string, value: string, options?: CookieOptions) => void;
    /**
     * Retrieves the value of a cookie by name.
     * @param name - Cookie name
     * @returns The cookie value or null if not found
     */
    get: (name: string) => string | null;
    /**
     * Removes a cookie by setting its expiry date to the past.
     * @param name - Cookie name
     * @param options - Optional cookie options (domain, path)
     */
    remove: (name: string, options?: CookieOptions) => void;
};

declare const createStorage: (type: "local" | "session") => {
    /** Save any value (auto JSON.stringified) */
    set: <T>(key: string, value: T) => void;
    /** Get and parse value, with optional default */
    get: <T>(key: string) => T | null;
    /** Get with fallback default value */
    getOr: <T>(key: string, defaultValue: T) => T;
    /** Remove a key */
    remove: (key: string) => void;
    /** Check if key exists */
    has: (key: string) => boolean;
    /** Clear all data in this storage */
    clear: () => void;
    /** Get all keys */
    keys: () => string[];
};
declare const local: {
    /** Save any value (auto JSON.stringified) */
    set: <T>(key: string, value: T) => void;
    /** Get and parse value, with optional default */
    get: <T>(key: string) => T | null;
    /** Get with fallback default value */
    getOr: <T>(key: string, defaultValue: T) => T;
    /** Remove a key */
    remove: (key: string) => void;
    /** Check if key exists */
    has: (key: string) => boolean;
    /** Clear all data in this storage */
    clear: () => void;
    /** Get all keys */
    keys: () => string[];
};
declare const session: {
    /** Save any value (auto JSON.stringified) */
    set: <T>(key: string, value: T) => void;
    /** Get and parse value, with optional default */
    get: <T>(key: string) => T | null;
    /** Get with fallback default value */
    getOr: <T>(key: string, defaultValue: T) => T;
    /** Remove a key */
    remove: (key: string) => void;
    /** Check if key exists */
    has: (key: string) => boolean;
    /** Clear all data in this storage */
    clear: () => void;
    /** Get all keys */
    keys: () => string[];
};

type FormDataValue = string | number | boolean | File | object | null | undefined;
interface FormDataOptions {
    skipNull?: boolean;
    skipUndefined?: boolean;
    skipEmptyStrings?: boolean;
}
declare class FormDataBuilder {
    private formData;
    private options;
    constructor(options?: FormDataOptions);
    /**
     * Add a single field to FormData
     */
    append(key: string, value: FormDataValue): this;
    /**
     * Add multiple fields from an object
     */
    appendFields(data: Record<string, FormDataValue>): this;
    appendArray(key: string, array: any[] | undefined | null): this;
    /**
     * Add a file field
     */
    appendFile(key: string, file: File | undefined): this;
    /**
     * Add an array or object as JSON string
     */
    appendJSON(key: string, value: object | undefined | null): this;
    /**
     * Build and return the FormData instance
     */
    build(): FormData;
    /**
     * Check if a value should be skipped based on options
     */
    private shouldSkip;
}
/**
 * Create a new FormData builder instance
 */
declare function createFormData(options?: FormDataOptions): FormDataBuilder;

interface LazyComponentMap {
    [key: string]: () => Promise<{
        default: ComponentType<any>;
    }>;
}
interface LazyComponents {
    [key: string]: ComponentType<any>;
}
interface LazyLoadOptions {
    retries?: number;
    delayMs?: number;
}
/**
 * Converts a map of import functions into lazy React components with retry on failure.
 *
 * @param componentMap - Map of component names to dynamic import functions
 * @param options - Optional retry settings (retries, delayMs)
 * @returns Map of component names to lazy React components
 */
declare const lazyLoad: (componentMap: LazyComponentMap, options?: LazyLoadOptions) => LazyComponents;

/**
 * Generate a unique ID
 * @param {number} size - Length of the ID (default: 21)
 * @returns {string} Random ID
 */
declare const tinyId: (size?: number) => string;
/**
 * Generate a unique ID
 * @param {number} size - Length of the ID (default: 21)
 * @returns {string} Random ID
 */
declare const timeId: (size?: number) => string;

interface PrintStyle {
    padding?: string;
    maxWidth?: string;
    maxHeight?: string;
    background?: string;
    fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}
declare const usePrint: () => {
    printInBlank: (src: string, style?: PrintStyle) => void;
    printInCurrent: (src: string, style?: PrintStyle) => void;
};

declare function useMount(effect: EffectCallback): void;

interface UsePortalOptions {
    id?: string;
}
declare const usePortal: ({ id }?: UsePortalOptions) => react.RefObject<HTMLElement | null>;

declare const useToggle: () => {
    isActive: boolean;
    onClose: () => void;
    onOpen: () => void;
    toggle: () => void;
};

declare function useUnmount(fn: () => void): void;

declare function useDebounce<T>(value: T, delay?: number): T;

declare function usePrevious<T>(value: T): T | undefined;

declare function useInterval(callback: () => void, delay: number | null): void;

interface UseEscapeKeyProps {
    enabled?: boolean;
    onEscape: () => void;
    preventDefault?: boolean;
}
declare const useEscapeKey: ({ onEscape, enabled, preventDefault, }: UseEscapeKeyProps) => void;

interface UseBodyScrollOptions {
    isLocked: boolean;
}
declare const useScrollLock: ({ isLocked }: UseBodyScrollOptions) => void;

declare function useMediaQuery(query: string, defaultValue?: boolean): boolean;

interface WindowSize {
    width: number;
    height: number;
}
declare function useWindowSize(): WindowSize;

declare const useDownloadFile: ({ errorMessage, }: {
    errorMessage: string;
}) => {
    downloadImage: (src: string, filename: string) => Promise<void>;
};

declare function useOnlineStatus(): boolean;

declare function useOutsideClick(ref: RefObject<HTMLElement | null>, onClickOutside?: () => void): void;

declare function useUpdateEffect(effect: EffectCallback, deps?: DependencyList): void;

declare function useEventListener<K extends keyof WindowEventMap>(event: K, handler: (event: WindowEventMap[K]) => void, element?: Window | Document): void;

declare const useResizeListener: (callback: () => void, active: boolean) => void;

declare function useKeyPress(targetKey: string): boolean;

declare const isBrowser: () => boolean;
declare const safeWindow: () => (Window & typeof globalThis) | undefined;

/**
 * Configuration for a shared feature endpoint.
 * Can be a string URL or an object mapping roles to URLs.
 */
interface SharedFeatureConfig {
    endpoint: string | Record<string, string | null>;
}
/**
 * Collection of shared features keyed by feature name.
 */
type SharedFeatures = Record<string, SharedFeatureConfig>;
/**
 * Returns the API endpoint URL for a given role and feature.
 * If the endpoint is an object, it looks up the URL for the role.
 * Returns null if the feature or role URL is not found.
 *
 * @param role - User role (e.g., 'admin', 'user')
 * @param feature - Feature key to look up
 * @param sharedFeatures - Object containing all shared features config
 */
declare function getEndpoint(role: string, feature: keyof SharedFeatures, sharedFeatures: SharedFeatures): string | null;
/**
 * Converts an object to a URL query string, excluding
 * keys with undefined, null, or empty string values.
 * Supports array values by adding multiple entries.
 *
 * @param query - Object representing query parameters
 * @returns URL-encoded query string
 */
declare const generateQuery: (query: Record<string, any>) => string;
/**
 * Checks if the user is logged in by verifying
 * the presence of an access token cookie.
 */
declare const isLoggedIn: (name: string) => boolean;

declare enum DateFormats {
    MMMM_DD_YYYY = "MMMM DD, YYYY",
    DD_MM_YYYY_WITH_DOT = "DD.MM.YYYY",
    DD_MM_YYYY_WITH_SLASH = "DD/MM/YYYY",
    YYYY_MM_DD_WITH_HYPEN = "YYYY-MM-DD",
    DD_MM_YYYY_WITH_HYPHEN = "DD-MM-YYYY",
    DD_MM_YYYY_HH_mm = "DD/MM/YYYY HH:mm",
    DD_MMM_YYYY_WITH_SPACE = "DD MMM YYYY"
}

type DateInput = Date | string | number | null | undefined;
declare const formatDate: (date: DateInput, format?: DateFormats | string) => string | undefined;
declare const formatRelativeTime: (date: DateInput, baseDate?: DateInput) => string | undefined;
declare const isValidDate: (date: DateInput) => boolean;
declare const isPast: (date: DateInput) => boolean;
declare const isFuture: (date: DateInput) => boolean;
declare const isToday: (date: DateInput) => boolean;
declare const isYesterday: (date: DateInput) => boolean;
declare const isTomorrow: (date: DateInput) => boolean;
declare const isSameDay: (date1: DateInput, date2: DateInput) => boolean;
declare const isBetweenDates: (date: DateInput, startDate: DateInput, endDate: DateInput) => boolean;
declare const getDateDifference: (date1: DateInput, date2: DateInput, unit?: "millisecond" | "second" | "minute" | "hour" | "day") => number | undefined;
declare const addToDate: (date: DateInput, amount: number, unit?: "day" | "hour" | "minute" | "second") => Date | undefined;
declare const subtractFromDate: (date: DateInput, amount: number, unit?: "day" | "hour" | "minute" | "second") => Date | undefined;
declare const startOf: (date: DateInput, unit?: "day" | "month" | "year") => Date | undefined;
declare const endOf: (date: DateInput, unit?: "day" | "month" | "year") => Date | undefined;
declare const formatDateRange: (startDate: DateInput, endDate: DateInput, format?: DateFormats | string, separator?: string) => string | undefined;
declare const getAge: (birthdate: DateInput) => number | undefined;
declare const parseDate: (dateString: string, format: string) => Date | undefined;
declare const toISOString: (date: DateInput) => string | undefined;
declare const toUnixTimestamp: (date: DateInput) => number | undefined;
declare const now: () => Date;
declare const compareDates: (date1: DateInput, date2: DateInput) => -1 | 0 | 1 | undefined;

/** Checks if a phone number already starts with Azerbaijan country code (+994 or 994) */
declare const hasAzerbaijanCountryCode: (phoneNumber: string | number) => boolean;
/** Adds Azerbaijan country code (+994) if it's missing */
declare const withAzerbaijanCountryCode: (phone: string | number) => string;
declare const normalizePhone: (phone: string | number) => string;

/**
 * Returns a new array with unique elements based on the specified key.
 * Keeps the first occurrence of each unique key value.
 *
 * @param arr - Array of objects
 * @param key - Key to determine uniqueness
 */
declare function uniqueBy<T, K extends keyof T>(arr: T[], key: K): T[];
/**
 * Groups array elements into an object, using the specified key's string value as group keys.
 *
 * @param arr - Array of objects
 * @param key - Key to group by
 */
declare function groupBy<T, K extends keyof T>(arr: T[], key: K): Record<string, T[]>;
/**
 * Splits an array into chunks of specified size.
 *
 * @param arr - Array to split
 * @param size - Chunk size
 */
declare function chunk<T>(arr: T[], size: number): T[][];
/**
 * Checks if two arrays are equal by comparing JSON stringified elements.
 * Optionally treats two empty arrays as equal.
 *
 * @param arr1 - First array
 * @param arr2 - Second array
 * @param treatEmptyAsEqual - If true, empty arrays are considered equal
 */
declare function checkArrEquality<T>(arr1: T[], arr2: T[], treatEmptyAsEqual?: boolean): boolean;
/**
 * Returns a new array which is the reverse of the input array.
 *
 * @param arr - Array to reverse
 */
declare function reverseArr<T>(arr: T[]): T[];
/**
 * Filters an array by rejecting elements that match the predicate.
 * This is the opposite of Array.filter().
 *
 * @param arr - Array to filter
 * @param predicate - Function that returns true for elements to reject
 * @returns New array with rejected elements removed
 */
declare function reject<T>(arr: T[], predicate: (x: T, i: number) => boolean): T[];
/**
 * Counts the number of elements in an array that match the predicate.
 * If no predicate is provided, returns the array length.
 *
 * @param arr - Array to count elements from
 * @param predicate - Optional function that returns true for elements to count
 * @returns Number of matching elements
 */
declare function count<T>(arr: T[], predicate?: (x: T, i: number) => boolean): number;
/**
 * Conditionally adds an element to an array based on a boolean or function condition.
 * Returns a new array without mutating the original.
 *
 * @param array - Original array
 * @param element - Element to add
 * @param condition - Boolean or function that returns boolean
 * @returns New array with element added if condition is true, otherwise original array
 */
declare function pushIf<T>(array: T[], element: T, condition: boolean | (() => boolean)): T[];
/**
 * Returns the first element of an array, or undefined if empty.
 *
 * @param arr - Array to get first element from
 * @returns First element or undefined
 */
declare function first<T>(arr: T[]): T | undefined;
/**
 * Returns the last element of an array, or undefined if empty.
 *
 * @param arr - Array to get last element from
 * @returns Last element or undefined
 */
declare function last<T>(arr: T[]): T | undefined;
/**
 * Returns a new array with only unique elements (primitive values).
 *
 * @param arr - Array to filter
 * @returns Array with unique elements
 */
declare function unique<T>(arr: T[]): T[];
/**
 * Flattens a nested array by one level.
 *
 * @param arr - Array to flatten
 * @returns Flattened array
 */
declare function flatten<T>(arr: T[][]): T[];
/**
 * Flattens a deeply nested array recursively.
 *
 * @param arr - Array to flatten deeply
 * @returns Deeply flattened array
 */
declare function flattenDeep(arr: any[]): any[];
/**
 * Returns a new array with all falsy values removed.
 * Falsy values: false, null, 0, "", undefined, NaN
 *
 * @param arr - Array to filter
 * @returns Array without falsy values
 */
declare function compactArr<T>(arr: T[]): NonNullable<T>[];
/**
 * Returns a random element from the array.
 *
 * @param arr - Array to pick from
 * @returns Random element or undefined if array is empty
 */
declare function sample<T>(arr: T[]): T | undefined;
/**
 * Returns n random elements from the array.
 *
 * @param arr - Array to pick from
 * @param n - Number of elements to pick
 * @returns Array of random elements
 */
declare function sampleSize<T>(arr: T[], n: number): T[];
/**
 * Shuffles an array randomly (Fisher-Yates algorithm).
 *
 * @param arr - Array to shuffle
 * @returns New shuffled array
 */
declare function shuffle<T>(arr: T[]): T[];
/**
 * Returns the difference between two arrays (elements in first array not in second).
 *
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns Elements in arr1 that are not in arr2
 */
declare function difference<T>(arr1: T[], arr2: T[]): T[];
/**
 * Returns the intersection of two arrays (elements present in both).
 *
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns Elements present in both arrays
 */
declare function intersection<T>(arr1: T[], arr2: T[]): T[];
/**
 * Returns the union of two arrays (all unique elements from both).
 *
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns Unique elements from both arrays
 */
declare function union<T>(arr1: T[], arr2: T[]): T[];
/**
 * Removes elements from an array based on values.
 *
 * @param arr - Array to filter
 * @param values - Values to remove
 * @returns New array without specified values
 */
declare function without<T>(arr: T[], ...values: T[]): T[];
/**
 * Zips multiple arrays into an array of tuples.
 *
 * @param arrays - Arrays to zip
 * @returns Array of tuples
 */
declare function zip<T>(...arrays: T[][]): T[][];
/**
 * Creates an object from an array of key-value pairs.
 *
 * @param pairs - Array of [key, value] pairs
 * @returns Object created from pairs
 */
declare function fromPairs<K extends string | number | symbol, V>(pairs: [K, V][]): Record<K, V>;
/**
 * Returns the sum of all numbers in an array.
 *
 * @param arr - Array of numbers
 * @returns Sum of all numbers
 */
declare function sum(arr: number[]): number;
/**
 * Returns the average of all numbers in an array.
 *
 * @param arr - Array of numbers
 * @returns Average of all numbers, or 0 if array is empty
 */
declare function average(arr: number[]): number;
/**
 * Returns the minimum value in an array.
 *
 * @param arr - Array of numbers
 * @returns Minimum value or undefined if array is empty
 */
declare function min(arr: number[]): number | undefined;
/**
 * Returns the maximum value in an array.
 *
 * @param arr - Array of numbers
 * @returns Maximum value or undefined if array is empty
 */
declare function max(arr: number[]): number | undefined;
/**
 * Partitions an array into two arrays based on a predicate.
 *
 * @param arr - Array to partition
 * @param predicate - Function that returns true for first partition
 * @returns Tuple of [matching, non-matching] arrays
 */
declare function partition<T>(arr: T[], predicate: (item: T, index: number) => boolean): [T[], T[]];
/**
 * Creates a shallow copy of an array.
 *
 * @param arr - Array to copy
 * @returns Shallow copy of the array
 */
declare function clone<T>(arr: T[]): T[];
/**
 * Returns a new array with elements sorted by a key or function.
 *
 * @param arr - Array to sort
 * @param keyOrFn - Key name or function to determine sort order
 * @param order - Sort order: 'asc' or 'desc'
 * @returns Sorted array
 */
declare function sortBy<T>(arr: T[], keyOrFn: keyof T | ((item: T) => number | string), order?: "asc" | "desc"): T[];

/**
 * Checks if a value is null or undefined.
 * @param v - Value to check
 * @returns true if null or undefined, else false
 */
declare function isNulOrUndefined(v: unknown): boolean;
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
declare function isEmpty(o: unknown): boolean;
/**
 * Checks if a value is NOT empty (opposite of isEmpty).
 * @param o - Value to check
 * @returns true if NOT empty, else false
 */
declare function isNotEmpty(o: unknown): boolean;
declare const getImageUrl: (id: string | number, baseUrl: string) => string;

/**
 * Creates a new object by selecting only specified keys from the input object.
 * @param obj - Source object
 * @param keys - Array of keys to pick
 * @returns New object with picked keys
 */
declare function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
/**
 * Creates a new object by removing specified keys from the input object.
 * @param obj - Source object
 * @param keys - Array of keys to omit
 * @returns New object without omitted keys
 */
declare function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
/**
 * Merges two objects into a new object.
 * Properties from the source override those in the target.
 * @param target - Target object
 * @param source - Source object
 * @returns Merged object
 */
declare function merge<T extends object, U extends object>(target: T, source: U): T & U;
/**
 * Removes keys from the object that have undefined, null,
 * empty string, or empty array values.
 * @param obj - Input object
 * @returns Partial object without empty values
 */
declare function cleanObject<T extends object>(obj: T): Partial<T>;
/**
 * Checks if all values in an object are "complete",
 * meaning not undefined, null, empty string, or empty array.
 * @param obj - Input object
 * @returns True if all values are complete, otherwise false
 */
declare function areAllValuesComplete<T extends object>(obj: T): boolean;
/**
 * Checks if a value is an object (not null or array).
 *
 * @param o - Value to check
 * @returns True if value is an object, false otherwise
 */
declare function isObject(o: unknown): boolean;
/**
 * Returns an array of the object's own property names.
 *
 * @param o - Object to get keys from
 * @returns Array of property names
 */
declare function keys<T extends object>(o: T): (keyof T)[];
/**
 * Returns an array of the object's own property values.
 *
 * @param o - Object to get values from
 * @returns Array of property values
 */
declare function values<T extends object>(o: T): T[keyof T][];
/**
 * Returns an array of key-value pairs for the object's own properties.
 *
 * @param o - Object to get entries from
 * @returns Array of [key, value] pairs
 */
declare function entries<T extends object>(o: T): [keyof T, T[keyof T]][];
/**
 * Deep clones an object using JSON serialization.
 * Note: This method doesn't preserve functions, undefined values, or circular references.
 *
 * @param obj - Object to clone
 * @returns Deep cloned object
 */
declare function deepClone<T>(obj: T): T;
/**
 * Deep merges two objects recursively.
 * Properties from source override those in target.
 *
 * @param target - Target object
 * @param source - Source object
 * @returns Deep merged object
 */
declare function deepMerge<T extends object, U extends object>(target: T, source: U): T & U;
/**
 * Checks if two objects are equal by deep comparison.
 *
 * @param obj1 - First object
 * @param obj2 - Second object
 * @returns True if objects are equal, false otherwise
 */
declare function isEqual(obj1: any, obj2: any): boolean;
/**
 * Gets a value from an object using a dot-notation path.
 *
 * @param obj - Source object
 * @param path - Dot-notation path (e.g., "user.address.city")
 * @param defaultValue - Default value if path doesn't exist
 * @returns Value at path or default value
 */
declare function get<T = any>(obj: any, path: string, defaultValue?: T): T | undefined;
/**
 * Sets a value in an object using a dot-notation path.
 * Creates nested objects as needed.
 *
 * @param obj - Target object
 * @param path - Dot-notation path (e.g., "user.address.city")
 * @param value - Value to set
 * @returns Modified object
 */
declare function set<T extends object>(obj: T, path: string, value: any): T;
/**
 * Checks if an object has a property at the specified path.
 *
 * @param obj - Source object
 * @param path - Dot-notation path (e.g., "user.address.city")
 * @returns True if property exists, false otherwise
 */
declare function has(obj: any, path: string): boolean;
/**
 * Inverts an object's keys and values.
 *
 * @param obj - Object to invert
 * @returns New object with keys and values swapped
 */
declare function invert<K extends string | number, V extends string | number>(obj: Record<K, V>): Record<V, K>;
/**
 * Maps over object values, transforming them with a function.
 *
 * @param obj - Source object
 * @param fn - Function to transform each value
 * @returns New object with transformed values
 */
declare function mapValues<T extends object, U>(obj: T, fn: (value: T[keyof T], key: keyof T) => U): Record<keyof T, U>;
/**
 * Maps over object keys, transforming them with a function.
 *
 * @param obj - Source object
 * @param fn - Function to transform each key
 * @returns New object with transformed keys
 */
declare function mapKeys<T extends object>(obj: T, fn: (key: keyof T, value: T[keyof T]) => string): Record<string, T[keyof T]>;
/**
 * Freezes an object deeply (recursive).
 *
 * @param obj - Object to freeze
 * @returns Deeply frozen object
 */
declare function deepFreeze<T extends object>(obj: T): Readonly<T>;
/**
 * Filters an object's properties based on a predicate function.
 *
 * @param obj - Source object
 * @param predicate - Function that returns true for properties to keep
 * @returns New object with filtered properties
 */
declare function filterObject<T extends object>(obj: T, predicate: (value: T[keyof T], key: keyof T) => boolean): Partial<T>;
/**
 * Unflattens a dot-notation object into a nested object.
 *
 * @param obj - Flattened object with dot-notation keys
 * @returns Nested object
 */
declare function unflatten(obj: Record<string, any>): Record<string, any>;

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
declare const isStringSimilar: (input: string, target?: string, maxDiffCount?: number) => boolean;
/**
 * Conditionally concatenates two strings.
 *
 * @param s1 - First string
 * @param s2 - Second string to concatenate if condition is true
 * @param condition - Whether to concatenate s2
 * @returns Concatenated string or just s1
 */
declare function concatIf(s1: string, s2: string, condition: boolean): string;
/**
 * Checks if a value is a string.
 *
 * @param v - Value to check
 * @returns True if value is a string, false otherwise
 */
declare function isString(v: unknown): boolean;
/**
 * Compares two strings for equality, ignoring case.
 *
 * @param s1 - First string
 * @param s2 - Second string
 * @returns True if strings are equal (case-insensitive), false otherwise
 */
declare function eqIgnoreCase(s1: string, s2: string): boolean;
/**
 * Checks if first string includes second string, ignoring case.
 *
 * @param s1 - String to search in
 * @param s2 - String to search for
 * @returns True if s1 includes s2 (case-insensitive), false otherwise
 */
declare function includesIgnoreCase(s1: string, s2: string): boolean;
/**
 * Conditionally adds an asterisk to the end of a string.
 *
 * @param s - Input string
 * @param condition - Whether to add asterisk (default: false)
 * @returns String with asterisk appended if condition is true
 */
declare function addAsteriskIf(s: string, condition?: boolean): string;
/**
 * Removes all whitespace from a string.
 *
 * @param s - Input string
 * @returns String with all whitespace removed
 */
declare const compactStr: (s: string) => string;
/**
 * Converts a string to UPPER_SNAKE_CASE format.
 *
 * @param str - Input string
 * @returns String in UPPER_SNAKE_CASE format
 */
declare const toUpperSnakeCase: (str: string) => string;
/**
 * Converts a string to lowercase snake_case format.
 *
 * @param str - Input string
 * @returns String in snake_case format
 */
declare const toSnakeCase: (str: string) => string;
/**
 * Converts a string to camelCase format.
 *
 * @param str - Input string
 * @returns String in camelCase format
 */
declare const toCamelCase: (str: string) => string;
/**
 * Converts a string to PascalCase format.
 *
 * @param str - Input string
 * @returns String in PascalCase format
 */
declare const toPascalCase: (str: string) => string;
/**
 * Converts a string to kebab-case format.
 *
 * @param str - Input string
 * @returns String in kebab-case format
 */
declare const toKebabCase: (str: string) => string;
/**
 * Capitalizes the first letter of a string.
 *
 * @param str - Input string
 * @returns String with first letter capitalized
 */
declare const capitalize: (str: string) => string;
/**
 * Capitalizes the first letter of each word in a string.
 *
 * @param str - Input string
 * @returns String with each word capitalized
 */
declare const capitalizeWords: (str: string) => string;
/**
 * Truncates a string to a specified length and adds ellipsis if needed.
 *
 * @param str - Input string
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: "...")
 * @returns Truncated string
 */
declare const truncate: (str: string, maxLength: number, suffix?: string) => string;
/**
 * Reverses a string.
 *
 * @param str - Input string
 * @returns Reversed string
 */
declare const reverse: (str: string) => string;
/**
 * Counts the occurrences of a substring in a string.
 *
 * @param str - String to search in
 * @param substr - Substring to count
 * @returns Number of occurrences
 */
declare const countOccurrences: (str: string, substr: string) => number;
/**
 * Removes leading and trailing whitespace and extra spaces between words.
 *
 * @param str - Input string
 * @returns String with normalized whitespace
 */
declare const normalizeWhitespace: (str: string) => string;
/**
 * Pads a string to a specified length from the start.
 *
 * @param str - Input string
 * @param length - Target length
 * @param char - Character to pad with (default: " ")
 * @returns Padded string
 */
declare const padStart: (str: string, length: number, char?: string) => string;
/**
 * Pads a string to a specified length from the end.
 *
 * @param str - Input string
 * @param length - Target length
 * @param char - Character to pad with (default: " ")
 * @returns Padded string
 */
declare const padEnd: (str: string, length: number, char?: string) => string;
/**
 * Removes specified characters from the beginning of a string.
 *
 * @param str - Input string
 * @param chars - Characters to remove (default: whitespace)
 * @returns String with characters trimmed from start
 */
declare const trimStart: (str: string, chars?: string) => string;
/**
 * Removes specified characters from the end of a string.
 *
 * @param str - Input string
 * @param chars - Characters to remove (default: whitespace)
 * @returns String with characters trimmed from end
 */
declare const trimEnd: (str: string, chars?: string) => string;
/**
 * Removes specified characters from both ends of a string.
 *
 * @param str - Input string
 * @param chars - Characters to remove (default: whitespace)
 * @returns String with characters trimmed from both ends
 */
declare const trim: (str: string, chars?: string) => string;
/**
 * Checks if a string starts with a specified substring (case-insensitive option).
 *
 * @param str - String to check
 * @param search - Substring to search for
 * @param ignoreCase - Whether to ignore case (default: false)
 * @returns True if string starts with search substring
 */
declare const startsWith: (str: string, search: string, ignoreCase?: boolean) => boolean;
/**
 * Checks if a string ends with a specified substring (case-insensitive option).
 *
 * @param str - String to check
 * @param search - Substring to search for
 * @param ignoreCase - Whether to ignore case (default: false)
 * @returns True if string ends with search substring
 */
declare const endsWith: (str: string, search: string, ignoreCase?: boolean) => boolean;
/**
 * Repeats a string n times.
 *
 * @param str - String to repeat
 * @param count - Number of times to repeat
 * @returns Repeated string
 */
declare const repeat: (str: string, count: number) => string;
/**
 * Slugifies a string (converts to URL-friendly format).
 *
 * @param str - Input string
 * @returns Slugified string
 */
declare const slugify: (str: string) => string;

/**
 * Converts a File or Blob object to a Base64-encoded data URL string.
 *
 * The resulting string will be in the format:
 * "data:[<mediatype>][;base64],<data>"
 *
 * @param file - The File or Blob object to convert
 * @returns A promise that resolves with the Base64 data URL string
 * @throws Will reject if an error occurs during reading (e.g. file system error)
 *
 * @example
 * ```ts
 * const base64 = await convertFileToBase64(selectedFile);
 * console.log(base64); // data:image/png;base64,iVBORw0KGgoAAA...
 * ```
 */
declare const convertFileToBase64: (file: File | Blob) => Promise<string>;
/**
 * Converts a Base64-encoded string (without the data URL prefix) back into a File object.
 *
 * Note: The input `base64` should be only the base64 part, NOT the full data URL.
 * If you have a full data URL (e.g. from convertFileToBase64), extract the base64 part first:
 * `base64String.split(',')[1]`
 *
 * @param base64 - Pure Base64-encoded string (without data: prefix)
 * @param fileName - Desired name for the resulting File
 * @param mimeType - MIME type of the file (e.g., "image/png", "application/pdf")
 * @returns A new File object reconstructed from the Base64 data
 *
 * @example
 * ```ts
 * const file = convertBase64ToFile(
 *   "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwACh...",
 *   "image.png",
 *   "image/png"
 * );
 *
 * // If you have a full data URL:
 * const dataUrl = "data:image/png;base64,iVBORw0KGgoAAA...";
 * const pureBase64 = dataUrl.split(',')[1];
 * const fileFromDataUrl = convertBase64ToFile(pureBase64, "image.png", "image/png");
 * ```
 */
declare function convertBase64ToFile(base64: string, fileName: string, mimeType: string): File;
/**
 * Extracts the pure Base64 string from a data URL (removes "data:...;base64," prefix)
 *
 * @param dataUrl - Full data URL string
 * @returns The base64-encoded part only
 */
declare const extractBase64FromDataUrl: (dataUrl: string) => string;
/** Convert File → Blob → ArrayBuffer */
declare const fileToArrayBuffer: (file: File | Blob) => Promise<ArrayBuffer>;

/**
 * No operation function - does nothing.
 */
declare const noop: () => void;
/**
 * Composes multiple functions into a single function,
 * where the output of each function is input to the previous.
 * The functions are applied right-to-left.
 *
 * @param fn1 - Last function to call
 * @param fns - Other functions to compose
 * @returns Composed function
 */
declare function compose<R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>): (a: R) => R;
/**
 * Creates a debounced version of a function that delays
 * invoking the function until after wait milliseconds have
 * elapsed since the last time it was invoked.
 *
 * @param func - Function to debounce
 * @param wait - Delay in milliseconds
 * @returns Debounced function with cancel method
 */
declare const debounce: <T extends (...args: any[]) => void>(func: T, wait: number) => ((...args: Parameters<T>) => void) & {
    cancel: () => void;
};
/**
 * Creates a throttled version of a function that only invokes
 * the function at most once per every wait milliseconds.
 *
 * @param func - Function to throttle
 * @param wait - Delay in milliseconds
 * @returns Throttled function with cancel method
 */
declare const throttle: <T extends (...args: any[]) => void>(func: T, wait: number) => ((...args: Parameters<T>) => void) & {
    cancel: () => void;
};
/**
 * Creates a memoized version of a function that caches the result
 * based on the arguments provided.
 *
 * @param func - Function to memoize
 * @param resolver - Optional function to generate cache key
 * @returns Memoized function with cache access
 */
declare const memoize: <T extends (...args: any[]) => any>(func: T, resolver?: (...args: Parameters<T>) => string) => T & {
    cache: Map<string, ReturnType<T>>;
};
/**
 * Creates a function that is restricted to invoking func once.
 * Repeat calls return the value from the first call.
 *
 * @param func - Function to restrict
 * @returns Function that can only be called once
 */
declare const once: <T extends (...args: any[]) => any>(func: T) => T;
/**
 * Delays the execution of a function by the specified number of milliseconds.
 *
 * @param func - Function to delay
 * @param wait - Delay in milliseconds
 * @param args - Arguments to pass to the function
 * @returns Timeout ID that can be used to cancel the delay
 */
declare const delay: <T extends (...args: any[]) => any>(func: T, wait: number, ...args: Parameters<T>) => ReturnType<typeof setTimeout>;
/**
 * Retries a function a specified number of times with a delay between attempts.
 *
 * @param func - Async function to retry
 * @param retries - Number of retry attempts (default: 3)
 * @param delayMs - Delay between retries in milliseconds (default: 1000)
 * @returns Promise that resolves with the function result or rejects after all retries
 */
declare const retry: <T extends (...args: any[]) => Promise<any>>(func: T, retries?: number, delayMs?: number) => Promise<Awaited<ReturnType<T>>>;
/**
 * Creates a curried version of a function.
 *
 * @param func - Function to curry
 * @returns Curried function
 */
declare const curry: <T extends (...args: any[]) => any>(func: T) => any;
/**
 * Creates a function that accepts arguments and invokes func with them,
 * but with the arguments reversed.
 *
 * @param func - Function to flip arguments
 * @returns Function with flipped arguments
 */
declare const flip: <T extends (...args: any[]) => any>(func: T) => ((...args: [...Parameters<T>]) => ReturnType<T>);
/**
 * Creates a function that invokes func with partials prepended to the arguments.
 *
 * @param func - Function to partially apply
 * @param partials - Arguments to prepend
 * @returns Partially applied function
 */
declare const partial: <T extends (...args: any[]) => any>(func: T, ...partials: any[]) => ((...args: any[]) => ReturnType<T>);
/**
 * Creates a function that negates the result of the predicate func.
 *
 * @param predicate - Predicate function to negate
 * @returns Negated predicate function
 */
declare const negate: <T extends (...args: any[]) => boolean>(predicate: T) => ((...args: Parameters<T>) => boolean);
/**
 * Safely calls a function if it exists, otherwise does nothing.
 *
 * @param func - Function to call (may be undefined or null)
 * @param args - Arguments to pass to the function
 * @returns Result of the function or undefined
 */
declare const safeCall: <T extends (...args: any[]) => any>(func: T | undefined | null, ...args: Parameters<T>) => ReturnType<T> | undefined;
/**
 * Wraps a function with try-catch and returns [error, result] tuple.
 * Useful for Go-style error handling in JavaScript/TypeScript.
 *
 * @param func - Function to wrap
 * @returns Function that returns [error, result] tuple
 */
declare const tryCatch: <T extends (...args: any[]) => any>(func: T) => ((...args: Parameters<T>) => [Error | null, ReturnType<T> | null]);
/**
 * Wraps an async function with try-catch and returns [error, result] tuple.
 * Useful for Go-style error handling with async operations.
 *
 * @param func - Async function to wrap
 * @returns Function that returns Promise of [error, result] tuple
 */
declare const tryCatchAsync: <T extends (...args: any[]) => Promise<any>>(func: T) => ((...args: Parameters<T>) => Promise<[Error | null, Awaited<ReturnType<T>> | null]>);
/**
 * Creates a function that limits the rate at which func can fire.
 * Calls are queued and executed one at a time with a minimum delay between them.
 *
 * @param func - Function to rate limit
 * @param minDelay - Minimum delay in milliseconds between calls
 * @returns Rate limited function
 */
declare const rateLimit: <T extends (...args: any[]) => any>(func: T, minDelay: number) => ((...args: Parameters<T>) => Promise<ReturnType<T>>);
/**
 * Identity function - returns the argument unchanged.
 *
 * @param value - Value to return
 * @returns The same value
 */
declare const identity: <T>(value: T) => T;
/**
 * Creates a function that always returns the same value.
 *
 * @param value - Value to return
 * @returns Function that returns the value
 */
declare const constant: <T>(value: T) => (() => T);
/**
 * Returns the first n elements of an array.
 * If n is 0 or undefined, returns array with first element.
 *
 * @param array - Array to get elements from
 * @param n - Number of elements to get from the beginning
 * @returns Array of first n elements or null if array is null/undefined
 */
declare function firstSeveral<T>(array: Array<T>, n?: number): T[] | null;
/**
 * Returns the last n elements of an array.
 * If n is 0 or undefined, returns array with last element.
 *
 * @param array - Array to get elements from
 * @param n - Number of elements to get from the end
 * @returns Array of last n elements or null if array is null/undefined
 */
declare function lastSeveral<T>(array: Array<T>, n?: number): T[] | null;

type AnimationType = 'fade-in' | 'slide-in-up' | 'slide-in-down' | 'slide-in-left' | 'slide-in-right' | 'scale-in' | 'bounce-in';
interface AnimationProps {
    /** Animation type */
    type: AnimationType;
    /** Order for staggered delay (0 = no delay) */
    order?: number;
    /** Custom delay in seconds (overrides order) */
    delay?: number;
    /** Extra CSS classes */
    className?: string;
    /** Extra inline styles */
    style?: CSSProperties;
}
/**
 * Universal animation props generator
 * CSS must be imported once: import 'hh-toolkit/animations.css'
 */
declare function animate({ type, order, delay, className, style }: AnimationProps): {
    className: string;
    style: CSSProperties;
};
declare const fadeIn: (order?: number, className?: string, style?: CSSProperties) => {
    className: string;
    style: CSSProperties;
};
declare const slideInUp: (order?: number, className?: string, style?: CSSProperties) => {
    className: string;
    style: CSSProperties;
};
declare const slideInDown: (order?: number, className?: string, style?: CSSProperties) => {
    className: string;
    style: CSSProperties;
};
declare const slideInLeft: (order?: number, className?: string, style?: CSSProperties) => {
    className: string;
    style: CSSProperties;
};
declare const slideInRight: (order?: number, className?: string, style?: CSSProperties) => {
    className: string;
    style: CSSProperties;
};
declare const scaleIn: (order?: number, className?: string, style?: CSSProperties) => {
    className: string;
    style: CSSProperties;
};
declare const bounceIn: (order?: number, className?: string, style?: CSSProperties) => {
    className: string;
    style: CSSProperties;
};

export { type ClassValue, CookieManager, DateFormats, type DateInput, FormDataBuilder, type PrintStyle, addAsteriskIf, addToDate, animate, areAllValuesComplete, average, bounceIn, capitalize, capitalizeWords, checkArrEquality, chunk, cleanObject, clone, cn, compactArr, compactStr, compareDates, compose, concatIf, constant, convertBase64ToFile, convertFileToBase64, count, countOccurrences, createFormData, createStorage, curry, debounce, deepClone, deepFreeze, deepMerge, delay, difference, endOf, endsWith, entries, eqIgnoreCase, extractBase64FromDataUrl, fadeIn, fileToArrayBuffer, filterObject, first, firstSeveral, flatten, flattenDeep, flip, formatDate, formatDateRange, formatRelativeTime, fromPairs, generateQuery, get, getAge, getDateDifference, getEndpoint, getImageUrl, groupBy, has, hasAzerbaijanCountryCode, identity, includesIgnoreCase, intersection, invert, isBetweenDates, isBrowser, isEmpty, isEqual, isFuture, isLoggedIn, isNotEmpty, isNulOrUndefined, isObject, isPast, isSameDay, isString, isStringSimilar, isToday, isTomorrow, isValidDate, isYesterday, keys, last, lastSeveral, lazyLoad, local, mapKeys, mapValues, max, memoize, merge, min, negate, noop, normalizePhone, normalizeWhitespace, now, omit, once, padEnd, padStart, parseDate, partial, partition, pick, pushIf, rateLimit, reject, repeat, retry, reverse, reverseArr, safeCall, safeWindow, sample, sampleSize, scaleIn, session, set, shuffle, slideInDown, slideInLeft, slideInRight, slideInUp, slugify, sortBy, startOf, startsWith, subtractFromDate, sum, throttle, timeId, tinyId, toCamelCase, toISOString, toKebabCase, toPascalCase, toSnakeCase, toUnixTimestamp, toUpperSnakeCase, trim, trimEnd, trimStart, truncate, tryCatch, tryCatchAsync, unflatten, union, unique, uniqueBy, useDebounce, useDownloadFile, useEscapeKey, useEventListener, useInterval, useKeyPress, useMediaQuery, useMount, useOnlineStatus, useOutsideClick, usePortal, usePrevious, usePrint, useResizeListener, useScrollLock, useToggle, useUnmount, useUpdateEffect, useWindowSize, values, withAzerbaijanCountryCode, without, zip };
