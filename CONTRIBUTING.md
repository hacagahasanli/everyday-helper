
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