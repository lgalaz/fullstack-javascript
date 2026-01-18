# JSON and Serialization

## Introduction

Serialization is converting objects to a storable or transferable format (JSON, bytes). JSON is the most common interchange format for APIs.

## Key Concepts

- Use `json` for safe, text-based serialization.
- Avoid `pickle` for untrusted data.
- Define explicit schemas for stability.

`pickle` is Python's binary serialization format. It can serialize many Python objects, but it is unsafe to load data from untrusted sources because it can execute arbitrary code during unpickling.
`__reduce__` is the special method pickle uses to define how objects are serialized and reconstructed.

Example: pickle (do not use with untrusted input):

```python
import pickle

data = {"id": 1, "name": "Ada"}
blob = pickle.dumps(data)
restored = pickle.loads(blob)
print(restored)
# {'id': 1, 'name': 'Ada'}
```

## Example: JSON Encode/Decode

```python
# json_example.py
import json

# Python dict -> JSON string.
payload = {"id": 1, "name": "Ada"}
text = json.dumps(payload)
print(text)
# {"id": 1, "name": "Ada"}

# JSON string -> Python dict.
data = json.loads(text)
print(data["name"])
# Ada
```

## Practical Guidance

- Use `json.dumps(..., default=...)` for custom types.
Explanation: JSON does not know how to serialize custom objects by default, so provide a fallback.
Example:

```python
import json
from datetime import datetime

def encode(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"unsupported type: {type(obj)!r}")

payload = {"when": datetime(2024, 1, 1, 9, 0, 0)}
text = json.dumps(payload, default=encode)
print(text)
```

- Validate inbound JSON before using it.
Explanation: external data may be missing fields or have wrong types.
Example:

```python
import json

payload = json.loads('{"id": 1, "name": "Ada"}')
if not isinstance(payload.get("id"), int):
    raise ValueError("id must be an int")
```

- Avoid `pickle` for security reasons.
Explanation: Because pickle doesn’t just store data; it stores instructions for how to reconstruct objects. During pickle.loads, Python may call constructors or functions referenced in the pickle stream (via __reduce__/__reduce_ex__). A malicious pickle can encode “call this function with these args,” which is arbitrary code execution. That’s why it’s unsafe with untrusted input.
Example:

```python
# Only unpickle data you created yourself.
with open("data.pickle", "rb") as f:
    safe_data = f.read()
    obj = pickle.loads(safe_data)
```

Bad example (do not run; demonstrates arbitrary code execution via unpickling):

```python
import os
import pickle

class Exploit:
    def __reduce__(self):
        return (os.system, ("echo MALICIOUS_CODE_EXECUTED",))

payload = pickle.dumps(Exploit())
pickle.loads(payload)  # would execute os.system(...) on unpickle
```
