# Bounded Contexts

## Introduction

A bounded context is a logical boundary where a model and language apply consistently. The same term can mean different things in different contexts.

## Example

“Customer” in billing might mean a paying account, while in support it might mean any user who opened a ticket. Treating these as separate contexts avoids confusion.

## Practical Guidance

- Define context boundaries early and make them explicit.
- Avoid sharing models across contexts; use translation at the boundary.
