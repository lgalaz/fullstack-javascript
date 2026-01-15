# Chain of Responsibility

## Overview

Passes a request along a chain of handlers until one handles it.

## When to use

- Multiple handlers may process a request.
- You want to decouple senders from receivers.
- Handling order should be configurable.

## Trade-offs

- Requests may go unhandled without clear feedback.
- Order can be subtle and hard to debug.
- Extra indirection for simple routing.
