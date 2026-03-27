# Core React Hooks 

## Introduction

Hooks let function components manage state, side effects, and performance. The most commonly used are `useState`, `useEffect`, `useMemo`, and `useCallback`.

Other built-in hooks and when to use them:

- Quick list: `useReducer`, `useContext`, `useRef`, `useLayoutEffect`, `useImperativeHandle`, `useDebugValue`, `useTransition`, `useDeferredValue`, `useId`, `useSyncExternalStore`, `useInsertionEffect`
## `useReducer` for complex state logic or when the next state depends on the previous state in multiple ways.
- Signature: `const [state, dispatch] = useReducer(reducer, initialArg, init?)`
- `reducer(state, action) -> nextState` describes how state changes in response to actions.
- Returns a tuple:
  - `state`: the current state value.
  - `dispatch`: a stable function you call with an `action` to schedule a state update.
- `initialArg` is the initial state (or the value passed to `init`).
- Optional `init(initialArg) -> initialState` lets you lazily compute the initial state (runs once).
- `useReducer` does not add new capabilities vs. `useState`; it provides a clearer state-management pattern when complexity grows.
- Use it when:
  - Multiple related fields update together (forms, wizards, editors).
  - Many different actions can change the state (add/edit/remove/reset/toggle).
  - You want predictable, testable transitions (a pure reducer function, conceptually like `Array.prototype.reduce` but for state transitions instead of array accumulation).
  - The component behaves like a simple state machine (loading/success/error modes).
- Stick with `useState` for small, local, or simple state where transitions are few.
- It is fine to dispatch multiple actions, but if you often dispatch several in a row to represent one user event, it is a signal to group them into a single action that the reducer handles together.
- Example:

```javascript
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'inc':
      return { count: state.count + 1 };
    case 'dec':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <button onClick={() => dispatch({ type: 'dec' })}>-</button>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: 'inc' })}>+</button>
    </>
  );
}
```

Example: "function-like" actions via action creators + reducer helpers:

```javascript
function increment(state, amount) {

  return { ...state, count: state.count + amount };
}

function reset(state) {

  return { ...state, count: 0 };
}

function reducer(state, action) {
  switch (action.type) {
    case 'inc':
      return increment(state, action.amount ?? 1);
    case 'reset':
      return reset(state);
    default:
      return state;
  }
}

const actions = {
  inc: (amount) => ({ type: 'inc', amount }),
  reset: () => ({ type: 'reset' }),
};

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <button onClick={() => dispatch(actions.inc(5))}>+5</button>
      <span>{state.count}</span>
      <button onClick={() => dispatch(actions.reset())}>Reset</button>
    </>
  );
}
```

Note: the reducer must stay pure, so action creators can assemble data but should not do side effects.

Example: multiple dispatches vs. a single grouped action:

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'save_start':
      return { ...state, saving: true, error: null };
    case 'save_success':
      return { ...state, saving: false, lastSavedAt: action.payload };
    case 'save_failed':
      return { ...state, saving: false, error: action.error };
    case 'save_all':
      return {
        ...state,
        saving: false,
        error: null,
        lastSavedAt: action.payload,
      };
    default:
      return state;
  }
}

async function onSave() {
  dispatch({ type: 'save_start' });
  try {
    const time = await save();
    dispatch({ type: 'save_success', payload: time });
  } catch (error) {
    dispatch({ type: 'save_failed', error: error.message });
  }
}

// If you frequently do multiple dispatches for one user action,
// consider a grouped action that captures the final state update.
async function onSaveGrouped() {
  try {
    const time = await save();
    dispatch({ type: 'save_all', payload: time });
  } catch (error) {
    dispatch({ type: 'save_failed', error: error.message });
  }
}
```

Why no "functional state update" here: the reducer always receives the latest state as its first argument, and React applies actions in order. Batching does not break this; it just defers when the updates are processed. If your next state depends on previous state, keep that logic inside the reducer.

## `useContext` to read values from React context without prop drilling.
- `createContext` returns an object with `Provider` and `Consumer` components:
  - `Provider` sets the value for its subtree via a `value` prop.
  - `Consumer` is the legacy render-prop way to read the value (still supported for class components or when hooks are unavailable).
- Example (`useContext`):

```javascript
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function Button() {
  const theme = useContext(ThemeContext);

  return <button className={`btn-${theme}`}>OK</button>;
}
```

Example (`Provider`):

```javascript
import { createContext } from 'react';

