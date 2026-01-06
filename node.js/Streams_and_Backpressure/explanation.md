# Streams and Backpressure

## Introduction

Streams are Node.js primitives for processing data incrementally. They enable high-performance I/O and keep memory usage stable for large payloads.

## Stream Types

- Readable: data source (files, sockets)
- Writable: data sink (files, sockets)
- Duplex: readable + writable (TCP sockets)
- Transform: modifies data as it flows

## Backpressure

Backpressure is how streams signal that the consumer is slower than the producer. The stream pauses reading until the writable side drains, preventing memory blow-ups.

## Example: File Copy with Pipeline

`pipeline` connects streams and propagates errors correctly. It also manages backpressure automatically so the writable stream is not overwhelmed.

```javascript
// copy-file.js
const fs = require('fs');
const { pipeline } = require('stream');

pipeline(
  fs.createReadStream('./big-input.bin'),
  fs.createWriteStream('./big-output.bin'),
  err => {
    if (err) {
      console.error('Copy failed:', err.message);
    } else {
      console.log('Copy completed');
    }
  }
);
```

## Example: Transform Stream

A transform stream lets you modify data as it passes through. Here we convert a text file to uppercase without loading it all into memory.

```javascript
// upper-case.js
const { Transform } = require('stream');
const fs = require('fs');

const upper = new Transform({
  transform(chunk, _encoding, callback) {
    const transformed = chunk.toString().toUpperCase();
    callback(null, transformed);
  },
});

fs.createReadStream('./input.txt')
  .pipe(upper)
  .pipe(fs.createWriteStream('./output.txt'));
```

## Practical Guidance

- Prefer `pipeline` over manual `pipe` to handle errors correctly.
- Use streams for large files or continuous data to avoid buffering everything in memory.
- Tune `highWaterMark` if you need to balance throughput vs. memory.
