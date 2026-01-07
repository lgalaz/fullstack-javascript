# File I/O and Pathlib

## Introduction

Python's `pathlib` provides a clean, cross-platform way to work with file paths. Use it with standard file I/O for readability and safety.

## Key Concepts

- Use `Path` for path operations.
- Prefer context managers for file access.
- Handle encoding explicitly for text files.

## Example: Read and Write

```python
# files.py
from pathlib import Path

path = Path('data') / 'note.txt'
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text('Hello', encoding='utf8')

text = path.read_text(encoding='utf8')
print(text)
```

## Practical Guidance

- Avoid string path concatenation.
- Catch `FileNotFoundError` when needed.
- Use binary mode for images or PDFs.
