# @rokku-x/react-hook-dialog

## 1.2.4

### Patch Changes

- d260d85: docs: update README to include style import options for submodules

## 1.2.3

### Patch Changes

- 3f0a9d3: feat: enhance CSS injection in Vite config to support ESM and CJS output

## 1.2.2

### Patch Changes

- 40edd81: fix: update @rokku-x/react-hook-modal version to 0.10.1

## 1.2.1

### Patch Changes

- 780e345: chore: update @rokku-x/react-hook-modal to version 0.10.0 and enhance README with logo
- 780e345: patch: enable client-side rendering by adding 'use client' directive
- f7b3cac: feat: enhance dialog management by adding optional instance ID to UseHookDialogConfig and updating storeDialog usage

## 1.2.0

### Minor Changes

- afcbee4: feat: introduce BaseDialogRenderer for default configuration and enhance dialog management

### Patch Changes

- afcbee4: patch: exported types
- afcbee4: patch: update react-hook-modal to 0.9.4
- afcbee4: patch: readme update
- afcbee4: patch: css bundling

## 1.1.0

### Minor Changes

- e6b72e5: Expose dialog instance context and control functions on the value returned by `requestDialog(...)`.

  The Promise returned from `requestDialog` is now an augmented `RequestDialogReturnType<T>` (`Promise<T> & { id: string; context: DialogInstanceContext }`) which allows programmatic control while the dialog is open (for example `p.context.forceCancel()`, `p.context.forceAction(...)`, or `p.context.forceDefault()`).

  Optimized imports and usage of `ModalWindow` component and `useBaseModal` hook to ensure proper dialog rendering and management.

## 1.0.4

### Patch Changes

- 8f04549: feat: update README with examples and best practices; modify package.json and bun.lock for dependency updates; enhance Vite config for directive preservation
- 8f04549: feat: add screenshot examples and Playwright tests for dialog components
- 5a00b72: test: add screenshot tests for dialog examples

## 1.0.3

### Patch Changes

- 12fa47b: fix: type being overwritten

## 1.0.2

### Patch Changes

- 799a12a: feat: update workflow run names for clarity and consistency

## 1.0.1

### Patch Changes

- 8641055: feat: enhance release workflow to detect version/changelog changes and exit early if none found
  feat: add check for .changeset MD files in version workflow and exit early if none found
  fix: update CI workflow to use Node.js version 24

## 1.0.0

### Major Changes

- 70ffb69: clean major release

## 1.0.0

### Major Changes

- 2615558: - feat: enhance useHookDialog with generic types for better type safety

  - Updated useHookDialog to accept a generic type parameter for more flexible return types.
  - Modified requestDialog function to support overloads for different return types based on config.
  - Adjusted ConfirmInstance and dialogStore to accommodate the new generic type.

  refactor: remove unused index.test.ts file

  - Deleted the index.test.ts file as it contained no meaningful tests.

  chore: update index.ts to ensure proper export of useHookDialog

  - Ensured consistent export of useHookDialog from index.ts.

  fix: improve dialogStore typings for better type inference

  - Updated DialogStore interface to use generics for ConfirmInstance.
  - Enhanced type safety in addInstance and getInstance methods.

  chore: remove outdated types from index.d.ts

  - Deleted index.d.ts file as it was no longer needed.

  feat: implement FormData utility functions

  - Added FormDataToObject function to convert FormData to a plain object.
  - Introduced FormDataValue and FormDataObject types for better type handling.

  chore: update tsconfig.json to exclude test files

  - Modified tsconfig.json to exclude test files from compilation.

  chore: add MIT license file

  - Included a LICENSE file with MIT license terms.

  test: add comprehensive tests for ModalWindow component

  - Created ModalWindow.test.tsx with various test cases covering rendering, actions, and interactions.

  feat: define base variant styles for buttons

  - Introduced baseVariantStyles constant for default button styling.

  test: add tests for useHookDialog hook

  - Implemented tests for useHookDialog to verify dialog instance management and configuration merging.

  chore: create separate tsconfig for testing

  - Added tsconfig.test.json for test-specific TypeScript configurations.

### Patch Changes

- 41efaa3: feat: refactor CI workflows to fully integrate Bun for dependency management and testing
- bcaa15e: feat: update workflows to enhance release process and version management
- d0f6105: feat: migrate workflows to use Bun for dependency management and caching
- 05adc22: feat: update CI workflows to use Bun for dependency management and caching
  refactor: adjust ModalWindow tests to correctly assert action arguments
