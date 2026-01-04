# Buffers and Binary Data

## Introduction

Node.js uses `Buffer` to handle raw binary data. Understanding how buffers work is critical for files, networking, cryptography, and performance-sensitive tasks.

## Key Concepts

- `Buffer` is a fixed-size chunk of memory.
- It is a subclass of `Uint8Array` with additional Node-specific methods.
- Encoding matters when converting between bytes and strings.

## Example: Encoding and Decoding

```javascript
// buffer-encoding.js
const text = 'Hello Node';
const buf = Buffer.from(text, 'utf8');

console.log(buf); // <Buffer 48 65 6c 6c 6f 20 4e 6f 64 65>
console.log(buf.toString('hex'));
console.log(buf.toString('base64'));
```

## Example: Building a Binary Packet

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
