/**
 * Options for serializing a server-side ("Set-Cookie") cookie.
 * Framework-agnostic — works with any request/response abstraction
 * (Next.js Route Handlers, Pages Router `res`, Express, raw Node `http`, etc.).
 */
export interface ServerCookieOptions {
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number;
  expires?: number | string | Date;
}

/**
 * Parses a raw `Cookie` request header into a name/value map.
 * @param cookieHeader - Raw `Cookie` header value (e.g. `req.headers.cookie`)
 */
export const parseCookieHeader = (
  cookieHeader?: string | null
): Record<string, string> => {
  const cookies: Record<string, string> = {};

  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((pair) => {
    const separatorIndex = pair.indexOf("=");
    if (separatorIndex === -1) return;

    const rawName = pair.slice(0, separatorIndex).trim();
    const rawValue = pair.slice(separatorIndex + 1).trim();

    if (!rawName) return;

    try {
      cookies[decodeURIComponent(rawName)] = decodeURIComponent(rawValue);
    } catch {
      cookies[rawName] = rawValue;
    }
  });

  return cookies;
};

/**
 * Reads a single cookie value from a raw `Cookie` request header.
 * @param name - Cookie name
 * @param cookieHeader - Raw `Cookie` header value (e.g. `req.headers.cookie`)
 */
export const getServerCookie = (
  name: string,
  cookieHeader?: string | null
): string | null => {
  const cookies = parseCookieHeader(cookieHeader);
  return name in cookies ? cookies[name] : null;
};

/**
 * Builds a `Set-Cookie` header value. The caller is responsible for
 * attaching it to the response (e.g. `res.setHeader('Set-Cookie', value)`
 * or `next/headers` `cookies().set(...)`).
 * @param name - Cookie name
 * @param value - Cookie value
 * @param options - Cookie options (domain, path, expiry, etc.)
 */
export const serializeCookie = (
  name: string,
  value: string,
  options: ServerCookieOptions = {}
): string => {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}`;

  if (options.maxAge !== undefined) {
    cookieString += `; Max-Age=${Math.floor(options.maxAge)}`;
  }

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
      cookieString += `; Expires=${date.toUTCString()}`;
    }
  }

  cookieString += `; Path=${options.path ?? "/"}`;

  if (options.domain) {
    cookieString += `; Domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += `; Secure`;
  }

  if (options.httpOnly) {
    cookieString += `; HttpOnly`;
  }

  if (options.sameSite) {
    const sameSiteLabel =
      options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1);
    cookieString += `; SameSite=${sameSiteLabel}`;
  }

  return cookieString;
};

/**
 * Minimal cookie store shape most SSR frameworks already expose
 * (`next/headers` `cookies()`, `NextResponse.cookies`, SvelteKit's
 * `event.cookies`, etc.) — anything with this shape works.
 */
export interface ServerCookieStore {
  get(name: string): { value: string } | undefined;
  set(
    name: string,
    value: string,
    options?: Omit<ServerCookieOptions, "expires">
  ): void;
  delete(name: string): void;
}

/**
 * Wraps a server cookie store (from your framework's request/response) so
 * it can be called the same way as `CookieManager` — `.set`/`.get`/`.remove`
 * — instead of re-deriving the store's raw API at every call site.
 * @param cookieStore - e.g. `await cookies()` (Next.js App Router) or
 * `event.cookies` (SvelteKit)
 */
export const createServerCookieManager = (cookieStore: ServerCookieStore) => ({
  set: (
    name: string,
    value: string,
    options: Omit<ServerCookieOptions, "expires"> = {}
  ): void => {
    cookieStore.set(name, value, options);
  },

  get: (name: string): string | null => {
    return cookieStore.get(name)?.value ?? null;
  },

  remove: (name: string): void => {
    cookieStore.delete(name);
  },
});

/**
 * Default options for an authentication token cookie. Shaped to match
 * Next.js's native cookie APIs (`next/headers` `cookies().set()`,
 * `NextRequest`/`NextResponse.cookies.set()`) as well as `serializeCookie`,
 * so the same object can be spread into any of them.
 */
export const DEFAULT_AUTH_COOKIE_OPTIONS: Omit<ServerCookieOptions, "maxAge"> =
  {
    path: "/",
    secure: true,
    httpOnly: false,
    sameSite: "lax",
  };

/**
 * Default lifetime (in seconds) for an authentication token cookie — 7 days.
 */
export const DEFAULT_AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/**
 * Builds a consistent options object for an authentication token cookie,
 * so `secure`/`httpOnly`/`sameSite`/`maxAge` aren't re-typed (and drifted)
 * at every call site. Pass the result directly to `next/headers`
 * `cookies().set()`, `NextResponse.cookies.set()`, or `serializeCookie`.
 * @param maxAge - Cookie lifetime in seconds (defaults to 7 days)
 * @param overrides - Per-call overrides merged on top of the defaults
 */
export const createAuthCookieOptions = (
  maxAge: number = DEFAULT_AUTH_COOKIE_MAX_AGE,
  overrides: Partial<Omit<ServerCookieOptions, "expires">> = {}
): Omit<ServerCookieOptions, "expires"> => ({
  ...DEFAULT_AUTH_COOKIE_OPTIONS,
  maxAge,
  ...overrides,
});

/**
 * Builds a `Set-Cookie` header value that expires the cookie immediately.
 * @param name - Cookie name
 * @param options - Path/domain must match the cookie that was originally set
 */
export const removeServerCookie = (
  name: string,
  options: Pick<ServerCookieOptions, "path" | "domain"> = {}
): string => {
  return serializeCookie(name, "", {
    ...options,
    maxAge: 0,
    expires: new Date(0),
  });
};
