// src/lib/cn.ts
function cn(...args) {
  return args.flatMap((arg) => {
    if (!arg) return [];
    if (typeof arg === "string") return [arg];
    if (Array.isArray(arg)) return cn(...arg);
    if (typeof arg === "object") {
      return Object.keys(arg).filter((key) => Boolean(arg[key]));
    }
    return [];
  }).join(" ");
}

// src/lib/cookie.ts
var CookieManager = {
  /**
   * Sets a cookie with optional settings.
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options (domain, path, expiry, etc.)
   */
  set: (name, value, options = {
    domain: "",
    path: "/"
  }) => {
    if (typeof document === "undefined") return;
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;
    if (options.expires) {
      let date = null;
      if (typeof options.expires === "number") {
        date = /* @__PURE__ */ new Date();
        date.setDate(date.getDate() + options.expires);
      } else if (typeof options.expires === "string" || options.expires instanceof Date) {
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
  get: (name) => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=").map(decodeURIComponent);
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
  remove: (name, options = {
    domain: "",
    path: "/"
  }) => {
    if (typeof document === "undefined") return;
    const pastDate = /* @__PURE__ */ new Date(0);
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
  }
};

// src/lib/storage.ts
var createStorage = (storage) => ({
  /** Save any value (auto JSON.stringified) */
  set: (key, value) => {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`[Storage] Failed to set "${key}":`, err);
    }
  },
  /** Get and parse value, with optional default */
  get: (key) => {
    try {
      const item = storage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item);
    } catch (err) {
      console.warn(`[Storage] Failed to parse "${key}":`, err);
      return null;
    }
  },
  /** Get with fallback default value */
  getOr: (key, defaultValue) => {
    const value = storage.getItem(key);
    if (value === null) return defaultValue;
    try {
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  },
  /** Remove a key */
  remove: (key) => {
    storage.removeItem(key);
  },
  /** Check if key exists */
  has: (key) => {
    return storage.getItem(key) !== null;
  },
  /** Clear all data in this storage */
  clear: () => {
    storage.clear();
  },
  /** Get all keys */
  keys: () => {
    return Object.keys(storage);
  }
});
var local = createStorage(localStorage);
var session = createStorage(sessionStorage);

// src/lib/form-data.ts
var FormDataBuilder = class {
  constructor(options) {
    this.formData = new FormData();
    this.options = {
      skipNull: false,
      skipUndefined: true,
      skipEmptyStrings: false,
      ...options
    };
  }
  /**
   * Add a single field to FormData
   */
  append(key, value) {
    if (this.shouldSkip(value)) {
      return this;
    }
    if (value instanceof File) {
      this.formData.append(key, value);
    } else if (typeof value === "object" && value !== null) {
      this.formData.append(key, JSON.stringify(value));
    } else if (typeof value === "boolean" || typeof value === "number") {
      this.formData.append(key, value.toString());
    } else if (typeof value === "string") {
      this.formData.append(key, value);
    }
    return this;
  }
  /**
   * Add multiple fields from an object
   */
  appendFields(data) {
    Object.entries(data).forEach(([key, value]) => {
      this.append(key, value);
    });
    return this;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appendArray(key, array) {
    if (!array || !Array.isArray(array)) return this;
    array.forEach((item, index) => {
      if (item && typeof item === "object") {
        Object.entries(item).forEach(([nestedKey, value]) => {
          const fullKey = `${key}[${index}].${nestedKey}`;
          this.append(fullKey, value);
        });
      }
    });
    return this;
  }
  /**
   * Add a file field
   */
  appendFile(key, file) {
    if (file) {
      this.formData.append(key, file);
    }
    return this;
  }
  /**
   * Add an array or object as JSON string
   */
  appendJSON(key, value) {
    if (this.shouldSkip(value)) {
      return this;
    }
    if (value && typeof value === "object") {
      this.formData.append(key, JSON.stringify(value));
    }
    return this;
  }
  /**
   * Build and return the FormData instance
   */
  build() {
    return this.formData;
  }
  /**
   * Check if a value should be skipped based on options
   */
  shouldSkip(value) {
    if (value === void 0 && this.options.skipUndefined) {
      return true;
    } else if (value === null && this.options.skipNull) {
      return true;
    } else if (value === "" && this.options.skipEmptyStrings) {
      return true;
    } else {
      return false;
    }
  }
};
function createFormData(options) {
  return new FormDataBuilder(options);
}

// src/lib/lazy-load.ts
import { lazy } from "react";
function retryImport(importFn, retries, delayMs) {
  return new Promise((resolve, reject2) => {
    const attempt = (n) => {
      importFn().then(resolve).catch((error) => {
        if (n === 0) reject2(error);
        else setTimeout(() => attempt(n - 1), delayMs);
      });
    };
    attempt(retries);
  });
}
var lazyLoad = (componentMap, options = {}) => {
  const { retries = 2, delayMs = 250 } = options;
  const lazyComponents = {};
  for (const [name, importFn] of Object.entries(componentMap)) {
    lazyComponents[name] = lazy(() => retryImport(importFn, retries, delayMs));
  }
  return lazyComponents;
};

// src/lib/tinyId.ts
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
var tinyId = (size = 21) => {
  let id = "";
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i] & 63];
  }
  return id;
};
var timeId = (size = 16) => {
  const timestamp = Date.now().toString(36);
  const randomPart = tinyId(size - timestamp.length);
  return timestamp + randomPart;
};

