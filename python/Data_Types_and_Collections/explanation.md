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
users = ["ada", "grace", "linus"]  # list: ordered, allows duplicates
ids = {"u1", "u2", "u3"}           # set: unique, unordered
user_by_id = {"u1": "ada", "u2": "grace"}  # dict: key -> value lookup
point = (10, 20)                   # tuple: ordered, immutable

print(users[0])
# "ada" (index access from list)
print("u2" in ids)
# True (fast membership check in set)
print(user_by_id.get("u1"))
# "ada" (dict lookup by key)
print(point)
# (10, 20) (tuple value)
```

## Performance Notes

- List membership (`x in list`) is O(n).
- Example:

```python
names = ["ada", "grace", "linus"]
print("ada" in names)  # O(n) scan
```

- Set and dict membership are O(1) on average.
- Example:

```python
name_set = {"ada", "grace", "linus"}
name_map = {"ada": 1, "grace": 2, "linus": 3}
print("ada" in name_set) # O(1) average
print("ada" in name_map) # O(1) average (checks keys)
```

- Use tuples as dict keys when you need composite keys.
- Example:

```python
conversion_table = {
    ("usd", "eur"): 0.92,
    ("usd", "jpy"): 157.4,
}

print(conversion_table[("usd", "eur")])
# 0.92

for (from_ccy, to_ccy), rate in conversion_table.items():
    if "usd" in (from_ccy, to_ccy):
        print(from_ccy, "->", to_ccy, rate)
```

## Practical Guidance

- Prefer dicts for lookup-heavy workloads.
- Example:

```python
user_by_id = {"u1": "ada", "u2": "grace"}
print(user_by_id["u1"])  # dict lookup by key
```

- Use sets to dedupe and test membership.
- Example:

```python
ids = ["u1", "u2", "u1"]
unique_ids = set(ids)
print(unique_ids)  # {'u1', 'u2'}
print("u2" in unique_ids)
```

- Use tuples for fixed-size, immutable data.
- Example:

```python
point = (10, 20)
print(point[0], point[1])
```

- A one-element tuple needs a trailing comma: `(1,)`, not `(1)`.
- Example:

```python
single = (1,)
print(single, len(single))
```
