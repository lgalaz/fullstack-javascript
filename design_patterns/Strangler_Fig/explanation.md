# Strangler Fig

## Overview

Gradually replaces a legacy system by routing functionality to new services.

## When to use

- You need to modernize without a big-bang rewrite.
- You can incrementally move features or endpoints.
- You want to de-risk migrations.

## Trade-offs

- Routing and integration logic can be complex.
- You must maintain two systems for a while.
- Clear boundaries are required to avoid duplication.
