# Buffers and Binary Data

## Introduction

Node.js uses `Buffer` to handle raw binary data. Understanding how buffers work is critical for files, networking, cryptography, and performance-sensitive tasks.

## Key Concepts

- `Buffer` is a fixed-size chunk of memory.
- It is a subclass of `Uint8Array` with additional Node-specific methods.
- Encoding matters when converting between bytes and strings.

## Common Use Cases

- File I/O for binary formats (images, PDFs, audio) where you must preserve exact bytes.

Example:

```javascript
// read-image.js
const fs = require('fs/promises');

async function readImage() {
  const data = await fs.readFile('./photo.jpg');
  console.log('Bytes:', data.length);
}

readImage().catch(console.error);
```

- Network protocols that send raw bytes over TCP/UDP sockets.

Example:

```javascript
// tcp-bytes.js
const net = require('net');

const server = net.createServer(socket => {
  socket.on('data', chunk => {
    console.log('Raw bytes:', chunk);
  });
});

server.listen(4000);
```

- Cryptography (hashing, signing, encryption) which operates on byte arrays.

Example:

```javascript
// hash-bytes.js
const crypto = require('crypto');

const buf = Buffer.from('hello');
const hash = crypto.createHash('sha256').update(buf).digest('hex');
console.log(hash);
```

## Example: Encoding and Decoding

This shows how a string becomes raw bytes and how the same bytes can be represented in different encodings (hex, base64).

```javascript
// buffer-encoding.js
const text = 'Hello Node';
const buf = Buffer.from(text, 'utf8');

console.log(buf); // <Buffer 48 65 6c 6c 6f 20 4e 6f 64 65>
console.log(buf.toString('hex')); // 48656c6c6f204e6f6465
console.log(buf.toString('base64')); // SGVsbG8gTm9kZQ==
```

## Example: Building a Binary Packet

Binary protocols often pack multiple values into a fixed-size buffer. This example writes a 32-bit integer and a 32-bit float into the same 8-byte buffer, then reads them back.

```javascript
// packet.js
const buf = Buffer.alloc(8);

// Write a 32-bit integer and a 32-bit float
buf.writeInt32BE(42, 0);
buf.writeFloatBE(3.14, 4);

const id = buf.readInt32BE(0);
const value = buf.readFloatBE(4);

console.log({ id, value });
```

## Safety and Performance

- Avoid `Buffer.allocUnsafe` unless you fully overwrite the memory.
- Reuse buffers for performance, but beware of sharing mutable data.
- Prefer binary protocols over JSON in hot paths for throughput.
