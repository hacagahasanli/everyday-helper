# everyday-helper

A lightweight collection of React hooks, utility functions, and helpers that'll make your development workflow smoother. This package brings together commonly needed utilities so you don't have to reinvent the wheel every time you start a new project.

## Contributing

Feel free to open issues or submit pull requests if you find bugs or have suggestions for improvements!

## Installation

```bash
npm install everyday-helper
# or
yarn add everyday-helper
```

## 📥 Contributing Guide

This package is open for contributions from teammates and friends.  
If you want to add new hooks, utility functions, or improvements, please follow the rules below so we maintain a clean and stable toolkit.

### 🔧 What You Can Contribute

You may contribute:

- Reusable React hooks
- Pure utility/helper functions
- Shared constants or small modules
- Fixes or improvements to existing features
- Documentation updates

#### Important Requirements

- Each contribution **must work independently** (no external dependencies).
- Must be **general-purpose and reusable**.
- Must include **proper TypeScript types**.
- Must follow the existing folder structure:
  - `hooks/`
  - `utils/`
  - `constants/`
  - `lib/`

### 🛠 How to Contribute

1. Create a new branch from `main`.
2. Add your hook/function/module following the existing structure.
3. Update `CHANGELOG.md` using the correct category.
4. Open a Pull Request.
5. PRs must use **Squash and Merge**.
6. After approval, your PR will be merged and automatically released through CI/CD.

### 📝 Commit Message Rules

These rules are **required** for the automatic release pipeline to work.

When squashing your PR, the commit message **must** follow Conventional Commits format:

### New Feature / New Hook
```sh
feat: added useLocalStorage hook
```
→ triggers a minor version bump

### Bug Fix
```sh
fix: corrected delay behavior in useDebounce
```
→ triggers a patch version bump

### Breaking Change
```sh
feat!: updated API for useToggle
```
→ triggers a major version bump

## Updating the CHANGELOG
Each PR must update CHANGELOG.md:

Use the correct category (Added, Changed, Fixed, etc.)
Follow the formatting already used in the file
Keep descriptions short and clear

## [Unreleased]

### Added
```sh
- `useLocalStorage` hook for persisting state in localStorage (#42)
```

### Fixed
```sh
- Fixed race condition in `useDebounce` when value changes rapidly (#45)
```

Final Note
Your involvement is highly appreciated!
The more people contribute, the more powerful and useful this shared toolkit becomes.
Let’s build something reliable and reusable for all of us! 🚀

## Peer Dependencies

Make sure you have these installed in your project:

```json
{
  "react": ">=18",
  "react-dom": ">=18",
  "react-router-dom": ">=6.0.0"
}
```

## What's Inside?

This package is organized into four main sections:

- **Hooks** - React hooks for common patterns
- **Utils** - Pure utility functions for data manipulation
- **Lib** - Helper libraries for specific tasks
- **Constants** - Predefined constant values

---

## React Hooks

### useAppLocation

A wrapper around React Router's `useLocation` that provides convenient methods for working with the current route.

```tsx
import { useAppLocation } from 'everyday-helper/hooks';

function NavBar() {
  const { pathname, isActive, includes, startsWith } = useAppLocation();

  return (
    <nav>
      <a className={isActive('/home') ? 'active' : ''}>Home</a>
      <a className={includes('/dashboard') ? 'active' : ''}>Dashboard</a>
      <a className={startsWith('/admin') ? 'active' : ''}>Admin</a>
    </nav>
  );
}
```

**Returns:**

- `pathname` - Current pathname
- `hash` - URL hash
- `search` - URL search params
- `isActive(path)` - Check if path exactly matches current pathname
- `includes(segment)` - Check if pathname includes a segment
- `startsWith(prefix)` - Check if pathname starts with a prefix

---

### useDebounce

Debounces a value, useful for search inputs or expensive operations.

```tsx
import { useDebounce } from 'everyday-helper/hooks';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    // This only runs 500ms after user stops typing
    if (debouncedSearch) {
      fetchSearchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />;
}
```

**Parameters:**

- `value` - The value to debounce
- `delay` - Delay in milliseconds (default: 500)

---

### useDownloadFile

Provides a simple way to download images from URLs.

