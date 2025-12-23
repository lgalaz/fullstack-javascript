# Layouts, Templates, Loading, and Error UI 

## Introduction

The App Router supports nested layouts and route-level UI states with special files.

## Layouts

Layouts persist across routes in the same segment.

```javascript
// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <section>
      <nav>Dashboard Nav</nav>
      {children}
    </section>
  );
}
```

Nested layouts compose, so parent layout UI persists while child layouts render below.

## Templates

Templates are like layouts but reset state on navigation.

Templates are useful when you need to re-run client component state on each navigation within a segment.

```javascript
// app/dashboard/template.js
export default function Template({ children }) {
  return <div>{children}</div>;
}
```

## Loading UI

`loading.js` renders while a route segment is streaming.

```javascript
// app/dashboard/loading.js
export default function Loading() {
  return <p>Loading...</p>;
}
```

Loading UI boundaries work with Suspense. Each segment can have its own `loading.js` for fine-grained loading states.

## Error and Not Found

```javascript
// app/dashboard/error.js
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <p>Something went wrong.</p>
      <button onClick={reset}>Retry</button>
    </div>
  );
}
```

Error boundaries reset only their segment. Place them to isolate failures.

```javascript
// app/not-found.js
export default function NotFound() {
  return <h1>Not Found</h1>;
}
```

## Interview Questions and Answers

### 1. What is the difference between a layout and a template?

Layouts persist state across navigations; templates reset state each time.

### 2. Where do you define route-level loading UI?

In a `loading.js` file inside the route segment.
