1. Node.js runtime & execution model
Interviewer

Explain Node.js’s execution model. How does the event loop actually work, and what misconceptions do you see often?

Candidate

Node.js is single-threaded at the JavaScript level, but not single-threaded overall.

Key points:

JavaScript runs on one main thread

I/O is handled by libuv, which manages:

an event loop

a thread pool (for fs, DNS, crypto, zlib, etc.)

The event loop phases (simplified):

Timers – setTimeout, setInterval

Pending callbacks – some I/O callbacks

Idle/prepare

Poll – incoming I/O, sockets, etc. (most important phase)

Check – setImmediate

Close callbacks

Additionally:

Microtasks (process.nextTick, Promises) run between phases

process.nextTick runs before Promises, which can starve the loop if abused

Common misconceptions:

“Node is single-threaded” → incorrect (thread pool exists)

“Async code runs in parallel” → JS does not; I/O does

“Promises are faster than callbacks” → they’re about control flow, not speed

The key mental model:
👉 Node is an event-driven orchestrator of async work, not a parallel compute engine.

2. Blocking the event loop
Interviewer

What does it mean to “block the event loop”? Give concrete examples and mitigation strategies.

Candidate

Blocking the event loop means preventing the main JS thread from yielding back to the event loop, which stops all requests from progressing.

Examples:

while (true) {} // infinite loop

JSON.parse(hugeString) // CPU-heavy sync work

bcrypt.hashSync(...) // sync crypto

Array.sort() on very large arrays


Symptoms:

Increased latency

Requests timing out

CPU pegged at 100% but low throughput

Mitigations:

Avoid sync APIs (fs.readFileSync, crypto.*Sync)

Chunk CPU work:

setImmediate(processChunk)


Move CPU-bound work to:

Worker Threads

A separate service (Go/Rust/Python)

Use streaming instead of loading everything into memory

Rule of thumb:

If it’s CPU-heavy or O(n²), it does not belong on the main thread.

3. Worker Threads vs Cluster
Interviewer

When would you use Worker Threads vs the Cluster module?

Candidate

They solve different problems.

Cluster

Multiple processes

Each has its own event loop and memory

Great for:

Horizontal scaling on a single machine

HTTP servers

Uses OS-level scheduling

Higher memory cost

Worker Threads

Multiple threads in the same process

Share memory via SharedArrayBuffer

Great for:

CPU-bound tasks

Offloading expensive computations

Lower memory overhead

More complex synchronization

Rule:

Scaling traffic → Cluster

Heavy computation → Worker Threads

In practice, many teams:

Use Kubernetes/PM2 instead of Cluster

Use Worker Threads sparingly for hotspots

4. Streams & backpressure
Interviewer

Explain streams and backpressure. Why do seniors care about this?

Candidate

Streams allow incremental processing of data instead of buffering everything in memory.

Types:

Readable

Writable

Duplex

Transform

Example:

fs.createReadStream('big.csv')
  .pipe(csvParser())
  .pipe(dbWriter())


Backpressure is the mechanism where:

If the consumer is slow

The producer pauses automatically

Without streams:

Memory spikes

GC pressure

Potential crashes

Backpressure is handled via:

highWaterMark

.pause() / .resume()

Return value of .write()

Why seniors care:

Streams are mandatory for large payloads

Prevent OOM crashes

Enable predictable memory usage

If you process files, uploads, logs, or data pipelines without streams → it’s a red flag.

5. Error handling philosophy
Interviewer

How do you design error handling in a Node.js service?

Candidate

I separate error types and boundaries.

Categories:

Programmer errors (bugs)

Null references

Type errors

Should crash the process

Operational errors

Network failures

Timeouts

Invalid user input

Should be handled gracefully

Patterns:

Never swallow errors

Never catch just to log and continue blindly

Use structured errors

class AppError extends Error {
  constructor(message, code, status) {}
}


Async handling:

Always await

Centralized error middleware (Express / Fastify)

process.on('unhandledRejection') → log + terminate

Production rule:

Crash fast, restart clean.

Node processes should be disposable.

6. Memory leaks in Node.js
Interviewer

How do memory leaks happen in Node.js? How do you debug them?

Candidate

Common causes:

Global variables retaining references

Event listeners not removed

Caches with no eviction

Closures capturing large objects

Timers that never clear

Debugging:

Enable:

node --inspect


Take heap snapshots

Compare snapshots over time

Look for:

Detached DOM-like structures

Growing arrays/maps

Listener counts

Operational signals:

RSS memory grows monotonically

GC runs more frequently

Latency spikes before OOM

Prevention:

Bounded caches (LRU)

Remove listeners

Avoid unbounded Maps/Sets

Monitor heap usage

7. Async patterns & control flow
Interviewer

What async patterns do you consider dangerous or outdated?

Candidate

Outdated / dangerous:

Callback pyramids

Manual Promise construction everywhere

Mixing callbacks and Promises

process.nextTick abuse

Preferred patterns:

async/await everywhere

Explicit concurrency control:

await Promise.allSettled(...)


Libraries like p-limit for throttling

Important insight:

Async ≠ parallel
Parallelism must be explicitly designed

8. HTTP servers: Express vs Fastify
Interviewer

What do you think of Express today? Would you still use it?

Candidate

Express is:

Stable

Minimal

Battle-tested

But:

No schema validation by default

Middleware chain can get messy

Performance is good but not great

Fastify advantages:

Built-in JSON schema

Better performance

Better TypeScript support

Clear plugin lifecycle

Decision:

Existing Express app → keep it

New high-performance API → Fastify

Serverless / edge → often neither

Framework choice matters less than:

Architecture

Observability

Error handling

9. Node.js in production
Interviewer

What does “production-ready” Node.js mean to you?

Candidate

It means:

Stateless processes

Proper graceful shutdown

process.on('SIGTERM', async () => {
  server.close()
})


Health checks

Structured logging

Metrics (latency, memory, event loop lag)

Timeouts everywhere

Idempotent handlers

Config via environment variables

Anti-patterns:

Long-lived in-memory state

Relying on try/catch for control flow

No request timeouts

No circuit breakers

10. Node.js strengths & limits
Interviewer

Where is Node.js the wrong tool?

Candidate

Node is excellent for:

- I/O-heavy workloads
- APIs
- Real-time systems
- BFFs
- Streaming
- Fast iteration and shared JS/TS across frontend and backend
- High concurrency with low per-request overhead
- Strong ecosystem for web tooling and serverless
- Polyglot systems (multiple languages/tech stacks) where Node glues services together

Node is bad for:

- CPU-heavy computation
- Tight numeric loops
- ML training
- Image/video processing (unless delegated)
- Senior judgment is knowing when not to use Node.
