import type { ConfirmInstance, ValidValue } from '@/types';
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

    /** Get a dialog instance by ID */
    getInstance: (id: string) => ConfirmInstance<T> | undefined;
}

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
    addInstance: (instance: ConfirmInstance) =>
        set((state) => ({
            instances: [...state.instances, instance],
        })),
    removeInstance: (id: string) =>
        set((state) => ({
            instances: state.instances.filter((m) => m.id !== id),
        })),
    getInstance: (id: string) => get().instances.find((m) => m.id === id) as ConfirmInstance | undefined,
}));
