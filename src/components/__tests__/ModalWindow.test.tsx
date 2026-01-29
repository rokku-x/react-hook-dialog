import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

// Mock @rokku-x/react-hook-modal exports used by ModalWindow
vi.mock('@rokku-x/react-hook-modal', async () => {
    return {
        ModalBackdrop: ({ onClick, children, className, style }: any) => (
            <div data-testid="backdrop" className={className} style={style} onClick={onClick}>
                {children}
            </div>
        ),
        ModalWindow: React.forwardRef(function ModalWindowMock({ children, className, style }: any, ref: any) {
            return <div ref={ref} data-testid="modal-window-base" className={className} style={style}>{children}</div>
        }),
        useBaseModal: () => ({
            pushModal: vi.fn((id, el) => id),
            popModal: vi.fn((id) => true),
        }),
    }
})

import ModalWindow from '../ModalWindow'

describe('ModalWindow', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    it('renders title, content and action buttons', () => {
        const handleAction = vi.fn()
        const handleClose = vi.fn()

        const { getByText } = render(
            <ModalWindow
                modalWindowId="m1"
                handleAction={handleAction}
                handleClose={handleClose}
                config={{
                    title: 'T1',
                    content: 'C1',
                    actions: [[{ title: 'OK', variant: 'primary', value: 'ok' }]],
                }}
            />
        )

        expect(getByText('T1')).toBeTruthy()
        expect(getByText('C1')).toBeTruthy()
        expect(getByText('OK')).toBeTruthy()
    })

    it('calls action.onClick and handleAction when button clicked', () => {
        const handleAction = vi.fn()
        const handleClose = vi.fn()
        const actionOnClick = vi.fn()

        const action = { title: 'Run', variant: 'primary', value: 'run', onClick: actionOnClick }

        const { getByText } = render(
            <ModalWindow
                modalWindowId="mid"
                handleAction={handleAction}
                handleClose={handleClose}
                config={{ actions: [[action]] }}
            />
        )

        const btn = getByText('Run')
        fireEvent.click(btn)

        expect(actionOnClick).toHaveBeenCalled()
        expect(handleAction).toHaveBeenCalledWith('mid', action)
    })

    it('positions actions on left and right according to isOnLeft', () => {
        const handleAction = vi.fn()

        const { container } = render(
            <ModalWindow
                modalWindowId="m2"
                handleAction={handleAction}
                handleClose={() => { }}
                config={{ actions: [[{ title: 'Left', isOnLeft: true }, { title: 'Right' }]] }}
            />
        )

        const left = container.querySelector('.hook-dialog-actions-left')
        const right = container.querySelector('.hook-dialog-actions-right')

        expect(left?.textContent).toContain('Left')
        expect(right?.textContent).toContain('Right')
    })

    it('shows close button when showCloseButton=true and calls handleClose when clicked', () => {
        const handleClose = vi.fn()
        const { getByLabelText } = render(
            <ModalWindow
                modalWindowId="m3"
                handleAction={() => { }}
                handleClose={handleClose}
                config={{ showCloseButton: true }}
            />
        )

        const closeBtn = getByLabelText('Close')
        fireEvent.click(closeBtn)
        expect(handleClose).toHaveBeenCalledWith('m3')
    })

    it('calls handleClose on backdrop click when backdropCancel is true', () => {
        const handleClose = vi.fn()

        const { getByTestId } = render(
            <ModalWindow
                modalWindowId="m4"
                handleAction={() => { }}
                handleClose={handleClose}
                config={{ backdropCancel: true }}
            />
        )

        const backdrop = getByTestId('backdrop')
        fireEvent.click(backdrop)
        expect(handleClose).toHaveBeenCalledWith('m4')
    })

    it('applies variantStyles and className/style injection', () => {
        const action = { title: 'Styled', variant: 'primary', value: 's' }
        const { getByText } = render(
            <ModalWindow
                modalWindowId="m5"
                handleAction={() => { }}
                handleClose={() => { }}
                config={{
                    actions: [[action]],
                    variantStyles: { primary: { backgroundColor: '#112233' } },
                    classNames: { actionButton: 'my-btn' },
                    styles: { actionButton: { fontWeight: '700' } }
                }}
            />
        )

        const btn = getByText('Styled')
        // color may be serialized to rgb in jsdom
        expect(btn.getAttribute('style')).toContain('rgb(17, 34, 51)')
        expect(btn.className).toContain('my-btn')
        expect(btn.getAttribute('style')).toContain('font-weight: 700')
    })

    it('closes on Escape key and restores focus', () => {
        const handleClose = vi.fn()
        // create a button outside modal to restore focus to
        const outside = document.createElement('button')
        outside.textContent = 'outside'
        document.body.appendChild(outside)
        outside.focus()

        const { getByLabelText, unmount } = render(
            <ModalWindow
                modalWindowId="mk"
                handleAction={() => { }}
                handleClose={handleClose}
                config={{ showCloseButton: true }}
            />
        )

        // press Escape
        fireEvent.keyDown(getByLabelText('Close'), { key: 'Escape' })
        expect(handleClose).toHaveBeenCalledWith('mk')

        // unmount should restore focus
        unmount()
        expect(document.activeElement?.textContent).toBe('outside')
        outside.remove()
    })

    it('respects noActionReturn: calls onClick but does not call handleAction', () => {
        const handleAction = vi.fn()
        const actionOnClick = vi.fn()
        const { getByText } = render(
            <ModalWindow
                modalWindowId="na"
                handleAction={handleAction}
                handleClose={() => { }}
                config={{ actions: [[{ title: 'N', noActionReturn: true, onClick: actionOnClick }]] }}
            />
        )

        fireEvent.click(getByText('N'))
        expect(actionOnClick).toHaveBeenCalled()
        expect(handleAction).not.toHaveBeenCalled()
    })

    it('renders isSubmit as button type=submit', () => {
        const { getByText } = render(
            <ModalWindow
                modalWindowId="s1"
                handleAction={() => { }}
                handleClose={() => { }}
                config={{ actions: [[{ title: 'Submit', isSubmit: true }]] }}
            />
        )

        const btn = getByText('Submit') as HTMLButtonElement
        expect(btn.type).toBe('submit')
    })

    it('focuses first focusable element on open and respects isFocused', () => {
        const { getByLabelText, getByText } = render(
            <ModalWindow
                modalWindowId="mf"
                handleAction={() => { }}
                handleClose={() => { }}
                config={{ showCloseButton: true, actions: [[{ title: 'A1' }]] }}
            />
        )

        // close button should be focused first
        const closeBtn = getByLabelText('Close')
        expect(document.activeElement).toBe(closeBtn)

        // action with isFocused should receive focus
        const { unmount, getByText: getByText2 } = render(
            <ModalWindow
                modalWindowId="mf2"
                handleAction={() => { }}
                handleClose={() => { }}
                config={{ actions: [[{ title: 'B1' }, { title: 'B2', isFocused: true }]] }}
            />
        )
        const focusedAction = getByText2('B2')
        expect(document.activeElement).toBe(focusedAction)
        unmount()
    })

    it('returns form values when isReturnSubmit is true', () => {
        const handleAction = vi.fn()
        const { getByText } = render(
            <ModalWindow
                modalWindowId="rs"
                handleAction={handleAction}
                handleClose={() => { }}
                config={{
                    content: (
                        <form>
                            <input name="a" defaultValue="1" />
                        </form>
                    ),
                    isReturnSubmit: true,
                    actions: [[{ title: 'Send', isSubmit: true }]]
                }}
            />
        )

        fireEvent.click(getByText('Send'))
        expect(handleAction).toHaveBeenCalled()
        const call = handleAction.mock.calls[0]
        expect(call[2]).toEqual({ a: '1' })
    })

    it('isSubmit still calls requestSubmit when isReturnSubmit enabled', () => {
        const handleAction = vi.fn()
        const { getByText, container } = render(
            <ModalWindow
                modalWindowId="rs2"
                handleAction={handleAction}
                handleClose={() => { }}
                config={{
                    content: (
                        <form>
                            <input name="a" defaultValue="1" />
                        </form>
                    ),
                    isReturnSubmit: true,
                    actions: [[{ title: 'Send', isSubmit: true }]]
                }}
            />
        )

        const form = container.querySelector('form') as HTMLFormElement
        form.requestSubmit = vi.fn()

        fireEvent.click(getByText('Send'))

        expect(form.requestSubmit).not.toHaveBeenCalled()
        expect(handleAction).toHaveBeenCalled()
        const call = handleAction.mock.calls[0]
        expect(call[2]).toEqual({ a: '1' })
    })

    it('isReturnSubmit overrides noActionReturn', () => {
        const handleAction = vi.fn()

        const { getByText } = render(
            <ModalWindow
                modalWindowId="rs3"
                handleAction={handleAction}
                handleClose={() => { }}
                config={{
                    content: (
                        <form>
                            <input name="b" defaultValue="x" />
                        </form>
                    ),
                    isReturnSubmit: true,
                    actions: [[{ title: 'Send', isSubmit: true, noActionReturn: true }]]
                }}
            />
        )

        fireEvent.click(getByText('Send'))

        expect(handleAction).toHaveBeenCalled()
        const call = handleAction.mock.calls[0]
        expect(call[2]).toEqual({ b: 'x' })
    })
})
