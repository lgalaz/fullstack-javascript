# API Design and Versioning

## What matters

- Use predictable resources and HTTP semantics.
- Prefer plural collections: `/users`, `/orders`, `/users/:id`.
- Keep error shapes, pagination, and naming conventions consistent across the API.

## Interview points

- Prefer additive changes over breaking changes.
- Version only when necessary; URL versioning is simpler to route, cache, log, and debug, while header versioning keeps URLs cleaner but requires more discipline in clients, proxies, and observability tooling.
- Use offset pagination for simple small lists; use cursor pagination for large or fast-changing lists, where the cursor usually encodes the last item’s stable sort key and is treated as opaque by clients.
- Use explicit filter params and a documented `sort` convention such as `sort=-createdAt`.

## Senior notes

- Stable sort order matters for pagination, because unstable ordering can cause duplicate or missing records between pages.
- `GET` should be safe to repeat; `POST` usually creates, but can be made retry-safe with idempotency keys; `PATCH` is partial update.
- Tools like Postman, OpenAPI-based docs and client generators, and proxies work better when the API follows standard conventions.
