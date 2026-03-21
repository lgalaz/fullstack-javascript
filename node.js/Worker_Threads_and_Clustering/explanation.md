# Worker Threads and Clustering

## What matters

- Worker Threads solve CPU-bound JavaScript work.
- Clustering runs multiple Node processes on one host. A worker thread is another JS thread inside the same process; a cluster worker is a separate OS process.

## Interview points

- Workers are for parallel compute, not for general I/O scaling.
- Reuse workers via a pool for repeated jobs.
- In many modern deployments, multiple containers/processes behind a load balancer are simpler than `cluster`.

## Senior notes

- Use workers when CPU work would otherwise block the event loop.
- Choose separate processes when you want stronger memory isolation or independent failure domains.

## Example

```javascript
const { Worker } = require('worker_threads');

const worker = new Worker('./worker.js');
worker.postMessage(42);
```
