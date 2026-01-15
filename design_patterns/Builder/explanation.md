# Builder

## Overview

Constructs complex objects step by step while keeping construction logic separate from representation.

## When to use

- Object creation has many optional parts or variants.
- You want readable, incremental construction (for example, fluent builders).
- You need to reuse construction logic for different representations.

## Trade-offs

- More code and types than a simple constructor.
- Can hide required fields if not designed carefully.
- Builders can drift from the target object API.
