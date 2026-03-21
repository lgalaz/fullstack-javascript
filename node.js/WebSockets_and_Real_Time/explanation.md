# WebSockets and Real-Time Communication

## What matters

- WebSockets are persistent bidirectional connections: one long-lived connection where both client and server can send messages.
- Use them when polling is too slow or too expensive.

## Interview points

- Choose WebSockets for chat, live dashboards, collaboration, or multiplayer flows.
- Choose SSE when you only need server-to-client streaming.
- Define a message protocol, auth model, reconnect strategy, and per-message authorization rules.

## Senior notes

- Real-time systems usually break because parts of the system cannot keep up with message volume (`backpressure`), too many clients reconnect at the same time after a failure (`reconnect storms`), or one update must be pushed to a large number of clients (`state fan-out`) not because sending a WebSocket message is hard.
- Deal with `backpressure` using bounded queues, rate limits, batching, and dropping low-value updates when consumers fall behind.
- Deal with `reconnect storms` using exponential backoff with jitter, lightweight session recovery, and connection throttling during recovery.
- Deal with `state fan-out` using rooms/topics, selective subscriptions, batching, and compact snapshots or deltas instead of broadcasting everything to everyone.

## Example

```javascript
socket.on('message', data => {
  console.log(data.toString());
});
```