const ThemeContext = createContext('light');

function App() {

  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```

Note: `Provider` makes `value` available to all descendant components via context, not via explicit props.

```javascript
function Button() {
  const theme = useContext(ThemeContext);

  return <button className={`btn-${theme}`}>OK</button>;
}
```

Example (`Consumer`):

```javascript
import { createContext } from 'react';

const ThemeContext = createContext('light');

function Button() {

  return (
    <ThemeContext.Consumer>
      {(theme) => <button className={`btn-${theme}`}>OK</button>}
    </ThemeContext.Consumer>
  );
}
```

## `useRef` to hold a mutable value that persists across renders (DOM nodes, timers, or instance-like data that should not trigger re-renders).
- Example:

```javascript
import { useRef } from 'react';

function SearchInput() {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </>
  );
}
```

## `useLayoutEffect` for measurements or DOM mutations that must happen before the browser paints (use sparingly, because it runs synchronously after DOM updates and before paint, which can block rendering and cause visible jank if it does heavy work).
- Use it for layout-critical work: measuring sizes/positions or synchronously applying style changes that affect layout (top/left, width/height, scroll position) to avoid visible flicker.
- Example:

```javascript
import { useLayoutEffect, useRef, useState } from 'react';

function Box() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    setWidth(ref.current.getBoundingClientRect().width);
  }, []);

  return <div ref={ref}>Width: {width}</div>;
}
```

## `useImperativeHandle` with `forwardRef` to expose an imperative API to parent components (it lets the child decide what methods/fields are exposed on its ref, instead of giving full access).
- Example:

```javascript
import { forwardRef, useImperativeHandle, useRef } from 'react';

const Input = forwardRef(function Input(props, ref) {
  const localRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus() {
      localRef.current?.focus();
    },
  }));

  return <input ref={localRef} />;
});
```

Usage:

```javascript
import { useRef } from 'react';

function Form() {
  const inputRef = useRef(null);

  return (
    <>
      <Input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus input</button>
    </>
  );
}
```

## `useDebugValue` to label custom hooks in React DevTools.
- It only affects how hooks appear in DevTools; it does not change runtime behavior or UI.
- Example:

```javascript
import { useDebugValue, useState } from 'react';

function useStatus() {
  const [status] = useState('idle');
  useDebugValue(status);

  return status;
}
```

In React DevTools, the hook will show a label like:

```
useStatus: idle
```

- More examples:

```javascript
import { useDebugValue, useMemo, useState } from 'react';

function useSearch(query) {
  const [status] = useState('idle');
  const results = useMemo(() => [], [query]);
  useDebugValue({ status, query, count: results.length });

  return { status, results };
}
```

```javascript
import { useDebugValue, useState } from 'react';

function useOnlineStatus() {
  const [online] = useState(true);
  useDebugValue(online ? 'online' : 'offline');

  return online;
}
```

## `useTransition` to mark updates as non-urgent (keep the UI responsive during expensive renders). `startTransition` wraps a callback; any state updates scheduled inside are treated as low priority.
- isPending is per useTransition hook instance. It becomes true if any transition started with that hook is still pending.
- You can call the same startTransition multiple times; isPending will reflect whether any of those are still in progress.
- If you need separate pending indicators, you can use multiple useTransition() calls.

- Example:

```javascript
import { useState, useTransition } from 'react';

function Search() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ sort: 'relevance', q: '' });
  const [isPending, startTransition] = useTransition();

  function onChange(e) {
    const next = e.target.value;
    setInput(next); // urgent update for the text field
    startTransition(() => {
      setQuery(next);
      setPage(1);
      setFilters((f) => ({ ...f, q: next }));
    });
  }

  return <input value={input} onChange={onChange} aria-busy={isPending} />;
}
```

How transitions work: they are not like `React.lazy`. `React.lazy` splits code and defers loading a component. `useTransition` marks a state update as low priority so React can keep urgent updates (like typing and clicks) responsive. React will render the urgent update first, then finish the transition update when time is available, which can mean showing the previous UI briefly while the new result renders. This scheduling is handled by React's scheduler, which yields to higher-priority work and resumes low-priority rendering in idle slices. Higher priority work usually means user input and direct feedback (typing, clicks, pointer moves, focus/blur, animations). Lower priority work usually means non-urgent updates like search results, filtering large lists, rendering expensive content, or preloading data for the next view. `isPending` lets you show a spinner or subtle loading state while the transition work completes.

## `useDeferredValue` to let a value lag behind so expensive rendering can be deferred.
- Example:

```javascript
import { useDeferredValue, useMemo, useState } from 'react';

