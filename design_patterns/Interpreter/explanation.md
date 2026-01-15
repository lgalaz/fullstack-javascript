# Interpreter

## Overview

Defines a grammar and interprets sentences in that language.

## When to use

- You need a simple domain-specific language.
- Rules are stable and can be represented as an AST.
- Expression evaluation should be extensible.

## Trade-offs

- Does not scale well to complex grammars.
- Performance can be slower than compiled approaches.
- Implementation can be verbose.
