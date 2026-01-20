# Anti-Corruption Layer

## Introduction

An Anti-Corruption Layer (ACL) protects your domain from external systems by translating their models into your own.

An ACL is commonly implemented with adapters/translation layers. It’s broader than a single adapter though: it can include facades, mappers, translators, and anti‑corruption services that shield your model from external model changes.

## Example

A third-party billing API returns `customer_status`, but your domain expects `SubscriptionState`. The ACL maps between them.

## Practical Guidance

- Keep translation logic at the boundary.
- Avoid leaking external models into core domain code.
