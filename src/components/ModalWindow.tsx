
import { FormDataToObject, IsForm } from "@/utils/utils";
import { ModalBackdrop, ModalWindow as ModalWindowBase } from "@rokku-x/react-hook-modal";
import React, { useEffect, useRef } from "react";
import type { ModalAction, ModalWindowProps } from '@/types'
import './ModalWindow.css'

// Some modal window implementations may not forward refs in their type definitions.
// Create a typed alias that asserts `ModalWindowBase` can accept a ref to an HTMLDivElement
// so we can attach the dialog ref for accessibility focus management.
const ModalWindowBaseWithRef = ModalWindowBase as unknown as React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;

/**
 * Main modal window component that renders the dialog UI.
 * 
 * Displays the title, content, action buttons, and optional close button.
 * Action buttons are organized into rows and can be positioned left or right.
 * 
 * @param props - Component props
 * @param props.modalWindowId - Unique identifier for this modal instance
 * @param props.handleAction - Callback when an action button is clicked
 * @param props.handleClose - Callback when the dialog should close
 * @param props.config - Dialog configuration options
 * 
 * @internal
 */
export default function ModalWindow({ modalWindowId, handleAction, handleClose, config }: ModalWindowProps) {
    const { actions = [], title, backdropCancel, showCloseButton, classNames = {}, styles = {}, variantStyles = {} } = config;
    let { content } = config;

    const actionRows = (actions.length ? actions : [[{ title: "OK", variant: "primary" }]] as ModalAction[][]).filter((row) => row && row.length);

    const onBackdropClick = () => backdropCancel && handleClose(modalWindowId);

    const dialogRef = useRef<HTMLDivElement | null>(null);
    const focusedActionRef = useRef<HTMLElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const focusableSelector = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;

        const getFocusableElements = () =>
            Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
                (el): el is HTMLElement => Boolean(el),
            );

        const focusFirstElement = () => {
            const focusable = getFocusableElements();
            if (focusable.length) focusable[0].focus();
            else dialog.focus();
        };

        if (focusedActionRef.current) {
            focusedActionRef.current.focus();
        } else {
            focusFirstElement();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                handleClose(modalWindowId);
                return;
            }

            if (e.key !== 'Tab') return;

            const focusable = getFocusableElements();
            if (focusable.length === 0) {
                e.preventDefault();
                return;
            }

            const firstEl = focusable[0];
            const lastEl = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                }
            } else if (document.activeElement === lastEl) {
                e.preventDefault();
                firstEl.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            previouslyFocused?.focus?.();
        };
    }, [handleClose, modalWindowId, focusableSelector]);

    if (IsForm(content)) {
        content = React.cloneElement(content as React.ReactElement, { ref: formRef });
    }

    const renderButton = (action: ModalAction, idx: number) => {
        const variantStyle = variantStyles[action.variant || 'secondary'];
        const className = [
            'hook-dialog-action-button',
            `hook-dialog-action-${action.variant || 'secondary'}`,
            classNames.actionButton,
            action.className,
        ]
            .filter(Boolean)
            .join(' ');

        const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            try {
                action.onClick?.(e, action);
            } catch {
                // Keep modal stable even if onClick throws.
            }

            if (action.isSubmit && config.isReturnSubmit && formRef.current) {
                return handleAction(modalWindowId, action, FormDataToObject(new FormData(formRef.current)));
            }

            if (action.isSubmit) {
                formRef.current?.requestSubmit();
            }

            if (action.noActionReturn) {
                e.stopPropagation();
                return;
            }

            handleAction(modalWindowId, action);
        };

        return (
            <button
                key={`${action.title}-${idx}`}
                ref={(el) => {
                    if (action.isFocused && el) focusedActionRef.current = el;
                }}
                data-action-focused={action.isFocused ? 'true' : undefined}
                className={className}
                onClick={handleButtonClick}
                style={{
                    ...variantStyle,
                    ...styles.actionButton,
                    ...(action.style || {}),
                }}
            >
                {action.title}
            </button>
        );
    };

    return (
        <ModalBackdrop
            onClick={onBackdropClick}
            className={classNames.backdrop || ''}
            style={styles.backdrop}
        >
            <ModalWindowBaseWithRef
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? `${modalWindowId}-title` : undefined}
                className={classNames.dialog || ''}
                style={styles.dialog}
                tabIndex={-1}
            >
                {showCloseButton && (
                    <button
                        type="button"
                        className={[
                            'hook-dialog-close-button',
                            classNames.closeButton,
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        aria-label="Close"
                        onClick={() => handleClose(modalWindowId)}
                        style={styles.closeButton}
                    >
                        ×
                    </button>
                )}

                {title && (
                    <h3
                        id={`${modalWindowId}-title`}
                        className={['hook-dialog-title', classNames.title].filter(Boolean).join(' ')}
                        style={styles.title}
                    >
                        {title}
                    </h3>
                )}
                {content && (
                    <div className={['hook-dialog-content', classNames.content].filter(Boolean).join(' ')} style={styles.content}>
                        {content}
                    </div>
                )}

                <div className={['hook-dialog-actions', classNames.actions].filter(Boolean).join(' ')} style={styles.actions}>
                    {actionRows.map((row, rowIndex) => {
                        const leftActions = row.filter((action) => action.isOnLeft);
                        const rightActions = row.filter((action) => !action.isOnLeft);

                        return (
                            <div
                                key={rowIndex}
                                className={['hook-dialog-actions-row', classNames.actionsRow].filter(Boolean).join(' ')}
                                style={styles.actionsRow}
                            >
                                <div className="hook-dialog-actions-left">
                                    {leftActions.map(renderButton)}
                                </div>
                                <div className="hook-dialog-actions-right">
                                    {rightActions.map(renderButton)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ModalWindowBaseWithRef>
        </ModalBackdrop>
    );
}