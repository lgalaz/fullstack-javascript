# Child Processes

## What matters

- Use child processes when you need another executable, shell command, or isolated process.

## Interview points

- `spawn`: stream output, best for long-running or large-output commands.
- `exec`: buffers output in memory, best for short commands.
- `fork`: starts another Node process with IPC (inter-process communication).
- Never pass unsanitized user input into shell commands.

## Senior notes

- Prefer `spawn` over `exec` for control and memory safety.
- Prefer Worker Threads over `fork` for CPU-heavy JavaScript that should stay inside the same service. A worker thread runs JavaScript on another thread inside the same Node process, which is usually lighter than starting a whole new Node process.

## Example

```javascript
const { spawn } = require('child_process');

const child = spawn('node', ['-v']);
child.stdout.on('data', chunk => process.stdout.write(chunk));
child.on('close', code => {
  console.log(`child exited with code ${code}`);
});
```
