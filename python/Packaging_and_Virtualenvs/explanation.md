# Packaging and Virtual Environments

## Introduction

Python packaging controls dependencies and reproducibility. Virtual environments isolate dependencies per project to avoid conflicts.

## Key Concepts

- `venv` creates isolated environments.
- `pip` installs dependencies.
- `pyproject.toml` is the modern packaging config.

`venv` isolates project dependencies, while `pyenv` manages multiple Python versions on a machine. They are complementary: use `pyenv` to select a Python version and `venv` to create an isolated environment for the project.

Example: pyenv + venv together

```bash
# Choose the Python version for this project.
pyenv install 3.11.6
pyenv local 3.11.6

# Create and activate the venv with that Python.
python -m venv .venv
source .venv/bin/activate
```

Alternative: pyenv-virtualenv (named envs)

```bash
pyenv install 3.11.6
pyenv virtualenv 3.11.6 myproj
pyenv activate myproj
```

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
In mixed repos (e.g., a Node app invoking Python), keep `pyproject.toml` with the Python codebase (as a separate subproject or at the repo root).
In modern packaging, `pyproject.toml` replaces the role of `requirements.txt` for declaring runtime dependencies, though some teams still generate `requirements.txt` or lockfiles for exact pinning and deployment.

## Example: Install a Git Dependency (Modern Pattern)

Use a `pyproject.toml` to define dependencies, including a direct URL to a Git repo:

```toml
[project]
name = "worker-app"
version = "0.1.0"
dependencies = [
  "requests>=2.31",
  "pydantic>=2.7",
  "sqlalchemy>=2.0",
  "httpx>=0.27",
  "mycli @ git+https://github.com/you/mycli.git@a1b2c3d4",
]

[project.optional-dependencies]
dev = [
  "pytest>=8.0",
  "pytest-cov>=5.0",
  "ruff>=0.4",
]
```

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .
python -m mycli --help
```

## Practical Guidance

- Always use a virtual environment for projects.
  Explanation: isolates dependencies so different projects do not conflict.
- Pin dependencies for reproducible builds.
  Explanation: fixed versions prevent surprises from upstream changes.
- Consider Poetry or uv for larger projects.
  Explanation: Poetry and uv are third-party packaging tools that provide dependency resolution, lockfiles, and streamlined project workflows.
