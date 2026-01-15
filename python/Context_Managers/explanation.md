# Context Managers

## Introduction

Context managers guarantee setup and cleanup around a block of code. They are essential for handling files, locks, and resources safely.

## Key Concepts

- `with` ensures cleanup even if errors occur.
- Implement `__enter__` and `__exit__` for custom managers.
- Use `contextlib` for lightweight managers.

## Example: File Handling

```python
# file-context.py
with open('data.txt', 'r', encoding='utf8') as f:
    data = f.read()
```

## Example: Custom Context Manager

```python
# timer.py
import time

class Timer:
    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, exc_type, exc, tb):
        self.end = time.time()
        print(f"Elapsed: {self.end - self.start:.3f}s")

with Timer():
    sum(range(1_000_000))
```

## Example: TypeScript using with Symbol.dispose

```ts
class Resource {
  constructor(private name: string) {}

  doWork() {
    console.log(`using ${this.name}`);
  }

  [Symbol.dispose]() {
    console.log(`disposed ${this.name}`);
  }
}

{
  using res = new Resource("file-handle");
  res.doWork();
}
// res[Symbol.dispose]() called automatically at end of block
```

## Practical Guidance

- Use context managers for any resource that must be closed.
- Avoid manual try/finally when `with` is clearer.
