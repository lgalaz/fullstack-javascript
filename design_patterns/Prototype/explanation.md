# Prototype

## Overview

Creates new objects by copying an existing prototype instance.

## When to use

- Construction is expensive and cloning is cheaper.
- You want to create variants by tweaking a base object.
- You need to avoid hardcoding concrete types.

## Trade-offs

- Cloning can be tricky for deep graphs and references.
- Requires clear copy semantics (deep vs shallow).
- Can hide real dependencies behind copies.