function Filter() {
  const [text, setText] = useState('');
  // This value updates immediately as the user types.
  // The deferred value updates later, letting expensive UI lag behind.
  const deferredText = useDeferredValue(text);

  const results = useMemo(() => {
    // Simulate expensive filtering that we want to defer.

    return ['apple', 'apricot', 'banana', 'berry', 'grape'].filter((item) =>
      item.includes(deferredText.toLowerCase())
    );
  }, [deferredText]);

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      {/* This list lags behind the input if rendering is expensive. */}
      <ul>
        {results.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}
```

Note: the deferral is managed by React's scheduler, which prioritizes urgent input updates (discrete events like clicks and typing) over normal async work, and treats updates marked with `startTransition` or `useDeferredValue` as low priority so they catch up in idle time.

## `useId` to generate stable IDs for accessibility attributes.
- Example:

```javascript
import { useId } from 'react';

function Field() {
  const id = useId();

  return (
    <>
      {/* Example id: "r0-1" (shape varies, but is stable for this component) */}
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" />
    </>
  );
}
```

Note: `useId` generates stable, unique IDs per component instance to avoid collisions and prevent hydration mismatches in SSR. Hardcoded strings can collide across instances, and Symbols are not valid DOM `id` values.

## `useSyncExternalStore` to subscribe safely to external stores (e.g., Redux, custom store) with concurrent rendering support. It was created to prevent “tearing” in concurrent rendering, where the UI can read inconsistent snapshots if a store changes mid-render. Use it when state lives outside React (global stores, event emitters, browser APIs). It also helps share state across multiple React roots/trees (e.g., separate widgets on a page) without wiring context between them, since all trees can read from the same external store. Libraries like Zustand and Redux integrate with it under the hood so React can read a consistent snapshot and re-render if it changes during a render.
- Example (store in a separate file):

```javascript
// store.js
export const store = {
  value: 0,
  listeners: new Set(),
  getSnapshot() {
    return this.value;
  },
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  increment() {
    this.value += 1;
    for (const listener of this.listeners) listener();
  },
};
```

```javascript
import { useSyncExternalStore } from 'react';
import { store } from './store';

function Counter() {
  // useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?).
  const value = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store)
  );

  return (
    <button onClick={() => store.increment()}>
      Count: {value}
    </button>
  );
}

function AnotherWidget() {
  const value = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store)
  );

  return <p>Shared value: {value}</p>;
}
```

Note: if you are not using a global state library, you create the external store yourself (as above). Any React tree that imports this store can subscribe to it, even if it is rendered in a separate root.

## `useInsertionEffect` for CSS-in-JS libraries to inject styles before layout (library-level, rarely used in app code). It's mainly for library authors who need to inject styles before layout to avoid flicker; most apps should use `useEffect`/`useLayoutEffect` or just static CSS. "Library-level" means it's primarily intended for CSS-in-JS tooling and third-party styling libraries.
- Example:

```javascript
import { useInsertionEffect } from 'react';

