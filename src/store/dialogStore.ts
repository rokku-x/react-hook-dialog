import ModalWindow from '@/components/ModalWindow';
import type { ConfirmInstance, ModalAction, ValidValue } from '@/types';
import { useBaseModal } from '@rokku-x/react-hook-modal';
import React from 'react';
import { create } from 'zustand';

/**
 * Zustand store interface for managing dialog instances.
 * Maintains a centralized list of active dialog instances.
 * @internal
 */
interface DialogStore<T = ValidValue> {
    /** Array of currently active dialog instances */
    instances: ConfirmInstance<T>[];

    /** Add a new dialog instance to the store */
    addInstance: (instance: ConfirmInstance<T>) => void;

    /** Remove a dialog instance from the store by ID */
    removeInstance: (id: string) => void;

    /** Handle closing a dialog instance */
    handleClose: (id: string, isForceCancel?: boolean) => void;

    /** Handle an action taken on a dialog instance */
    handleAction: (id: string, action: ModalAction) => void;

    /** Get a dialog instance by ID */
    getInstance: (id: string) => ConfirmInstance<T> | undefined;

    /** Get the context of a dialog instance by ID */
    getContext: (id: string) => { id: string; config: any; forceCancel: () => void } | undefined;
}

// Get base modal instance for managing modal stack
const baseModalInstance = useBaseModal();

/**
 * Zustand store for managing dialog instances.
 * Provides centralized state management for all active dialogs.
 * 
 * @internal
 * @example
 * ```tsx
 * const { addInstance, removeInstance, getInstance } = useDialogStore();
 * ```
 */
export const useDialogStore = create<DialogStore<any>>((set, get) => ({
    instances: [],
    addInstance: (instance: ConfirmInstance) => {
        set((state) => ({
            instances: [...state.instances, instance],
        }));
        instance.id = baseModalInstance.pushModal(instance.id, React.createElement(ModalWindow, { config: instance.config, modalWindowId: instance.id, handleClose: get().handleClose, handleAction: get().handleAction }));
    },
    removeInstance: (id: string) =>
        set((state) => ({
            instances: state.instances.filter((m) => m.id !== id),
        })),
    handleClose: (id: string, isForceCancel: boolean = false) => {
        const modal = get().getInstance(id);
        if (!modal) return;
        baseModalInstance.popModal(id);

        if (modal.config.rejectOnCancel !== false || isForceCancel) modal.reject(modal.config.defaultCancelValue);
        else modal.resolve(modal.config.defaultCancelValue);

        get().removeInstance(id);
    },
    handleAction: (id: string, action: ModalAction) => {
        const modal = get().getInstance(id);
        if (!modal) return;
        baseModalInstance.popModal(id);

        if (action.isCancel) {
            if (modal.config.rejectOnCancel !== false) modal.reject(action.value);
            else modal.resolve(action.value);
        } else {
            modal.resolve(action.value);
        }

        get().removeInstance(id);
    },
    getContext: (id: string) => {
        const modal = get().getInstance(id);
        if (!modal) throw new Error(`Dialog instance with id "${id}" not found.`);
        return {
            id: modal.id,
            config: modal.config,
            forceCancel: (forceReject: boolean = true) => get().handleClose(id, forceReject),
            forceAction: (action: ModalAction) => { get().handleAction(id, action); },
            forceDefault: () => {
                const firstDefaultAction = modal.config.actions?.flat().find((action) => action.isFocused);
                if (!firstDefaultAction) throw new Error(`No default action (isFocused) defined for dialog instance with id "${id}".`);
                get().handleAction(id, firstDefaultAction);
            }
        };
    },
    getInstance: (id: string) => get().instances.find((m) => m.id === id) as ConfirmInstance | undefined,
}));
