# Context Variables (contextvars)

`contextvars` is a Python standard library module for storing request-scoped data that survives async boundaries safely. Think of them as: “Globals, but only within the logical execution context of this request.”
It avoids the pitfalls of global variables and thread-locals in async code.

## Why Use Them

- Safe per-request state in async code (no cross-task leakage).
- Works across `await` boundaries without manual parameter plumbing.
- Better for logging/tracing context than globals.

## When to Use Them

- ASGI apps and background tasks that interleave on the same event loop.
- You need to carry request IDs, user IDs, or trace IDs through deep call stacks.
- You have shared libraries that need access to request-scoped data without extra parameters.

## What It Solves

- Tracks per-request state across `async`/`await`.
- Keeps values isolated between concurrent tasks.
- Enables safe propagation of values like request IDs, user IDs, or trace IDs.

## Example

```python
import contextvars

request_id = contextvars.ContextVar("request_id")

def handle_request(rid):
    token = request_id.set(rid)
    try:
        # Read the current value anywhere in the call stack.
        return request_id.get()
    finally:
        # Always reset to avoid leaking into other tasks.
        request_id.reset(token)
```

Common usage is in ASGI apps and async frameworks for logging and tracing context.
