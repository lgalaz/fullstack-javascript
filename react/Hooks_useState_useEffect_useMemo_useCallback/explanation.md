# Core React Hooks 

## Introduction

Hooks let function components manage state, side effects, and performance. The most commonly used are `useState`, `useEffect`, `useMemo`, and `useCallback`.

## Rules of Hooks

- Only call hooks at the top level.
- Only call hooks from React function components or custom hooks.

## useState

`useState` adds local state to a function component. It accepts an initial value (or initializer function) and returns `[state, setState]`.

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

Example of stale values:

```javascript
function Counter({ step }) {
  const [count, setCount] = useState(0);
  const [localStep, setLocalStep] = useState(step);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + localStep);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setLocalStep((s) => s + 1)}>
        Increase step (now {localStep})
      </button>
    </div>
  );
}
```

Because `count` and `step` are missing from the dependency array, the interval keeps using the initial values and never sees updates.

Correct usage (include dependencies):

```javascript
function Counter({ step }) {
  const [count, setCount] = useState(0);
  const [localStep, setLocalStep] = useState(step);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + localStep);
    }, 1000);
    return () => clearInterval(id);
  }, [count, localStep]);

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setLocalStep((s) => s + 1)}>
        Increase step (now {localStep})
      </button>
    </div>
  );
}
```

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

function App() {
  const [items, setItems] = useState([1, 2, 3]);

  return (
    <>
      <Expensive items={items} />
      <button onClick={() => setItems((prev) => [...prev, 4])}>
        Add item
      </button>
    </>
  );
}
```

`useMemo` is a performance hint, not a guarantee. React may discard memoized values under memory pressure (when it needs to free memory, it can drop cached values and recompute later).

## useCallback

Memoizes a function reference to avoid unnecessary re-renders in children.

```javascript
import { useCallback, useState, memo } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <Child onClick={handleClick} count={count} />;
}

const Child = memo(function Child({ onClick, count }) {
  return (
    <button onClick={onClick}>
      Clicked {count}
    </button>
  );
});
```

Explanation: `memo` avoids re-rendering `Child` when its props are referentially equal. `useCallback` keeps `onClick` stable so `Child` doesn't re-render unless `count` changes.

Without `useCallback`, a new `onClick` function is created every render, so `memo` can't skip the child:

```javascript
function App() {
  const [tick, setTick] = useState(0);

  return (
    <>
      <button onClick={() => setTick((t) => t + 1)}>
        Re-render Parent (tick {tick})
      </button>
      <Parent />
    </>
  );
}

// Updating App state re-renders App and all its children (including Parent).

function Parent() {
  const [count, setCount] = useState(0);
  return <Child onClick={() => setCount(c => c + 1)} count={count} />;
}
```

Eplanation: That inline arrow function is re-created on every render of Parent, so onClick is a new reference each time. Because Child is memoized, it only skips re-rendering when props are referentially equal; the new onClick prop breaks that, so Child re-renders every time. It still works functionally, but you lose the render‑skipping benefit of memo.

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

Use them when you need stable references or expensive calculations and can measure a performance benefit. Avoid blanket memoization (adding `useMemo`/`useCallback` everywhere); it adds complexity, increases dependency management, and can be wasted work if renders are cheap. Start by memoizing where you see re-render hotspots, especially with memoized children or expensive computations.
