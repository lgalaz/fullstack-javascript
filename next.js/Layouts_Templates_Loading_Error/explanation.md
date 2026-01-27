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

Nested layouts compose, so parent layout UI persists while child layouts render at the `{children}` placeholder.

## Templates

Templates are like layouts but reset state on navigation.

Templates are useful when you need to re-run client component state on each navigation within a segment.

Example scenario: a multi-step wizard or search filter panel should reset when moving between sub-routes (e.g., `/dashboard/reports` to `/dashboard/settings`). Use a template so the form state doesn't leak across pages.

```javascript
// app/dashboard/template.js
export default function Template({ children }) {

  return <div>{children}</div>;
}
```

Example: a template can reset a form when navigating between sub-pages.

```javascript
// app/dashboard/template.js
'use client';
import { useState } from 'react';

export default function Template({ children }) {
  const [value, setValue] = useState('');

  return (
    <div>
      <input value={value} onChange={e => setValue(e.target.value)} />
      {children}
    </div>
  );
}
```

Bad practice: using a layout when you expect local state to reset between sub-routes.

```javascript
// app/dashboard/layout.js
'use client';
import { useState } from 'react';

export default function DashboardLayout({ children }) {
  const [value, setValue] = useState('');

  return (
    <div>
      <input value={value} onChange={e => setValue(e.target.value)} />
      {children}
    </div>
  );
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

Example:

```javascript
// app/dashboard/loading.js
export default function Loading() {

  return <p>Loading dashboard...</p>;
}
```

```javascript
// app/dashboard/page.js
export default async function DashboardPage() {
  const data = await fetch('https://api.example.com/dashboard').then(r => r.json());

  return <div>{data.title}</div>;
}
```

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

Notes:
- `error.js` must be a client component because it uses React error boundaries.
- Use `app/global-error.js` for a root-level error boundary that catches errors in the root layout.

## Interview Questions and Answers

### 1. What is the difference between a layout and a template?

Layouts persist state across navigations; templates reset state each time.

### 2. Where do you define route-level loading UI?

In a `loading.js` file inside the route segment.
