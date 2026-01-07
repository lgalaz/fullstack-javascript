# Child Processes

## Introduction

Node.js can spawn other processes to run system commands or isolate work. The `child_process` module provides multiple APIs for this.

## APIs

- `spawn`: stream-based, good for long-running commands.
- `exec`: buffers output in memory, good for short commands.
- `fork`: spawns a Node process with IPC built in.

## Example: spawn

`spawn` starts a process and gives you streaming access to stdout/stderr. It is best for long-running or large-output commands.

```javascript
// list-files.js
const { spawn } = require('child_process');

const ls = spawn('ls', ['-la']);

ls.stdout.on('data', data => {
  process.stdout.write(data);
});

ls.stderr.on('data', data => {
  process.stderr.write(data);
});

ls.on('close', code => {
  console.log(`Child exited with code ${code}`);
});
```

## Example: fork with IPC

`fork` runs another Node.js script and opens an IPC (inter-process communication) channel so the parent and child can exchange JSON messages.

```javascript
// child.js
process.on('message', msg => {
  process.send({ received: msg, pid: process.pid });
});
```

```javascript
// parent.js
const { fork } = require('child_process');

const child = fork('./child.js');
child.on('message', msg => {
  console.log('From child:', msg);
});

child.send({ task: 'work' });
```

## Practical Guidance

- Use `spawn` for streaming output to avoid memory issues.
- Sanitize any user input before passing it to a child process.
- Prefer Worker Threads for CPU-bound JS work within the same process.
- Common use case: calling system tools (image/video processing, PDF generation, git commands) where the heavy work is done by an external binary.
