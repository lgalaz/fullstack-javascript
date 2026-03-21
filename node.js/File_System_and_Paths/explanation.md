# File System and Paths

## What matters

- Use async fs APIs in servers, because sync fs blocks the event loop; keep sync fs for scripts or startup tasks where no live traffic is being served.
- Use `path.join()` / `path.resolve()` instead of string concatenation.

## Interview points

- Handle `ENOENT`, permission failures, and partial writes explicitly.
- Paths are platform-specific; do not hardcode separators.
- File I/O can still use the libuv thread pool and become a bottleneck under load.

## Senior notes

- Treat user-controlled file paths as a security boundary.
- Large file operations should usually be streamed.

## Example

```javascript
const fs = require('fs/promises');
const path = require('path');

async function readConfig() {
  const file = path.join(process.cwd(), 'config.json');
  return fs.readFile(file, 'utf8');
}
```
