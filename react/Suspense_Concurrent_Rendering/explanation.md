# Suspense and Concurrent Rendering - Comprehensive Study Guide

## Introduction

Suspense lets you show fallback UI while a component or data is loading. Concurrent features like `startTransition` help keep the UI responsive during expensive updates.

## React.lazy with Suspense

```javascript
import { Suspense, lazy } from 'react';

const Settings = lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Settings />
    </Suspense>
  );
}
```

## startTransition

Use transitions for non-urgent updates.

```javascript
import { startTransition, useState } from 'react';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    startTransition(() => {
      setResults(expensiveFilter(value));
    });
  }

  return (
    <input value={query} onChange={handleChange} />
  );
}
```

You can also use `useTransition` to track pending state.

```javascript
const [isPending, startTransition] = useTransition();
```

## useDeferredValue

Defer non-urgent derived values to keep typing responsive.

```javascript
const deferredQuery = useDeferredValue(query);
const results = expensiveFilter(deferredQuery);
```

## Notes

Concurrent rendering means React can interrupt renders and resume later. It does not mean multi-threaded rendering in JavaScript.

## Interview Questions and Answers

### 1. What problem does Suspense solve?

It provides a consistent way to show fallback UI while components or data are loading.

### 2. What is `startTransition` used for?

To mark updates as non-urgent so React can keep the UI responsive.