```tsx
import { useDownloadFile } from 'everyday-helper/hooks';

function ImageGallery() {
  const { downloadImage } = useDownloadFile();

  return (
    <button onClick={() => downloadImage('/api/image.jpg', 'my-image')}>Download Image</button>
  );
}
```

**Methods:**

- `downloadImage(src, filename)` - Downloads image as PNG file

---

### useEscapeKey

Execute a callback when the Escape key is pressed.

```tsx
import { useEscapeKey } from 'everyday-helper/hooks';

function Modal({ onClose }) {
  useEscapeKey({
    onEscape: onClose,
    enabled: true,
    preventDefault: true,
  });

  return <div className="modal">...</div>;
}
```

**Props:**

- `onEscape` - Callback function to execute
- `enabled` - Whether the hook is active (default: true)
- `preventDefault` - Prevent default behavior (default: false)

---

### useEventListener

Attach event listeners to window or document with automatic cleanup.

```tsx
import { useEventListener } from 'everyday-helper/hooks';

function Component() {
  useEventListener('scroll', () => {
    console.log('User scrolled!');
  });

  useEventListener('click', handleClick, document);

  return <div>...</div>;
}
```

**Parameters:**

- `event` - Event name
- `handler` - Event handler function
- `element` - Target element (default: window)

---

### useOnlineStatus

Track the user's online/offline status in real-time.

```tsx
import { useOnlineStatus } from 'everyday-helper/hooks';

function ConnectionStatus() {
  const isOnline = useOnlineStatus();

  return (
    <div className={isOnline ? 'online' : 'offline'}>
      {isOnline ? 'Connected' : 'No internet connection'}
    </div>
  );
}
```

---

### useOutsideClick

Detect clicks outside a specific element.

```tsx
import { useOutsideClick } from 'everyday-helper/hooks';
import { useRef } from 'react';

function Dropdown() {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  return <div ref={dropdownRef}>{/* Clicking outside closes the dropdown */}</div>;
}
```

---

### usePortal

Create a portal container dynamically for modals, tooltips, etc.

```tsx
import { usePortal } from 'everyday-helper/hooks';
import { createPortal } from 'react-dom';

function Modal({ children }) {
  const portalRef = usePortal({ id: 'modal-root' });

  if (!portalRef.current) return null;

  return createPortal(children, portalRef.current);
}
```

**Options:**

- `id` - Target element ID (if not provided, appends to body)

---

### usePrevious

Keep track of a value from the previous render.

```tsx
import { usePrevious } from 'everyday-helper/hooks';

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
    </div>
  );
}
```

---

### usePrint

Print images with customizable styling in a new window or iframe.

```tsx
import { usePrint } from 'everyday-helper/hooks';

function ImageViewer({ imageUrl }) {
  const { printInBlank, printInCurrent } = usePrint();

  return (
    <>
      <button onClick={() => printInBlank(imageUrl, { padding: '20px' })}>
        Print in New Window
      </button>
      <button onClick={() => printInCurrent(imageUrl, { fit: 'contain' })}>
        Print in Current Page
      </button>
    </>
  );
}
```

**Methods:**

- `printInBlank(src, style?)` - Opens print dialog in new window
- `printInCurrent(src, style?)` - Prints using hidden iframe

**Style Options:**

- `padding` - Padding around image (default: '20px')
- `fit` - Object-fit value (default: 'contain')
- `maxWidth` - Maximum width (default: '100%')
- `maxHeight` - Maximum height (default: '100%')
- `background` - Background color (default: '#fff')
- `printDelay` - Delay before printing (default: 150ms)
- `cleanupDelay` - Cleanup delay for iframe (default: 10000ms)

---

### useResizeListener

Listen for window resize events with optional activation control.

```tsx
import { useResizeListener } from 'everyday-helper/hooks';

function ResponsiveComponent() {
  const [width, setWidth] = useState(window.innerWidth);

  useResizeListener(() => {
    setWidth(window.innerWidth);
  }, true);

  return <div>Window width: {width}px</div>;
}
```

---

### useScrollLock

Lock/unlock body scroll, perfect for modals and overlays.

