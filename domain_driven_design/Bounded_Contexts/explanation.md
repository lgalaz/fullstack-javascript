# Bounded Contexts

## Introduction

A bounded context is primarily a modeling and language boundary for a domain area. It is a logical boundary where a model and language apply consistently. 
A bounded context is where a single ubiquitous language is consistent and unambiguous. Outside it, the same term can mean something different, so you need translation between contexts.

## Example

“Customer” in billing might mean a paying account, while in support it might mean any user who opened a ticket. Treating these as separate contexts avoids confusion.

## Practical Guidance

- Define context boundaries early and make them explicit.
- Avoid sharing models across contexts; use translation at the boundary.
