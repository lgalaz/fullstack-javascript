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

## Example: Redirect Stats to Logging or Sentry

```python
import cProfile
import io
import logging
import pstats

logger = logging.getLogger(__name__)

prof = cProfile.Profile()
prof.enable()
work()
prof.disable()

buf = io.StringIO()
stats = pstats.Stats(prof, stream=buf).sort_stats("tottime")
stats.print_stats(10)

# Send to logs (could be picked up by ELK/cloud logging).
logger.info("profile stats:\n%s", buf.getvalue())

# Or send to Sentry as an attachment (requires sentry_sdk).
# import sentry_sdk
# sentry_sdk.capture_message("profile stats", attachments=[
#     {"filename": "profile.txt", "data": buf.getvalue()}
# ])
```

## Example: timeit

```python
# timeit_example.py
import timeit

# Time how long 1000 runs of sum(range(10000)) take.
# number=1000 controls how many repeats; the range size controls the work per run.
print(timeit.timeit('sum(range(10000))', number=1000))
# e.g. 0.02 (varies by machine)
```

## Practical Guidance

- Optimize hot paths only after measuring.
  Explanation: profile first so you focus on the code that actually dominates runtime.
- Use built-in functions and vectorized libraries when possible.
  Explanation: built-ins and vectorized libraries (e.g., NumPy) operate on whole arrays and run fast loops in native code (C/Fortran), avoiding slow Python-level loops.
- Offload CPU-heavy work to native code or multiprocessing.
  Explanation: native code (C/Cython/Rust extensions) bypasses Python overhead (interpreter overhead like dynamic dispatch and type checks); multiprocessing uses multiple OS processes to parallelize CPU-bound tasks.
