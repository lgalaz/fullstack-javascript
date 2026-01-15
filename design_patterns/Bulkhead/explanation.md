# Bulkhead

## Overview

Isolates resources so failures in one part do not sink the whole system.

## When to use

- You want to limit blast radius of failures.
- Different workloads should not contend for the same resources.
- You need predictable capacity for critical paths.

## Trade-offs

- Resource partitioning can reduce overall utilization.
- Requires tuning and monitoring.
- More configuration and operational overhead.
