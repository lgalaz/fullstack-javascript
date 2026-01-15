# Circuit Breaker

## Overview

Prevents repeated calls to failing services by opening a circuit.

## When to use

- You need to protect systems from cascading failures.
- Downstream services are flaky or slow.
- You want fast failure with fallback behavior.

## Trade-offs

- Tuning thresholds requires monitoring and experimentation.
- Can hide issues if misconfigured.
- Adds runtime state and complexity.
