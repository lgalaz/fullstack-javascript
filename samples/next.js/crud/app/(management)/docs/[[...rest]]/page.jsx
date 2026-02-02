import React from 'react';

export default function DocsOptionalCatchAllPage({ params }) {
  const segments = params.rest ?? [];

  return (
    <main className="app">
      <header>
        <h1>Docs Optional Catch-All</h1>
        {segments.length === 0 ? (
          <p>No segments provided.</p>
        ) : (
          <p>Segments: {segments.join(' / ')}</p>
        )}
      </header>
    </main>
  );
}
