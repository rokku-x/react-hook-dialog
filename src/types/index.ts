/**
 * Valid return values from dialog actions.
 * Can be string, number, boolean, or undefined.
 */
export type ValidValue = string | number | boolean | undefined;

/**
 * Available button variant types for styling action buttons.
 */
export const variantTypes = ['primary', 'secondary', 'danger', 'success', 'warning', 'info', 'neutral'] as const;

/**
 * Type union of all available button variants.
 * @see variantTypes
 */
export type ModalVariant = typeof variantTypes[number];

/**
 * Configuration for an individual action button in a dialog.
 *
 * @example
 * ```tsx
 * const action: ModalAction = {
 *   title: 'Delete',
 *   value: true,
 *   variant: 'danger',
 *   onClick: (e) => console.log('Clicked!')
 * };
 * ```
 */
export interface ModalAction {
    /** The label or content displayed on the button */
    title: React.ReactNode;

    /** The value returned when this action is clicked */
    value?: ValidValue;

    /** If true, treats this as a cancel button (respects rejectOnCancel config) */
    isCancel?: boolean;

    /** If true, positions the button on the left side of the row */
    isOnLeft?: boolean;

    /** If true, this action should receive initial focus when the dialog opens */
    isFocused?: boolean;

    /** Visual style variant for the button */
    variant?: ModalVariant;

    /** Additional CSS class to apply to the button */
    className?: string;

    /** Inline styles to apply to the button */
    style?: React.CSSProperties;

    /** If true, renders the button as `type="submit"` to participate in native form submission */
    isSubmit?: boolean;

    /** If true, the button will NOT perform the default dialog action (won't call `handleAction`) — useful for custom handlers */
    noActionReturn?: boolean;

    /**
     * Click handler called before the default action handling.
     * Can receive both the event and action object, or just be called with no args.
     */
    onClick?: ((event: React.MouseEvent<HTMLButtonElement>, action: ModalAction) => void) | (() => void);
}

/**
 * Custom CSS class names for dialog elements.
 * All properties are optional and will be appended to default classes.
 *
 * @example
 * ```tsx
 * const classNames: DialogClassNames = {
 *   dialog: 'my-custom-dialog',
 *   actionButton: 'my-button'
 * };
 * ```
 */
export interface DialogClassNames {
    /** CSS class for the backdrop overlay */
    backdrop?: string;

    /** CSS class for the dialog container */
    dialog?: string;

    /** CSS class for the close button */
    closeButton?: string;

    /** CSS class for the title element */
    title?: string;

    /** CSS class for the content container */
    content?: string;

    /** CSS class for the actions container */
    actions?: string;

    /** CSS class for each action button row */
    actionsRow?: string;

    /** CSS class for action buttons */
    actionButton?: string;
}

/**
 * Custom inline styles for dialog elements.
 * All properties are optional and will be merged with default styles.
 *
 * @example
 * ```tsx
 * const styles: DialogStyles = {
 *   dialog: { borderRadius: '20px' },
 *   actionButton: { fontWeight: 'bold' }
 * };
 * ```
 */
export interface DialogStyles {
    /** Inline styles for the backdrop overlay */
    backdrop?: React.CSSProperties;

    /** Inline styles for the dialog container */
    dialog?: React.CSSProperties;

    /** Inline styles for the close button */
    closeButton?: React.CSSProperties;

    /** Inline styles for the title element */
    title?: React.CSSProperties;

    /** Inline styles for the content container */
    content?: React.CSSProperties;

    /** Inline styles for the actions container */
    actions?: React.CSSProperties;

    /** Inline styles for each action button row */
    actionsRow?: React.CSSProperties;

    /** Inline styles for action buttons */
    actionButton?: React.CSSProperties;
}

/**
 * Custom styles for button variants.
 * Allows overriding the default color scheme for each variant type.
 *
 * @example
 * ```tsx
 * const variantStyles: DialogVariantStyles = {
 *   primary: { backgroundColor: '#7c3aed', color: '#fff' }
 * };
 * ```
 */
export type DialogVariantStyles = Partial<Record<ModalVariant, React.CSSProperties>>;

/**
 * Configuration options for a dialog call.
 *
 * @example
 * ```tsx
 * const config: ConfirmConfig = {
 *   title: 'Confirm',
 *   content: 'Are you sure?',
 *   actions: [[
 *     { title: 'Cancel', isCancel: true },
 *     { title: 'OK', variant: 'primary', value: true }
 *   ]]
 * };
 * ```
 */
