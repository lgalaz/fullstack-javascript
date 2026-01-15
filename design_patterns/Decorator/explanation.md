# Decorator

## Overview

Adds behavior to objects dynamically by wrapping them.

## When to use

- You need flexible combinations of behaviors.
- Inheritance would lead to many subclasses.
- You want to extend behavior without changing the base class.

## Trade-offs

- Many small wrapper objects can be hard to trace.
- Order of decoration can change behavior.
- Debugging requires inspecting multiple layers.
