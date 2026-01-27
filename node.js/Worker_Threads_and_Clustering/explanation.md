# Worker Threads and Clustering

## Introduction

Node.js runs JavaScript on a single thread. For CPU-bound workloads, you need parallelism. Two common approaches:

- Worker Threads: multiple threads inside one process.
- Clustering: multiple Node processes that share the same server port.

## Worker Threads Example

Worker threads run JavaScript in parallel. This example computes a slow Fibonacci value in a worker so the main thread stays responsive.

```javascript
// worker.js
const { parentPort } = require('worker_threads');

function fib(n) {

  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}

parentPort.on('message', n => {
  const result = fib(n);
  parentPort.postMessage(result);
});
```

```javascript
// main.js
const { Worker } = require('worker_threads');

function runFib(n) {

  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js');
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.postMessage(n);
  });
}

runFib(40).then(result => {
  console.log('fib(40) =', result);
});
```

## Clustering Example

Clustering starts multiple Node processes that share the same server port. The OS load balancer distributes incoming connections across workers.

```javascript
// cluster.js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
  cluster.on('exit', worker => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  http.createServer((_req, res) => {
    res.end(`Handled by ${process.pid}`);
  }).listen(3000);
}
```

## Practical Guidance

- Use Worker Threads for CPU-heavy JS inside a service.
- Use clustering when you need multiple processes (e.g., better memory isolation).
- Prefer an external process manager (systemd, PM2) to supervise workers.
