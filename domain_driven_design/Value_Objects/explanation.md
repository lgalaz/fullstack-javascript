# Value Objects

## Introduction

Value objects are defined by their attributes and are immutable. Two value objects with the same values are considered equal.

## Example

A `Money` value object might include `amount` and `currency` and be treated as a single concept.

## Practical Guidance

- Make value objects immutable.
- Validate invariants at creation time.
