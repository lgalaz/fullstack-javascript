# Performance Pitfalls in React 

## Introduction

React is fast by default, but certain patterns can cause unnecessary re-renders or expensive work.

## Common Pitfalls

### 1. Unstable Props

Inline objects and functions create new references each render.

```javascript
// Bad: Causes re-render of Child every time
<Child style={{ color: 'red' }} onClick={() => doThing()} />
```

```javascript
// Good: Stable references
const style = useMemo(() => ({ color: 'red' }), []);
const handleClick = useCallback(() => doThing(), []);
return <Child style={style} onClick={handleClick} />;
```

Fix with `useMemo` and `useCallback` when it matters.

Note: the deps array in `useMemo`/`useCallback` controls when the memoized value/function is recreated. `[]` means it stays stable for the component's lifetime.

Best practice: only stabilize props for components that are memoized or demonstrably expensive; otherwise keep code simple.

### 2. Missing or Incorrect useEffect Dependencies

Leaving dependencies out can lead to stale values or missed updates.

```javascript
// Bad: Missing dependency
useEffect(() => {
  doSomething(count);
}, []);
```

```javascript
// Good: Include dependencies
useEffect(() => {
  doSomething(count);
}, [count]);
```

Best practice: include all values referenced in the effect, and use the linter to catch omissions.

### 3. Expensive Calculations on Every Render

Memoize heavy work with `useMemo`.

```javascript
// Bad: Heavy compute on every render
function Totals({ items }) {
  const total = items.reduce((sum, n) => sum + n, 0);
  return <div>Total: {total}</div>;
}
```

```javascript
// Good: Memoize heavy work
function Totals({ items }) {
  const total = useMemo(() => items.reduce((sum, n) => sum + n, 0), [items]);
  return <div>Total: {total}</div>;
}
```

Best practice: memoize only if the computation is expensive and renders are frequent; measure before and after.

### 4. Large Lists Without Virtualization

Render only visible items with libraries like `react-window`.

How it works: it calculates which rows are visible based on scroll position and only mounts those rows (plus a small overscan buffer). It doesn't stream data; it just avoids rendering off-screen items. It's closer to windowing than lazy loading, though you can combine it with lazy data fetching if needed.
Windowing: only render the items inside the current viewport (plus a small buffer) and reuse DOM nodes as you scroll.
Infinite scroll (deferred loading): fetch more items when the user scrolls near the end. It reduces network/initial load, but the DOM can still grow unless you combine it with virtualization.

```javascript
// Bad: Render thousands of rows at once
<ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>
```

```javascript
// Good: Virtualize large lists
<FixedSizeList height={400} itemCount={items.length} itemSize={32}>
  {({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  )}
</FixedSizeList>
```

How `FixedSizeList` works: it renders a fixed-height scroll container, calculates which item indexes are visible from the scroll offset, and only mounts those rows. Each rendered row gets a `style` prop with absolute positioning to place it correctly.

```javascript
import { FixedSizeList } from 'react-window';

function Row({ index, style, data }) {
  return <div style={style}>{data[index].name}</div>;
}

function BigList({ items }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={32}
      width="100%"
      itemData={items}
    >
      {Row}
    </FixedSizeList>
  );
}
```

Best practice: virtualize lists when item counts are large enough to cause slow renders or scrolling.

#### React-window: What it is and how to use it

`react-window` is a small library for list and grid virtualization (windowing). It renders only the visible rows and reuses DOM nodes as you scroll, keeping render cost and DOM size stable even with tens of thousands of items.

Install:

```bash
npm install react-window
```

Key ideas:

- You must provide a fixed `height` (viewport size).
- For `FixedSizeList`, every row has the same `itemSize` in pixels.
- For variable heights, use `VariableSizeList` and provide a `getItemSize(index)` function.
- The row renderer receives `style`; it must be applied to position rows correctly.
- `itemData` is how you pass data into rows without closing over it.

Complete example (fixed row height):

```javascript
import { FixedSizeList } from 'react-window';

const items = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}));

function Row({ index, style, data }) {
  const item = data[index];
  return (
    <div style={style}>
      #{item.id} - {item.name}
    </div>
  );
}

export default function VirtualizedList() {
  return (
    <FixedSizeList
      height={360}
      width="100%"
      itemCount={items.length}
      itemSize={36}
      itemData={items}
      overscanCount={4}
    >
      {Row}
    </FixedSizeList>
  );
}
```

Notes:

- `overscanCount` renders a few extra rows above and below the viewport to make scrolling smoother.
- If rows need internal state, be careful: rows are reused. Keep state in the data model, not in row components.

