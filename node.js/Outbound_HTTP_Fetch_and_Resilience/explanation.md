# Outbound HTTP, Fetch, and Resilience

## What matters

- Node services are also HTTP clients.
- Outbound requests need timeouts, cancellation, and controlled retries.

## Interview points

- Always set a timeout.
- Retry only transient failures and only when the operation is safe to retry.
- Propagate cancellation when the original request is aborted.
- Connection reuse and concurrency limits matter under load.

## Senior notes

- Most production incidents in service-to-service calls come from retry storms, no timeouts, or unbounded fan-out.
- Built-in `fetch()` is fine for many cases, but resilience behavior still has to be designed explicitly.

## Example

```javascript
const response = await fetch('https://api.example.com/users', {
  signal: AbortSignal.timeout(3000),
});
```
