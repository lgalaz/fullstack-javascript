# Observer

## Overview

Defines a one-to-many dependency so observers are notified of changes.

## When to use

- You need event-driven updates between components.
- You want to decouple publishers from subscribers.
- Multiple listeners should react to a change.

## Trade-offs

- Notification order can be unpredictable.
- Memory leaks if subscriptions are not cleaned up.
- Debugging event cascades can be hard.