### 5. Overusing Memoization

`useMemo` and `useCallback` add overhead. Use them when there is measurable benefit.

```javascript
// Bad: Memoizing trivial values everywhere
const label = useMemo(() => 'Submit', []);
```

```javascript
// Good: Keep it simple when work is cheap
const label = 'Submit';
```

Best practice: avoid blanket memoization; add it only where profiling shows a bottleneck.

## Context updates

Context updates re-render all consumers. Split contexts by concern or memoize the provider value.

```javascript
// Bad: One big context object that changes often
<AppContext.Provider value={{ user, theme, locale }}>
  {children}
</AppContext.Provider>
```

```javascript
// Good: Split or memoize provider value
const value = useMemo(() => ({ user, setUser }), [user]);
<UserContext.Provider value={value}>{children}</UserContext.Provider>
```

```javascript
// Good: Split by concern
<UserContext.Provider value={userValue}>
  <ThemeContext.Provider value={themeValue}>
    {children}
  </ThemeContext.Provider>
</UserContext.Provider>
```

Best practice: keep context values stable and scoped; split large contexts by concern to reduce re-renders.

## React.memo

`React.memo` prevents re-renders when props are equal by shallow comparison.

```javascript
const Item = React.memo(function Item({ value }) {
  return <div>{value}</div>;
});
```

```javascript
// Bad: Memoizing everything without measuring
const AlwaysMemo = React.memo(function AlwaysMemo({ value }) {
  return <div>{value}</div>;
});
```

```javascript
// Good: Memoize components with stable props and heavy renders
const HeavyItem = React.memo(function HeavyItem({ value }) {
  return <ExpensiveChart data={value} />;
});
```

Best practice: use `React.memo` for components with stable props and expensive renders; avoid memoizing trivial components.

## Profiling

Use the React Profiler to identify actual hotspots before optimizing.

Note: `React.Profiler` is a built-in component provided by React. You do not implement it yourself.
You can also send `onRender` timings to an observability tool (e.g., OpenTelemetry) for production profiling.

```javascript
// Bad: Optimize based on guesses
const value = useMemo(() => computeSomething(), [data]);
```

```javascript
// Good: Measure first, then optimize (and optionally export metrics)
import React from 'react';
import { metrics, trace } from '@opentelemetry/api';

const meter = metrics.getMeter('react-profiler');
const renderDuration = meter.createHistogram('react.render.duration.ms');
const tracer = trace.getTracer('react-profiler');

function logProfiler(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
  interactions
) {
  const span = tracer.startSpan('react.render', {
    attributes: {
      id,
      phase,
      baseDuration,
    },
  });
  renderDuration.record(actualDuration, { id, phase });
  span.setAttribute('actualDuration', actualDuration);
  span.end();
}

<React.Profiler id="List" onRender={logProfiler}>
  <BigList items={items} />
</React.Profiler>
```

Best practice: measure first, then optimize; remove or reduce memoization if it doesn't show a real improvement.

## Using the Profiler (More Detail)

Wrap the part of the tree you want to measure and pass an `onRender` callback:

```javascript
import React, { Profiler } from 'react';

function onRender(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  });
}

function App() {
  return (
    <Profiler id="List" onRender={onRender}>
      <BigList items={items} />
    </Profiler>
  );
}
```

What the arguments mean:

- `id`: label for the Profiler instance.
- `phase`: `"mount"` or `"update"`, tells you whether this was the first render or a re-render.
- `actualDuration`: time spent rendering this update.
- `baseDuration`: estimated cost of rendering the subtree without memoization.
- `startTime`/`commitTime`: timestamps for when render started and committed.

How to use it:

- Wrap only the subtree you want to measure to keep logs focused.
- Compare `actualDuration` before and after an optimization.
- Look for components that re-render frequently with high `actualDuration`.

DevTools: React DevTools has a Profiler tab that visualizes these timings and shows which components rendered.

Caveats:

- Profiling adds overhead; avoid leaving it enabled in production.
- If you're using `React.Profiler`, remove those components (or guard them by environment) to disable callback logging.
- DevTools profiling is toggled in the React DevTools UI, independent of `React.Profiler`.
- Memoization can reduce `actualDuration` but may increase complexity; verify gains.

## Interview Questions and Answers

### 1. What causes unnecessary re-renders in React?

Changing prop references (new objects/functions), state updates, and context changes.

### 2. When should you use `React.memo`?

When a component renders often and its props are stable, and profiling shows a benefit.
