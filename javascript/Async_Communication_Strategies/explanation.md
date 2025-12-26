# Async Communication Strategies (Polling, SSE, WebSockets)

## Introduction

This topic explains how browsers keep data updated without full page reloads. It focuses on the common strategies: polling, long polling, Server-Sent Events (SSE), and WebSockets, plus older request mechanisms like XMLHttpRequest (XHR).

## Core Terms (Quick Definitions)

- **HTTP request**: A message the browser sends to a server to ask for data.
- **Response**: The server's reply to a request.
- **Polling**: The client repeatedly asks the server for updates.
- **Long polling**: The server holds the request open until new data is available.
- **SSE (Server-Sent Events)**: A one-way, server-to-client stream over HTTP.
- **WebSocket**: A two-way, persistent connection between client and server.
- **XHR (XMLHttpRequest)**: An older browser API for making HTTP requests.
- **Fetch**: The modern browser API for making HTTP requests.

## Why This Is JavaScript (Not HTML)

HTML defines the structure of a page. These strategies are about network requests and event handling, which are controlled by JavaScript running in the browser or in a server environment.

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

**Pros**:

- Efficient for server-to-client updates.
- Built-in reconnection behavior in browsers.

**Cons**:

- One-way only (server to client).
- Not supported in older browsers without a polyfill. This mostly affects legacy environments like IE11 or older embedded WebViews (Android/Safari); modern evergreen browsers generally support SSE.

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
- **WebSockets**: Two-way real-time data (chat, multiplayer, trading).
