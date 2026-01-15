# Threading, Multiprocessing, and the GIL

## Introduction

Python threads share memory but are limited by the Global Interpreter Lock (GIL), which allows only one thread to execute Python bytecode at a time. Multiprocessing uses separate processes for true parallelism.

The GIL simplifies memory management in CPython (reference counting) but means CPU-bound threads do not run in parallel within a single process. I/O-bound threads can still make progress because the GIL is released during many blocking operations.

## Key Concepts

- Threads are good for I/O-bound work.
- Multiprocessing is better for CPU-bound tasks.
- The GIL limits parallel CPU execution in one process.

## Example: Thread vs Process

```python
# concurrency.py
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def work(x):
    # CPU-bound toy function.
    return x * x

with ThreadPoolExecutor() as t:
    # Runs tasks on threads (shared memory, GIL applies).
    print(list(t.map(work, range(5))))
    # [0, 1, 4, 9, 16]

with ProcessPoolExecutor() as p:
    # Runs tasks in separate processes (true parallelism).
    print(list(p.map(work, range(5))))
    # [0, 1, 4, 9, 16]
```

## Practical Guidance

- Use threads for I/O concurrency.
- Use processes or native extensions for CPU-heavy workloads.
- Avoid shared mutable state across processes.
- For web servers, use a process manager like Gunicorn to run multiple worker processes for parallel request handling.
Gunicorn is a WSGI application server. It’s not a cluster manager by itself, but it can run multiple worker processes on one machine, which looks like “clustering” locally. For multi‑host clustering, you’d use an external process manager or orchestrator (systemd, supervisord, Kubernetes, etc.) and run multiple Gunicorn instances behind a load balancer.
**WSGI** stands for **Web Server Gateway Interface**.
