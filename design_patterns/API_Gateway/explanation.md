# API Gateway

## Overview

Provides a single entry point that routes, aggregates, and secures backend services.

## When to use

- Clients need a unified API over multiple services.
- You want central authentication and rate limiting.
- You need response aggregation and protocol translation.

## Trade-offs

- Gateway can become a bottleneck or single point of failure.
- Must be scaled and secured carefully.
- Changes require coordination across teams.
