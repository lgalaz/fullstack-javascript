# Retry

## Overview

Automatically re-attempts failed operations with backoff and limits.

## When to use

- Failures are transient and likely to succeed on retry.
- You want to improve robustness without user involvement.
- Operations are idempotent or safely repeatable.

## Trade-offs

- Can amplify load during outages.
- Non-idempotent operations risk duplication.
- Requires careful backoff strategy.
