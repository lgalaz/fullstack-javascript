# Why Node.js

## What matters

- Node.js is strongest for I/O-heavy systems: APIs, BFFs, real-time services, automation, and CLIs.
- Its advantage is concurrency through non-blocking I/O, not raw CPU throughput. Non-blocking I/O means the process can keep serving other work while waiting on network or disk operations.
- The big practical benefit is one language across frontend, backend, and tooling.

## Senior interview points

- Know the tradeoff: great for network-bound work, weaker for CPU-heavy work unless you offload to Worker Threads or another service.
- Know why teams choose it: fast iteration, huge ecosystem, operational maturity, and strong observability/debugging support.
- Know when not to use it: hard real-time systems, heavy compute pipelines, or workloads where the event loop would be a bottleneck.