```tsx
import { useScrollLock } from 'everyday-helper/hooks';

function Modal({ isOpen }) {
  useScrollLock({ isLocked: isOpen });

  return isOpen ? <div className="modal">...</div> : null;
}
```

---

### useToggle

Simple toggle state management with helpful methods.

```tsx
import { useToggle } from 'everyday-helper/hooks';

function Accordion() {
  const { isActive, toggle, onOpen, onClose } = useToggle();

  return (
    <div>
      <button onClick={toggle}>Toggle</button>
      <button onClick={onOpen}>Open</button>
      <button onClick={onClose}>Close</button>
      {isActive && <div>Accordion content</div>}
    </div>
  );
}
```

**Returns:**

- `isActive` - Current state (boolean)
- `toggle()` - Toggle the state
- `onOpen()` - Set to true
- `onClose()` - Set to false

---

## Utility Functions

### Array Utils

Working with arrays made easier.

```tsx
import {
  uniqueBy,
  groupBy,
  chunk,
  first,
  last,
  shuffle,
  sortBy,
  partition,
} from 'everyday-helper/utils';

// Remove duplicates by key
const users = uniqueBy(allUsers, 'id');

// Group items by property
const usersByRole = groupBy(users, 'role');
// { admin: [...], user: [...] }

// Split into chunks
const pages = chunk(items, 10); // [[1-10], [11-20], ...]

// Get first/last elements
const firstUser = first(users);
const lastUser = last(users);

// Shuffle array randomly
const randomOrder = shuffle(items);

// Sort by key or function
const sorted = sortBy(users, 'name', 'asc');
const custom = sortBy(users, (u) => u.age, 'desc');

// Partition based on condition
const [active, inactive] = partition(users, (u) => u.isActive);
```

**Available functions:**

- `uniqueBy(arr, key)` - Unique elements by property
- `groupBy(arr, key)` - Group by property
- `chunk(arr, size)` - Split into chunks
- `checkArrEquality(arr1, arr2)` - Deep equality check
- `reverseArr(arr)` - Reverse array
- `reject(arr, predicate)` - Opposite of filter
- `count(arr, predicate?)` - Count matching elements
- `pushIf(arr, element, condition)` - Conditional push
- `first(arr)` - First element
- `last(arr)` - Last element
- `unique(arr)` - Unique primitives
- `flatten(arr)` - Flatten one level
- `flattenDeep(arr)` - Flatten all levels
- `compactArr(arr)` - Remove falsy values
- `sample(arr)` - Random element
- `sampleSize(arr, n)` - N random elements
- `shuffle(arr)` - Randomize order
- `difference(arr1, arr2)` - Elements in arr1 not in arr2
- `intersection(arr1, arr2)` - Common elements
- `union(arr1, arr2)` - All unique elements
- `without(arr, ...values)` - Remove specific values
- `zip(...arrays)` - Zip arrays into tuples
- `fromPairs(pairs)` - Create object from pairs
- `sum(arr)` - Sum of numbers
- `average(arr)` - Average of numbers
- `min(arr)` - Minimum value
- `max(arr)` - Maximum value
- `partition(arr, predicate)` - Split by condition
- `sortBy(arr, keyOrFn, order)` - Sort by key/function

---

### String Utils

Comprehensive string manipulation utilities.

```tsx
import {
  capitalize,
  truncate,
  slugify,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
} from 'everyday-helper/utils';

// Case transformations
const camel = toCamelCase('hello-world'); // 'helloWorld'
const pascal = toPascalCase('hello-world'); // 'HelloWorld'
const snake = toSnakeCase('HelloWorld'); // 'hello_world'
const kebab = toKebabCase('HelloWorld'); // 'hello-world'

// Text formatting
const title = capitalize('hello'); // 'Hello'
const short = truncate('Long text here', 10); // 'Long te...'
const url = slugify('Hello World!'); // 'hello-world'

// String checks
const similar = isStringSimilar('dashbord', 'dashboard', 2); // true
const hasMatch = includesIgnoreCase('Hello World', 'WORLD'); // true
const isEqual = eqIgnoreCase('Hello', 'hello'); // true
```

**Available functions:**