function useInjectedStyles(cssText) {
  useInsertionEffect(() => {
    const style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, [cssText]);
}
```

Usage:

```javascript
function Badge({ tone }) {
  const css = `
    .badge {
      padding: 2px 6px;
      border-radius: 4px;
      background: ${tone === 'success' ? 'green' : 'gray'};
      color: white;
    }
  `;

  useInjectedStyles(css);

  return <span className="badge">New</span>;
}
```

Better vs. bad usage:

```javascript
// themeStyles.js
import { useInsertionEffect } from 'react';

const inserted = new Set();
const styleTag = document.createElement('style');
document.head.appendChild(styleTag);

// Better: a library hook that dedupes rules and controls insertion order.
export function useInjectedStyles(cssText, key) {
  useInsertionEffect(() => {
    if (inserted.has(key)) return;
    inserted.add(key);
    styleTag.appendChild(document.createTextNode(cssText));
  }, [cssText, key]);
}
```

```javascript
// Badge.js
import { useInsertionEffect } from 'react';
import { useInjectedStyles } from './themeStyles';

export function Badge({ tone }) {
  const css = `.badge--${tone} { background: ${tone}; }`;
  useInjectedStyles(css, `badge:${tone}`);

  return <span className={`badge--${tone}`}>New</span>;
}

// Bad: app code calling useInsertionEffect directly to add ad-hoc styles.
export function BadBadge({ tone }) {
  useInsertionEffect(() => {
    const style = document.createElement('style');
    style.textContent = `.badge { background: ${tone}; }`;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, [tone]);

  return <span className="badge">New</span>;
}
```

Note: if you find yourself injecting CSS from components, it's usually better to use static CSS, CSS modules, or a standard CSS-in-JS solution rather than ad-hoc DOM style injection.

## Rules of Hooks

- Only call hooks at the top level.
- Only call hooks from React function components or custom hooks.

Why these rules matter:

- Only call hooks at the top level so React can rely on a stable hook call order across renders. If you call a hook inside a condition or loop, the order can change and React may attach state to the wrong hook, leading to bugs or errors like "Rendered fewer hooks than expected."
- Only call hooks from React function components or custom hooks because hooks need React's internal render context. Calling them in regular functions or event handlers will throw "Invalid hook call" since there is no component render to associate the hook state with.

Example bug from a conditional hook:

```javascript
import { useState } from 'react';

function Profile({ showDetails }) {
  const [name, setName] = useState('Ada');

  if (showDetails) {
    const [age, setAge] = useState(36);
    return (
      <>
        <p>{name}</p>
        <p>{age}</p>
      </>
    );
  }

  return <p>{name}</p>;
}
```

If `showDetails` toggles between renders, React sees a different number/order of hooks and throws an error like "Rendered fewer hooks than expected."

## useState

`useState` adds local state to a function component. It accepts an initial value (or initializer function) and returns `[state, setState]`.

```javascript
import { useState } from 'react';

function Toggle() {
  const [on, setOn] = useState(false);

  return <button onClick={() => setOn(v => !v)}>{String(on)}</button>;
}
```

Initializer function example (runs once):

```javascript
import { useState } from 'react';

function Draft() {
  const [text, setText] = useState(() => {
    const saved = localStorage.getItem('draft');

    return saved ?? '';
  });

  return <textarea value={text} onChange={(e) => setText(e.target.value)} />;
}
```

Example bug: derived state goes stale

```javascript
function Profile({ user }) {
  // Bad: `fullName` is derived from props but stored in state once.
  const [fullName] = useState(`${user.first} ${user.last}`);

  return <p>{fullName}</p>;
}
```

If `user` changes, `fullName` does not update, so the UI shows stale data.

Important: Although a function component re-executes on every render, useState values persist across renders and are not recomputed automatically—so storing data that can be derived from props/state leads to stale “source-of-truth” bugs.

## useEffect

Use for side effects like data fetching, subscriptions, and timers.

useEffect declares side effects tied to state.

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

Dependency arrays control when the effect runs. Missing dependencies can cause stale values, meaning the effect keeps using variables from an older render instead of the latest state/props. Cleanup enforces correctness across updates.

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

Effects run after paint. Effects must be restart-safe. In React Strict Mode (dev), effects may run twice to surface side-effect issues. Strict Mode double-invokes effects to prove they are restart-safe.

## useSyncExternalStore

`useSyncExternalStore` is the official React hook for reading from and subscribing to external stores (Redux, Zustand, custom event emitters) in a way that is safe with concurrent rendering and hydration.

### Why it exists

Before concurrent rendering, subscribing in `useEffect` and reading store state directly could work most of the time. But with concurrent rendering, React may render in the background and switch between versions of the UI. If the store changes during that render, components can "tear" (render with mixed snapshots), leading to inconsistent UI or subtle bugs. `useSyncExternalStore` coordinates snapshot reads with React's render lifecycle so the snapshot is consistent and React can re-render if it changes mid-render.

### How it works

The signature is:

```javascript
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```

- `subscribe(listener)` should register the listener and return an unsubscribe function.
- `getSnapshot()` must return the current store value (synchronously). React calls it during render, so it must be fast and deterministic.
- `getServerSnapshot()` is optional, but required for SSR to avoid hydration mismatches. It returns the snapshot the server used to render.

React compares snapshots by reference (or `Object.is`). If `getSnapshot()` returns a new object each call, React will re-render every time even if data didn't change. Store snapshots should be immutable and stable.

### Example: minimal external store

```javascript
import { useSyncExternalStore } from 'react';

function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    getSnapshot() {
      return state;
    },
    setState(next) {
      state = typeof next === 'function' ? next(state) : next;
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const store = createStore({ count: 0 });

function Counter() {
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );

  return (
    <button onClick={() => store.setState((s) => ({ count: s.count + 1 }))}>
      Count: {state.count}
    </button>
  );
}
```

### Example: browser API with SSR fallback

```javascript
import { useSyncExternalStore } from 'react';

function useWindowWidth() {

  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('resize', onStoreChange);

      return () => window.removeEventListener('resize', onStoreChange);
    },
    () => window.innerWidth,
    () => 0
  );
}