// src/hooks/usePrint.ts
import { useCallback } from "react";
var DEFAULT_STYLE = {
  padding: "20px",
  fit: "contain",
  maxWidth: "100%",
  maxHeight: "100%",
  background: "#fff"
};
var DEFAULT_CONFIG = {
  ...DEFAULT_STYLE,
  printDelay: 150,
  cleanupDelay: 1e4
};
var usePrint = () => {
  const createPrintHTML = (src, style = {}) => {
    const { padding, fit, maxWidth, maxHeight, background } = { ...DEFAULT_STYLE, ...style };
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body {
              width: 100%;
              height: 100%;
              background: ${background};
              display: flex;
              align-items: center;
              justify-content: center;
              padding: ${padding};
            }
            img {
              max-width: ${maxWidth};
              max-height: ${maxHeight};
              object-fit: ${fit};
            }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <img src="${src}" alt="Print document">
        </body>
      </html>
    `;
  };
  const printInBlank = useCallback((src, style = {}) => {
    const windowRef = window.open("", "_blank", "width=800,height=600");
    if (!windowRef) {
      return alert("P\u0259nc\u0259r\u0259 bloklan\u0131b. \xC7ap \xFC\xE7\xFCn pop-uplara icaz\u0259 verin.");
    }
    const html = createPrintHTML(src, style);
    const { printDelay = DEFAULT_CONFIG.printDelay } = style;
    windowRef.document.write(html);
    windowRef.document.close();
    windowRef.document.querySelector("img")?.addEventListener("load", () => {
      setTimeout(() => {
        windowRef.print();
        windowRef.close();
      }, printDelay);
    });
  }, []);
  const printInCurrent = useCallback((src, style = {}) => {
    const iframe = document.createElement("iframe");
    Object.assign(iframe.style, {
      position: "fixed",
      right: "0",
      bottom: "0",
      width: "0",
      height: "0",
      border: "0",
      opacity: "0",
      pointerEvents: "none"
    });
    document.body.appendChild(iframe);
    const html = createPrintHTML(src, style);
    const { printDelay = DEFAULT_CONFIG.printDelay, cleanupDelay = DEFAULT_CONFIG.cleanupDelay } = style;
    const iframeDoc = iframe.contentDocument;
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
    const cleanup = () => {
      iframe.contentWindow?.removeEventListener("afterprint", cleanup);
      iframe.remove();
    };
    iframe.contentWindow?.addEventListener("afterprint", cleanup);
    iframe.contentWindow?.addEventListener("load", () => {
      setTimeout(() => {
        iframe.contentWindow?.print();
      }, printDelay);
    });
    setTimeout(cleanup, cleanupDelay);
  }, []);
  return { printInBlank, printInCurrent };
};

// src/hooks/useMount.ts
import { useEffect } from "react";
function useMount(effect) {
  useEffect(() => {
    return effect();
  }, []);
}

// src/hooks/usePortal.ts
import { useEffect as useEffect2, useRef } from "react";
var usePortal = ({ id } = {}) => {
  const rootRef = useRef(null);
  useEffect2(() => {
    let parentElement = null;
    if (id) {
      parentElement = document.getElementById(id);
    }
    const container = document.createElement("div");
    rootRef.current = container;
    if (parentElement) {
      parentElement.appendChild(container);
    } else {
      document.body.appendChild(container);
    }
    return () => {
      container.remove();
    };
  }, [id]);
  return rootRef;
};

// src/hooks/useToggle.ts
import { useState } from "react";
var useToggle = () => {
  const [isActive, setIsActive] = useState(false);
  const toggle = () => setIsActive((prev) => !prev);
  const onClose = () => setIsActive(false);
  const onOpen = () => setIsActive(true);
  return { isActive, onClose, onOpen, toggle };
};

// src/hooks/useUnmount.ts
import { useEffect as useEffect3, useRef as useRef2 } from "react";
function useUnmount(fn) {
  const fnRef = useRef2(fn);
  fnRef.current = fn;
  useEffect3(
    () => () => {
      fnRef.current();
    },
    []
  );
}

// src/hooks/useDebounce.ts
import { useEffect as useEffect4, useState as useState2 } from "react";
function useDebounce(value, delay2 = 500) {
  const [debouncedValue, setDebouncedValue] = useState2(value);
  useEffect4(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay2);
    return () => clearTimeout(timer);
  }, [value, delay2]);
  return debouncedValue;
}

// src/hooks/usePrevious.ts
import { useEffect as useEffect5, useRef as useRef3 } from "react";
function usePrevious(value) {
  const ref = useRef3(void 0);
  useEffect5(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// src/hooks/useInterval.ts
import { useEffect as useEffect6, useRef as useRef4 } from "react";
function useInterval(callback, delay2) {
  const savedCallback = useRef4(callback);
  useEffect6(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect6(() => {
    if (delay2 === null) {
      return;
    }
    const id = setInterval(() => savedCallback.current(), delay2);
    return () => clearInterval(id);
  }, [delay2]);
}

// src/hooks/useEscapeKey.ts
import { useCallback as useCallback2 } from "react";

// src/constants/EventTypes.ts
var EventTypes = /* @__PURE__ */ ((EventTypes2) => {
  EventTypes2["IDLE"] = "idle";
  EventTypes2["CLICK"] = "click";
  EventTypes2["MOUSE_UP"] = "mouseup";
  EventTypes2["DBLCLICK"] = "dblclick";
  EventTypes2["MOUSE_OUT"] = "mouseout";
  EventTypes2["MOUSE_DOWN"] = "mousedown";
  EventTypes2["MOUSE_MOVE"] = "mousemove";
  EventTypes2["MOUSE_OVER"] = "mouseover";
  EventTypes2["MOUSE_ENTER"] = "mouseenter";
  EventTypes2["MOUSE_LEAVE"] = "mouseleave";
  EventTypes2["CONTEXT_MENU"] = "contextmenu";
  EventTypes2["KEY_UP"] = "keyup";
  EventTypes2["ESCAPE"] = "Escape";
  EventTypes2["KEY_DOWN"] = "keydown";
  EventTypes2["KEY_PRESS"] = "keypress";
  EventTypes2["ARROW_LEFT"] = "ArrowLeft";
  EventTypes2["ARROW_RIGHT"] = "ArrowRight";
  EventTypes2["BLUR"] = "blur";
  EventTypes2["INPUT"] = "input";
  EventTypes2["RESET"] = "reset";
  EventTypes2["FOCUS"] = "focus";
  EventTypes2["CHANGE"] = "change";
  EventTypes2["SUBMIT"] = "submit";
  EventTypes2["TOUCH_END"] = "touchend";
  EventTypes2["TOUCH_MOVE"] = "touchmove";
  EventTypes2["TOUCH_START"] = "touchstart";
  EventTypes2["TOUCH_CANCEL"] = "touchcancel";
  EventTypes2["POINTER_UP"] = "pointerup";
  EventTypes2["POINTER_OUT"] = "pointerout";
  EventTypes2["POINTER_DOWN"] = "pointerdown";
  EventTypes2["POINTER_MOVE"] = "pointermove";
  EventTypes2["POINTER_OVER"] = "pointerover";
  EventTypes2["POINTER_ENTER"] = "pointerenter";
  EventTypes2["POINTER_LEAVE"] = "pointerleave";
  EventTypes2["POINTER_CANCEL"] = "pointercancel";
  EventTypes2["DRAG"] = "drag";
  EventTypes2["DROP"] = "drop";
  EventTypes2["DRAG_END"] = "dragend";
  EventTypes2["DRAG_OVER"] = "dragover";
  EventTypes2["DRAG_START"] = "dragstart";
  EventTypes2["DRAG_ENTER"] = "dragenter";
  EventTypes2["DRAG_LEAVE"] = "dragleave";
  EventTypes2["CUT"] = "cut";
  EventTypes2["COPY"] = "copy";
  EventTypes2["PASTE"] = "paste";
  EventTypes2["PLAY"] = "play";
  EventTypes2["PAUSE"] = "pause";
  EventTypes2["ENDED"] = "ended";
  EventTypes2["TIME_UPDATE"] = "timeupdate";
  EventTypes2["VOLUME_CHANGE"] = "volumechange";
  EventTypes2["LOADED_METADATA"] = "loadedmetadata";
  EventTypes2["FOCUS_IN"] = "focusin";
  EventTypes2["FOCUS_OUT"] = "focusout";
  EventTypes2["VISIBILITY_CHANGE"] = "visibilitychange";
  EventTypes2["WHEEL"] = "wheel";
  EventTypes2["SCROLL"] = "scroll";
  EventTypes2["LOAD"] = "load";
  EventTypes2["ERROR"] = "error";
  EventTypes2["RESIZE"] = "resize";
  EventTypes2["UNLOAD"] = "unload";
  EventTypes2["ONLINE"] = "online";
  EventTypes2["OFFLINE"] = "offline";
  EventTypes2["BEFORE_UNLOAD"] = "beforeunload";
  return EventTypes2;
})(EventTypes || {});
var EventTypes_default = EventTypes;

// src/hooks/useEventListener.ts
import { useEffect as useEffect7 } from "react";
function useEventListener(event, handler, element = window) {
  useEffect7(() => {
    element.addEventListener(event, handler);
    return () => element.removeEventListener(event, handler);
  }, [event, handler, element]);
}

// src/hooks/useEscapeKey.ts
var useEscapeKey = ({
  onEscape,
  enabled = true,
  preventDefault = false
}) => {
  const handler = useCallback2(
    (event) => {
      if (!enabled) return;
      if (event.key === EventTypes_default.ESCAPE) {
        if (preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }
        onEscape();
      }
    },
    [enabled, onEscape, preventDefault]
  );
  useEventListener("keydown", handler, document);
};

// src/hooks/useScrollLock.ts
import { useEffect as useEffect8 } from "react";
var useScrollLock = ({ isLocked }) => {
  useEffect8(() => {
    if (isLocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLocked]);
};

// src/hooks/useMediaQuery.ts
import { useState as useState3, useEffect as useEffect9 } from "react";

// src/utils/browser.ts
var isBrowser = () => typeof window !== "undefined";
var safeWindow = () => isBrowser() ? window : void 0;

// src/hooks/useMediaQuery.ts
function useMediaQuery(query, defaultValue = false) {
  const [matches, setMatches] = useState3(() => {
    if (isBrowser()) {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  });
  useEffect9(() => {
    if (isBrowser()) {
      return;
    }
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handleChange = (event) => {
      setMatches(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);
  return matches;
}

// src/hooks/useWindowSize.ts
import { useState as useState4, useEffect as useEffect10 } from "react";
function useWindowSize() {
  const [windowSize, setWindowSize] = useState4({
    width: isBrowser() ? window.innerWidth : 0,
    height: isBrowser() ? window.innerHeight : 0
  });
  useEffect10(() => {
    if (isBrowser()) return;
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return windowSize;
}

// src/hooks/useAppLocation.ts
import { useLocation } from "react-router-dom";
var useAppLocation = () => {
  const location = useLocation();
  const { pathname, hash, search } = location ?? {};
  const isActive = (path) => pathname === path;
  const includes = (segment) => pathname.includes(segment);
  const startsWith2 = (prefix) => pathname.startsWith(prefix);
  return {
    hash,
    search,
    isActive,
    includes,
    pathname,
    startsWith: startsWith2
  };
};

// src/hooks/useDownloadFile.ts
var useDownloadFile = ({
  errorMessage = "Endirm\u0259 u\u011Fursuz oldu."
}) => {
  const downloadImage = async (src, filename) => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert(errorMessage);
    }
  };
  return { downloadImage };
};

// src/hooks/useOnlineStatus.ts
import { useSyncExternalStore } from "react";
function useOnlineStatus() {
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  return isOnline;
}
function getSnapshot() {
  return navigator.onLine;
}
function getServerSnapshot() {
  return true;
}
function subscribe(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

// src/hooks/useOutsideClick.ts
import { useCallback as useCallback3 } from "react";
function useOutsideClick(ref, onClickOutside) {
  const handler = useCallback3(
    (event) => {
      if (!ref.current) return;
      if (!ref.current.contains(event.target)) {
        onClickOutside?.();
      }
    },
    [ref, onClickOutside]
  );
  useEventListener("mousedown", handler, document);
}

// src/hooks/useBeforeUnload.ts
import { useEffect as useEffect11 } from "react";

// src/hooks/useUpdateEffect.ts
import { useEffect as useEffect12, useRef as useRef5 } from "react";
function useUpdateEffect(effect, deps) {
  const isFirstRender = useRef5(true);
  useEffect12(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    return effect();
  }, deps);
}

// src/hooks/useResizeListener.ts
import { useEffect as useEffect13 } from "react";
var useResizeListener = (callback, active) => {
  useEffect13(() => {
    if (active) {
      callback();
      window.addEventListener(EventTypes_default.RESIZE, callback);
    }
    return () => {
      window.removeEventListener(EventTypes_default.RESIZE, callback);
    };
  }, [active, callback]);
};

// src/hooks/useCopyToClipboard.ts
import { useState as useState5 } from "react";

// src/hooks/useKeyPress.ts
import { useCallback as useCallback4, useState as useState6 } from "react";
function useKeyPress(targetKey) {
  const [pressed, setPressed] = useState6(false);
  const downHandler = useCallback4((e) => {
    if (e.key === targetKey) setPressed(true);
  }, [targetKey]);
  const upHandler = useCallback4((e) => {
    if (e.key === targetKey) setPressed(false);
  }, [targetKey]);
  useEventListener("keydown", downHandler);
  useEventListener("keyup", upHandler);
  return pressed;
}

// src/utils/common-utils.ts
function isNulOrUndefined(v) {
  return v === null || v === void 0;
}
function isEmpty(o) {
  if (Number.isNaN(o)) return true;
  if (isNulOrUndefined(o)) return true;
  if (typeof o === "string") return o === "";
  if (Array.isArray(o)) return o.length === 0;
  if (typeof o === "object") return !Object.keys(o !== null ? o : {}).length;
  return false;
}
function isNotEmpty(o) {
  return !isEmpty(o);
}
var getImageUrl = (id, baseUrl) => {
  const finalBaseUrl = baseUrl || window.location.href;
  return `${finalBaseUrl}/fs/v1/files/${id}/download`;
};

// src/utils/api-utils.ts
function getEndpoint(role, feature, sharedFeatures) {
  const featureConfig = sharedFeatures?.[feature];
  if (!featureConfig) return null;
  if (typeof featureConfig.endpoint === "object") {
    return featureConfig.endpoint?.[role] || null;
  }
  return featureConfig.endpoint;
}
var generateQuery = (query) => {
  const searchParams = new URLSearchParams();
  if (isNulOrUndefined(query)) {
    return "";
  }
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== void 0 && v !== null && v !== "") {
          searchParams.append(key, String(v));
        }
      });
    } else if (value !== void 0 && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};
var isLoggedIn = (name) => {
  return !!CookieManager.get(name);
};

// src/constants/DateFormats.ts
var DateFormats = /* @__PURE__ */ ((DateFormats2) => {
  DateFormats2["MMMM_DD_YYYY"] = "MMMM DD, YYYY";
  DateFormats2["DD_MM_YYYY_WITH_DOT"] = "DD.MM.YYYY";
  DateFormats2["DD_MM_YYYY_WITH_SLASH"] = "DD/MM/YYYY";
  DateFormats2["YYYY_MM_DD_WITH_HYPEN"] = "YYYY-MM-DD";
  DateFormats2["DD_MM_YYYY_WITH_HYPHEN"] = "DD-MM-YYYY";
  DateFormats2["DD_MM_YYYY_HH_mm"] = "DD/MM/YYYY HH:mm";
  DateFormats2["DD_MMM_YYYY_WITH_SPACE"] = "DD MMM YYYY";
  return DateFormats2;
})(DateFormats || {});

// src/utils/date-utils.ts
var toDate = (date) => {
  if (!date) return void 0;
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? void 0 : d;
};
var pad = (n) => String(n).padStart(2, "0");
var formatDate = (date, format = "DD MMM YYYY" /* DD_MMM_YYYY_WITH_SPACE */) => {
  const d = toDate(date);
  if (!d) return void 0;
  if (format === "DD MMM YYYY" /* DD_MMM_YYYY_WITH_SPACE */) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(d).replace(",", "");
  }
  const tokens = {
    YYYY: d.getFullYear().toString(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes())
  };
  return Object.entries(tokens).reduce(
    (acc, [token, value]) => acc.replace(new RegExp(token, "g"), value),
    format
  );
};
var formatRelativeTime = (date, baseDate) => {
  const d = toDate(date);
  const base = toDate(baseDate) ?? /* @__PURE__ */ new Date();
  if (!d) return void 0;
  const diff = d.getTime() - base.getTime();
  const abs = Math.abs(diff);
  if (abs < 6e4) return diff < 0 ? "seconds ago" : "in seconds";
  const minutes = Math.round(abs / 6e4);
  if (minutes < 60) return diff < 0 ? `${minutes} minutes ago` : `in ${minutes} minutes`;
  const hours = Math.round(abs / 36e5);
  if (hours < 24) return diff < 0 ? `${hours} hours ago` : `in ${hours} hours`;
  const days = Math.round(abs / 864e5);
  return diff < 0 ? `${days} days ago` : `in ${days} days`;
};
var isValidDate = (date) => !!toDate(date);
var isPast = (date) => {
  const d = toDate(date);
  return d ? d.getTime() < Date.now() : false;
};
var isFuture = (date) => {
  const d = toDate(date);
  return d ? d.getTime() > Date.now() : false;
};
var isToday = (date) => {
  const d = toDate(date);
  if (!d) return false;
  const today = /* @__PURE__ */ new Date();
  return d.toDateString() === today.toDateString();
};
var isYesterday = (date) => {
  const d = toDate(date);
  if (!d) return false;
  const y = /* @__PURE__ */ new Date();
  y.setDate(y.getDate() - 1);
  return d.toDateString() === y.toDateString();
};
var isTomorrow = (date) => {
  const d = toDate(date);
  if (!d) return false;
  const t = /* @__PURE__ */ new Date();
  t.setDate(t.getDate() + 1);
  return d.toDateString() === t.toDateString();
};
var isSameDay = (date1, date2) => {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  return d1 && d2 ? d1.toDateString() === d2.toDateString() : false;
};
var isBetweenDates = (date, startDate, endDate) => {
  const d = toDate(date);
  const s = toDate(startDate);
  const e = toDate(endDate);
  if (!d || !s || !e) return false;
  const t = d.getTime();
  return t >= s.getTime() && t <= e.getTime();
};
var getDateDifference = (date1, date2, unit = "day") => {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return void 0;
  const diff = d1.getTime() - d2.getTime();
  switch (unit) {
    case "millisecond":
      return diff;
    case "second":
      return diff / 1e3;
    case "minute":
      return diff / 6e4;
    case "hour":
      return diff / 36e5;
    default:
      return diff / 864e5;
  }
};
var addToDate = (date, amount, unit = "day") => {
  const d = toDate(date);
  if (!d) return void 0;
  const copy = new Date(d);
  if (unit === "second") copy.setSeconds(copy.getSeconds() + amount);
  else if (unit === "minute") copy.setMinutes(copy.getMinutes() + amount);
  else if (unit === "hour") copy.setHours(copy.getHours() + amount);
  else copy.setDate(copy.getDate() + amount);
  return copy;
};
var subtractFromDate = (date, amount, unit = "day") => addToDate(date, -amount, unit);
var startOf = (date, unit = "day") => {
  const d = toDate(date);
  if (!d) return void 0;
  const copy = new Date(d);
  if (unit === "day") copy.setHours(0, 0, 0, 0);
  else if (unit === "month") {
    copy.setDate(1);
    copy.setHours(0, 0, 0, 0);
  } else if (unit === "year") {
    copy.setMonth(0, 1);
    copy.setHours(0, 0, 0, 0);
  }
  return copy;
};
var endOf = (date, unit = "day") => {
  const d = toDate(date);
  if (!d) return void 0;
  const copy = new Date(d);
  if (unit === "day") copy.setHours(23, 59, 59, 999);
  else if (unit === "month") {
    copy.setMonth(copy.getMonth() + 1, 0);
    copy.setHours(23, 59, 59, 999);
  } else if (unit === "year") {
    copy.setMonth(11, 31);
    copy.setHours(23, 59, 59, 999);
  }
  return copy;
};
var formatDateRange = (startDate, endDate, format = "DD MMM YYYY" /* DD_MMM_YYYY_WITH_SPACE */, separator = " - ") => {
  const s = formatDate(startDate, format);
  const e = formatDate(endDate, format);
  return s && e ? `${s}${separator}${e}` : void 0;
};
var getAge = (birthdate) => {
  const d = toDate(birthdate);
  if (!d) return void 0;
  const today = /* @__PURE__ */ new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || m === 0 && today.getDate() < d.getDate()) age--;
  return age;
};
var parseDate = (dateString, format) => {
  if (format === "DD/MM/YYYY") {
    const [dd, mm, yyyy] = dateString.split("/").map(Number);
    return new Date(yyyy, mm - 1, dd);
  }
  return toDate(dateString);
};
var toISOString = (date) => {
  const d = toDate(date);
  return d?.toISOString();
};
var toUnixTimestamp = (date) => {
  const d = toDate(date);
  return d ? Math.floor(d.getTime() / 1e3) : void 0;
};
var now = () => /* @__PURE__ */ new Date();
var compareDates = (date1, date2) => {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return void 0;
  if (d1.getTime() < d2.getTime()) return -1;
  if (d1.getTime() > d2.getTime()) return 1;
  return 0;
};

// src/utils/phone-utils.ts
var hasAzerbaijanCountryCode = (phoneNumber) => {
  const phone = String(phoneNumber).trim();
  return /^(\+994|994)(\s|\d|$)/.test(phone);
};
var withAzerbaijanCountryCode = (phone) => {
  const phoneStr = String(phone).trim().replace(/\s+/g, "");
  if (!phoneStr) return "";
  if (hasAzerbaijanCountryCode(phoneStr)) {
    return phoneStr.replace(/^(\+994|994)/, "+994");
  }
  const digitsOnly = phoneStr.replace(/\D+/g, "");
  if (digitsOnly.length >= 9) {
    return `+994${digitsOnly.slice(-9)}`;
  }
  return `+994${digitsOnly}`;
};
var normalizePhone = (phone) => withAzerbaijanCountryCode(phone);

// src/utils/array-utils.ts
function uniqueBy(arr, key) {
  const seen = /* @__PURE__ */ new Set();
  return arr.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});
}
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
function checkArrEquality(arr1, arr2, treatEmptyAsEqual = false) {
  if (treatEmptyAsEqual && arr1.length === 0 && arr2.length === 0) return true;
  if (arr1.length !== arr2.length && arr1.length !== 0 && arr2.length !== 0)
    return false;
  return arr1.every((obj1, index) => {
    const obj2 = arr2[index];
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  });
}
function reverseArr(arr) {
  return [...arr].reverse();
}
function reject(arr, predicate) {
  const invert2 = (f) => (x, i) => !f(x, i);
  return arr.filter(invert2(predicate));
}
function count(arr, predicate) {
  if (!arr) return 0;
  if (!predicate) return arr.length;
  let counter = 0;
  for (let i = 0; i < arr.length; i += 1) {
    if (predicate(arr[i], i)) counter += 1;
  }
  return counter;
}
function pushIf(array, element, condition) {
  if (typeof condition === "boolean" && condition) {
    return [...array, element];
  }
  if (typeof condition === "function" && condition()) {
    return [...array, element];
  }
  return array;
}
function first(arr) {
  return arr[0];
}
function last(arr) {
  return arr[arr.length - 1];
}
function unique(arr) {
  return Array.from(new Set(arr));
}
function flatten(arr) {
  return arr.flat();
}
function flattenDeep(arr) {
  return arr.flat(Infinity);
}
function compactArr(arr) {
  return arr.filter(Boolean);
}
function sample(arr) {
  if (arr.length === 0) return void 0;
  return arr[Math.floor(Math.random() * arr.length)];
}
function sampleSize(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((item) => !set2.has(item));
}
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((item) => set2.has(item));
}
function union(arr1, arr2) {
  return unique([...arr1, ...arr2]);
}
function without(arr, ...values2) {
  const valuesSet = new Set(values2);
  return arr.filter((item) => !valuesSet.has(item));
}
function zip(...arrays) {
  const maxLength = Math.max(...arrays.map((arr) => arr.length));
  const result = [];
  for (let i = 0; i < maxLength; i++) {
    result.push(arrays.map((arr) => arr[i]));
  }
  return result;
}
function fromPairs(pairs) {
  return pairs.reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );
}
function sum(arr) {
  return arr.reduce((acc, val) => acc + val, 0);
}
function average(arr) {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
}
function min(arr) {
  if (arr.length === 0) return void 0;
  return Math.min(...arr);
}
function max(arr) {
  if (arr.length === 0) return void 0;
  return Math.max(...arr);
}
function partition(arr, predicate) {
  const truthy = [];
  const falsy = [];
  arr.forEach((item, index) => {
    if (predicate(item, index)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  });
  return [truthy, falsy];
}
function clone(arr) {
  return [...arr];
}
function sortBy(arr, keyOrFn, order = "asc") {
  const result = [...arr];
  const multiplier = order === "asc" ? 1 : -1;
  return result.sort((a, b) => {
    const aVal = typeof keyOrFn === "function" ? keyOrFn(a) : a[keyOrFn];
    const bVal = typeof keyOrFn === "function" ? keyOrFn(b) : b[keyOrFn];
    if (aVal < bVal) return -1 * multiplier;
    if (aVal > bVal) return 1 * multiplier;
    return 0;
  });
}

// src/utils/object-utils.ts
function pick(obj, keys2) {
  const result = {};
  for (let i = 0; i < keys2.length; i++) {
    const key = keys2[i];
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}
function omit(obj, keys2) {
  const result = { ...obj };
  for (let i = 0; i < keys2.length; i++) {
    delete result[keys2[i]];
  }
  return result;
}
function merge(target, source) {
  return { ...target, ...source };
}
function cleanObject(obj) {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== void 0 && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0)) {
      result[key] = value;
    }
  }
  return result;
}
function areAllValuesComplete(obj) {
  return Object.values(obj).every(
    (value) => value !== void 0 && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0)
  );
}
function isObject(o) {
  return typeof o === "object" && o !== null && !Array.isArray(o);
}
function keys(o) {
  return Object.keys(o);
}
function values(o) {
  return Object.values(o);
}
function entries(o) {
  return Object.entries(o);
}
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const targetValue = target[key];
      const sourceValue = source[key];
      if (isObject(targetValue) && isObject(sourceValue)) {
        result[key] = deepMerge(
          targetValue,
          sourceValue
        );
      } else {
        result[key] = sourceValue;
      }
    }
  }
  return result;
}
function isEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!isEqual(obj1[key], obj2[key])) return false;
  }
  return true;
}
function get(obj, path, defaultValue) {
  const keys2 = path.split(".");
  let result = obj;
  for (const key of keys2) {
    if (result?.[key] === void 0) {
      return defaultValue;
    }
    result = result[key];
  }
  return result;
}
function set(obj, path, value) {
  const keys2 = path.split(".");
  const lastKey = keys2.pop();
  let current = obj;
  for (const key of keys2) {
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }
  current[lastKey] = value;
  return obj;
}
function has(obj, path) {
  const keys2 = path.split(".");
  let current = obj;
  for (const key of keys2) {
    if (current === null || current === void 0 || !Object.prototype.hasOwnProperty.call(current, key)) {
      return false;
    }
    current = current[key];
  }
  return true;
}
function invert(obj) {
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[obj[key]] = key;
    }
  }
  return result;
}
function mapValues(obj, fn) {
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = fn(obj[key], key);
    }
  }
  return result;
}
function mapKeys(obj, fn) {
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = fn(key, obj[key]);
      result[newKey] = obj[key];
    }
  }
  return result;
}
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = obj[prop];
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return obj;
}
function filterObject(obj, predicate) {
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
function unflatten(obj) {
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      set(result, key, obj[key]);
    }
  }
  return result;
}

// src/utils/string-utils.ts
var isStringSimilar = (input, target = "dashboard", maxDiffCount = 2) => {
  let diffCount = 0;
  for (let i = 0, j = 0; i < input.length && j < target.length; i++, j++) {
    if (input[i] !== target[j]) {
      diffCount++;
      if (diffCount > maxDiffCount) return false;
      if (input.length > target.length) j--;
      else if (input.length < target.length) i--;
    }
  }
  return diffCount <= maxDiffCount;
};
function concatIf(s1, s2, condition) {
  return s1 + (condition ? s2 : "");
}
function isString(v) {
  return typeof v === "string";
}
function eqIgnoreCase(s1, s2) {
  return s1 && s2 ? s1.toLowerCase() === s2.toLowerCase() : false;
}
function includesIgnoreCase(s1, s2) {
  return s1 && s2 ? s1.toLowerCase().includes(s2.toLowerCase()) : false;
}
function addAsteriskIf(s, condition = false) {
  return s && `${s}${condition ? "*" : ""}`;
}
var compactStr = (s) => s?.replace(/\s+/g, "");
var toUpperSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter, index) => index === 0 ? letter : `_${letter}`).toUpperCase();
};
var toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter, index) => index === 0 ? letter : `_${letter}`).toLowerCase();
};
var toCamelCase = (str) => {
  return str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : "").replace(/^[A-Z]/, (char) => char.toLowerCase());
};
var toPascalCase = (str) => {
  return str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : "").replace(/^[a-z]/, (char) => char.toUpperCase());
};
var toKebabCase = (str) => {
  return str.replace(
    /[A-Z]/g,
    (letter, index) => index === 0 ? letter.toLowerCase() : `-${letter.toLowerCase()}`
  ).replace(/[\s_]+/g, "-");
};
var capitalize = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
var capitalizeWords = (str) => {
  if (!str) return str;
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
var truncate = (str, maxLength, suffix = "...") => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
};
var reverse = (str) => {
  return str.split("").reverse().join("");
};
var countOccurrences = (str, substr) => {
  if (!str || !substr) return 0;
  return str.split(substr).length - 1;
};
var normalizeWhitespace = (str) => {
  return str?.trim().replace(/\s+/g, " ");
};
var padStart = (str, length, char = " ") => {
  return str.padStart(length, char);
};
var padEnd = (str, length, char = " ") => {
  return str.padEnd(length, char);
};
var trimStart = (str, chars) => {
  if (!chars) return str.trimStart();
  const pattern = new RegExp(`^[${chars}]+`);
  return str.replace(pattern, "");
};
var trimEnd = (str, chars) => {
  if (!chars) return str.trimEnd();
  const pattern = new RegExp(`[${chars}]+$`);
  return str.replace(pattern, "");
};
var trim = (str, chars) => {
  if (!chars) return str.trim();
  return trimEnd(trimStart(str, chars), chars);
};
var startsWith = (str, search, ignoreCase = false) => {
  if (ignoreCase) {
    return str.toLowerCase().startsWith(search.toLowerCase());
  }
  return str.startsWith(search);
};
var endsWith = (str, search, ignoreCase = false) => {
  if (ignoreCase) {
    return str.toLowerCase().endsWith(search.toLowerCase());
  }
  return str.endsWith(search);
};
var repeat = (str, count2) => {
  return str.repeat(count2);
};
var slugify = (str) => {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
};

// src/utils/convert-utils.ts
var convertFileToBase64 = (file) => new Promise((resolve, reject2) => {
  const reader = new FileReader();
  reader.onload = () => {
    resolve(reader.result);
  };
  reader.onerror = (error) => reject2(error);
  reader.readAsDataURL(file);
});
function convertBase64ToFile(base64, fileName, mimeType) {
  const bstr = atob(base64);
  let n = bstr.length;
  const buffer = new Uint8Array(n);
  while (n--) {
    buffer[n] = bstr.charCodeAt(n);
  }
  return new File([buffer], fileName, { type: mimeType });
}
var extractBase64FromDataUrl = (dataUrl) => {
  const match = dataUrl.match(/^data:[\w/+]+;base64,(.+)$/);
  if (!match) throw new Error("Invalid data URL format");
  return match[1];
};
var fileToArrayBuffer = (file) => new Promise((resolve, reject2) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject2;
  reader.readAsArrayBuffer(file);
});

// src/utils/function-utils.ts
var noop = () => {
};
function compose(fn1, ...fns) {
  return fns.reduce((prevFn, nextFn) => (value) => prevFn(nextFn(value)), fn1);
}
var debounce = (func, wait) => {
  let timeout = null;
  const debounced = (...args) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
  debounced.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  return debounced;
};
var throttle = (func, wait) => {
  let timeout = null;
  let lastRan = null;
  const throttled = (...args) => {
    const now2 = Date.now();
    if (lastRan === null || now2 - lastRan >= wait) {
      func(...args);
      lastRan = now2;
    } else if (timeout === null) {
      timeout = setTimeout(() => {
        func(...args);
        lastRan = Date.now();
        timeout = null;
      }, wait - (now2 - lastRan));
    }
  };
  throttled.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    lastRan = null;
  };
  return throttled;
};
var memoize = (func, resolver) => {
  const cache = /* @__PURE__ */ new Map();
  const memoized = (...args) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
  memoized.cache = cache;
  return memoized;
};
var once = (func) => {
  let called = false;
  let result;
  return ((...args) => {
    if (!called) {
      called = true;
      result = func(...args);
    }
    return result;
  });
};
var delay = (func, wait, ...args) => {
  return setTimeout(() => func(...args), wait);
};
var retry = async (func, retries = 3, delayMs = 1e3) => {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await func();
    } catch (error) {
      lastError = error;
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
};
var curry = (func) => {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func(...args);
    }
    return (...nextArgs) => curried(...args, ...nextArgs);
  };
};
var flip = (func) => {
  return (...args) => func(...args.reverse());
};
var partial = (func, ...partials) => {
  return (...args) => func(...partials, ...args);
};
var negate = (predicate) => {
  return (...args) => !predicate(...args);
};
var safeCall = (func, ...args) => {
  return func ? func(...args) : void 0;
};
var tryCatch = (func) => {
  return (...args) => {
    try {
      const result = func(...args);
      return [null, result];
    } catch (error) {
      return [error, null];
    }
  };
};
var tryCatchAsync = (func) => {
  return async (...args) => {
    try {
      const result = await func(...args);
      return [null, result];
    } catch (error) {
      return [error, null];
    }
  };
};
var rateLimit = (func, minDelay) => {
  const queue = [];
  let processing = false;
  const processQueue = async () => {
    if (processing || queue.length === 0) return;
    processing = true;
    const { args, resolve, reject: reject2 } = queue.shift();
    try {
      const result = await func(...args);
      resolve(result);
    } catch (error) {
      reject2(error);
    }
    await new Promise((r) => setTimeout(r, minDelay));
    processing = false;
    processQueue();
  };
  return (...args) => {
    return new Promise((resolve, reject2) => {
      queue.push({ args, resolve, reject: reject2 });
      processQueue();
    });
  };
};
var identity = (value) => value;
var constant = (value) => () => value;
function firstSeveral(array, n) {
  if (!array) return null;
  if (n === 0 || n === void 0) return [array[0]];
  const part = [];
  const limit = Math.min(n, array.length);
  for (let i = 0; i < limit; i += 1) {
    part.push(array[i]);
  }
  return part;
}
function lastSeveral(array, n) {
  if (!array) return null;
  if (n === 0 || n === void 0) return [array[array.length - 1]];
  const res = [];
  const start = Math.max(0, array.length - n);
  for (let i = array.length - 1; i >= start; i -= 1) {
    res.unshift(array[i]);
  }
  return res;
}

// src/utils/animation-utils.ts
function animate({ type, order = 0, delay: delay2, className = "", style = {} }) {
  const baseClass = "animate";
  const animationClass = type;
  const finalDelay = delay2 !== void 0 ? delay2 : order * 0.04;
  return {
    className: `${baseClass} ${animationClass} ${className}`.trim(),
    style: {
      "--delay": `${finalDelay}s`,
      ...style
    }
  };
}
var fadeIn = (order, className, style) => animate({ type: "fade-in", order, className, style });
var slideInUp = (order, className, style) => animate({ type: "slide-in-up", order, className, style });
var slideInDown = (order, className, style) => animate({ type: "slide-in-down", order, className, style });
var slideInLeft = (order, className, style) => animate({ type: "slide-in-left", order, className, style });
var slideInRight = (order, className, style) => animate({ type: "slide-in-right", order, className, style });
var scaleIn = (order, className, style) => animate({ type: "scale-in", order, className, style });
var bounceIn = (order, className, style) => animate({ type: "bounce-in", order, className, style });
export {
  CookieManager,
  DateFormats,
  FormDataBuilder,
  addAsteriskIf,
  addToDate,
  animate,
  areAllValuesComplete,
  average,
  bounceIn,
  capitalize,
  capitalizeWords,
  checkArrEquality,
  chunk,
  cleanObject,
  clone,
  cn,
  compactArr,
  compactStr,
  compareDates,
  compose,
  concatIf,
  constant,
  convertBase64ToFile,
  convertFileToBase64,
  count,
  countOccurrences,
  createFormData,
  createStorage,
  curry,
  debounce,
  deepClone,
  deepFreeze,
  deepMerge,
  delay,
  difference,
  endOf,
  endsWith,
  entries,
  eqIgnoreCase,
  extractBase64FromDataUrl,
  fadeIn,
  fileToArrayBuffer,
  filterObject,
  first,
  firstSeveral,
  flatten,
  flattenDeep,
  flip,
  formatDate,
  formatDateRange,
  formatRelativeTime,
  fromPairs,
  generateQuery,
  get,
  getAge,
  getDateDifference,
  getEndpoint,
  getImageUrl,
  groupBy,
  has,
  hasAzerbaijanCountryCode,
  identity,
  includesIgnoreCase,
  intersection,
  invert,
  isBetweenDates,
  isBrowser,
  isEmpty,
  isEqual,
  isFuture,
  isLoggedIn,
  isNotEmpty,
  isNulOrUndefined,
  isObject,
  isPast,
  isSameDay,
  isString,
  isStringSimilar,
  isToday,
  isTomorrow,
  isValidDate,
  isYesterday,
  keys,
  last,
  lastSeveral,
  lazyLoad,
  local,
  mapKeys,
  mapValues,
  max,
  memoize,
  merge,
  min,
  negate,
  noop,
  normalizePhone,
  normalizeWhitespace,
  now,
  omit,
  once,
  padEnd,
  padStart,
  parseDate,
  partial,
  partition,
  pick,
  pushIf,
  rateLimit,
  reject,
  repeat,
  retry,
  reverse,
  reverseArr,
  safeCall,
  safeWindow,
  sample,
  sampleSize,
  scaleIn,
  session,
  set,
  shuffle,
  slideInDown,
  slideInLeft,
  slideInRight,
  slideInUp,
  slugify,
  sortBy,
  startOf,
  startsWith,
  subtractFromDate,
  sum,
  throttle,
  timeId,
  tinyId,
  toCamelCase,
  toISOString,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
  toUnixTimestamp,
  toUpperSnakeCase,
  trim,
  trimEnd,
  trimStart,
  truncate,
  tryCatch,
  tryCatchAsync,
  unflatten,
  union,
  unique,
  uniqueBy,
  useAppLocation,
  useDebounce,
  useDownloadFile,
  useEscapeKey,
  useEventListener,
  useInterval,
  useKeyPress,
  useMediaQuery,
  useMount,
  useOnlineStatus,
  useOutsideClick,
  usePortal,
  usePrevious,
  usePrint,
  useResizeListener,
  useScrollLock,
  useToggle,
  useUnmount,
  useUpdateEffect,
  useWindowSize,
  values,
  withAzerbaijanCountryCode,
  without,
  zip
};
