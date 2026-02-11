const isBrowserEnv = typeof window !== "undefined";

const getStorage = (type: "local" | "session"): Storage | null => {
  if (!isBrowserEnv) return null;
  try {
    const storage = type === "local" ? window.localStorage : window.sessionStorage;
    const testKey = "__storage_test__";
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
};

export const createStorage = (type: "local" | "session") => ({
  /** Save any value (auto JSON.stringified) */
  set: <T>(key: string, value: T): void => {
    const storage = getStorage(type);
    if (!storage) return;
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`[Storage] Failed to set "${key}":`, err);
    }
  },

  /** Get and parse value */
  get: <T>(key: string): T | null => {
    const storage = getStorage(type);
    if (!storage) return null;
    try {
      const item = storage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (err) {
      console.warn(`[Storage] Failed to parse "${key}":`, err);
      return null;
    }
  },

  /** Get with fallback default value */
  getOr: <T>(key: string, defaultValue: T): T => {
    const storage = getStorage(type);
    if (!storage) return defaultValue;
    const value = storage.getItem(key);
    if (value === null) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  },

  /** Remove a key */
  remove: (key: string): void => {
    const storage = getStorage(type);
    if (!storage) return;
    storage.removeItem(key);
  },

  /** Check if key exists */
  has: (key: string): boolean => {
    const storage = getStorage(type);
    if (!storage) return false;
    return storage.getItem(key) !== null;
  },

  /** Clear all data in this storage */
  clear: (): void => {
    const storage = getStorage(type);
    if (!storage) return;
    storage.clear();
  },

  /** Get all keys */
  keys: (): string[] => {
    const storage = getStorage(type);
    if (!storage) return [];
    return Object.keys(storage);
  },
});

export const local = createStorage("local");
export const session = createStorage("session");