- `isStringSimilar(input, target, maxDiff)` - Fuzzy string matching
- `concatIf(s1, s2, condition)` - Conditional concatenation
- `isString(v)` - Type check
- `eqIgnoreCase(s1, s2)` - Case-insensitive equality
- `includesIgnoreCase(s1, s2)` - Case-insensitive includes
- `addAsteriskIf(s, condition)` - Conditional asterisk
- `compactStr(s)` - Remove all whitespace
- `toUpperSnakeCase(str)` - UPPER_SNAKE_CASE
- `toSnakeCase(str)` - snake_case
- `toCamelCase(str)` - camelCase
- `toPascalCase(str)` - PascalCase
- `toKebabCase(str)` - kebab-case
- `capitalize(str)` - Capitalize first letter
- `capitalizeWords(str)` - Capitalize each word
- `truncate(str, maxLength, suffix)` - Truncate with ellipsis
- `reverse(str)` - Reverse string
- `countOccurrences(str, substr)` - Count substring
- `normalizeWhitespace(str)` - Normalize spaces
- `padStart/padEnd(str, length, char)` - Pad string
- `trim/trimStart/trimEnd(str, chars)` - Trim characters
- `startsWith/endsWith(str, search, ignoreCase)` - String checks
- `repeat(str, count)` - Repeat string
- `slugify(str)` - URL-friendly string

---

### Object Utils

Powerful object manipulation utilities.

```tsx
import {
  pick,
  omit,
  get,
  set,
  merge,
  deepMerge,
  cleanObject,
  mapValues,
} from 'everyday-helper/utils';

const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  role: 'admin',
  metadata: { age: 30 },
};

// Pick specific keys
const basicInfo = pick(user, ['name', 'email']);
// { name: 'John', email: 'john@example.com' }

// Omit keys
const withoutEmail = omit(user, ['email']);

// Get nested values safely
const age = get(user, 'metadata.age', 0); // 30

// Set nested values
set(user, 'metadata.city', 'NYC');

// Merge objects
const updated = merge(user, { status: 'active' });
const deepMerged = deepMerge(user, { metadata: { location: 'US' } });

// Clean empty values
const cleaned = cleanObject({ name: 'John', email: '', age: null });
// { name: 'John' }

// Transform values
const uppercased = mapValues(user, (val) => (typeof val === 'string' ? val.toUpperCase() : val));
```

**Available functions:**

- `pick(obj, keys)` - Select specific keys
- `omit(obj, keys)` - Remove specific keys
- `merge(target, source)` - Shallow merge
- `cleanObject(obj)` - Remove null/undefined/empty
- `areAllValuesComplete(obj)` - Check if all values are filled
- `isObject(o)` - Type check
- `keys(o)` - Get keys (typed)
- `values(o)` - Get values (typed)
- `entries(o)` - Get entries (typed)
- `deepClone(obj)` - Deep clone via JSON
- `deepMerge(target, source)` - Recursive merge
- `isEqual(obj1, obj2)` - Deep equality
- `get(obj, path, defaultValue)` - Safe nested get
- `set(obj, path, value)` - Safe nested set
- `has(obj, path)` - Check nested property
- `invert(obj)` - Swap keys and values
- `mapValues(obj, fn)` - Transform values
- `mapKeys(obj, fn)` - Transform keys
- `deepFreeze(obj)` - Deep freeze
- `filterObject(obj, predicate)` - Filter properties
- `unflatten(obj)` - Convert dot-notation to nested

---

### Date Utils

Comprehensive date utilities powered by dayjs.

```tsx
import {
  formatDate,
  formatRelativeTime,
  isToday,
  isYesterday,
  isFuture,
  addToDate,
  getDateDifference,
} from 'everyday-helper/utils';
import { DateFormats } from 'everyday-helper/constants';

// Format dates
const formatted = formatDate(new Date(), DateFormats.DD_MM_YYYY_WITH_DOT);
// '02.12.2025'

const relative = formatRelativeTime(new Date('2025-11-30'));
// '2 days ago'

// Date checks
if (isToday(someDate)) {
  console.log('Date is today!');
}

if (isYesterday(someDate)) {
  console.log('Date was yesterday');
}

// Date manipulation
const nextWeek = addToDate(new Date(), 7, 'day');
const lastMonth = subtractFromDate(new Date(), 1, 'month');

// Date comparison
const daysDiff = getDateDifference(date1, date2, 'day');
const age = getAge('1990-01-01'); // Age in years
```

