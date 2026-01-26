# API Development

REST (Representational State Transfer) is about resource‑oriented design and uniform HTTP semantics, which maps directly to these practices: use resource URLs and proper verbs (resource design + HTTP basics), represent state consistently with clear schemas and error shapes (request/response shape + contracts), and rely on HTTP features like status codes, caching headers, and idempotency for predictable behavior. The rest of the list—security, versioning, observability, reliability—supports REST’s goals of stateless, scalable, and evolvable APIs.

## HTTP Basics

HTTP method semantics (sometimes called REST semantics): the intended meaning of each verb, along with properties like idempotency and safety (e.g., GET is safe/idempotent).
- Use HTTP verbs correctly: GET (read), POST (create/action), PUT (replace), PATCH (partial update), DELETE (remove).
- Use status codes consistently:
  - 103 Early Hints (not common as of Jan 24 2026)
  - 200 OK, 201 Created, 202 Accepted: Use 202 Accepted when the server accepts a request but hasn’t finished processing it yet (async work). You should return a way to check status (e.g., a job ID or status URL).
  - 204 No Content (no response body)
  - 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
  - 409 Conflict (idempotency/key reuse, version conflicts)
  - 422 Unprocessable Entity (validation errors)
  - 429 Too Many Requests (rate limiting)
  - 500/503 for server errors

## Resource Design

- Prefer resource-based URLs: `/users/123` not `/getUser?id=123`.
- Use nouns and consistent pluralization.
- Keep URLs stable; use query params for filtering, sorting, pagination.
- Avoid deep nesting unless it reflects ownership (e.g., `/users/123/posts`).

## Request/Response Shape

- Use consistent response envelopes and error formats.
- Include a stable error code and a human-readable message.
- For validation errors, return field-level details.

Example error:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "Invalid input",
    "fields": {
      "email": "Must be a valid email"
    }
  }
}
```

## Pagination

- Use cursor pagination for large datasets; offset for small lists.
- Return `next_cursor` or `links` metadata.
- Include `limit` defaults and max caps.

## Idempotency

- For retryable POST actions, support idempotency keys.
- Return the original result for repeated requests.
- Use 409 if the key is reused with a different payload.

## Versioning

- Prefer versioning in the URL (`/v1/...`) or via headers.
- Avoid breaking changes in place.
- Deprecate with clear timelines and response headers.

## Security

- Authenticate all protected routes (token, OAuth2, session).
- Authorize per resource (ownership checks, roles).
- Validate and sanitize input; never trust client data.
- Rate limit sensitive endpoints (login, password reset).
- Use TLS everywhere; avoid mixed content (mixing HTTP and HTTPS).

## Caching

- Use `ETag` or `Last-Modified` for cache validation. An ETag is a response header that represents a version of a resource (often a hash).
- Return `Cache-Control` headers where safe.
- Beware of caching user-specific responses.

## Observability

- Log request IDs/correlation IDs.
- Record latency, status codes, and error rates.
- Add structured logs and trace context headers.
- When possible, use OpenTelemetry or an APM (Sentry, Datadog, New Relic).

## Reliability

- Handle timeouts and retries on clients. (Exponential Backoff)
- Use circuit breakers for upstream dependencies. Circuit breakers are a resilience pattern that stops calling a failing dependency after repeated errors, then retries after a cool‑down.
- Return 202 for async workflows and provide status endpoints.

## Consistency and Contracts

- Document your API (OpenAPI/Swagger).
- Use schema validation and contract tests.
- Keep field naming and types consistent.

## Common Pitfalls

- Overloading POST for everything.
- Returning 200 on errors.
- Leaking internal exceptions.
- No rate limiting or observability.
- Breaking clients without versioning.
