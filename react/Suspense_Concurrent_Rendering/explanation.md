# Suspense and Concurrent Rendering 

## Introduction

Suspense lets you show fallback UI while a component or data is loading. Concurrent features let React pause, interrupt, and resume rendering work so urgent updates (like typing) stay responsive during expensive updates.

## React.StrictMode

`<React.StrictMode>` is a development-only wrapper that enables extra checks and warnings. It intentionally double-invokes certain lifecycle methods and renders in development to surface side effects and unsafe patterns. It does not affect production behavior or performance.

Note: many frameworks and templates enable Strict Mode by default in development (for example, Next.js and Create React App), so you may already be running under it even if you did not add the wrapper yourself. You can usually configure this in the framework's settings.

## React Scheduler (Overview)

The scheduler is React's internal priority system for rendering work. Urgent updates (like input) are handled first, while low-priority updates (like transitions or deferred values) can be paused and resumed so the UI stays responsive. It does not run on multiple threads; it yields back to the browser between chunks of work.

React decides when to pause by checking time spent, browser signals, and whether higher-priority updates are pending. It resumes low-priority work when the main thread is free and no urgent updates are waiting. "Browser signals" here means frame deadlines and input/paint timing that tell React whether it should yield to keep the page responsive, or:  "hints from the browser event loop, like pending user input, rendering work, or other tasks queued on the main thread."

React is a deterministic UI state machine with a non-deterministic scheduler.

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
<>
  <App>
    <Header />
    <Main>
      <Button />
      {'Save'}
    </Main>
  </App>
  <Footer />
</>
```

Fiber mapping in that example:
- Function components: `App`, `Header`, `Main`, `Button`, `Footer`
- Fragment: the outer `<>...</>`
- Text node: `'Save'`

Internally this becomes a Fiber tree:

```
Fiber(Fragment)
 ├─ Fiber(App)
 │   ├─ Fiber(Header)
 │   └─ Fiber(Main)
 │       ├─ Fiber(Button)
 │       └─ Fiber(Text: "Save")
 └─ Fiber(Footer)
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

Suspense replays render. Suspense prevents effects from running until UI is actually committed.

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

Note: transitions are not debounce or throttle. They only lower priority; the update still runs for each keystroke, just at a lower priority.

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
      <input
        value={query}
        onChange={e => setQuery(e.target.value)} // Urgent: input updates immediately.
      />
      <p>Showing results for: {deferredQuery}</p> {/* Deferred: lags behind typing. */}
      <ul>
        {/* Heavy work based on deferred value so typing stays responsive. */}
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

This model enables concurrency and correctness. All of this exists to support concurrent rendering. Strict Mode simulates concurrency. Ergonomics = ease-of-use React deliberately sacrifices for correctness.

If your code assumes when things run, it will eventually break. If your code only cares about what should be true, it will survive concurrency, SSR, and future React versions.

## Interview Questions and Answers

### 1. What problem does Suspense solve?

It provides a consistent way to show fallback UI while components or data are loading.

### 2. What is `startTransition` used for?

To mark updates as non-urgent so React can keep the UI responsive.