export interface ConfirmConfig {
    /** Dialog title (can be string or React element) */
    title?: React.ReactNode;

    /** Dialog content (can be string or React element) */
    content?: React.ReactNode;

    /** If true, allows closing the dialog by clicking the backdrop (default: false) */
    backdropCancel?: boolean;

    /** If true, rejects the promise on cancel instead of resolving (default: true) */
    rejectOnCancel?: boolean;

    /** Value returned/rejected when dialog is cancelled */
    defaultCancelValue?: ValidValue;

    /** If true, shows the X close button in the top-right corner (default: false) */
    showCloseButton?: boolean;

    /** Custom CSS class names for dialog elements */
    classNames?: DialogClassNames;

    /** Custom inline styles for dialog elements */
    styles?: DialogStyles;

    /** Custom styles for button variants */
    variantStyles?: DialogVariantStyles;

    /**
     * Array of action button rows. Each inner array represents a row of buttons.
     * Buttons without isOnLeft flag are positioned on the right.
     */
    actions?: ModalAction[][];

    /**
     * If true and `content` is a `<form>`, clicking a submit action will return the submitted
     * form values as the dialog result instead of using the action's `value`.
     */
    isReturnSubmit?: boolean;
}

/**
 * Default configuration options for the useHookDialog hook.
 * These settings apply to all dialogs created by the hook unless overridden per-call.
 *
 * @example
 * ```tsx
 * const defaultConfig: UseHookDialogConfig = {
 *   showCloseButton: false,
 *   backdropCancel: false,
 *   styles: { dialog: { maxWidth: '500px' } }
 * };
 * ```
 */
export interface UseHookDialogConfig {
    /** If true, allows closing dialogs by clicking the backdrop (default: false) */
    backdropCancel?: boolean;

    /** If true, rejects the promise on cancel instead of resolving (default: true) */
    rejectOnCancel?: boolean;

    /** Default value returned/rejected when dialog is cancelled */
    defaultCancelValue?: ValidValue;

    /** If true, shows the X close button in the top-right corner (default: false) */
    showCloseButton?: boolean;

    /** Default CSS class names for dialog elements */
    classNames?: DialogClassNames;

    /** Default inline styles for dialog elements */
    styles?: DialogStyles;

    /** Default styles for button variants */
    variantStyles?: DialogVariantStyles;
}

/**
 * Internal interface representing a dialog instance in the store.
 * Extends ConfirmConfig with instance-specific properties.
 * @internal
 */
export interface ConfirmInstance<T = ValidValue> extends ConfirmConfig {
    /** Unique identifier for this dialog instance */
    id: string

    /** The configuration used for this dialog */
    config: ConfirmConfig;

    /** Promise resolve function */
    resolve: (value: T) => void;

    /** Promise reject function */
    reject: (reason?: any) => void;
}

/**
 * Props for the ModalWindow component.
 * @internal
 */
export interface ModalWindowProps {
    /** Callback to close the modal */
    handleClose: (id: string) => void;

    /** Callback when an action button is clicked */
    handleAction: HandleActionCallback;

    /** Dialog configuration */
    config: ConfirmConfig;

    /** Unique identifier for this modal window */
    modalWindowId: string;
}

interface HandleActionCallback {
    (id: string, action: ModalAction, formValues: FormDataObject): void;
    (id: string, action: ModalAction): void;
}

/**
 * Friendly Form Data object type
 */
export type FormDataObject = Record<string, FormDataEntryValue | FormDataEntryValue[]>;

/** Function type for requesting a dialog*/
export interface RequestDialog<U> {
    <U = FormDataObject>(config: ConfirmConfig & { isReturnSubmit: true }): RequestDialogReturnType<U>;
    <U = ValidValue>(config: ConfirmConfig): RequestDialogReturnType<U>;
}

/** Context information for a dialog instance */
export type DialogInstanceContext = {
    id: string;
    config: any;
    forceCancel: (forceReject?: boolean) => void,
    forceAction: (action: ModalAction) => void,
    forceDefault: () => void
};

/** Return type of the requestDialog function with added context property */
export type RequestDialogReturnType<T> = Promise<T> & { id: string, context: DialogInstanceContext };

/** Return type of the useHookDialog hook */
export type UseHookDialogReturnType<T> = [requestDialog: RequestDialog<T>, getContext: (id: string) => DialogInstanceContext]; 
