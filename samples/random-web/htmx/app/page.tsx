export default function Page() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>HTMX Streaming (SSE) in Next.js</h1>
      <p>
        This example uses HTMX + SSE to stream updates into the DOM without React
        state.
      </p>

      {/* HTMX SSE: connect to the server stream and swap incoming messages here */}
      <div
        data-hx-ext="sse"
        data-sse-connect="/api/stream"
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
          maxWidth: '520px',
        }}
      >
        <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
          Live stream
        </div>
        {/* Any SSE "message" event will replace this element's content */}
        <pre
          data-sse-swap="message"
          suppressHydrationWarning
          style={{ margin: 0, whiteSpace: 'pre-wrap' }}
        >
          Connecting...
        </pre>
      </div>

      {/* HTMX core + SSE extension (client-side only, no React hooks needed) */}
      <script src="https://unpkg.com/htmx.org@1.9.12"></script>
      <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/sse.js"></script>
    </main>
  );
}
