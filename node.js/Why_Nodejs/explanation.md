# Why Node.js

## Summary

Node.js is a JavaScript runtime built for I/O-heavy work. It shines when you need to handle many concurrent connections efficiently and want a single language across the stack.

## Why It’s Popular

- Non-blocking I/O handles lots of network requests with low overhead.
- Large ecosystem (npm) for web, CLI, tooling, and infrastructure.
- One language across frontend and backend simplifies teams and code sharing.
- Good fit for real-time apps (chat, dashboards, streaming).
- Strong tooling for debugging and profiling.

## When It’s Not Ideal

- CPU-bound workloads can block the event loop (use Worker Threads or another runtime).
- Ultra-low-latency or hard real-time systems may prefer other platforms.

## Typical Use Cases

- APIs and microservices
- Real-time systems (WebSockets, notifications)
- CLIs and automation tools
- BFF (backend-for-frontend) layers
