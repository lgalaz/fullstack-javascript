# Custom Hooks in React 

## Introduction

Custom hooks let you extract and reuse stateful logic across components. They are plain functions whose names start with `use`.
They can call other hooks, which is what differentiates them from regular utility functions.
Use a custom hook when you need reusable stateful behavior that plugs into React's lifecycle (state, effects, context); use a plain function for pure, stateless helpers.

## Example: useLocalStorage

```javascript
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

Usage:

```javascript
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [theme2, setTheme2] = useLocalStorage('theme2', 'light');
  const [theme3, setTheme3] = useLocalStorage('theme3', 'light');

  return (
    <>
      <button onClick={() => setTheme('dark')}>{theme}</button>
      <button onClick={() => setTheme2('dark')}>{theme2}</button>
      <button onClick={() => setTheme3('dark')}>{theme3}</button>
    </>
  );
}
```

## Guidelines

- Names must start with `use` so React can enforce hook rules.
- Custom hooks can call other hooks.
- Keep them focused and reusable.

## Example: useEventListener

```javascript
function useEventListener(target, type, handler) {
  // Keep the latest handler without re-attaching the listener every render.
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!target) return;

    // Use a stable listener that calls the latest handler.
    const listener = (event) => handlerRef.current(event);
    target.addEventListener(type, listener);

    // Cleanup runs on unmount and before re-running when target/type changes.
    return () => target.removeEventListener(type, listener);
  }, [target, type]);
}

function Example() {
  const [count, setCount] = useState(0);

  useEventListener(window, 'keydown', (event) => {
    if (event.key === 'ArrowUp') {
      setCount((c) => c + 1);
    }
  });

  return <p>Count: {count}</p>;
}
```

Notes:
- `target` is a DOM node or `window`/`document`. Pass `null` until it exists (e.g., before a ref is set).
- `type` is the event name string, like `'click'` or `'keydown'`.
- `handler` can change every render; the ref ensures the listener always calls the latest function.

Custom hooks encapsulate lifecycle and cleanup logic so components stay small.

## Interview Questions and Answers

### 1. What is a custom hook?

A reusable function that uses hooks to share stateful logic across components.

### 2. Why must custom hooks start with `use`?

It allows React to detect hook usage and enforce the rules of hooks.

Sample rules of hooks:
- Call hooks only at the top level (never inside loops, conditions, or nested functions).
- Call hooks only from React function components or other custom hooks.

Example bug (state gets associated with the wrong hook):

```javascript
function Profile({ showStatus }) {
  const [name, setName] = useState('');

  // This hook is called only when showStatus is true.
  if (showStatus) {
    useEffect(() => {
      document.title = `Status for ${name}`;
    }, [name]);
  }

  const [age, setAge] = useState(0);

  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={age} onChange={(e) => setAge(Number(e.target.value))} />
    </>
  );
}
```

If `showStatus` changes from true to false, React "skips" the effect hook and the next hook (`useState` for age) takes its place. On the next render, the
state that used to belong to the effect slot is now treated as the age state.
In practice, you might see the age input suddenly show `undefined` or a stale value, or the app might throw a runtime error like:

```
Rendered fewer hooks than expected. This may be caused by an accidental early return statement.
```
