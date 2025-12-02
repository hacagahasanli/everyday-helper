# Changelog

See the full changelog [here](./CHANGELOG.md).
All notable changes to this package are documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
and this project adheres to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

## [Unreleased]

### [1.0.0] - 2025-12-01
- Initial release of everyday-helper
- React Hooks (13 hooks):
  - `useAppLocation` - React Router location utilities
  - `useDebounce` - Debounce values
  - `useDownloadFile` - Download files utilities
  - `useEscapeKey` - Handle Escape key press
  - `useEventListener` - Attach event listeners with cleanup
  - `useOnlineStatus` - Track online/offline status
  - `useOutsideClick` - Detect clicks outside elements
  - `usePortal` - Create portal containers
  - `usePrevious` - Track previous values
  - `usePrint` - Print utilities
  - `useResizeListener` - Listen for window resize
  - `useScrollLock` - Lock/unlock body scroll
  - `useToggle` - Toggle state management

- Utility Functions (100+ utilities):
  - Array utilities: `uniqueBy`, `groupBy`, `chunk`, `sortBy`, `partition`, etc.
  - String utilities: `capitalize`, `slugify`, `toCamelCase`, `toSnakeCase`, etc.
  - Object utilities: `pick`, `omit`, `get`, `set`, `deepMerge`, `mapValues`, etc.
  - Date utilities: `formatDate`, `isToday`, `addToDate`, `getDateDifference`, etc.
  - Function utilities: `debounce`, `throttle`, `memoize`, `once`, `retry`, etc.
  - Common utilities: `isEmpty`, `isNotEmpty`, `getImageUrl`, etc.
  - Convert utilities: `convertFileToBase64`, `convertBase64ToFile`, etc.
  - API utilities: `generateQuery`, `getEndpoint`, `isLoggedIn`
  - Phone utilities: `normalizePhone`, `withAzerbaijanCountryCode`
  - Animation utilities: `fadeIn`, `slideInUp`, `bounceIn`, etc.

- Library Helpers:
  - `cn` - Conditional class name utility
  - `CookieManager` - Cookie management utilities
  - `FormDataBuilder` - Build FormData objects easily
  - `createStorage` - localStorage/sessionStorage wrappers
  - `local` & `session` - Type-safe storage helpers
  - `lazyLoad` - Lazy load React components with retry logic

- Constants:
  - `DateFormats` - Predefined date format strings
  - `EventTypes` - Comprehensive DOM event types enum
  - `SortOrders` - Sort order constants

- Full TypeScript support with type definitions
- ESM and CommonJS module formats
- Comprehensive documentation in README.md