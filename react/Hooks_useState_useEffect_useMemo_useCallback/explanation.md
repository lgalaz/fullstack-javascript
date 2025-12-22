# Core React Hooks - Comprehensive Study Guide

## Introduction

Hooks let function components manage state, side effects, and performance. The most commonly used are `useState`, `useEffect`, `useMemo`, and `useCallback`.

## Rules of Hooks

- Only call hooks at the top level.
- Only call hooks from React function components or custom hooks.

## useState

```javascript
import { useState } from 'react';

function Toggle() {
  const [on, setOn] = useState(false);
  return <button onClick={() => setOn(v => !v)}>{String(on)}</button>;
}
```

## useEffect

Use for side effects like data fetching, subscriptions, and timers.

```javascript
import { useEffect, useState } from 'react';

function User({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let canceled = false;

    fetch(`/api/users/${id}`)
      .then(r => r.json())
      .then(data => {
        if (!canceled) setUser(data);
      });

    return () => { canceled = true; };
  }, [id]);

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
```

Dependency arrays control when the effect runs. Missing dependencies can cause stale values.

Effects run after paint. In React Strict Mode (dev), effects may run twice to surface side-effect issues.

## useMemo

Memoizes a computed value to avoid expensive recalculation.

```javascript
import { useMemo } from 'react';

function Expensive({ items }) {
  const total = useMemo(() => {
    return items.reduce((sum, n) => sum + n, 0);
  }, [items]);

  return <div>Total: {total}</div>;
}
```

`useMemo` is a performance hint, not a guarantee. React may discard memoized values under memory pressure.

## useCallback

Memoizes a function reference to avoid unnecessary re-renders in children.

```javascript
import { useCallback, useState } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <Child onClick={handleClick} />;
}
```

`useCallback` is equivalent to `useMemo(() => fn, deps)`. Use it to keep function identity stable when passing to memoized children.

## Choosing the right hook

- `useState` for UI state.
- `useEffect` for side effects and subscriptions.
- `useMemo` for expensive derived data.
- `useCallback` for stable function props.

## Interview Questions and Answers

### 1. What does `useEffect` replace from class components?

It replaces `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.

### 2. When should you use `useMemo` or `useCallback`?

Use them when you need stable references or expensive calculations and can measure a performance benefit.
