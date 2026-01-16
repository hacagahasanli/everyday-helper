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
export const CookieManager = {
  /**
   * Sets a cookie with optional settings.
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options (domain, path, expiry, etc.)
   */
  set: (
    name: string,
    value: string,
    options: CookieOptions = {
      domain: "",
      path: "/",
    }
  ): void => {
    if (typeof document === "undefined") return;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;

    if (options.expires) {
      let date: Date | null = null;

      if (typeof options.expires === "number") {
        date = new Date();
        date.setDate(date.getDate() + options.expires);
      } else if (
        typeof options.expires === "string" ||
        options.expires instanceof Date
      ) {
        date = new Date(options.expires);
      }

      if (date && !isNaN(date.getTime())) {
        cookieString += `; expires=${date.toUTCString()}`;
      }
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += `; secure`;
    }

    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  },

  /**
   * Retrieves the value of a cookie by name.
   * @param name - Cookie name
   * @returns The cookie value or null if not found
   */
  get: (name: string): string | null => {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie
        .trim()
        .split("=")
        .map(decodeURIComponent) as [string, string];

      if (cookieName === name) {
        return cookieValue;
      }
    }

    return null;
  },

  /**
   * Removes a cookie by setting its expiry date to the past.
   * @param name - Cookie name
   * @param options - Optional cookie options (domain, path)
   */
  remove: (
    name: string,
    options: CookieOptions = {
      domain: "",
      path: "/",
    }
  ): void => {
    if (typeof document === "undefined") return;

    const pastDate = new Date(0);
    let cookieString = `${encodeURIComponent(
      name
    )}=; expires=${pastDate.toUTCString()}`;

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    document.cookie = cookieString;
  },
};
