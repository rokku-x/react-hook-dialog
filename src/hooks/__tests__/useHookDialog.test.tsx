// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { renderHook, act } from '@testing-library/react'
import storeDialog from '@/store/dialog'
import useHookDialog from '@/hooks/useHookDialog'

// Mock useBaseModal and components from @rokku-x/react-hook-modal
vi.mock('@rokku-x/react-hook-modal', async () => {
    // Provide both the hook and the shared store API used by `store/dialog`.
    const pushModal = vi.fn((id, el) => id);
    const popModal = vi.fn((id) => true);
    return {
        ModalBackdrop: ({ children }: any) => <div>{children}</div>,
        ModalWindow: ({ children }: any) => <div>{children}</div>,
        useBaseModal: () => ({
            pushModal,
            popModal,
            updateModal: vi.fn(() => true),
        }),
        // `storeBaseModal` is the zustand store factory used by the library store.
        storeBaseModal: (id?: string) => ({
            getState: () => ({ actions: { pushModal, popModal } })
        })
    }
})

describe('useHookDialog', () => {
    beforeEach(() => {
        // reset store before each test
        const { instances } = storeDialog().getState()
        if (instances.length) storeDialog().setState({ instances: [] })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('adds an instance and resolves when instance.resolve is called', async () => {
        const { result } = renderHook(() => useHookDialog())

        let promise: Promise<any>
        act(() => {
            // call requestDialog
            promise = result.current[0]({ title: 'Test', actions: [[{ title: 'OK', value: 'ok' }]] })
        })

        // There should be one instance in the store
        const instances = storeDialog().getState().instances
        expect(instances.length).toBe(1)
        const inst = instances[0]

        // Resolve via the stored resolve function
        act(() => inst.resolve('ok'))

        await expect(promise).resolves.toBe('ok')
    })

    it('rejects when instance.reject is called and rejectOnCancel is true', async () => {
        const { result } = renderHook(() => useHookDialog())

        let promise: Promise<any>
        act(() => {
            promise = result.current[0]({ title: 'Test Cancel', actions: [[{ title: 'Cancel', isCancel: true }]] })
        })

        const inst = storeDialog().getState().instances[0]

        act(() => inst.reject(new Error('cancelled')))

        await expect(promise).rejects.toThrow('cancelled')
    })

    it('merges default config with per-call config', async () => {
        const defaultConfig = { showCloseButton: true, styles: { dialog: { maxWidth: '600px' } } }
        const { result } = renderHook(() => useHookDialog(defaultConfig))

        act(() => {
            result.current[0]({ title: 'Merged' })
        })

        const inst = storeDialog().getState().instances[0]
        expect(inst.config.showCloseButton).toBe(true)
        expect(inst.config.styles?.dialog?.maxWidth).toBe('600px')
    })
})