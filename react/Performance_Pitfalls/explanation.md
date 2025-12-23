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

Note: the deps array controls when the memoized value/function is recreated. `[]` means it stays stable for the component's lifetime.

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

Best practice: virtualize lists when item counts are large enough to cause slow renders or scrolling.

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

```javascript
// Bad: Optimize based on guesses
const value = useMemo(() => computeSomething(), [data]);
```

```javascript
// Good: Measure first, then optimize
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
- Memoization can reduce `actualDuration` but may increase complexity; verify gains.

## Interview Questions and Answers

### 1. What causes unnecessary re-renders in React?

Changing prop references (new objects/functions), state updates, and context changes.

### 2. When should you use `React.memo`?

When a component renders often and its props are stable, and profiling shows a benefit.
