# react-hook-dialog

[![CI](https://github.com/rokku-x/react-hook-dialog/actions/workflows/ci.yml/badge.svg)](https://github.com/rokku-x/react-hook-dialog/actions/workflows/ci.yml) [![npm version](https://img.shields.io/npm/v/@rokku-x/react-hook-dialog.svg)](https://www.npmjs.com/package/@rokku-x/react-hook-dialog) [![license](https://img.shields.io/npm/l/@rokku-x/react-hook-dialog.svg)](https://www.npmjs.com/package/@rokku-x/react-hook-dialog) [![downloads](https://img.shields.io/npm/dm/@rokku-x/react-hook-dialog.svg)](https://www.npmjs.com/package/@rokku-x/react-hook-dialog) ![TS](https://img.shields.io/badge/TS-%E2%9C%93-blue)

<p><a href="https://jgd.qzz.io/rhd.png"><img src="https://jgd.qzz.io/rhd.png" alt="react-hook-dialog Logo" width="600"/></a></p>

A lightweight, powerful, and flexible React dialog hook library for confirmation dialogs, alerts, and modals. Built on top of `@rokku-x/react-hook-modal` with a focus on dialog-specific features like action buttons, variants, and customizable styling.

## Features

- ♿ **Accessibility Focused** - Keyboard navigation and ARIA support
- 🔄 **Asynchronous** - Async/await friendly dialog results
- 🎯 **Hook-based API** - Simple and intuitive `useHookDialog()` hook
- 🎨 **Rich Variants** - 7 button variants (primary, secondary, danger, success, warning, info, neutral)
- 📝 **Dialog Actions** - Flexible action button system with left/right positioning
- 💅 **Full Customization** - Injectable className and styles at every level
- ⌨️ **Rich Configuration** - Default configs with per-call overrides
- 📱 **TypeScript Support** - Full type safety out of the box
- 🧑‍🤝‍🧑 **Multiple Dialogs** - Support for multiple simultaneous dialogs
- 🛠️ **Programmatic Control** - Force actions and cancellations via dialog context
- 🖼️ **Rich Content Support** - Accepts React nodes for titles and content
- 📦 **Lightweight** - Minimal bundle size for fast load times

## Installation

```bash
npm install @rokku-x/react-hook-dialog
# or
bun add @rokku-x/react-hook-dialog
# or
yarn add @rokku-x/react-hook-dialog
# or
pnpm add @rokku-x/react-hook-dialog
```

## Quick Start

### 1. Setup BaseModalRenderer or BaseDialogRenderer

You can either use the upstream `BaseModalRenderer` directly (from `@rokku-x/react-hook-modal`) or use the convenience wrapper `BaseDialogRenderer` provided by this package.

- `BaseModalRenderer` (upstream): mount this at the root to render modal instances.
- `BaseDialogRenderer` (this package): a thin wrapper around `BaseModalRenderer` that lets you pass a `defaultConfig` prop to set default dialog options for all dialogs created by `useHookDialog()`.

Use `BaseModalRenderer` directly:

```tsx
import { BaseModalRenderer } from '@rokku-x/react-hook-modal';

function App() {
  return (
    <>
      <YourComponents />
      <BaseModalRenderer />
    </>
  );
}
```

Or use the wrapper `BaseDialogRenderer` from this package to set defaults:

```tsx
import { BaseDialogRenderer } from '@rokku-x/react-hook-dialog';

function App() {
  return (
    <>
      <YourComponents />
      <BaseDialogRenderer defaultConfig={{ showCloseButton: false, backdropCancel: false }} />
    </>
  );
}
```

Either component is fine — `BaseDialogRenderer` simply sets the dialog defaults for you so consumers of `useHookDialog()` don't have to provide them on each call.

### 2. Use useHookDialog Hook

```tsx
import { useHookDialog } from '@rokku-x/react-hook-dialog';

function MyComponent() {
  const [requestDialog] = useHookDialog();

  const handleConfirm = async () => {
    const result = await requestDialog({
      title: 'Confirm Action',
      content: 'Are you sure you want to proceed?',
      actions: [[
        { title: 'Cancel', isCancel: true },
        { title: 'Confirm', variant: 'primary' }
      ]]
    });
    
    console.log('User chose:', result);
  };

  return <button onClick={handleConfirm}>Open Dialog</button>;
}
```

## API Reference

### useHookDialog

Main hook for displaying confirmation dialogs and alerts.

#### Parameters

```typescript
useHookDialog(defaultConfig?: UseHookDialogConfig)
```

| Parameter | Type | Description |
|---|---|---|
| `defaultConfig` | `UseHookDialogConfig` | Optional default configuration applied to all dialogs |

#### Returns

```typescript
[requestDialog, getContext]
```

| Return Value | Type | Description |
|---|---|---|
| `requestDialog` | `(config: ConfirmConfig) => RequestDialogReturnType<ValidValue>` | Open a dialog and receive a result. The return value is an **augmented Promise** (see `RequestDialogReturnType<T>`). |
| `getContext` | `(id: string) => DialogInstanceContext` | Retrieve the runtime context for an open dialog by its `id` (useful if you only have the `id`). |

```typescript
// Augmented promise returned by `requestDialog`
type RequestDialogReturnType<T> = Promise<T> & { id: string; context: DialogInstanceContext };
```

> Important: awaiting the returned Promise resolves with the dialog result (`T`). The `id` and `context` properties are available immediately after calling `requestDialog(...)`, allowing programmatic control while the dialog is open.

### Dialog Context & Force Functions ✅

The augmented Promise exposes two helpers:

- `id: string` — unique identifier for the dialog instance
- `context: DialogInstanceContext` — runtime control helpers

`DialogInstanceContext` methods:

| Method | Signature | Description |
|---|---|---|
| `forceCancel` | `forceCancel(forceReject?: boolean = true): void` | Close the dialog as a cancellation. **Default:** `forceReject = true` (the promise will be rejected by default). If set to `false`, the dialog follows the dialog's `rejectOnCancel` setting. |
| `forceAction` | `forceAction(action: ModalAction): void` | Programmatically trigger the specified action (resolves/rejects according to the action and dialog config). |
| `forceDefault` | `forceDefault(): void` | Trigger the dialog's default action (first action marked with `isFocused`). Throws if no default is defined. |

Quick example:

```tsx
const [requestDialog, getContext] = useHookDialog();

const actions: ModalAction[][] = [[ { title: 'Cancel', isCancel: true }, { title: 'OK', value: true, isFocused: true } ]];

const p = requestDialog({
  title: 'Confirm',
  content: 'Proceed?',
  actions
});

// id available immediately
console.log('dialog id:', p.id);

// cancel programmatically (rejects by default)
p.context.forceCancel();

// trigger a specific action by referencing the action in the array
getContext(p.id).forceAction(actions[0][1]); // triggers `okAction`
// or
p.context.forceAction(actions[0][0]); // triggers `cancelAction`
```

> Tip: use `forceAction(...)` when you want to trigger a specific action object. Use `forceDefault()` to trigger the focused/default action (if defined). The returned Promise still resolves with the action's `value` (or rejects when cancelled).
#### Default Config Options

| Property | Type | Default | Description |
|---|---|---|---|
| `backdropCancel` | `boolean` | `false` | Allow closing via backdrop click |
| `rejectOnCancel` | `boolean` | `true` | Reject promise on cancel instead of resolving |
| `defaultCancelValue` | `ValidValue` | `undefined` | Value to return/reject on cancel |
| `showCloseButton` | `boolean` | `false` | Show X close button |
| `classNames` | `DialogClassNames` | `undefined` | Custom CSS classes |
| `styles` | `DialogStyles` | `undefined` | Custom inline styles |
| `variantStyles` | `DialogVariantStyles` | `undefined` | Custom variant button styles |

### ConfirmConfig

Configuration for individual dialog calls.

| Property | Type | Description |
|---|---|---|
| `title` | `React.ReactNode` | Dialog title (string or React element) |
| `content` | `React.ReactNode` | Dialog content (string or React element) |
| `actions` | `ModalAction[][]` | Array of action button rows |
| `backdropCancel` | `boolean` | Allow closing via backdrop click |
| `rejectOnCancel` | `boolean` | Reject promise on cancel |
| `defaultCancelValue` | `ValidValue` | Value to return/reject on cancel |
| `showCloseButton` | `boolean` | Show X close button |
| `classNames` | `DialogClassNames` | Custom CSS classes for elements |
| `styles` | `DialogStyles` | Custom inline styles for elements |
| `variantStyles` | `DialogVariantStyles` | Custom variant button styles |
| `isReturnSubmit` | `boolean` | When `true` and `content` is a `<form>`, clicking a submit action returns the serialized form values as the dialog result |

### ModalAction

Individual action button configuration.

| Property | Type | Required | Description |
|---|---|---|---|
| `title` | `React.ReactNode` | ✓ | Button label (string or React element) |
| `value` | `ValidValue` | | Value to return when clicked |
| `isCancel` | `boolean` | | Treat as cancel button (respects `rejectOnCancel`) |
| `isOnLeft` | `boolean` | | Position button on left side of row |
| `isFocused` | `boolean` | | Request initial focus when the dialog opens (highest focus priority) |
| `isSubmit` | `boolean` | | Render as `type="submit"` and trigger form submit if `content` is a `<form>` |
| `noActionReturn` | `boolean` | | Run `onClick` but do _not_ perform default dialog action (`handleAction`) — useful for custom flows |
| `variant` | `ModalVariant` | | Visual style variant |
| `className` | `string` | | Additional CSS class applied to the button |
| `style` | `React.CSSProperties` | | Custom inline styles applied to the button (highest style priority) |
| `onClick` | `((event, action) => void) \| (() => void)` | | Click handler called before default handling |

### ModalVariant

Available button variants:

```typescript
type ModalVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'neutral';
```

| Variant | Color | Text Color |
|---|---|---|
| `primary` | Blue (#2563eb) | White |
| `secondary` | Gray (#e5e7eb) | Black |
| `danger` | Red (#dc2626) | White |
| `success` | Green (#16a34a) | White |
| `warning` | Amber (#f59e0b) | Black |
| `info` | Sky (#0ea5e9) | White |
| `neutral` | Gray (#6b7280) | White |

### Action Flags — Priority & Behavior 🔀

- **Focus priority**: `isFocused` (per-action) > close button (if shown) > first action button > dialog container
- **Click ordering**: `action.onClick` is executed first. Then:
  1. If `isSubmit` is true and `isReturnSubmit` is also enabled (and `content` is a `<form>`), the form is serialized and its values are returned as the dialog result immediately (no native submit is triggered).
  2. Else if `isSubmit` is true, the form's `requestSubmit()` is invoked (useful for native validation flows).
  3. Else if `noActionReturn` is true, the default dialog action is skipped (use to perform custom flows and close the dialog manually).
  4. Otherwise `handleAction` is called and the dialog resolves/rejects using the action's `value`.
- **isCancel**: marks a cancel action — dialog resolves or rejects according to `rejectOnCancel` and `defaultCancelValue` settings.
- **Placement**: `isOnLeft` positions the action on the left side; other actions render on the right.
- **Style & class precedence** (lowest → highest):
  1. built-in `baseVariantStyles` (library defaults)
  2. `ConfirmConfig.variantStyles` (per-call variant overrides)
  3. `ConfirmConfig.styles.actionButton` (per-call default action button styles)
  4. `ModalAction.style` (per-action inline style — highest precedence)
  5. `className` values are appended so per-action `className` and `ConfirmConfig.classNames.actionButton` both apply (per-action classes appear last).

### DialogClassNames

Customize CSS classes for all elements:

| Property | Type | Description |
|---|---|---|
| `backdrop` | `string` | Backdrop overlay |
| `dialog` | `string` | Dialog container |
| `closeButton` | `string` | Close button |
| `title` | `string` | Title element |
| `content` | `string` | Content container |
| `actions` | `string` | Actions container |
| `actionsRow` | `string` | Individual action row |
| `actionButton` | `string` | Action button |

### DialogStyles

Customize inline styles for all elements:

| Property | Type | Description |
|---|---|---|
| `backdrop` | `React.CSSProperties` | Backdrop overlay styles |
| `dialog` | `React.CSSProperties` | Dialog container styles |
| `closeButton` | `React.CSSProperties` | Close button styles |
| `title` | `React.CSSProperties` | Title element styles |
| `content` | `React.CSSProperties` | Content container styles |
| `actions` | `React.CSSProperties` | Actions container styles |
| `actionsRow` | `React.CSSProperties` | Action row styles |
| `actionButton` | `React.CSSProperties` | Action button styles |

## Components

### BaseDialogRenderer 🔧

A convenience wrapper around the upstream `BaseModalRenderer` that accepts a `defaultConfig` prop allowing you to specify default `UseHookDialogConfig` for all dialogs created by `useHookDialog()`.

```tsx
import { BaseDialogRenderer } from '@rokku-x/react-hook-dialog';

<BaseDialogRenderer defaultConfig={{ showCloseButton: false, backdropCancel: false }} />
```

> Note: `BaseModalRenderer` from `@rokku-x/react-hook-modal` can still be used directly if you prefer — this wrapper only adds `defaultConfig` convenience.

### Multiple renderer instances 🔁

You can mount multiple modal renderers (either `BaseDialogRenderer` from this package or the upstream `BaseModalRenderer`) and give each a unique `id`. Use the `instanceId` option (in the hook's `defaultConfig` or per-call `ConfirmConfig`) to target which renderer/store should manage the dialog.

- Mount two renderers:

```tsx
<BaseDialogRenderer id="primary" defaultConfig={{ showCloseButton: false }} />
<BaseDialogRenderer id="secondary" defaultConfig={{ showCloseButton: true }} />
```

- Use the hook with a default instance:

```tsx
const [requestDialog] = useHookDialog({ instanceId: 'secondary' });
await requestDialog({ title: 'Settings' });
```

- Or target a renderer per call:

```tsx
const [requestDialog] = useHookDialog();
await requestDialog({ title: 'Switch', instanceId: 'primary' });
```

- Programmatic store access:

```ts
import storeDialog from '@rokku-x/react-hook-dialog';
const primaryStore = storeDialog('primary'); // returns the zustand store hook
const state = primaryStore.getState();
primaryStore.setState({ rendererDefaultConfig: { /* ... */ } });
```

> Note: The default instance id is `"default"`. Make sure you mount a renderer with the same `id` if you want dialogs to be visible. If a renderer with the requested id is not mounted, the store will still be created and you can use it programmatically, but dialogs will not be rendered until a matching renderer is mounted.

### Backdrop

Overlay component that wraps dialog windows.

```tsx
<Backdrop 
  onClick={() => handleClose()}
  className="custom-backdrop"
  style={{ backdropFilter: 'blur(5px)' }}
>
  {children}
</Backdrop>
```

### DialogWindow

Main dialog container component.

```tsx
<DialogWindow
  className="custom-dialog"
  style={{ backgroundColor: '#f5f5f5' }}
>
  {children}
</DialogWindow>
```

## Examples

### Example 1: Basic Confirmation Dialog

```tsx
import { useHookDialog } from '@rokku-x/react-hook-dialog';

function DeleteConfirm() {
  const [requestDialog] = useHookDialog();

  const handleDelete = async () => {
    const result = await requestDialog({
      title: 'Delete Item?',
      content: 'This action cannot be undone.',
      actions: [[
        { title: 'Cancel', isCancel: true, variant: 'secondary' },
        { title: 'Delete', variant: 'danger', value: true }
      ]]
    });

    if (result === true) {
      console.log('Item deleted!');
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

![Example 1 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-1.png)

### Example 2: Multiple Action Rows

```tsx
const [requestDialog] = useHookDialog();

await requestDialog({
  title: 'Choose Action',
  content: 'What would you like to do?',
  actions: [
    [{ title: 'Back', isOnLeft: true, variant: 'secondary' }],
    [
      { title: 'Cancel', isCancel: true },
      { title: 'Save', variant: 'primary' }
    ]
  ]
});
```

![Example 2 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-2.png)

### Example 3: Custom Styling

```tsx
const [requestDialog] = useHookDialog({
  styles: {
    dialog: { 
      borderRadius: '20px',
      backgroundColor: '#f9fafb'
    },
    actionButton: {
      fontWeight: 'bold'
    }
  },
  classNames: {
    dialog: 'my-custom-dialog'
  }
});

await requestDialog({
  title: 'Styled Dialog',
  content: 'This dialog has custom styles'
});
```

![Example 3 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-3.png)

### Example 4: Custom Button Variants

```tsx
const [requestDialog] = useHookDialog({
  variantStyles: {
    primary: {
      backgroundColor: '#7c3aed',  // Purple
      color: '#fff'
    }
  }
});

await requestDialog({
  title: 'Custom Colors',
  actions: [[
    { title: 'Confirm', variant: 'primary' }
  ]]
});
```

![Example 4 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-4.png)

### Example 5: Button Click Handlers

```tsx
await requestDialog({
  title: 'Action Dialog',
  actions: [[
    {
      title: 'Log to Console',
      onClick: (e) => console.log('Button clicked!'),
      variant: 'info'
    },
    {
      title: 'Proceed',
      variant: 'primary'
    }
  ]]
});
```

![Example 5 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-5.png)

### Example 6: Rich Content

```tsx
await requestDialog({
  title: <span style={{ color: 'blue' }}>Custom <strong>Title</strong></span>,
  content: (
    <div>
      <p>This dialog has rich content:</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </div>
  ),
  actions: [[
    { title: 'OK', variant: 'primary' }
  ]]
});
```

![Example 6 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-6.png)

### Example 7: Default Configuration

```tsx
const [requestDialog] = useHookDialog({
  showCloseButton: false,
  backdropCancel: false,
  styles: {
    dialog: { maxWidth: '500px' }
  }
});

// All subsequent dialogs will use these defaults
await requestDialog({
  title: 'Will use defaults',
  content: 'No close button, backdrop click disabled'
});
```

![Example 7 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-7.png)

### Example 8: Alert Dialog

```tsx
async function showAlert(message: string) {
  const [requestDialog] = useHookDialog();
  
  await requestDialog({
    title: 'Alert',
    content: message,
    actions: [[
      { title: 'OK', variant: 'primary' }
    ]]
  });
}

showAlert('Operation completed successfully!');
```

![Example 8 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-8.png)

### Example 9: Multiple Choice with Different Values

```tsx
const [requestDialog] = useHookDialog();

const handleSaveOptions = async () => {
  const result = await requestDialog({
    title: 'Save Options',
    content: 'How would you like to save?',
    actions: [[
      { title: 'Cancel', isCancel: true },
      { title: 'Save Draft', variant: 'secondary', value: 'draft' },
      { title: 'Publish', variant: 'primary', value: 'publish' }
    ]]
  });

  if (result === 'draft') {
    console.log('Saving as draft...');
  } else if (result === 'publish') {
    console.log('Publishing...');
  } else {
    console.log('Cancelled');
  }
};
```

![Example 9 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-9.png)

### Example 10: Numeric Rating Dialog

```tsx
const [requestDialog] = useHookDialog();

const handleRating = async () => {
  const rating = await requestDialog({
    title: 'Rate Your Experience',
    content: 'How would you rate our service?',
    actions: [
      [
        { title: '1 Star', variant: 'danger', value: 1 },
        { title: '2 Stars', variant: 'warning', value: 2 },
        { title: '3 Stars', variant: 'neutral', value: 3 }
      ],
      [
        { title: '4 Stars', variant: 'info', value: 4 },
        { title: '5 Stars', variant: 'success', value: 5 }
      ]
    ],
    showCloseButton: false,
    backdropCancel: false
  });

  console.log(`User rated: ${rating} stars`);
  // Send rating to API
};
```

![Example 10 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-10.png)

### Example 11: Conditional Actions Based on Result

```tsx
const [requestDialog] = useHookDialog();

const handleFileOperation = async () => {
  const action = await requestDialog({
    title: 'File Actions',
    content: 'What would you like to do with this file?',
    actions: [[
      { title: 'Download', variant: 'info', value: 'download' },
      { title: 'Share', variant: 'primary', value: 'share' },
      { title: 'Delete', variant: 'danger', value: 'delete', isOnLeft: true }
    ]]
  });

  switch (action) {
    case 'download':
      // Download file logic
      window.location.href = '/api/download/file.pdf';
      break;
    case 'share':
      // Open share dialog
      await requestDialog({
        title: 'Share File',
        content: 'File link copied to clipboard!',
        actions: [[{ title: 'OK', variant: 'primary' }]]
      });
      break;
    case 'delete':
      // Confirm deletion
      const confirm = await requestDialog({
        title: 'Confirm Delete',
        content: 'Are you sure? This cannot be undone.',
        actions: [[
          { title: 'Cancel', isCancel: true },
          { title: 'Delete', variant: 'danger', value: true }
        ]]
      });
      if (confirm) {
        console.log('File deleted');
      }
      break;
  }
};
```

![Example 11 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-11.png)

### Example 12: Handle Cancel vs Reject

```tsx
const [requestDialog] = useHookDialog({
  rejectOnCancel: true  // Reject promise on cancel
});

const handleWithErrorHandling = async () => {
  try {
    const result = await requestDialog({
      title: 'Important Action',
      content: 'This requires your confirmation.',
      actions: [[
        { title: 'Cancel', isCancel: true },
        { title: 'Proceed', variant: 'primary', value: 'proceed' }
      ]]
    });

    if (result === 'proceed') {
      console.log('User proceeded');
      // Perform action
    }
  } catch (error) {
    console.log('User cancelled or closed dialog');
    // Handle cancellation
  }
};
```

![Example 12 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-12.png)

### Example 13: Form Submission with Validation

```tsx
const [requestDialog] = useHookDialog();

const handleFormSubmit = async (formData: any) => {
  const action = await requestDialog({
    title: 'Review Changes',
    content: (
      <div>
        <p>You are about to submit the following changes:</p>
        <ul>
          <li>Name: {formData.name}</li>
          <li>Email: {formData.email}</li>
        </ul>
      </div>
    ),
    actions: [[
      { title: 'Edit', variant: 'secondary', value: 'edit' },
      { title: 'Cancel', isCancel: true },
      { title: 'Submit', variant: 'success', value: 'submit' }
    ]]
  });

  if (action === 'submit') {
    // Submit form
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    await requestDialog({
      title: 'Success',
      content: 'Your changes have been saved!',
      actions: [[{ title: 'OK', variant: 'success' }]]
    });
  } else if (action === 'edit') {
    // Return to form
    console.log('User wants to edit');
  }
};
```

![Example 13 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-13.png)

### Example 14: Boolean Result with Custom Values

```tsx
const [requestDialog] = useHookDialog();

const handleLogout = async () => {
  const shouldLogout = await requestDialog({
    title: 'Confirm Logout',
    content: 'Are you sure you want to log out?',
    actions: [[
      { title: 'Stay Logged In', variant: 'secondary', value: false },
      { title: 'Log Out', variant: 'danger', value: true }
    ]]
  });

  if (shouldLogout) {
    // Perform logout
    sessionStorage.clear();
    window.location.href = '/login';
  }
};
```

![Example 14 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-14.png)

### Example 15: Form Dialog Returning Values (isReturnSubmit)

```tsx
const [requestDialog] = useHookDialog();

async function openProfileDialog() {
  const result = await requestDialog({
    title: 'Edit Profile',
    content: (
      <form>
        <label>
          Name
          <input name="name" defaultValue="Alice" />
        </label>
        <label>
          Email
          <input name="email" defaultValue="alice@example.com" />
        </label>
      </form>
    ),
    actions: [[
      { title: 'Cancel', isCancel: true },
      // `isSubmit` triggers native submit; when `isReturnSubmit` is enabled on the dialog config, the dialog returns the form values object
      { title: 'Save', isSubmit: true }
    ]],
    isReturnSubmit: true
  });

  if (result && typeof result === 'object') {
    // `result` is the object built from the submitted form
    console.log('Form values:', result);
    // e.g. result.name, result.email
  }
}
```

![Example 15 Screenshot](https://jgd.qzz.io/screenshots/react-hook-dialog-example-15.png)

> Note: `isReturnSubmit` overrides `noActionReturn` and returns the serialized form values as the action `value`. `isSubmit` still triggers `requestSubmit()` to allow native validation flows.

## Types

### ValidValue

```typescript
type ValidValue = string | number | boolean | undefined;
```

The type of value returned from dialog actions.

### DialogVariantStyles

```typescript
type DialogVariantStyles = Partial<Record<ModalVariant, React.CSSProperties>>;
```

Custom styles for each variant type.

## Accessibility

- Backdrop close can be enabled with `backdropCancel: true`
- Close button can be shown with `showCloseButton: true`
- All buttons are keyboard accessible
- ARIA labels provided for interactive elements
- Supports custom ARIA attributes via className injection

## Best Practices

1. **Mount `BaseModalRenderer` at root level** - Required for modals to render
2. **Use default configs for consistency** - Set common styles/behaviors once
3. **Provide meaningful button labels** - Users should know what each button does
4. **Use appropriate variants** - Use `danger` for destructive actions, `success` for confirmations
5. **Keep content concise** - Dialogs should be focused and brief
6. **Handle both resolve and reject** - Account for cancellation scenarios
7. **Use `isOnLeft` for secondary actions** - Helps with visual hierarchy
8. **Customize responsibly** - Maintain accessibility and usability standards

## Troubleshooting

### Dialog not appearing
- Ensure `BaseModalRenderer` is mounted at root level
- Check that `useHookDialog()` is called within the component tree

### Styles not applying
- Verify className/style props are passed to `ConfirmConfig`
- Check CSS specificity - inline styles take precedence
- Use browser dev tools to inspect applied styles

### Promise never resolves
- Ensure action buttons have appropriate `value` or are configured as cancel buttons
- Check that action click handlers don't prevent default behavior


## Bundle Size

- ESM : ~6.69 kB gzipped (13.10 kB raw)
- CJS : ~7.35 kB gzipped (14.14 kB raw)

Measured with Vite build for the current branch.

## License

MIT
