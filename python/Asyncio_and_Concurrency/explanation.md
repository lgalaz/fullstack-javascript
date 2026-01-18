# Asyncio and Concurrency

## Introduction

`asyncio` provides cooperative concurrency for I/O-bound tasks. It enables many tasks to run without blocking the event loop.
When a coroutine awaits I/O, the OS performs the I/O in the background while the event loop runs other awaiting tasks. Once the I/O is ready, the event loop resumes the coroutine. CPU-bound work does not yield, so it blocks the loop unless you offload it to a thread or process.

## Key Concepts

- `async def` defines a coroutine.
- `await` yields control to the event loop.
- Use `asyncio.gather` to run tasks concurrently.

## Example: Concurrent I/O

```python
# asyncio-example.py
import asyncio

async def fetch(n):
    # Simulate an I/O-bound call (e.g., HTTP request) without blocking the event loop.
    await asyncio.sleep(0.5)
    return f"done {n}"

async def main():
    # Schedule three fetch coroutines concurrently, like Promise.all in Node.js.
    # Each sleeps for 0.5s, and gather waits for all three before returning results.
    results = await asyncio.gather(fetch(1), fetch(2), fetch(3))
    print(results)

    # Kick off the event loop and run main() to completion.
asyncio.run(main())
```

## Practical Guidance

- Use asyncio for network and file I/O, not CPU-heavy work.
- Avoid blocking calls in async code; use async libraries.
- Add timeouts to external calls.