**Available functions:**

- `toDayjs(date)` - Convert to dayjs object
- `formatDate(date, format)` - Format date
- `formatRelativeTime(date, baseDate?)` - Relative time string
- `isValidDate(date)` - Validate date
- `isPast/isFuture(date)` - Check if past/future
- `isToday/isYesterday/isTomorrow(date)` - Day checks
- `isSameDay(date1, date2)` - Compare days
- `isBetweenDates(date, start, end)` - Range check
- `getDateDifference(date1, date2, unit)` - Calculate difference
- `addToDate/subtractFromDate(date, amount, unit)` - Manipulate dates
- `startOf/endOf(date, unit)` - Get start/end of period
- `formatDateRange(start, end, format)` - Format range
- `getAge(birthdate)` - Calculate age
- `parseDate(dateString, format)` - Parse with format
- `toISOString(date)` - Convert to ISO string
- `toUnixTimestamp(date)` - Convert to Unix timestamp
- `now()` - Current date/time
- `compareDates(date1, date2)` - Compare dates

---

### Function Utils

Higher-order functions and function utilities.

```tsx
import { debounce, throttle, memoize, once, retry } from 'everyday-helper/utils';

// Debounce function calls
const debouncedSearch = debounce((query) => {
  fetchResults(query);
}, 500);

// Throttle function calls
const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 100);

// Memoize expensive calculations
const expensiveCalc = memoize((a, b) => {
  // Complex calculation
  return result;
});

// Run function only once
const initialize = once(() => {
  console.log('Initialized!');
});

// Retry failed async operations
const fetchData = retry(
  async () => {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Failed');
    return response.json();
  },
  3,
  1000,
); // 3 retries, 1s delay
```

**Available functions:**

- `noop()` - No-op function
- `compose(...fns)` - Function composition
- `debounce(fn, wait)` - Debounce with cancel
- `throttle(fn, wait)` - Throttle with cancel
- `memoize(fn, resolver?)` - Memoization
- `once(fn)` - Call once
- `delay(fn, wait, ...args)` - Delayed execution
- `retry(fn, retries, delayMs)` - Retry async function
- `curry(fn)` - Curry function
- `flip(fn)` - Flip arguments
- `partial(fn, ...partials)` - Partial application
- `negate(predicate)` - Negate predicate
- `safeCall(fn, ...args)` - Safe function call
- `tryCatch(fn)` - Sync try-catch wrapper
- `tryCatchAsync(fn)` - Async try-catch wrapper
- `rateLimit(fn, minDelay)` - Rate limiting
- `identity(value)` - Identity function
- `constant(value)` - Constant function
- `firstSeveral(arr, n)` - First n elements
- `lastSeveral(arr, n)` - Last n elements

---

### Common Utils

General-purpose utility functions.

```tsx
import { isEmpty, isNotEmpty, isNulOrUndefined, getImageUrl } from 'everyday-helper/utils';

// Check empty values
if (isEmpty(value)) {
  // Handles null, undefined, '', [], {}
}

if (isNotEmpty(value)) {
  // Value is not empty
}

// Null/undefined checks
if (isNulOrUndefined(value)) {
  // value is null or undefined
}

// Generate image URLs
const imageUrl = getImageUrl(fileId, 'https://api.example.com');
// 'https://api.example.com/fs/v1/files/123/download'
```

---

### Convert Utils

File and data conversion utilities.

```tsx
import {
  convertFileToBase64,
  convertBase64ToFile,
  extractBase64FromDataUrl,
  fileToArrayBuffer,
} from 'everyday-helper/utils';

// File to Base64
const base64 = await convertFileToBase64(file);
// 'data:image/png;base64,iVBORw0KG...'

// Base64 to File
const file = convertBase64ToFile(base64String, 'image.png', 'image/png');

// Extract Base64 from data URL
const pureBase64 = extractBase64FromDataUrl(dataUrl);

// File to ArrayBuffer
const buffer = await fileToArrayBuffer(file);
```

---

### API Utils

API and HTTP-related utilities.

