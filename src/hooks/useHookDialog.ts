import React, { useCallback } from "react";
import { useBaseModal } from '@rokku-x/react-hook-modal';
import ModalWindow from "@/components/ModalWindow";
import storeDialog from "@/store/dialog";
import type { FormDataObject, ConfirmConfig, ConfirmInstance, UseHookDialogConfig, ValidValue, ModalAction } from '@/types'

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
    const baseModalInstance = useBaseModal({ rendererId: defaultConfig?.instanceId });
    const { addInstance, handleAction, handleClose, rendererDefaultConfig } = storeDialog(defaultConfig?.instanceId)();
    // Overloads allow consumers to narrow the Promise result type:
    // - When `isReturnSubmit: true` is provided in the config, the default result is a `FormDataObject` (but can be overridden via generic)
    // - Otherwise the default is `T` (the hook's generic)
    function requestDialog<U = FormDataObject>(config: ConfirmConfig & { isReturnSubmit: true }): Promise<U>
    function requestDialog<U = T>(config: ConfirmConfig): Promise<U>
    function requestDialog<U = any>(config: ConfirmConfig): Promise<U> {
        return new Promise<U>((resolve, reject) => {
            const id = Math.random().toString(36).substring(2, 6);
            const mergedConfig: ConfirmConfig = {
                ...rendererDefaultConfig,
                ...defaultConfig,
                ...config,
                classNames: {
                    ...rendererDefaultConfig?.classNames,
                    ...defaultConfig?.classNames,
                    ...config.classNames,
                },
                styles: {
                    ...rendererDefaultConfig?.styles,
                    ...defaultConfig?.styles,
                    ...config.styles,
                },
                variantStyles: {
                    ...rendererDefaultConfig?.variantStyles,
                    ...defaultConfig?.variantStyles,
                    ...config.variantStyles,
                }
            };
            const newInstance: ConfirmInstance<U> = {
                id,
                config: mergedConfig,
                resolve,
                reject,
            };
            addInstance(newInstance);

            newInstance.id = baseModalInstance.pushModal(id, React.createElement(ModalWindow, { config: mergedConfig, modalWindowId: id, handleClose, handleAction }));
        });
    };

    return [requestDialog];
}