# Threading, Multiprocessing, and the GIL

## Introduction

Python threads share memory but are limited by the Global Interpreter Lock (GIL), which allows only one thread to execute Python bytecode at a time. Multiprocessing uses separate processes for true parallelism.

## Key Concepts

- Threads are good for I/O-bound work.
- Multiprocessing is better for CPU-bound tasks.
- The GIL limits parallel CPU execution in one process.

## Example: Thread vs Process

```python
# concurrency.py
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def work(x):
    return x * x

with ThreadPoolExecutor() as t:
    print(list(t.map(work, range(5))))

with ProcessPoolExecutor() as p:
    print(list(p.map(work, range(5))))
```

## Practical Guidance

- Use threads for I/O concurrency.
- Use processes or native extensions for CPU-heavy workloads.
- Avoid shared mutable state across processes.
