# Performance and Profiling

## Introduction

Python performance issues typically come from CPU-bound loops or excessive I/O waits. Profiling helps you optimize the right places.

## Key Concepts

- Use `cProfile` for CPU profiling.
- Use `timeit` for micro-benchmarks.
- Avoid premature optimization.

## Example: cProfile

```python
# profile_example.py
import cProfile

def work():
    # Simulate a CPU-bound loop.
    total = 0
    for i in range(1000000):
        total += i
    return total

# Run the function under the profiler and print timing stats.
cProfile.run('work()')
```

## Example: timeit

```python
# timeit_example.py
import timeit

# Time how long 1000 runs of sum(range(1000)) take.
print(timeit.timeit('sum(range(1000))', number=1000))
# e.g. 0.02 (varies by machine)
```

## Practical Guidance

- Optimize hot paths only after measuring.
- Use built-in functions and vectorized libraries when possible.
- Offload CPU-heavy work to native code or multiprocessing.
