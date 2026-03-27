# Async Communication Strategies (Polling, SSE, WebSockets)

## Core Terms (Quick Definitions)

- **HTTP request**: A message the browser sends to a server to ask for data.
- **Response**: The server's reply to a request.

## Short Polling (Basic Polling)

**What it is**: The client sends a request on a fixed interval (for example every 5 seconds).

**How it works**:

1. Client sends a request.
2. Server responds immediately with whatever it has.
3. Client waits for the next interval and repeats.

**Client example (poll every 5 seconds)**:

```javascript
async function poll() {
  const res = await fetch('/api/status');
  const data = await res.json();
  console.log('status:', data);
}

setInterval(poll, 5000);
```

**Pros**:

- Simple to implement.
- Works with plain HTTP.

**Cons**:

- Wastes bandwidth when there are no updates.
- Higher server load due to constant requests.

## Long Polling

**What it is**: The client sends a request and the server holds it open until it has new data (or times out).

**How it works**:

1. Client sends a request.
2. Server waits until there is new data.
3. Server responds with the update.
4. Client immediately sends another request.

**Server note**: The server must allow long-lived HTTP requests. Many servers or proxies have default timeouts, so you may need to increase the timeout or send periodic keep-alives (small responses, like a comment or heartbeat, that reset the timeout). A heartbeat is a tiny message sent on a schedule to prove the connection is still alive and keep it from timing out.

**Client example (repeat after each response)**:

```javascript
async function longPoll() {
  const res = await fetch('/api/updates'); // server holds this request
  const data = await res.json();
  console.log('update:', data);
  longPoll(); // immediately wait for the next update
}

longPoll();
```

**Pros**:

- Less wasted requests than short polling.
- Works over HTTP without special protocols.

**Cons**:

- More complex to manage timeouts and retries.
- Still creates many HTTP connections over time.

## Server-Sent Events (SSE)

**What it is**: The server keeps a one-way stream open and pushes events to the client.

**How it works**:

1. Client opens a stream using `EventSource` (a built-in browser API for SSE).
2. Server sends events over a single HTTP response.
3. Client listens for messages.

**Client example (EventSource)**:

```javascript
const source = new EventSource('/api/stream');

source.onmessage = event => {
  console.log('message:', event.data);
};

source.onerror = () => {
  console.log('stream error, browser will retry');
};
```

**Server example (Node.js + Express)**:

```javascript
import express from 'express';

const app = express();

app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  const interval = setInterval(() => {
    send({ time: Date.now() });
  }, 2000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(3000, () => console.log('SSE server on :3000'));
```

**Pros**:

- Efficient for server-to-client updates.
- Built-in reconnection behavior in browsers.

**Cons**:

- One-way only (server to client).
- Not supported in older browsers without a polyfill. This mostly affects legacy environments like IE11 or older embedded WebViews (Android/Safari); modern evergreen browsers generally support SSE.

## Fetch Streaming (ReadableStream)

**What it is**: The server sends a single HTTP response that stays open and delivers chunks over time, and the client reads those chunks as they arrive.

**How it works**:

1. Client starts a `fetch` request.
2. Server writes data in chunks (often newline-delimited JSON or text).
3. Client reads `response.body` as a stream and parses incrementally.

**Client example (streaming text chunks with framing + reconnect)**:

```javascript
async function streamWithReconnect() {
  let retryMs = 1000;

  while (true) {
    try {
      const res = await fetch('/api/stream');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Framing: NDJSON where each line is a JSON message.
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line) continue;
          const msg = JSON.parse(line);
          console.log('message:', msg);
        }
      }
    } catch (err) {
      console.log('stream error, retrying...', err);
      await new Promise((r) => setTimeout(r, retryMs));
      retryMs = Math.min(retryMs * 2, 10000);
    }
  }
}

streamWithReconnect();
```

**Server example (Node.js + Express)**:

```javascript
import express from 'express';

const app = express();

app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let count = 0;
  const interval = setInterval(() => {
    count += 1;
    res.write(`chunk ${count}\n`);
    if (count >= 5) {
      clearInterval(interval);
      res.end();
    }
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

app.listen(3000, () => console.log('Streaming server on :3000'));
```

**Pros**:

- Works over plain HTTP and supports incremental updates.
- More flexible than SSE when you need custom framing or binary data.
  - Custom framing means you define how each message is delimited and parsed (for example, NDJSON lines, length-prefixed blobs, or your own protocol markers).
  - Binary data is useful for non-text payloads like images, audio chunks, protobuf messages (“structured binary messages defined by a schema.”), or compressed buffers to reduce overhead.

**Cons**:

- No built-in reconnection or event framing; you must define your own.
- `res.json()` does not work because the response never completes until the server closes it.

## WebSockets

**What it is**: A two-way, persistent connection between client and server.

**How it works**:

1. Client and server upgrade from HTTP to WebSocket.
2. Both sides can send messages at any time.
3. Connection stays open until closed.

**Client example (WebSocket)**:

```javascript
const socket = new WebSocket('wss://example.com/socket');

socket.onopen = () => {
  socket.send(JSON.stringify({ type: 'hello' }));
};

socket.onmessage = event => {
  console.log('message:', event.data);
};

socket.onclose = () => {
  console.log('connection closed');
};

// Close the connection when you are done.
socket.close();
```

**Server example (Node.js + Express + ws)**:

```javascript
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/socket' });

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'welcome' }));

  ws.on('message', (data) => {
    // Echo messages back to the client.
    ws.send(data.toString());
  });
});

server.listen(3000, () => console.log('WebSocket server on :3000'));
```

**Pros**:

- Full duplex (two-way) communication.
- Very low latency for real-time apps.

**Cons**:

- Requires WebSocket support on the server.
- Needs extra handling for scaling and reconnects (for example, a shared pub/sub like Redis to broadcast messages across multiple server instances, plus client-side reconnect logic with backoff).

## Request APIs (Not Strategies)

These are the tools you use to send requests, but they are not strategies by themselves.

- **Fetch**: Modern promise-based API. Often used for polling.
- **XHR**: Older API. Still used in some libraries and legacy code.

## Choosing a Strategy (Rule of Thumb)

- **Short polling**: Low update frequency, simple apps.
- **Long polling**: Updates need to be near real-time but you want to stay on HTTP.
- **SSE**: Many server-to-client updates (news feeds, logs).
- **Fetch streaming**: You want a single HTTP response that delivers incremental data, and you control the client parsing.
- **WebSockets**: Two-way real-time data (chat, multiplayer, trading).
