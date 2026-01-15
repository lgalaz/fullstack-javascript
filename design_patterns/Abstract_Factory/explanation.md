# Abstract Factory

## Overview

Creates families of related objects without specifying their concrete classes.

## When to use

- You need to switch entire product families (for example, UI themes or drivers).
- Clients should stay decoupled from concrete types.
- You want consistent combinations of objects across a family.

## Trade-offs

- Adds extra types and indirection.
- Harder to extend with new product types.
- Can feel heavy for small codebases.
