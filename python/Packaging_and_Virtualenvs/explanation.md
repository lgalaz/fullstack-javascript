# Packaging and Virtual Environments

## Introduction

Python packaging controls dependencies and reproducibility. Virtual environments isolate dependencies per project to avoid conflicts.

## Key Concepts

- `venv` creates isolated environments.
- `pip` installs dependencies.
- `pyproject.toml` is the modern packaging config.

## Example: Create and Use a venv

```bash
# Create an isolated environment in .venv/
python -m venv .venv
# Activate it (bash/zsh).
source .venv/bin/activate
# Install a dependency into the venv.
pip install requests
```

## Example: Minimal pyproject.toml

```toml
[project]
name = "my-app"
version = "0.1.0"
dependencies = ["requests>=2.31"]
```

## Practical Guidance

- Always use a virtual environment for projects.
- Pin dependencies for reproducible builds.
- Consider Poetry or uv for larger projects.
