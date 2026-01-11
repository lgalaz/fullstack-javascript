export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  const { signal } = request;
  let count = 0;
  let interval: ReturnType<typeof setInterval> | null = null;

  // SSE stream: keep the HTTP connection open and push events over time.
  const stream = new ReadableStream({
    start(controller) {
      const send = () => {
        // SSE format: "event" + "data" lines, followed by a blank line.
        const payload = `event: message\ndata: ${new Date().toISOString()} (tick ${count++})\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      send();
      interval = setInterval(send, 1000);

      const abort = () => {
        if (interval) clearInterval(interval);
        controller.close();
      };

      // Stop streaming when the client disconnects.
      if (signal.aborted) {
        abort();
      } else {
        signal.addEventListener('abort', abort, { once: true });
      }
    },
    cancel() {
      if (interval) clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      // SSE response headers.
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
