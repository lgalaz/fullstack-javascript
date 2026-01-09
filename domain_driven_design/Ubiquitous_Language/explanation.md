# Ubiquitous Language

## Introduction

Ubiquitous Language is a shared vocabulary between developers and domain experts. The same terms appear in code, discussions, and documentation.

## Why It Matters

- Reduces translation errors between business and engineering.
- Makes code easier to read and validate with domain experts.
- Aligns teams around consistent concepts.

## Example

If the business says “Subscription can be paused,” the code should have a `Subscription.pause()` method, not a generic `setStatus('paused')`.

## Practical Guidance

- Keep terms consistent across APIs, DB fields, and UI.
- Rename code when the business language changes.
