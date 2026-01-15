# Packaging and Virtual Environments

## Introduction

Python packaging controls dependencies and reproducibility. Virtual environments isolate dependencies per project to avoid conflicts.

## Key Concepts

- `venv` creates isolated environments.
- `pip` installs dependencies.
- `pyproject.toml` is the modern packaging config.

`venv` isolates project dependencies, while `pyenv` manages multiple Python versions on a machine. They are complementary: use `pyenv` to select a Python version and `venv` to create an isolated environment for the project.

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

`pyproject.toml` lives at the root of a Python project. It is not part of `venv`; it is a packaging metadata file used by build tools (and pip) to describe the project name, version, and dependencies.

## Practical Guidance

- Always use a virtual environment for projects.
  Explanation: isolates dependencies so different projects do not conflict.
- Pin dependencies for reproducible builds.
  Explanation: fixed versions prevent surprises from upstream changes.
- Consider Poetry or uv for larger projects.
  Explanation: Poetry and uv are third-party packaging tools that provide dependency resolution, lockfiles, and streamlined project workflows.
