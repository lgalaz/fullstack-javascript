'use client';

import { useState } from 'react';

export default function Home() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const now = Date.now();

  if (shouldThrow) {
    throw new Error('Dev overlay demo error: button-triggered exception.');
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Dev Overlay Lab</h1>
      <p>
        This page intentionally renders a dynamic timestamp to trigger a hydration warning.
      </p>
      <p>
        Rendered timestamp: <strong>{now}</strong>
      </p>
      <button
        type="button"
        onClick={() => setShouldThrow(true)}
        style={{ padding: '8px 12px', marginTop: 12 }}
      >
        Trigger Runtime Error
      </button>
    </main>
  );
}
