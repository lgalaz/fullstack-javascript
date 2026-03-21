# Streams and Backpressure

## What matters

- Streams let Node process large or continuous data without buffering everything in memory.
- Backpressure is the mechanism that slows producers when consumers cannot keep up.

## Interview points

- Know the stream types: Readable, Writable, Duplex, Transform.
- `Readable`: you read data from it, like a file read stream or an incoming HTTP request body.
- `Writable`: you write data into it, like a file write stream or an HTTP response.
- `Duplex`: it is both readable and writable, like a TCP socket.
- `Transform`: it is a duplex stream that changes data as it passes through, like gzip compression.
- Prefer `pipeline()` over manual `.pipe()` chains because a stream chain should fail as one unit: `pipeline()` propagates errors, cleans up the other streams, and gives one completion point for the whole operation.
- Use streams for uploads, downloads, file processing, compression, and proxying.

## Example

```javascript
const fs = require('fs');
const { pipeline } = require('stream');

pipeline(
  fs.createReadStream('./input.txt'),
  fs.createWriteStream('./output.txt'),
  error => {
    if (error) console.error(error);
  }
);
```

## Senior notes

- Memory problems in Node often come from buffering when streaming was the right choice.

```js
// Buffers the whole file in memory before sending it.
const data = await fs.promises.readFile('./large-report.csv');
res.end(data);

// Streams the file chunk by chunk instead.
fs.createReadStream('./large-report.csv').pipe(res);
```

- Buffering means holding the whole payload, or too much of it, in memory at once. Streaming avoids that by processing data chunk by chunk.

- Tune `highWaterMark` only when measurements justify it.
- `highWaterMark` is the stream's internal buffering threshold. When buffered data reaches that level, the stream starts applying backpressure to slow producers down.

```js
const fs = require('fs');

const writable = fs.createWriteStream('./output.txt', {
  highWaterMark: 16 * 1024, // 16 KB buffer threshold
});

const chunk = Buffer.alloc(8 * 1024); // 8 KB

let canKeepWriting = writable.write(chunk);
console.log(canKeepWriting); // true: buffer is still under the threshold

canKeepWriting = writable.write(chunk);
console.log(canKeepWriting); // false: buffer reached the threshold

writable.once('drain', () => {
  console.log('buffer drained, writes can resume');
});
```

- In this example, the first write stays below `highWaterMark`, so it returns `true`. After the next write fills the internal buffer, `write()` returns `false`, which is the signal to stop pushing more data until `drain` fires.
