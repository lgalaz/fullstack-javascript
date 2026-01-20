# Shared Kernel

## Introduction

A Shared Kernel is a small, explicitly shared part of the model and code used by multiple bounded contexts. It exists to avoid duplicated core concepts while keeping most of each context independent. 
It’s usually better to only share value objects and small abstractions. Sharing entities can tightly couple contexts, so only do it if both contexts truly agree on the entity’s meaning and lifecycle.

## Example

Billing and Support both rely on a shared concept like `Money` or `EmailAddress`. These value objects live in the shared kernel, while each context keeps its own domain model for everything else.

## Practical Guidance

- Keep the shared kernel small and stable.
- Define ownership and coordination rules before sharing changes.
- Avoid turning it into a dumping ground for general utilities.
