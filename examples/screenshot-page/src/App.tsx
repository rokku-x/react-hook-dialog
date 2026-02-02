import React, { useEffect } from 'react';
import { BaseModalRenderer, useHookDialog } from '/src';

import Examples from './examples';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const exampleId = params.get('example') || 'list';

  if (exampleId === 'list') {
    const keys = Object.keys(Examples).filter((k) => k.startsWith('Example'));
    const count = keys.length;

    return (
      <div>
        <h1>Examples</h1>
        <p className="info">Append <code>?example=1</code> through <code>?example={count}</code> to the URL to render a specific example and capture a screenshot.</p>
        <ul>
          {keys.map((_, i) => (
            <li key={i}><a href={`?example=${i + 1}`}>Example {i + 1}</a></li>
          ))}
        </ul>
        <BaseModalRenderer />
      </div>
    );
  }

  const ExampleComponent = (Examples as any)[`Example${exampleId}`];

  if (!ExampleComponent) return <div>Unknown example: {exampleId}</div>;

  // Render the selected example and immediately trigger the dialog when mounted
  return (
    <div>
      <h2 className="example-title">Example {exampleId}</h2>
      <p className="info">This will automatically open the dialog for the selected example.</p>
      <BaseModalRenderer />
      <ExampleComponent />
    </div>
  );
}
