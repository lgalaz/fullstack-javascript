# Suspense and Concurrent Rendering 

## Introduction

Suspense lets you show fallback UI while a component or data is loading. Concurrent features let React pause, interrupt, and resume rendering work so urgent updates (like typing) stay responsive during expensive updates.

## React Scheduler (Overview)

The scheduler is React's internal priority system for rendering work. Urgent updates (like input) are handled first, while low-priority updates (like transitions or deferred values) can be paused and resumed so the UI stays responsive. It does not run on multiple threads; it yields back to the browser between chunks of work.

React decides when to pause by checking time spent, browser signals and  whether higher-priority updates are pending. It resumes low-priority work when the main thread is free and no urgent updates are waiting.

Browser signals here means hints from the browser event loop, like pending user input, rendering work, or other tasks queued on the main thread.

## What Is a Fiber?

A Fiber is React's internal data structure that represents a single unit of work in the UI tree. It is the runtime representation of a component or a DOM node, not JSX and not a virtual DOM element.

Each Fiber corresponds to exactly one of these:
- A function component
- A class component
- A host component (DOM node like `div`)
- A fragment
- A Suspense boundary
- A text node

Example:

```jsx
<App>
  <Header />
  <Main>
    <Button />
  </Main>
</App>
```

Internally this becomes a Fiber tree:

```
Fiber(App)
 ├─ Fiber(Header)
 └─ Fiber(Main)
     └─ Fiber(Button)
```

Conceptually, a Fiber stores:
- Component type (function, host, etc.)
- Props and state
- Hooks (linked list)
- Child, sibling, and parent pointers
- Effect flags for the commit phase
- A reference to the actual DOM node (for host fibers)

Why Fiber exists:
- Pre-React 16 rendering was synchronous and recursive.
- Large trees could block the main thread.
- There was no prioritization or interruption.

Fiber enables React to pause, resume, and prioritize rendering work, which is the basis for concurrent features.

## React.lazy with Suspense

`React.lazy` lets you split code and load a component only when it is needed. `Suspense` wraps the lazy component and shows a fallback while the module is loading.

"Only when it is needed" means the code for that component is not part of the initial bundle; it is fetched the first time React tries to render it.
`React.lazy` is what makes that happen by wrapping a dynamic `import()` into a component that loads on first render.

Suspense can wrap any component that suspends (like a `lazy()` component). The fallback shows while React is waiting for the suspended work to resolve. For `React.lazy`, the fallback remains until the dynamic `import()` finishes and the module loads.

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

`./Settings` is just a separate component module; in real apps it might take time to load because it is code-split or does extra work.

## startTransition

Use transitions to mark updates as low-priority so React can keep urgent updates (like typing) responsive. React's scheduler may pause, interrupt, or resume the transition work.

```javascript
import { startTransition, useState } from 'react';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  function handleChange(e) {
    const value = e.target.value;
    // Urgent update: keep the input snappy.
    setQuery(value);
    // Non-urgent update: can be interrupted if the user keeps typing.
    startTransition(() => {
      setResults(expensiveFilter(value));
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
    </div>
  );
}
```

You can also use `useTransition` to track pending state.

```javascript
import { useState, useTransition } from 'react';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    startTransition(() => {
      setResults(expensiveFilter(value));
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending ? <p>Updating results...</p> : null}
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
    </div>
  );
}
```

## useDeferredValue

Defer non-urgent derived values by letting them update at lower priority. The input updates immediately, and the deferred value catches up when the scheduler has time.

```javascript
import { useDeferredValue, useState } from 'react';

function Search() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const results = expensiveFilter(deferredQuery);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <p>Showing results for: {deferredQuery}</p>
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Notes

Concurrent rendering means React can interrupt renders and resume later. It does not mean multi-threaded rendering in JavaScript.

## Interview Questions and Answers

### 1. What problem does Suspense solve?

It provides a consistent way to show fallback UI while components or data are loading.

### 2. What is `startTransition` used for?

To mark updates as non-urgent so React can keep the UI responsive.
