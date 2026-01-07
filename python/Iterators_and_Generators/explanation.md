# Iterators and Generators

## Introduction

Iterators and generators provide lazy iteration, which is critical for large datasets and streaming pipelines.

## Key Concepts

- An iterator implements `__iter__` and `__next__`.
- A generator is a function that yields values lazily.
- Generators save memory by not building full lists.

## Example: Generator

```python
# generator.py
def read_lines(path):
    with open(path, 'r', encoding='utf8') as f:
        for line in f:
            yield line.strip()

for line in read_lines('logs.txt'):
    print(line)
```

## Example: Custom Iterator

```python
# countdown.py
class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

for n in Countdown(3):
    print(n)
```

## Practical Guidance

- Use generators for large files or infinite streams.
- Prefer generator expressions for simple transformations.
- Be explicit when a function returns an iterator vs. a list.