```tsx
import { getEndpoint, generateQuery, isLoggedIn } from 'everyday-helper/utils';

// Get role-based endpoints
const endpoint = getEndpoint('admin', 'users', sharedFeatures);

// Generate query strings
const query = generateQuery({
  page: 1,
  search: 'john',
  filters: ['active', 'verified'],
  empty: '',
});
// 'page=1&search=john&filters=active&filters=verified'

// Check login status
if (isLoggedIn('access_token')) {
  // User is logged in
}
```

---

### Phone Utils

Azerbaijan phone number utilities.

```tsx
import {
  hasAzerbaijanCountryCode,
  withAzerbaijanCountryCode,
  normalizePhone,
} from 'everyday-helper/utils';

// Check for country code
const hascode = hasAzerbaijanCountryCode('0501234567'); // false

// Add country code
const phone = withAzerbaijanCountryCode('501234567');
// '+994501234567'

// Normalize phone number
const normalized = normalizePhone('0501234567');
// '+994501234567'
```

---

### Animation Utils

CSS animation helper utilities.

```tsx
import { animate, fadeIn, slideInUp, bounceIn } from 'everyday-helper/utils';

function AnimatedComponent() {
  return (
    <>
      <div {...fadeIn(0)}>Fades in first</div>
      <div {...slideInUp(1)}>Slides in second</div>
      <div {...bounceIn(2)}>Bounces in third</div>

      {/* Custom animation */}
      <div
        {...animate({
          type: 'fade-in',
          order: 3,
          delay: 0.5,
          className: 'extra-class',
        })}
      >
        Custom timing
      </div>
    </>
  );
}
```

**Note:** Import animations CSS once in your app:

```tsx
import 'hh-toolkit/animations.css';
```

**Available animations:**

- `fadeIn(order?, className?, style?)`
- `slideInUp(order?, className?, style?)`
- `slideInDown(order?, className?, style?)`
- `slideInLeft(order?, className?, style?)`
- `slideInRight(order?, className?, style?)`
- `scaleIn(order?, className?, style?)`
- `bounceIn(order?, className?, style?)`

---

## Library Helpers

### cn - Class Name Utility

Conditionally combine class names.

```tsx
import cn from 'everyday-helper/lib';

function Button({ isActive, isPrimary, className }) {
  return (
    <button
      className={cn(
        'btn',
        {
          active: isActive,
          'btn-primary': isPrimary,
        },
        className,
      )}
    >
      Click me
    </button>
  );
}
```

---

### CookieManager

Simple cookie management.

```tsx
import { CookieManager } from 'everyday-helper/lib';

// Set cookie
CookieManager.set('user_token', 'abc123', {
  domain: '.example.com',
  path: '/',
  expires: 7, // 7 days
  secure: true,
  sameSite: 'Strict',
});

// Get cookie
const token = CookieManager.get('user_token');

// Remove cookie
CookieManager.remove('user_token');
```

---

### FormDataBuilder

Build FormData objects with ease.

```tsx
import { createFormData } from 'everyday-helper/lib';

const formData = createFormData()
  .append('name', 'John')
  .append('email', 'john@example.com')
  .appendFile('avatar', avatarFile)
  .appendJSON('metadata', { age: 30 })
  .appendArray('tags', [{ id: 1, name: 'tech' }])
  .build();

// With options
const formData2 = createFormData({
  skipNull: true,
  skipUndefined: true,
  skipEmptyStrings: true,
})
  .appendFields({ name: 'John', age: 30 })
  .build();
```

---

### Storage Helpers

Type-safe localStorage and sessionStorage wrappers.

```tsx
import { local, session } from 'everyday-helper/lib';

// Local storage
local.set('user', { id: 1, name: 'John' });
const user = local.get<User>('user');
const userOrDefault = local.getOr('user', { id: 0, name: 'Guest' });
local.remove('user');
local.clear();

// Session storage
session.set('temp_data', { foo: 'bar' });
const data = session.get('temp_data');
session.has('temp_data'); // true
const allKeys = session.keys();
```

---

### lazyLoad

Lazy load React components with retry logic.

