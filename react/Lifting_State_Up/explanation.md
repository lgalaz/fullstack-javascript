# Lifting State Up - Comprehensive Study Guide

## Introduction

When multiple components need to share the same state, move that state to their closest common ancestor. This is called lifting state up.

## Example

```javascript
function TemperatureInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  );
}

function Calculator() {
  const [celsius, setCelsius] = useState('');

  return (
    <div>
      <TemperatureInput label="C" value={celsius} onChange={setCelsius} />
      <p>F: {celsius ? (celsius * 9) / 5 + 32 : ''}</p>
    </div>
  );
}
```

## Why It Helps

- Single source of truth
- Consistent updates across related components
- Simpler debugging

## Avoid duplicated state

Compute derived values instead of storing multiple versions of the same data.

```javascript
function Calculator() {
  const [celsius, setCelsius] = useState('');
  const fahrenheit = celsius ? (celsius * 9) / 5 + 32 : '';

  return (
    <div>
      <TemperatureInput label="C" value={celsius} onChange={setCelsius} />
      <p>F: {fahrenheit}</p>
    </div>
  );
}
```

If lifting causes deep prop chains, consider context or a state store for shared state.

## Interview Questions and Answers

### 1. What is lifting state up?

Moving shared state to the nearest common parent so multiple children can use it.

### 2. When should you lift state up?

When two or more components need to read or update the same piece of data.
