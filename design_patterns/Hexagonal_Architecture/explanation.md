# Hexagonal Architecture

## Overview

Organizes the system around a domain core with ports and adapters at the edges.

## When to use

- You want domain logic independent of frameworks and IO.
- Multiple interfaces (web, CLI, tests) should be interchangeable.
- You need a clean separation between core and infrastructure.

## Trade-offs

- More abstractions and interfaces to maintain.
- Can be overkill for simple apps.
- Requires discipline to keep boundaries intact.
