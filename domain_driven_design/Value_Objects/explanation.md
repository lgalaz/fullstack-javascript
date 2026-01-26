# Value Objects

## Introduction

Value objects are defined by their attributes and are immutable. Two value objects with the same values are considered equal.

## Example

A `Money` value object might include `amount` and `currency` and be treated as a single concept.

## Practical Guidance

- Validate invariants at creation time.

## Typed Identifiers and Domain Primitives

Typed identifiers (like `OrderId`) and domain primitives (like `EmailAddress`, `Percentage`) are usually implemented as value objects. They model small, stable concepts in the ubiquitous language and keep validation close to the data.

If a concept is small, immutable, and defined by its value, treat it as a value object and include it in the domain model. These are not separate from value objects; they are common categories of value objects you add to your model.
