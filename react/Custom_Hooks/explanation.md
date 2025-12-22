# Custom Hooks in React - Comprehensive Study Guide

## Introduction

Custom hooks let you extract and reuse stateful logic across components. They are plain functions whose names start with `use`.

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
  return <button onClick={() => setTheme('dark')}>{theme}</button>;
}
```

## Guidelines

- Names must start with `use` so React can enforce hook rules.
- Custom hooks can call other hooks.
- Keep them focused and reusable.

## Example: useEventListener

```javascript
function useEventListener(target, type, handler) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!target) return;
    const listener = event => handlerRef.current(event);
    target.addEventListener(type, listener);
    return () => target.removeEventListener(type, listener);
  }, [target, type]);
}
```

Custom hooks encapsulate lifecycle and cleanup logic so components stay small.

## Interview Questions and Answers

### 1. What is a custom hook?

A reusable function that uses hooks to share stateful logic across components.

### 2. Why must custom hooks start with `use`?

It allows React to detect hook usage and enforce the rules of hooks.
