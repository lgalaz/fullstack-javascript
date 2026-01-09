# Entities

## Introduction

Entities are domain objects defined by identity, not just their attributes. They can change over time but remain the same conceptual thing.

## Example

A `User` is still the same user if their email changes, because identity is tied to `id`.

## Practical Guidance

- Use stable identifiers.
- Place business rules on the entity, not in services.
