# State and Lifecycle in React - Comprehensive Study Guide

## Introduction

State represents data that changes over time within a component. In class components, lifecycle methods manage setup and teardown. In function components, hooks like `useEffect` cover lifecycle behavior.

## State with Function Components

Use `useState` to create local state.

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### State Updates Are Async and Batched

Multiple state updates in an event handler are batched for performance. Use the functional form when the next state depends on the previous state.

```javascript
setCount(prev => prev + 1);
```

## Class Component Lifecycle (Overview)

Class components use lifecycle methods like:

- `componentDidMount` for setup
- `componentDidUpdate` for updates
- `componentWillUnmount` for cleanup

```javascript
class Timer extends React.Component {
  state = { seconds: 0 };

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(s => ({ seconds: s.seconds + 1 }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <div>{this.state.seconds}</div>;
  }
}
```

## Lifecycle in Function Components

`useEffect` replaces most lifecycle methods.

```javascript
import { useEffect, useState } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <div>{seconds}</div>;
}
```

## Interview Questions and Answers

### 1. What is state in React?

State is data owned by a component that can change over time and cause the component to re-render.

### 2. When should you use the functional updater in `setState`?

When the next state depends on the previous state, use the functional updater to avoid stale values.
