# Changelog

All notable changes to this package are documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
and this project adheres to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

## [Unreleased]

## [1.1.18] - 2025-12-05

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