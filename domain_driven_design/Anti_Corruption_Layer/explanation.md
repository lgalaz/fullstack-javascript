# Anti-Corruption Layer

## Introduction

An Anti-Corruption Layer (ACL) protects your domain from external systems by translating their models into your own.

## Example

A third-party billing API returns `customer_status`, but your domain expects `SubscriptionState`. The ACL maps between them.

## Practical Guidance

- Keep translation logic at the boundary.
- Avoid leaking external models into core domain code.
