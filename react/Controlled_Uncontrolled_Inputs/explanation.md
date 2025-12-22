# Controlled vs Uncontrolled Inputs - Comprehensive Study Guide

## Introduction

Forms in React can be controlled (state drives the input) or uncontrolled (DOM holds the value). Both are valid, with different tradeoffs.

## Controlled Inputs

The input value is stored in React state and updated on every change.

```javascript
import { useState } from 'react';

function NameForm() {
  const [name, setName] = useState('');

  return (
    <input
      value={name}
      onChange={e => setName(e.target.value)}
      placeholder="Name"
    />
  );
}
```

Pros: single source of truth, easy validation, instant UI updates.

## Uncontrolled Inputs

The DOM manages the value. Use refs to read it when needed.

```javascript
import { useRef } from 'react';

function NameForm() {
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(inputRef.current.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="" />
      <button type="submit">Save</button>
    </form>
  );
}
```

Pros: fewer re-renders, simpler for large forms with rare reads.

## Avoid switching modes

React warns if an input switches between controlled and uncontrolled. Keep `value` defined (even empty string) for controlled inputs, and use `defaultValue` for uncontrolled.

```javascript
<input value={value ?? ''} onChange={...} />
```

## Hybrid patterns

You can keep inputs uncontrolled for typing performance, then sync on submit or blur.

```javascript
function Search() {
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');

  function onSubmit(e) {
    e.preventDefault();
    setQuery(inputRef.current.value);
  }

  return (
    <form onSubmit={onSubmit}>
      <input ref={inputRef} defaultValue={query} />
    </form>
  );
}
```

## When to Use Each

- Controlled: validation, dynamic UI, dependent fields.
- Uncontrolled: quick forms, legacy integrations, performance-sensitive forms.

## Interview Questions and Answers

### 1. What is a controlled input?

An input whose value is driven by React state and updated via `onChange`.

### 2. When would you choose uncontrolled inputs?

When you need less state handling or only read values on submit.
