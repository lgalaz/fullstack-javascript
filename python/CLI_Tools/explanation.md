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