```tsx
import lazyLoad from 'everyday-helper/lib';

const components = lazyLoad(
  {
    HomePage: () => import('./pages/Home'),
    AboutPage: () => import('./pages/About'),
    Dashboard: () => import('./pages/Dashboard'),
  },
  {
    retries: 2,
    delayMs: 250,
  },
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<components.HomePage />} />
        <Route path="/about" element={<components.AboutPage />} />
      </Routes>
    </Suspense>
  );
}
```

---

## Constants

### DateFormats

Predefined date format strings for use with date utilities.

```tsx
import { DateFormats } from 'everyday-helper/constants';

DateFormats.MMMM_DD_YYYY; // "MMMM DD, YYYY"
DateFormats.DD_MM_YYYY_WITH_DOT; // "DD.MM.YYYY"
DateFormats.DD_MM_YYYY_WITH_SLASH; // "DD/MM/YYYY"
DateFormats.YYYY_MM_DD_WITH_HYPEN; // "YYYY-MM-DD"
DateFormats.DD_MM_YYYY_WITH_HYPHEN; // "DD-MM-YYYY"
DateFormats.DD_MM_YYYY_HH_mm; // "DD/MM/YYYY HH:mm"
DateFormats.DD_MMM_YYYY_WITH_SPACE; // "DD MMM YYYY"
```

---

### EventTypes

Comprehensive enum of DOM event types.

```tsx
import { EventTypes } from 'everyday-helper/constants';

// Mouse events
EventTypes.CLICK;
EventTypes.MOUSE_MOVE;
EventTypes.MOUSE_ENTER;

// Keyboard events
EventTypes.KEY_DOWN;
EventTypes.ESCAPE;
EventTypes.ARROW_LEFT;

// Form events
EventTypes.SUBMIT;
EventTypes.CHANGE;
EventTypes.FOCUS;

// Window events
EventTypes.RESIZE;
EventTypes.SCROLL;
EventTypes.LOAD;

// And many more...
```

---

### SortOrders

Sort order constants.

```tsx
import { SortOrders } from 'everyday-helper/constants';

SortOrders.ASC; // 'asc'
SortOrders.DESC; // 'desc'
```

---

## Import Paths

You can import from specific paths for better tree-shaking:

```tsx
// Import all from main entry
import { useDebounce, formatDate, cn } from 'everyday-helper';

// Or import from specific modules
import { useDebounce } from 'everyday-helper/hooks';
import { formatDate } from 'everyday-helper/utils';
import { cn } from 'everyday-helper/lib';
import { DateFormats } from 'everyday-helper/constants';
```

---

## TypeScript Support

This package is written in TypeScript and includes full type definitions. You'll get autocomplete and type checking out of the box.

```tsx
import { formatDate, pick } from 'everyday-helper';

// Types are inferred automatically
const date = formatDate(new Date()); // string | undefined
const user = pick({ name: 'John', age: 30 }, ['name']); // { name: string }
```

---

## Examples

### Building a Search Component

```tsx
import { useDebounce } from 'everyday-helper/hooks';
import { isEmpty } from 'everyday-helper/utils';
import { useState, useEffect } from 'react';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (isEmpty(debouncedQuery)) {
      setResults([]);
      return;
    }

    fetch(`/api/search?q=${debouncedQuery}`)
      .then((res) => res.json())
      .then(setResults);
  }, [debouncedQuery]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Modal with Outside Click & Escape Key

```tsx
import { useOutsideClick, useEscapeKey, useScrollLock } from 'everyday-helper/hooks';
import { useRef } from 'react';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useScrollLock({ isLocked: isOpen });
  useOutsideClick(modalRef, onClose);
  useEscapeKey({ onEscape: onClose, enabled: isOpen });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-content">
        {children}
      </div>
    </div>
  );
}
```

### Data Table with Sorting

```tsx
import { sortBy, groupBy } from 'everyday-helper/utils';
import { SortOrders } from 'everyday-helper/constants';
import { useState } from 'react';

function DataTable({ data }) {
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState(SortOrders.ASC);

  const sortedData = sortBy(data, sortKey, sortOrder);
  const groupedByRole = groupBy(sortedData, 'role');

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => setSortKey('name')}>Name</th>
          <th onClick={() => setSortKey('age')}>Age</th>
          <th onClick={() => setSortKey('role')}>Role</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{row.age}</td>
            <td>{row.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```
