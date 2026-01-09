# Factories

## Introduction

Factories create complex objects while enforcing invariants. They keep construction logic out of entities and services.

## Example

A factory can build an `Order` with required items and compute initial totals.

## Practical Guidance

- Use factories when construction has rules.
- Prefer static factory methods for small object graphs.
