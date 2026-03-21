# Performance, Profiling, and Memory

## What matters

- Measure first.
- In Node, common bottlenecks are event-loop blocking, hot code paths, memory leaks, and slow dependencies.

### What those mean

- `event-loop blocking`: a long synchronous task holds the main thread, so other requests, timers, and callbacks wait behind it.
- `hot code paths`: code that runs very frequently, where small inefficiencies add up into meaningful CPU cost.
- `memory leaks`: memory that should become collectible stays referenced, so heap or RSS keeps growing over time.
- `slow dependencies`: databases, APIs, caches, disks, or other external systems that make your app wait even when your own code is fine.

## Interview points

- Watch event-loop delay, CPU usage, heap growth, RSS (Resident Set Size), latency, and GC pauses. RSS is total memory held by the process; GC is garbage collection.
- Use profiles and heap snapshots instead of guessing. A profile shows where CPU time is spent.
- Unbounded caches and retained references are common leak sources.

### Useful commands

CPU profile:

```bash
node --cpu-prof app.js
```

Heap snapshot:

```bash
node --heapsnapshot-signal=SIGUSR2 app.js
kill -USR2 <pid>
```

Inspector for DevTools-based profiling:

```bash
node --inspect app.js
```

## Senior notes

- “High memory” is not automatically a leak; look for memory that grows and does not come back down.
- Performance work is usually about system behavior under realistic concurrency, not microbenchmarks in isolation.
