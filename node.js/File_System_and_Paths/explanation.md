# File System and Paths

## Introduction

Node.js provides the `fs` and `path` modules for working with the file system in a cross-platform way. Understanding sync vs. async APIs, permissions, and path resolution is essential for reliability.

## Async vs. Sync

- Async APIs are non-blocking and should be used in servers.
- Sync APIs block the event loop and are best for scripts or startup-time tasks.

## Example: Read/Write with fs/promises

This example creates a directory, writes a file, and reads it back using the promise-based API. It is safe for servers because it does not block the event loop.

```javascript
// files.js
const fs = require('fs/promises');
const path = require('path');

async function writeAndRead() {
  const dir = path.join(process.cwd(), 'data');
  await fs.mkdir(dir, { recursive: true });

  const file = path.join(dir, 'note.txt');
  await fs.writeFile(file, 'Hello from Node', 'utf8');

  const content = await fs.readFile(file, 'utf8');
  console.log(content);
}

writeAndRead().catch(error => {
  console.error(error.message);
});
```

## Path Resolution

Paths are different across operating systems, so use `path` helpers to avoid bugs. `path.resolve` returns an absolute path from the current working directory, while `path.join` safely concatenates segments.

```javascript
const path = require('path');

const absolute = path.resolve('logs', 'app.log');
const joined = path.join('/var', 'tmp', 'cache');

console.log({ absolute, joined });
```

## Practical Guidance

- Use `path.join` or `path.resolve` instead of string concatenation.
- Use `fs.promises` for cleaner `async`/`await` flow.
- Handle `ENOENT` and permission errors explicitly.
