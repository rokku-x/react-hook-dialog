
import { baseVariantStyles } from "@/constants/theme";
import { FormDataToObject, IsForm } from "@/utils/utils";
import { ModalBackdrop, ModalWindow as ModalWindowBase } from "@rokku-x/react-hook-modal";
import React, { useEffect, useRef } from "react";
import type { ModalAction, ModalWindowProps } from '@/types'

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

    const actionRows: ModalAction[][] = (actions.length ? actions : [[{ title: "OK", variant: "primary" }]] as ModalAction[][]).filter((row) => row && row.length);
    const mergedVariantStyles = { ...baseVariantStyles, ...variantStyles } as Record<string, React.CSSProperties>;

    const onBackdropClick = () => backdropCancel && handleClose(modalWindowId);

    const dialogRef = useRef<HTMLDivElement | null>(null);
    const focusedActionRef = useRef<HTMLElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;

        // If an action requests initial focus (via ref), prefer it
        if (focusedActionRef.current) {
            focusedActionRef.current.focus();
        } else {
            // Focus first focusable element (close button or first action) or dialog
            const focusable = dialog.querySelector<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
            if (focusable) focusable.focus();
            else {
                dialog.setAttribute('tabindex', '-1');
                dialog.focus();
            }
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                handleClose(modalWindowId);
            } else if (e.key === 'Tab') {
                // Focus trapping
                const els = Array.from(dialog.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")).filter(Boolean);
                if (els.length === 0) {
                    e.preventDefault();
                    return;
                }
                const firstEl = els[0];
                const lastEl = els[els.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === firstEl) {
                        e.preventDefault();
                        lastEl.focus();
                    }
                } else {
                    if (document.activeElement === lastEl) {
                        e.preventDefault();
                        firstEl.focus();
                    }
                }
            }
        };

        dialog.addEventListener('keydown', handleKeyDown);
        return () => {
            dialog.removeEventListener('keydown', handleKeyDown);
            if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
        };
    }, [handleClose, modalWindowId]);

    IsForm(content) && (content = React.cloneElement(content as React.ReactElement, { ref: formRef }));

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
            >
                {showCloseButton && (
                    <button
                        type="button"
                        className={`hook-dialog-close-button ${classNames.closeButton || ''}`}
                        aria-label="Close"
                        onClick={() => handleClose(modalWindowId)}
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            transform: "translate(75%, -75%)",
                            width: 32,
                            height: 32,
                            background: "none",
                            border: "none",
                            fontSize: 21,
                            cursor: "pointer",
                            lineHeight: 1,
                            color: "#555",
                            ...styles.closeButton,
                        }}
                    >
                        ×
                    </button>
                )}

                {title && <h3 id={`${modalWindowId}-title`} className={`hook-dialog-title ${classNames.title || ''}`} style={{ margin: "0 0 15px", fontSize: 20, ...styles.title }}>{title}</h3>}
                {content && <div className={`hook-dialog-content ${classNames.content || ''}`} style={{ marginBottom: 15, color: "#555", ...styles.content }}>{content}</div>}

                <div className={`hook-dialog-actions ${classNames.actions || ''}`} style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 15, ...styles.actions }}>
                    {actionRows.map((row, rowIndex) => {
                        const leftActions = row.filter((a) => a.isOnLeft);
                        const rightActions = row.filter((a) => !a.isOnLeft);
                        const renderButton = (action: ModalAction, idx: number) => {
                            const variantStyle = mergedVariantStyles[action.variant || 'secondary'] || mergedVariantStyles.secondary;

                            return (
                                <button
                                    key={`${action.title}-${idx}`}
                                    ref={(el) => {
                                        if (action.isFocused && el) focusedActionRef.current = el;
                                    }}
                                    data-action-focused={action.isFocused ? 'true' : undefined}
                                    className={`hook-dialog-action-button hook-dialog-action-${action.variant || 'secondary'} ${classNames.actionButton || ''} ${action.className || ''}`}
                                    onClick={(e) => {
                                        try {
                                            action.onClick?.(e as React.MouseEvent<HTMLButtonElement>, action);
                                        } catch { }
                                        if (action.isSubmit && config.isReturnSubmit && formRef.current) return handleAction(modalWindowId, action, FormDataToObject(new FormData(formRef.current)));
                                        else if (action.isSubmit) formRef.current?.requestSubmit();
                                        if (action.noActionReturn) return e.stopPropagation();
                                        handleAction(modalWindowId, action);
                                    }
                                    }
                                    style={{
                                        ...{
                                            border: "none",
                                            borderRadius: 15,
                                            padding: "10px 18px",
                                            fontSize: 14,
                                            fontWeight: 800,
                                            cursor: "pointer",

                                        },
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
                            <div key={rowIndex} className={`hook-dialog-actions-row ${classNames.actionsRow || ''}`} style={{ display: "flex", gap: 8, justifyContent: "space-between", ...styles.actionsRow }}>
                                <div className="hook-dialog-actions-left" style={{ display: "flex", gap: 8 }}>
                                    {leftActions.map((action, idx) => renderButton(action, idx))}
                                </div>
                                <div className="hook-dialog-actions-right" style={{ display: "flex", gap: 8 }}>
                                    {rightActions.map((action, idx) => renderButton(action, idx))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ModalWindowBaseWithRef>
        </ModalBackdrop>
    );
}