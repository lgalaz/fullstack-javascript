# CQRS (Command Query Responsibility Segregation)

## Introduction

Command Query Responsibility Segregation (CQRS) separates write operations (commands) from read operations (queries). It can simplify models when read and write needs diverge.

## DDD Relationship

CQRS is optional in DDD. Many DDD systems use a single model; CQRS becomes useful when reporting/read models are very different from write models.

## Practical Guidance

- Start with a single model; split only if reads and writes have conflicting requirements.
- Keep commands aligned with domain invariants.
