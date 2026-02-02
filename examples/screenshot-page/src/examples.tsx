import React, { useEffect } from 'react';
import type { ModalAction } from '/src/types';
import { useHookDialog } from '/src';

// Recreate the examples from README. Each component will run the dialog once on mount.
export function Example1() {
  const [requestDialog] = useHookDialog();
  useEffect(() => {
    requestDialog({
      title: 'Delete Item?',
      content: 'This action cannot be undone.',
      actions: [[
        { title: 'Cancel', isCancel: true, variant: 'secondary' },
        { title: 'Delete', variant: 'danger', value: true }
      ]]
    })
  }, [])
  return null;
}

export function Example2() {
  const [requestDialog] = useHookDialog();
  useEffect(() => {
    requestDialog({
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
  }, []);
  return null;
}

export function Example3() {
  const [requestDialog] = useHookDialog({
    styles: {
      dialog: {
        borderRadius: '20px',
        backgroundColor: '#f9fafb'
      },
      actionButton: { fontWeight: 'bold' }
    },
    classNames: { dialog: 'my-custom-dialog' }
  });
  useEffect(() => {
    requestDialog({ title: 'Styled Dialog', content: 'This dialog has custom styles' });
  }, []);
  return null;
}

export function Example4() {
  const [requestDialog] = useHookDialog({
    variantStyles: {
      primary: {
        backgroundColor: '#7c3aed',
        color: '#fff'
      }
    }
  });
  useEffect(() => {
    requestDialog({ title: 'Custom Colors', actions: [[{ title: 'Confirm', variant: 'primary' }]] });
  }, []);
  return null;
}

export function Example5() {
  const [requestDialog] = useHookDialog();
  useEffect(() => {
    requestDialog({
      title: 'Action Dialog',
      actions: [[
        {
          title: 'Log to Console',
          onClick: (e) => console.log('Button clicked!'),
          variant: 'info'
        },
        { title: 'Proceed', variant: 'primary' }
      ]]
    });
  }, []);
  return null;
}

export function Example6() {
  const [requestDialog] = useHookDialog();
  useEffect(() => {
    requestDialog({
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
      actions: [[{ title: 'OK', variant: 'primary' }]]
    });
  }, []);
  return null;
}

export function Example7() {
  const [requestDialog] = useHookDialog({
    showCloseButton: false,
    backdropCancel: false,
    styles: { dialog: { maxWidth: '500px' } }
  });
  useEffect(() => {
    requestDialog({ title: 'Will use defaults', content: 'No close button, backdrop click disabled' });
  }, []);
  return null;
}

export function Example8() {
  const [requestDialog] = useHookDialog();
  useEffect(() => {
    requestDialog({ title: 'Alert', content: 'Operation completed successfully!', actions: [[{ title: 'OK', variant: 'primary' }]] });
  }, []);
  return null;
}

export function Example9() {
  const [requestDialog] = useHookDialog();
  useEffect(() => {
    requestDialog({
      title: 'Save Options',
      content: 'How would you like to save?',
      actions: [[
        { title: 'Cancel', isCancel: true },
        { title: 'Save Draft', variant: 'secondary', value: 'draft' },
        { title: 'Publish', variant: 'primary', value: 'publish' }
      ]]
    });
  }, []);
  return null;
}

// Additional README examples
export function Example10() {
  // Quick Start example: basic confirm dialog from README
  const [requestDialog] = useHookDialog();
  useEffect(() => {
    requestDialog({
      title: 'Confirm Action',
      content: 'Are you sure you want to proceed?',
      actions: [[
        { title: 'Cancel', isCancel: true },
        { title: 'Confirm', variant: 'primary' }
      ]]
    });
  }, []);
  return null;
}

export function Example11() {
  // Backdrop example: custom backdrop style
  const [requestDialog] = useHookDialog({ styles: { backdrop: { backdropFilter: 'blur(5px)' } } });
  useEffect(() => {
    requestDialog({
      title: 'Custom Backdrop',
      content: 'This dialog demonstrates a blurred backdrop.',
      actions: [[{ title: 'OK', variant: 'primary' }]]
    });
  }, []);
  return null;
}

export function Example12() {
  // DialogWindow example: custom dialog style and className
  const [requestDialog] = useHookDialog({ classNames: { dialog: 'custom-dialog' }, styles: { dialog: { backgroundColor: '#f5f5f5' } } });
  useEffect(() => {
    requestDialog({
      title: 'Custom Dialog',
      content: 'Dialog with a custom background and class name',
      actions: [[{ title: 'Close', variant: 'secondary' }]]
    });
  }, []);
  return null;
}

export function Example13() {
  // Form submission with validation (display review dialog using sample data)
  const [requestDialog] = useHookDialog();
  useEffect(() => {
    const sample = { name: 'John Doe', email: 'john@example.com' };
    requestDialog({
      title: 'Review Changes',
      content: (
        <div>
          <p>You are about to submit the following changes:</p>
          <ul>
            <li>Name: {sample.name}</li>
            <li>Email: {sample.email}</li>
          </ul>
        </div>
      ),
      actions: [[
        { title: 'Edit', variant: 'secondary', value: 'edit' },
        { title: 'Cancel', isCancel: true },
        { title: 'Submit', variant: 'success', value: 'submit' }
      ]]
    });
  }, []);
  return null;
}

export function Example14() {
  // Boolean result with custom values
  const [requestDialog] = useHookDialog();
  useEffect(() => {
    requestDialog({
      title: 'Confirm Logout',
      content: 'Are you sure you want to log out?',
      actions: [[
        { title: 'Stay Logged In', variant: 'secondary', value: false },
        { title: 'Log Out', variant: 'danger', value: true }
      ]]
    });
  }, []);
  return null;
}

export function Example15() {
  // Form dialog returning values (isReturnSubmit) — styled and more fields
  const [requestDialog] = useHookDialog();
  useEffect(() => {
    requestDialog({
      title: 'Edit Profile',
      content: (
        <form style={{ display: 'grid', gap: 10, maxWidth: 420 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#333' }}>Name</span>
            <input name="name" defaultValue="Alice" style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }} />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#333' }}>Email</span>
            <input name="email" defaultValue="alice@example.com" style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }} />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#333' }}>Role</span>
            <select name="role" defaultValue="member" style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="guest">Guest</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#333' }}>Bio</span>
            <textarea name="bio" defaultValue="Loves cats and building neat UIs." rows={4} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }} />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" name="subscribe" defaultChecked />
            <span style={{ fontSize: 13, color: '#333' }}>Subscribe to newsletter</span>
          </label>
        </form>
      ),
      actions: [[
        { title: 'Cancel', isCancel: true },
        { title: 'Save', isSubmit: true }
      ]],
      isReturnSubmit: true
    });
  }, []);
  return null;
}

export default { Example1, Example2, Example3, Example4, Example5, Example6, Example7, Example8, Example9, Example10, Example11, Example12, Example13, Example14, Example15 };