function WindowWidth() {
  const width = useWindowWidth();

  return <p>Window width: {width}</p>;
}
```

This avoids hydration warnings by returning a stable server snapshot (`0`) until the client hydrates.

### When to use (and when not to)

- Use it for external stores that are not React state (global state libraries, subscriptions, caches, browser APIs).
- Do not use it as a replacement for React state or Context. Context is for passing React-managed state and dependencies through the tree; `useSyncExternalStore` is for reading external sources with subscription semantics.
- If the data is derived from props or state, compute it directly or memoize it; don't wrap it in an external store just to read it with this hook.
- It is fine to share state across distant trees via a store if the source is truly external (e.g., Redux/Zustand), but avoid introducing a custom store just to bypass Context/props.

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

Note: `setItems((prev) => [...prev, 4])` uses the functional update form, so it always appends to the latest array. In this example, each click adds another `4`, so yes, it would produce `[1, 2, 3, 4, 4, 4, ...]`. If you want to add a dynamic value instead, replace `4` with the value you intend to append.

`useMemo` is a performance hint, not a guarantee (it suggests React can reuse a cached value, but React is free to recompute if it wants). React may discard memoized values under memory pressure (when it needs to free memory, it can drop cached values and recompute later).

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

`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`. Use it to keep function identity stable when passing to memoized children.

useCallback can cascade into dependency hell, where stabilizing one function forces you to add more dependencies, which then change and require more memoization, creating a chain of `useCallback`/`useMemo` calls that adds complexity and is hard to maintain. Mitigations include using functional state updates, using `useReducer` so callbacks depend on stable `dispatch`, avoiding memoization unless there's a measured benefit, or adopting `useEvent` when it becomes stable.

## useEvent (experimental)

useEvent gives you stable handlers with fresh logic, solving the closure problem cleanly. useEvent is the future solution, not stable yet.
Note: As of Dec 2025 status is experimental/proposed (available in React Canary, not in stable releases), so the API may change.
It returns a stable function reference, but that function always sees the latest props/state without needing dependency arrays.
Use it when you need a stable callback (for event handlers, subscriptions) and want to avoid stale closures.

Example:

```javascript
import { useEvent, useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = useEvent(() => {
    setCount(count + 1);
  });

  return <button onClick={handleClick}>Clicked {count}</button>;
}
```

Note: `useEvent` sees the latest `count`, so the functional updater form (`setCount(c => c + 1)`) is not required to avoid stale closures.
Compared to `useCallback`, `useEvent` returns a stable function reference that always reads the latest props/state, without a dependency array.
- useCallback closes over the values from the render when the callback was created (controlled by the deps array).
- useEvent returns a stable function that reads the latest callback logic from an internal ref, so it doesn’t get stuck with old values. Conceptually it closes over athe internal ref that React updates every render with the latest callback.

## Choosing the right hook

- `useState` for UI state.
- `useEffect` for side effects and subscriptions.
- `useMemo` for expensive derived data.
- `useCallback` for stable function props.

## Interview Questions and Answers

### 1. What does `useEffect` replace from class components?

It replaces `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.

### 2. When should you use `useMemo` or `useCallback`?

Use them when you need stable references or when you have expensive calculations that benefit from memoization, and you can measure a performance gain (for example, using the React DevTools Profiler, `react-scan`, or browser performance traces). Avoid blanket memoization (adding `useMemo`/`useCallback` everywhere); it adds complexity, increases dependency management, and can be wasted work if renders are cheap. Start by memoizing where you see re-render hotspots, especially with memoized children or expensive computations.
