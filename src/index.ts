/**
 * @packageDocumentation
 * react-hook-dialog - A powerful and flexible React dialog hook library
 * 
 * Provides a hook-based API for displaying confirmation dialogs, alerts, and modals
 * with rich customization options including action buttons, variants, and styling.
 * 
 * @example
 * ```tsx
 * import { BaseModalRenderer } from '@rokku-x/react-hook-dialog';
 * import { useHookDialog } from '@rokku-x/react-hook-dialog';
 * 
 * function App() {
 *   return (
 *     <>
 *       <YourComponents />
 *       <BaseModalRenderer />
 *     </>
 *   );
 * }
 * 
 * function MyComponent() {
 *   const [requestDialog] = useHookDialog();
 *   
 *   const handleConfirm = async () => {
 *     const result = await requestDialog({
 *       title: 'Confirm',
 *       content: 'Are you sure?',
 *       actions: [[
 *         { title: 'Cancel', isCancel: true },
 *         { title: 'OK', variant: 'primary', value: true }
 *       ]]
 *     });
 *   };
 * }
 * ```
 */

/**
 * Re-exports of renderer components.
 * - `BaseModalRenderer` is the upstream renderer from `@rokku-x/react-hook-modal`.
 * - `BaseDialogRenderer` is a small wrapper provided by this package that allows setting a `defaultConfig` prop.
 * Both should be mounted at the root of your application for dialogs to render.
 */
export { BaseModalRenderer } from '@rokku-x/react-hook-modal';
export { default as BaseDialogRenderer } from '@/components/BaseDialogRenderer';

/**
 * Main hook for displaying confirmation dialogs and alerts.
 * @see {@link useHookDialog}
 */
export { default as useHookDialog } from '@/hooks/useHookDialog';

// Useful exported types for consumers
export type { UseHookDialogConfig, ConfirmConfig, ModalAction, RequestDialogReturnType, DialogInstanceContext, RequestDialog, UseHookDialogReturnType } from '@/types';
