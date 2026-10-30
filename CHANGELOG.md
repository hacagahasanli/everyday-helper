# Changelog

All notable changes to this package are documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
and this project adheres to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

## [1.6.1] - 2026-10-30

### Fixed

- `findLabel` and `toOptions` accept readonly arrays (e.g. option lists declared `as const`)

## [1.6.0] - 2026-10-29

### Added

- `replaceUrlParams` for filling `:param` placeholders in route/URL templates
- `isEmptyValue` type guard for empty form values (`''`, `null`, `undefined`)
- `useDownloadFile` accepts an optional `onError` callback

### Changed

- `useDownloadFile` takes the file extension from the response MIME type (pdf, png, jpg, gif, webp, svg; default png) instead of always saving `.png`
- `useDownloadFile` treats non-2xx responses as errors instead of saving the error body
- `useDownloadFile` options are optional, so `useDownloadFile()` works without arguments

## [1.5.0] - 2026-10-29

### Added

- Option helpers `entriesToOptions`, `toOptions`, `findLabel` for select/dropdown options and label lookups
- Number helpers `clamp`, `formatNumber` (locale-aware, default `az-AZ`), `toNumberOrUndef`
- `getRowNumber` for numbering table rows on paginated lists

## [1.4.0] - 2026-10-20

### Added

- String utils `toStr`, `toStrWithFallback`, `toStrOrUndef`, `toStrWithSuffix` for null-safe value-to-string conversion
- `boolLabel` for mapping booleans to labels (Azerbaijani defaults, overridable)
- `toLocaleUpper` for locale-aware upper-casing (default `az`)
- `prettifySnakeCase` for turning snake_case / UPPER_SNAKE_CASE values into title case (Unicode-aware)
- Azerbaijani grammar helpers `ablativeSuffix`, `dativeSuffix`, `toDative`
- `isIsoDateString`, `formatIsoDate`, `formatIfIsoDate` for formatting ISO date strings (date-only values read as local dates)
- `formatAzDate`, `formatAzDateTime`, `formatAzDateShort` and `AZ_MONTHS` / `AZ_MONTHS_SHORT` constants for Azerbaijani date output
- `combineDateAndTime` for merging a day and a time into one date-time string
- `isBeforeToday`, `isAfterToday` for day-level comparison with today
- Date picker helpers `disabledBeforeDay`, `disabledOnOrBeforeDay`, `disabledOutsideRange`, `getDisabledPastTime`
- `DateLike` type so date helpers accept date-library objects (e.g. Dayjs)
- `reformatDate` for converting a date string between formats
- `computeAnchor` and `generateOrderedDateText` are now exported (previously internal to `getDaysDiffAsText`)
- `formatFileSize`, `getFileExtension` for displaying file size and type
- Browser download helpers `downloadUrl`, `downloadBlob`, `fetchAndDownload`
- `toDataUrl` for turning raw Base64 into a data URL (inverse of `extractBase64FromDataUrl`)

### Changed

- `formatDate` supports the `ss` (seconds) token
- `parseDate` parses any `YYYY MM DD HH mm ss` format in local time (date-only values no longer shift to UTC), `format` defaults to `YYYY-MM-DD`, impossible dates (e.g. `2026-02-31`) return `undefined`
- `generateOrderedDateText` `lang` is optional (default `az`)

## [1.3.13] - 2026-09-04

### Added

- `useListPagination` hook for client-side array pagination (page/pageSize slicing with clamped bounds)
- `useUrlPagination` hook for pagination state synced with URL search params
### Fixed

- `useOutsideClick` and `useEscapeKey` no longer crash during SSR (they referenced `document` directly at render time instead of inside an effect). `useEventListener`'s `window` fallback is now resolved lazily inside its effect as well, so the fix covers every hook built on top of it. Public API is unchanged.

-- sad but lost version logs

## [1.3.4] - 2026-02-11

### Changed

- useAppLocation hook removed

## [1.3.3] - 2026-01-19

### Changed

- DD_MM_YYYY_HH_mm format is fixed in formatDate function

## [1.3.2] - 2026-01-19

### Changed

- DD_MM_YYYY_HH_mm format is fixed in formatDate function

## [1.3.0] - 2026-01-16

### Changed

- Unique ID Generator: tinyId lib addedd

## [1.2.4] - 2025-12-12

### Changed

- Making domain param of Cookie lib optional

## [1.2.3] - 2025-12-10

### Changed

- Fix package.json config to make visual studio suggestion enabled

## [1.2.2] - 2025-12-10

### Changed

- Fix package.json config to make visual studio suggestion enabled

## [1.2.2] - 2025-12-10

### Changed

- Fix package.json config to make visual studio suggestion enabled

## [1.2.1] - 2025-12-10

### Changed

- Removed `.cjs` build output to simplify package artifacts
- Removed sourcemap generation from `tsup`
- Cleaned and simplified build configuration

### Performance

- Reduced bundle size by removing duplicate CJS builds

## [1.2.0] - 2025-12-08

### Added

- 8 new React hooks including lifecycle, timer, and browser utilities

## [1.1.19] - 2025-12-05

### Added

- date utils converted from dayjs to native.
- dayjs dependency removed

## [1.0.18] - 2025-12-03

### Added

- test for automatic changelog.md changes

## [1.0.17] - 2025-12-03

### Added

- test for automatic changelog.md changes

## [1.0.16] - 2025-12-03

### Added

- test for automatic changelog.md changes

## [1.0.15] - 2025-12-03

### Added

- test for automatic changelog.md changes

## [1.0.14] - 2025-12-03

### Added

- test for automatic changelog.md changes

## [1.0.13] - 2025-12-03

### Added

- publish.yml file for automatic deploy

## [1.0.12] - 2025-12-02

### Changed

- Package improvements

## [1.0.11] - 2025-12-02

### Fixed

- VSCode auto-suggestions configuration

## [1.0.10] - 2025-12-02

### Changed

- TSup configuration updates

## [1.0.9] - 2025-12-02

### Fixed

- Package.json fixes

## [1.0.8] - 2025-12-02

### Changed

- Package.json improvements

## [1.0.7] - 2025-12-02

### Changed

- Package.json updates

## [1.0.6] - 2025-12-02

### Fixed

- Package.json fixes

## [1.0.5] - 2025-12-02

### Changed

- Package.json configuration improvements

## [1.0.4] - 2025-12-02

### Fixed

- Package.json fixes

## [1.0.3] - 2025-12-02

### Fixed

- TSup configuration fixes

## [1.0.2] - 2025-12-02

### Changed

- TSup build improvements

## [1.0.1] - 2025-12-01

### Changed

- Package description updated

## [1.0.0] - 2025-12-01

### Added

- Initial release of everyday-helper
- React Hooks (13 hooks):
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
  - `tinyId` - Unique ID Generator
- Constants:
  - `DateFormats` - Predefined date format strings
  - `EventTypes` - Comprehensive DOM event types enum
  - `SortOrders` - Sort order constants
- Full TypeScript support with type definitions
- ESM and CommonJS module formats
- Comprehensive documentation in README.md
