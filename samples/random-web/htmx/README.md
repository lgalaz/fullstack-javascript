# HTMX Streaming Example (Next.js)

This sample shows HTMX streaming with Server-Sent Events (SSE) served from a Next.js route handler.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 and watch the stream update.

## What it demonstrates

- HTMX + SSE updates a DOM node without React state
- Next.js route handler streams `text/event-stream`

## Hydration note (why `suppressHydrationWarning` is used)

HTMX can update the `<pre>` with incoming SSE data *before* React finishes hydrating. That means the server-rendered text ("Connecting...") might already be replaced by a streamed timestamp when React hydrates, triggering a mismatch warning. This race is timing-dependent, so it may appear/disappear between runs.

To avoid noisy hydration errors, the example uses `suppressHydrationWarning` on the `<pre>` element. Use this sparingly: it tells React to ignore mismatches for that subtree, so only apply it when an external system (like HTMX, third-party scripts, or ad injections) intentionally mutates the DOM before hydration.

Another option is to delay the first SSE message so hydration finishes before HTMX updates the DOM:

```ts
// app/api/stream/route.ts
const send = () => {
  const payload = `event: message\ndata: ${new Date().toISOString()} (tick ${count++})\n\n`;
  controller.enqueue(encoder.encode(payload));
};

setTimeout(send, 300);
interval = setInterval(send, 1000);
```
