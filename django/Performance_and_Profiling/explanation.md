# Performance and Profiling

## Query Profiling

- Use Django Debug Toolbar locally to see SQL counts and timings.
- Use `QuerySet.explain()` to view query plans.
- Log queries with the `django.db.backends` logger when debugging.

```python
qs = Post.objects.filter(status="published")
print(qs.explain())
```

## Detecting N+1

- Watch for repeated queries in a list view.
- Fix with `select_related` and `prefetch_related`.

## App-Level Monitoring

- Track response time percentiles and error rates.
- Add request IDs to logs for tracing.
- Use APM tools (Datadog, New Relic, Sentry) in production.

## Load Testing

- Use tools like `locust` or `k6` for endpoint benchmarks.
- Measure p95/p99 latency and error rates under load.

## Testing for Query Counts

```python
from django.test import TestCase

class PostListTests(TestCase):
    def test_list_queries(self):
        with self.assertNumQueries(2):
            self.client.get("/posts/")
```
