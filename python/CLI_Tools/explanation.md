# CLI Tools

## Introduction

Python is excellent for building command-line tools. Use `argparse` for built-in parsing or `click` for more ergonomic CLIs.

## Key Concepts

- Parse arguments and validate input.
- Return non-zero exit codes on failure.
- Provide `--help` output.

## Example: argparse

```python
# cli.py
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('name')
parser.add_argument('--times', type=int, default=1)

args = parser.parse_args()
for _ in range(args.times):
    print(f"Hello {args.name}")
```

## Practical Guidance

- Keep CLIs small and focused.
- Use subcommands for complex tools.
- Print helpful error messages.

## Why Use Click

Use `click` when you want a more ergonomic, declarative CLI with less boilerplate. It is especially useful when:

- You have multiple commands or subcommands and want a clean structure.
- You want automatic help text, type conversion, and validation.
- You need prompts, confirmations, or colored output.

Stick with `argparse` for small, dependency-free scripts or when you want to avoid third-party packages.

In this context, "ergonomic" means the API is more pleasant to use: fewer lines of code, clearer structure, and less manual wiring for common features.
