# Data Types and Collections

## Introduction

Python's core types (list, dict, set, tuple) are powerful and flexible. Understanding their performance characteristics and correct usage is key for senior-level Python work.

## Key Concepts

- Lists are ordered and allow duplicates.
- Tuples are ordered and immutable.
- Sets are unordered collections of unique items.
- Dicts map keys to values with average O(1) lookup.

## Example: Choosing the Right Collection

```python
# collections.py
users = ["ada", "grace", "linus"]  # order matters
ids = {"u1", "u2", "u3"}            # uniqueness matters
user_by_id = {"u1": "ada", "u2": "grace"}  # key lookup matters

print(users[0])
print("u2" in ids)
print(user_by_id.get("u1"))
```

## Performance Notes

- List membership (`x in list`) is O(n).
- Set and dict membership are O(1) on average.
- Use tuples as dict keys when you need composite keys.

## Practical Guidance

- Prefer dicts for lookup-heavy workloads.
- Use sets to dedupe and test membership.
- Use tuples for fixed-size, immutable data.
