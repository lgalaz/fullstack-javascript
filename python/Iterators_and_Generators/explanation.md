# Iterators and Generators

## Introduction

Iterators and generators provide lazy iteration, which is critical for large datasets and streaming pipelines.

## Key Concepts

- An iterator implements `__iter__` and `__next__`.
- A generator is a function that yields values lazily and is itself an iterator.
- Generators save memory by not building full lists.

## Example: Generator

```python
# generator.py
def read_lines(path):
    # Stream file lines one at a time.
    with open(path, 'r', encoding='utf8') as f:
        for line in f:
            yield line.strip()

for line in read_lines('logs.txt'):
    print(line)
    # Prints each line from logs.txt without loading the whole file.
```

## Example: Custom Iterator

```python
# countdown.py
class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        # The iterator is the object itself.
        return self

    def __next__(self):
        # Stop when we reach zero.
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

for n in Countdown(3):
    print(n)
    # 3, then 2, then 1 on separate iterations.
```

## Practical Guidance

- Use generators for large files or infinite streams.
- Prefer generator expressions for simple transformations.
- Be explicit when a function returns an iterator vs. a list.
- Iterators (including generators) only advance when `next()` is called, typically by a `for` loop or a consumer like `list()` or `sum()`.

Example: Manual `next()`:

```python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

it = countdown(3)
print(next(it))  # 3
print(next(it))  # 2
print(next(it))  # 1
```

Example: Infinite generator (only advances when you call `next()`, so it does not block unless you keep consuming it in a loop).
Useful for streams, paginated APIs, log tailing, or any “produce values on demand” workflow:

```python
def countdown(n):
    while True:
        yield n
        n += 1

it = countdown(3)
print(next(it))  # 3
print(next(it))  # 4
print(next(it))  # 5
```
