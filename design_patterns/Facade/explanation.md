# Facade

## Overview

Provides a simplified interface to a complex subsystem.

## When to use

- You want to reduce coupling to subsystem details.
- You need a clean entry point for clients.
- Subsystem complexity should be hidden from callers.

## Trade-offs

- Can become a god object if it grows too much.
- May hide useful functionality behind a minimal interface.
- Needs maintenance as subsystems evolve.
