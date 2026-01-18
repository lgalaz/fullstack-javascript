# Data Types and Collections

## Introduction

Python's core types (list, dict, set, tuple) are powerful and flexible. Understanding their performance characteristics and correct usage is key for senior-level Python work.

## Key Concepts

- "Ordered" means the collection preserves insertion order when iterated.
- "Unordered" means iteration order is not guaranteed and may vary between runs.
  For sets, order depends on hash values and internal table layout, which can change with inserts/removals or hash randomization.
- Sets use a hash table but do not guarantee insertion order by design (the language spec does not require it).
- Lists are ordered and allow duplicates.
- Tuples are ordered and immutable.
- Sets are unordered collections of unique items.
- Dicts map keys to values with average O(1) lookup and preserve insertion order (Python 3.7+). Python dict is a hash table. It maps keys to values using the key’s hash (plus equality checks).
- Python supports generics via `typing` (e.g., `list[int]`, `dict[str, int]`) for type hints.

```python
from typing import TypeVar, Generic

T = TypeVar("T")

class Box(Generic[T]):
    def __init__(self, value: T) -> None:
        self.value = value

box_int: Box[int] = Box(1)
box_str: Box[str] = Box("hi")
```

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

- If you need ordered uniqueness, a key-only dict is a common pattern.
- Example:

```python
items = ["b", "a", "b", "c"]
ordered_unique = list(dict.fromkeys(items))
print(ordered_unique)  # ['b', 'a', 'c']
# If you need O(1) membership too, keep the dict itself and use `k in ordered_keys`.
ordered_keys = dict.fromkeys(items)  # {'b': None, 'a': None, 'c': None}
print("a" in ordered_keys)  # True
```

## Standard Collections

- `collections.Counter`: frequency counts and multiset operations.
- Example:

```python
from collections import Counter

counts = Counter(["a", "b", "a", "c", "b", "a"])
print(counts["a"])  # 3
print(counts.most_common(2))  # [('a', 3), ('b', 2)]
```

- `collections.defaultdict`: default values for missing keys.
- Example:

```python
from collections import defaultdict

# list is the default factory: missing keys start with []
groups = defaultdict(list)
groups["admin"].append("ada")
groups["admin"].append("grace")
print(groups["admin"])  # ['ada', 'grace']
```

- `collections.deque`: stands for double ended queue. Fast append/pop at both ends.
- Example:

```python
from collections import deque

q = deque(["task1", "task2"])
q.append("task3")
print(q.popleft())  # task1
```

- `collections.ChainMap`: layered views over multiple dicts. ChainMap looks up keys left‑to‑right.
- Example:

```python
from collections import ChainMap

defaults = {"timeout": 10, "retries": 2}
overrides = {"timeout": 30}
latest_overrides = {"retries": 3}
settings = ChainMap(overrides, defaults)
print(settings["timeout"])  # 30
print(settings["retries"])  # 2
setting2 = ChainMap(overrides, defaults, latest_overrides)
print(settings2["retries"])  # 2 (defaults before latest_overrides)
setting2 = ChainMap(latest_overrides, overrides, defaults)
print(settings3["retries"])  # 3 (latest_overrides first)
```

- `heapq`: priority queue on a list.
- Items must be mutually comparable (support `<`), so custom objects need ordering or should be wrapped.
- Example:

```python
import heapq

tasks = [(3, "low"), (1, "high"), (2, "medium")]
heapq.heapify(tasks)
print(heapq.heappop(tasks))  # (1, 'high')
print(heapq.heappop(tasks))  # (2, 'medium')
print(heapq.heappop(tasks))  # (3, 'low')
```

```python
import heapq

class Job:
    def __init__(self, priority: int, name: str) -> None:
        self.priority = priority
        self.name = name

    def __lt__(self, other: "Job") -> bool:
        return self.priority < other.priority

jobs = [Job(3, "low"), Job(1, "high"), Job(2, "medium")]
heapq.heapify(jobs)
print(heapq.heappop(jobs).name)  # high
```

- `bisect`: binary search in sorted lists.
- Example:

```python
import bisect

scores = [10, 20, 30, 40]
# bisect_left returns the insertion index before any existing equal values (keeps stable order).
pos = bisect.bisect_left(scores, 25)
scores.insert(pos, 25)
print(scores)  # [10, 20, 25, 30, 40]
```
