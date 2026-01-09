# Repositories

## Introduction

Repositories provide collection-like access to aggregates. They hide persistence details and allow the domain to stay clean.

## Example

`OrderRepository.save(order)` and `OrderRepository.byId(id)` are typical methods.

## Practical Guidance

- Keep repository interfaces in the domain layer.
- Implement them in infrastructure layers.
