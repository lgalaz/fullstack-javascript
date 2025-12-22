# Performance Pitfalls in React - Comprehensive Study Guide

## Introduction

React is fast by default, but certain patterns can cause unnecessary re-renders or expensive work.

## Common Pitfalls

### 1. Unstable Props

Inline objects and functions create new references each render.

```javascript
// Causes re-render of Child every time
<Child style={{ color: 'red' }} onClick={() => doThing()} />
```

Fix with `useMemo` and `useCallback` when it matters.

### 2. Missing or Incorrect useEffect Dependencies

Leaving dependencies out can lead to stale values or missed updates.

```javascript
useEffect(() => {
  doSomething(count);
}, [count]);
```

### 3. Expensive Calculations on Every Render

Memoize heavy work with `useMemo`.

### 4. Large Lists Without Virtualization

Render only visible items with libraries like `react-window`.

### 5. Overusing Memoization

`useMemo` and `useCallback` add overhead. Use them when there is measurable benefit.

## Context updates

Context updates re-render all consumers. Split contexts by concern or memoize the provider value.

## React.memo

`React.memo` prevents re-renders when props are equal by shallow comparison.

```javascript
const Item = React.memo(function Item({ value }) {
  return <div>{value}</div>;
});
```

## Profiling

Use the React Profiler to identify actual hotspots before optimizing.

## Interview Questions and Answers

### 1. What causes unnecessary re-renders in React?

Changing prop references (new objects/functions), state updates, and context changes.

### 2. When should you use `React.memo`?

When a component renders often and its props are stable, and profiling shows a benefit.
