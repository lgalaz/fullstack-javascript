# Asyncio and Concurrency

## Introduction

`asyncio` provides cooperative concurrency for I/O-bound tasks. It enables many tasks to run without blocking the event loop.

## Key Concepts

- `async def` defines a coroutine.
- `await` yields control to the event loop.
- Use `asyncio.gather` to run tasks concurrently.

## Example: Concurrent I/O

```python
# asyncio-example.py
import asyncio

async def fetch(n):
    await asyncio.sleep(0.5)
    return f"done {n}"

async def main():
    results = await asyncio.gather(fetch(1), fetch(2), fetch(3))
    print(results)

asyncio.run(main())
```

## Practical Guidance

- Use asyncio for network and file I/O, not CPU-heavy work.
- Avoid blocking calls in async code; use async libraries.
- Add timeouts to external calls.
