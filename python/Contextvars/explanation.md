# Context Variables (contextvars)

`contextvars` is a Python standard library module for storing request-scoped data that survives async boundaries safely. Think of them as: “Globals, but only within the logical execution context of this request.” (For example, to save a correlation id for a request)
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
    token = request_id.set(rid)  # set() returns a token for restoring the previous value
    try:
        # Read the current value anywhere in the call stack.
        return request_id.get()
    finally:
        # Always reset to avoid leaking into other tasks or reused code paths.
        request_id.reset(token)

def handle_request_without_reset(rid):
    request_id.set(rid)
    return request_id.get()

print(handle_request("req-1"))
print(handle_request("req-2"))

# If you forget to reset, the old value can persist in the current context.
print(handle_request_without_reset("req-3"))
print(request_id.get())  # still "req-3" here unless you reset it
```

Resetting restores the previous value for the current context so a reused task or code path does not keep the old request's ID.
Common usage is in ASGI apps and async frameworks for logging and tracing context.
