# @rokku-x/react-hook-dialog

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
