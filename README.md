# react-hook-dialog

[![CI](https://github.com/rokku-x/react-hook-dialog/actions/workflows/ci.yml/badge.svg)](https://github.com/rokku-x/react-hook-dialog/actions/workflows/ci.yml)

A powerful and flexible React dialog hook library for confirmation dialogs, alerts, and modals. Built on top of `@rokku-x/react-hook-modal` with a focus on dialog-specific features like action buttons, variants, and customizable styling.

## Features

- 🎯 **Hook-based API** - Simple and intuitive `useHookDialog()` hook
- 🎨 **Rich Variants** - 7 button variants (primary, secondary, danger, success, warning, info, neutral)
- 🧩 **Modular Components** - Composed from reusable Backdrop and DialogWindow components
- 📝 **Dialog Actions** - Flexible action button system with left/right positioning
- 💅 **Full Customization** - Injectable className and styles at every level
- ⌨️ **Rich Configuration** - Default configs with per-call overrides
- 🎁 **Zero Dependencies** - Only requires React, Zustand, and @rokku-x/react-hook-modal
- 📱 **TypeScript Support** - Full type safety out of the box
- ♿ **Backdrop Control** - Configurable backdrop click behavior

## Installation

```bash
npm install @rokku-x/react-hook-dialog
```

or with yarn:

```bash
yarn add @rokku-x/react-hook-dialog
```

## Quick Start

### 1. Setup BaseModalRenderer

First, add the `BaseModalRenderer` at the root of your application (from `@rokku-x/react-hook-modal`):

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
[requestDialog]
```

| Return Value | Type | Description |
|---|---|---|
| `requestDialog` | `(config: ConfirmConfig) => RequestDialogReturnType<ValidValue>` | Function to open a dialog and get user response. `RequestDialogReturnType<T>` is defined as `Promise<T> & { id: string; context: DialogInstanceContext }` which means the native Promise resolves with `T` while the *returned* value exposes `id` and `context` for programmatic control. |

```typescript
// Convenience alias shown in the library
type RequestDialogReturnType<T> = Promise<T> & { id: string; context: DialogInstanceContext };
```

### Dialog Context & Force Functions ✅

The Promise returned from `requestDialog(...)` is augmented with:

- `id: string` — unique identifier for the dialog instance
- `context: DialogInstanceContext` — helper methods to programmatically control the dialog instance

You can access the context either directly from the returned Promise (`promise.context`) or via the second value returned from the hook (`getContext(id)`).

Dialog context methods:

- `forceCancel(forceReject?: boolean)` — close the dialog as a cancellation. If `forceReject` is `true` the promise will be rejected even if the dialog `rejectOnCancel` config is `false`. Otherwise the usual `rejectOnCancel` behavior applies.
- `forceAction(action: ModalAction)` — programmatically trigger a specific action (resolve/reject according to the action and dialog config).
- `forceDefault()` — triggers the dialog's default action (first action marked with `isFocused`). Throws if no default action is defined.

Example usage:

```tsx
const [requestDialog, getContext] = useHookDialog();

// open a dialog and get the augmented promise
const p = requestDialog({
  title: 'Confirm',
  content: 'Proceed?',
  actions: [[
    { title: 'Cancel', isCancel: true },
    { title: 'OK', value: true, isFocused: true }
  ]]
});

console.log('dialog id:', p.id);

// force the default action (same as clicking the focused action)
p.context.forceDefault();

// or cancel programmatically (forces reject by default)
p.context.forceCancel();

// you can also use the helper returned from the hook
const ctx = getContext(p.id);
ctx.forceAction({ title: 'OK', value: true });
```

> Note: `forceDefault()` will throw if no action is marked with `isFocused`. Use `forceAction(...)` to explicitly specify which action to run.

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

- ESM: ~4.06 kB gzipped (13.48 kB raw)
- CJS: ~3.48 kB gzipped (9.21 kB raw)

Measured with Vite build for v0.0.1.

## License

MIT
