---
"@rokku-x/react-hook-dialog": minor
---

Expose dialog instance context and control functions on the value returned by `requestDialog(...)`.

The Promise returned from `requestDialog` is now an augmented `RequestDialogReturnType<T>` (`Promise<T> & { id: string; context: DialogInstanceContext }`) which allows programmatic control while the dialog is open (for example `p.context.forceCancel()`, `p.context.forceAction(...)`, or `p.context.forceDefault()`).

Optimized imports and usage of `ModalWindow` component and `useBaseModal` hook to ensure proper dialog rendering and management.