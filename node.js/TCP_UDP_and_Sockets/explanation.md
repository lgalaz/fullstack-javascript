# TCP/UDP and Sockets

## Introduction

Node.js provides low-level networking via the `net` (TCP) and `dgram` (UDP) modules. These are useful for custom protocols, proxies, and high-performance services.

## Example: TCP Echo Server

```javascript
// tcp-server.js
const net = require('net');

const server = net.createServer(socket => {
  socket.on('data', data => {
    socket.write(`echo: ${data.toString()}`);
  });
});

server.listen(4000, () => {
  console.log('TCP server on port 4000');
});
```

```javascript
// tcp-client.js
const net = require('net');

const socket = net.createConnection({ port: 4000 }, () => {
  socket.write('hello');
});

socket.on('data', data => {
  console.log(data.toString());
  socket.end();
});
```

## Example: UDP Sender/Receiver

```javascript
// udp-server.js
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
  console.log(`msg: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.bind(5000);
```

```javascript
// udp-client.js
const dgram = require('dgram');
const client = dgram.createSocket('udp4');

client.send('ping', 5000, 'localhost', err => {
  if (err) console.error(err.message);
  client.close();
});
```

## Practical Guidance

- Use TCP for reliability; use UDP for low latency when loss is acceptable.
- Implement framing for TCP protocols (length prefix or delimiters).
- Add timeouts and backpressure handling.
