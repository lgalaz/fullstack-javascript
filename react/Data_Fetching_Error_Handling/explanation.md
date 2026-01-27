# Data Fetching and Error Handling in React

## Introduction

React does not prescribe a single data fetching pattern. What matters is a consistent loading, success, and error strategy that works with your rendering model.

## Client-side fetching with effects

Use `useEffect` for client-only data fetching. Track loading and error explicitly and abort on unmount.

```jsx
import { useEffect, useState } from 'react';

function User({ id }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/users/${id}`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error('Request failed');

        return r.json();
      })
      .then(data => setUser(data))
      .catch(err => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">Failed to load user.</p>;

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
```

## Error boundaries vs async errors

Error boundaries only catch errors thrown during rendering, lifecycle methods, and constructors. They do not catch errors in event handlers or asynchronous code.

- Errors in `useEffect` must be handled locally (as above).
- Errors thrown during render can be handled by an error boundary.

## Suspense + error boundaries (modern pattern)

Suspense handles loading, and error boundaries handle failures. Libraries like React Query, SWR, or framework data layers can integrate with Suspense.

```jsx
<ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <Suspense fallback={<p>Loading...</p>}>
    <UserProfile />
  </Suspense>
</ErrorBoundary>
```

Rule of thumb:
- Use Suspense for loading states.
- Use error boundaries for render-time errors.
- Use local `try/catch` or error state for async/event errors.

## Interview Questions and Answers

### 1. Why do error boundaries not catch async errors?

They only intercept errors during render or lifecycle methods. Async errors happen outside that phase, so you must catch them yourself.

Note on phases: React work roughly flows through render (reconciliation), commit (DOM mutations), layout effects (`useLayoutEffect`), and passive effects (`useEffect`). Error boundaries catch errors thrown while React is rendering/reconciling and during class lifecycle methods in the commit phase (constructors, `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`). They do not catch errors in passive effects, event handlers, or async callbacks.

### 2. When would you choose Suspense for data?

When you have a data layer or framework that supports it and you want consistent loading states tied to rendering. Suspense works only when the data layer can "suspend" during render (throw a promise) and resume when it resolves. Frameworks like Next.js and libraries like React Query/SWR (Suspense mode) provide this integration. It is useful when you want loading UI controlled by `<Suspense>` boundaries instead of manual `loading` flags, so nested regions can stream and reveal independently.

### 3. What is the simplest reliable pattern for fetching in React?

Fetch in `useEffect`, track `loading` and `error` in local component state (via `useState`), and abort on unmount to avoid stale updates.
