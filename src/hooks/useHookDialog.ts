import { useBaseModal } from '@rokku-x/react-hook-modal';
import { useDialogStore } from "@/store/dialogStore";
import type { FormDataObject, ConfirmConfig, ConfirmInstance, UseHookDialogConfig, ValidValue, ModalAction, RequestDialogReturnType, UseHookDialogReturnType } from '@/types'

/**
 * Hook for displaying confirmation dialogs and alerts.
 * 
 * Returns a function to request a dialog and receive the user's response as a Promise.
 * Dialogs can be customized with titles, content, action buttons, and styling.
 * 
 * @param defaultConfig - Optional default configuration applied to all dialogs created by this hook
 * @returns A tuple containing the requestDialog function
 * 
 * @example
 * ```tsx
 * const [requestDialog] = useHookDialog();
 * 
 * const result = await requestDialog({
 *   title: 'Confirm',
 *   content: 'Are you sure?',
 *   actions: [[
 *     { title: 'Cancel', isCancel: true },
 *     { title: 'OK', variant: 'primary', value: true }
 *   ]]
 * });
 * 
 * if (result === true) {
 *   console.log('User confirmed');
 * }
 * ```
 * 
 * @example With default config
 * ```tsx
 * const [requestDialog] = useHookDialog({
 *   showCloseButton: false,
 *   backdropCancel: false
 * });
 * ```
 */
export default function useHookDialog<T = ValidValue>(defaultConfig?: UseHookDialogConfig) {
    const { addInstance, handleAction, handleClose, getContext } = useDialogStore();
    const baseModalInstance = useBaseModal();

    // Overloads allow consumers to narrow the Promise result type:
    // - When `isReturnSubmit: true` is provided in the config, the default result is a `FormDataObject` (but can be overridden via generic)
    // - Otherwise the default is `T` (the hook's generic)
    function requestDialog<U = FormDataObject>(config: ConfirmConfig & { isReturnSubmit: true }): Promise<U>
    function requestDialog<U = T>(config: ConfirmConfig): Promise<U> {
        const id = Math.random().toString(36).substring(2, 6);

        //check actions if there are multiple focused actions
        const focusedActions = config.actions?.flat().filter(action => action.isFocused) || [];
        if (focusedActions.length > 1) console.warn(`useHookDialog: Multiple actions are marked as isFocused in dialog "${id}". Only one action should be focused.`);

        //check actions if there is at least one action marked as cancel
        const hasCancelAction = config.actions?.some(row => row.some(action => action.isCancel));

        // If no cancel action is defined, and backdropCancel config is undefined, we treat backdrop clicks as cancel
        const backdropCancel = config.backdropCancel ?? defaultConfig?.backdropCancel ?? !hasCancelAction;

        const mergedConfig: ConfirmConfig = {
            ...defaultConfig,
            ...config,
            classNames: {
                ...defaultConfig?.classNames,
                ...config.classNames,
            },
            styles: {
                ...defaultConfig?.styles,
                ...config.styles,
            },
            variantStyles: {
                ...defaultConfig?.variantStyles,
                ...config.variantStyles,
            },
            backdropCancel,
        };

        const promise = new Promise<U>((resolve, reject) => {
            const newInstance: ConfirmInstance<U> = {
                id,
                config: mergedConfig,
                resolve,
                reject,
            };
            addInstance(newInstance);
        });

        Object.defineProperties(promise, {
            'context': { get() { return getContext(id); }, enumerable: true, configurable: false },
            'id': { get() { return id }, enumerable: true, configurable: false }
        })

        return promise as RequestDialogReturnType<U>;
    };

    return [requestDialog, getContext] as UseHookDialogReturnType<T>;
}

