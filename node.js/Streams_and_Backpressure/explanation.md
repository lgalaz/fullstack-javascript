# Streams and Backpressure

## Introduction

Streams are Node.js primitives for processing data incrementally. Think of a stream like a hose instead of a bucket: you handle chunks as they flow rather than waiting for the entire payload. This keeps memory usage stable for large files because you only hold a small buffer at a time. The same pattern applies to downloads: you stream chunks as they arrive and process or forward them on the fly.

## Stream Types

- Readable: a source you can read chunks from (e.g., a file read stream or inbound socket).
- Writable: a sink you can write chunks to (a “sink” is the destination, like a file write stream or outbound socket).
- Duplex: both readable and writable at the same time (e.g., a TCP socket where you send and receive data).
- Transform: a duplex stream that changes data as it passes through (e.g., gzip compression or uppercasing text).

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

Example use case: stream a large upload to disk without buffering it all in memory.

```javascript
// upload-stream.js
const http = require('http');
const fs = require('fs');
const { pipeline } = require('stream');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/upload') {
    const out = fs.createWriteStream('./upload.bin', { highWaterMark: 64 * 1024 });
    pipeline(req, out, err => {
      if (err) {
        res.writeHead(500);
        res.end('upload failed');
        return;
      }
      res.writeHead(200);
      res.end('ok');
    });
    return;
  }

  res.writeHead(404);
  res.end('not found');
});

server.listen(3000);
```
