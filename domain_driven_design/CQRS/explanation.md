# CQRS (Command Query Responsibility Segregation)

## Introduction

Command Query Responsibility Segregation (CQRS) separates write operations (commands) from read operations (queries). It can simplify models when read and write needs diverge.

Common divergence: writes need strong validation, invariants, and strict transactions, while reads are high-volume and optimized for reporting/search. In practice, you might have heavy dashboards or analytics that require denormalized views, different indexes, or read replicas, while writes use a stricter model and security on a separate connection. CQRS lets you optimize each side without contorting one model to fit both.

## DDD Relationship

CQRS is optional in DDD. Many DDD systems use a single model; CQRS becomes useful when reporting/read models are very different from write models.

## Practical Guidance

- Start with a single model; split only if reads and writes have conflicting requirements.
- Keep commands aligned with domain invariants.
