# WebSockets and Real-Time Communication

## Introduction

HTTP is request/response. Real-time apps need persistent, bidirectional connections. WebSockets provide that with a single TCP connection that stays open.

## When to Use

- Live dashboards, chat, notifications, multiplayer games.
- Avoid polling when you need low latency or high frequency updates.

## Example: WebSocket Server and Client

Install dependency:

```
npm install ws
```

```javascript
// ws-server.js
const http = require('http');
const { WebSocketServer } = require('ws');

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', socket => {
  socket.send('welcome');

  socket.on('message', data => {
    const text = data.toString();
    socket.send(`echo: ${text}`);
  });
});

server.listen(3000, () => {
  console.log('WebSocket server on ws://localhost:3000');
});
```

```javascript
// ws-client.js
const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:3000');

socket.on('open', () => {
  socket.send('hello server');
});

socket.on('message', data => {
  console.log(data.toString());
});
```

## Practical Guidance

- Design a message protocol (JSON or binary) and version it.
- Handle reconnects and backpressure on the client.
- Authenticate the connection and enforce authorization per message.
