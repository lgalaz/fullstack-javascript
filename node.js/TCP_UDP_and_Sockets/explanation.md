# TCP/UDP and Sockets

## Introduction

Node.js provides low-level networking via the `net` (TCP) and `dgram` (UDP) modules. A protocol is a set of rules for how data is formatted and transmitted over a network. TCP is connection-oriented and reliable (a connection is established and maintained per client; ordered delivery with retransmission), while UDP is connectionless and best-effort (no handshake or persistent connection; faster, but no delivery guarantees). These are useful for custom protocols, proxies, and high-performance services.

## Example: TCP Echo Server

This TCP server reads raw bytes from a socket and writes a response. TCP is stream-based, so you must design message framing in real protocols (define how to split the byte stream into messages, e.g., length prefixes or delimiters like `\n`).

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

UDP is message-based and does not guarantee delivery. This example sends a single datagram and logs it on the server.

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
