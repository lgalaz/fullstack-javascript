# Ecosystem

Laravel's ecosystem includes first-party tools and common integrations:

First-party:
- **Sanctum**: simple token auth for APIs and SPAs.
- **Passport**: OAuth2 server.
- **Horizon**: queue dashboard for Redis.
- **Telescope**: local debugging and request/DB monitoring.
- **Octane**: high-performance server (Swoole/RoadRunner).
- **Dusk**: browser testing.
- **Nova**: admin panel (paid).

Common integrations:
- **Redis** for cache/queues.
- **S3** for file storage.
- **Stripe** or **Paddle** for payments.
- **Mail providers** like SES, Mailgun, Postmark.
- **Sentry** or **Bugsnag** for error tracking.
- **Algolia** or **Meilisearch** for search.
- **Spatie packages** (roles/permissions, media library, activity log).
- **Livewire** / **Inertia** for reactive UI without a full SPA.

Ecosystem best practice: keep framework-specific logic at the edges and move core domain logic into services so upgrades are easier.
