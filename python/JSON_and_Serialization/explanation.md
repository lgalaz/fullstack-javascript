# JSON and Serialization

## Introduction

Serialization is converting objects to a storable or transferable format (JSON, bytes). JSON is the most common interchange format for APIs.

## Key Concepts

- Use `json` for safe, text-based serialization.
- Avoid `pickle` for untrusted data.
- Define explicit schemas for stability.

## Example: JSON Encode/Decode

```python
# json_example.py
import json

payload = {"id": 1, "name": "Ada"}
text = json.dumps(payload)
print(text)

data = json.loads(text)
print(data["name"])
```

## Practical Guidance

- Use `json.dumps(..., default=...)` for custom types.
- Validate inbound JSON before using it.
- Avoid `pickle` for security reasons.
