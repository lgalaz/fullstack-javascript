# Adapter

## Overview

Converts the interface of a class into one clients expect.

## When to use

- You need to integrate legacy or third-party APIs.
- You want to unify multiple interfaces behind a single contract.
- You need to decouple clients from concrete APIs.

## Trade-offs

- Adds another layer to trace when debugging.
- Can mask impedance mismatches instead of fixing them.
- May need multiple adapters for different clients.
