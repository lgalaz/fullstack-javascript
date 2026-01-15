# Layered Architecture

## Overview

Organizes code into layers (presentation, domain, data) with clear dependencies.

## When to use

- You need a straightforward separation of concerns.
- You want to limit coupling between UI and data access.
- The system is a classic CRUD-style application.

## Trade-offs

- Layers can become leaky and tightly coupled.
- Strict layering may hurt performance.
- Business logic can get scattered.
