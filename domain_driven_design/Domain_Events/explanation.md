# Domain Events

## Introduction

Domain events represent something meaningful that happened in the domain. They capture facts and enable decoupled reactions.

## Example

`OrderPlaced` can trigger email notifications, inventory updates, and analytics, without the order aggregate knowing the details.

## Practical Guidance

- Name events in past tense.
- Treat events as immutable facts.
