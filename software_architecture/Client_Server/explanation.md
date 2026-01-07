# Client-Server Architecture

## Introduction

Client-server architecture splits a system into clients that request services and servers that provide them. It is the dominant model for web and API-based systems.

## What It Is

- Clients initiate requests (browser, mobile app, other services).
- Servers handle requests, perform work, and return responses.
- Communication usually happens over HTTP or WebSocket.

## When It Is the Best Solution

- Most web and mobile applications.
- Systems where clients and servers evolve independently.
- Clear separation between UI concerns and backend logic.

## Misuse and When It Is Overkill

- Overkill for local scripts or single-process tools.
- Misuse when the server becomes a thin proxy with no domain logic (a proxy forwards requests to another service without doing much itself; it adds hops without adding business validation, orchestration, or security).
- Overuse of chatty client-server interactions can create latency issues (many small round trips amplify network delay). Best practice: batch or aggregate requests (BFF, GraphQL, or tailored endpoints) and return data in fewer calls.

## Example (Request/Response Flow)

```text
Client -> GET /users/123 -> Server -> Database -> Server -> JSON -> Client
```

```javascript
// server.js
const http = require('http');

http.createServer((req, res) => {
  if (req.url === '/users/123') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ id: 123, name: 'Ada' }));
    return;
  }
  res.writeHead(404);
  res.end('not found');
}).listen(3000);
```
