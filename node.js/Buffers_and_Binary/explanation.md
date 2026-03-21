# Buffers and Binary Data

## What matters

- `Buffer` is Node’s raw byte container: a fixed-size block of memory for bytes.
- It is central to files, sockets, crypto, and binary protocols.

## Interview points

- `Buffer` extends `Uint8Array`.
- Encoding matters: UTF-8, hex, base64, and raw bytes are different views of data.
- `Buffer.allocUnsafe()` is fast but only safe if you overwrite all bytes before reading.

## Senior notes

- Binary handling bugs are often encoding bugs.
- Buffers are mutable; shared references can cause subtle corruption.

## Example

```javascript
const buf = Buffer.from('hello', 'utf8');

console.log(buf.toString('hex'));    // 68656c6c6f
console.log(buf.toString('base64')); // aGVsbG8=
```
