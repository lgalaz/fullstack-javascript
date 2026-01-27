# State and Lifecycle in React 

## Introduction

State represents data that changes over time within a component. In class components, lifecycle methods manage setup and teardown. In function components, hooks like `useEffect` cover lifecycle behavior.

State is a snapshot tied to a render. Updating state schedules a re-render; it does not mutate state in place. When you change state, React creates a new snapshot for the next render.

## Why You Must Use React State Setters

Updating state outside React's setters is like bypassing a setter in OOP - you may change the raw value, but you skip all the logic that makes the system work.

React state must be written through React, or it stops being React state. Mutating an object key directly (for example `state.obj.x = 2`) changes the data without changing the reference, so React does not detect an update. It may seem to work if a render later happens for another reason (for example a parent re-render, a context update, or a different state change) and React reads the mutated value, but the change was never tracked. Because React detects updates by reference, state must be treated as immutable and replaced with a new object to avoid non-deterministic bugs, dev/prod differences, and race conditions.

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

## State in Class Components

Use `this.state` for the initial state and `this.setState` to update it.

```javascript
class Counter extends React.Component {
  state = { count: 0 };

  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

### State Updates Are Async and Batched

Multiple state updates in an event handler are batched for performance. Use the functional form when the next state depends on the previous state.

The functional form is the robust pattern when:

- multiple updates happen before a render
- updates happen async (effects, timeouts, promises)
- several updates rely on each other

The simple `setCount(count + 1)` example works when each update gets its own render, but if there is no render between updates, the functional form ensures you get the latest queued state.

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      {count}
    </button>
  );
}
```

Here is a more complex example where the next state depends on multiple fields from the previous state.

```javascript
function Cart() {
  const [cart, setCart] = useState({ items: 0, total: 0 });

  const addItem = price => {
    setCart(prev => ({
      items: prev.items + 1,
      total: prev.total + price,
    }));
  };

  return (
    <button onClick={() => addItem(9.99)}>
      Items: {cart.items} (${cart.total.toFixed(2)})
    </button>
  );
}
```

React batches state updates within the same event and may batch across async boundaries in React 18+ (e.g., updates inside timeouts, promises, or async handlers can be grouped into a single render).

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

Function components have no lifecycle events. Lifecycle is implicit = React owns timing. Effects are explicit = you declare relationships, React schedules.

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

`useEffect` runs after paint.
For DOM measurement (reading layout) or synchronous layout updates (changes that must happen before paint), use `useLayoutEffect`. This is for DOM-measure-before-paint cases.

Reading layout means accessing computed geometry like `getBoundingClientRect`, `offsetWidth`, `offsetHeight`, `clientHeight`, or `scrollTop`, not style values like colors or fonts. Synchronous layout updates are changes you want applied before the user sees the frame, like setting a tooltip position based on measured size or preventing a visible layout jump.

Rule of thumb: use `useEffect` for most DOM work, data fetching, subscriptions, and non-layout updates. Use `useLayoutEffect` only when you must read layout or apply a layout-critical change before paint to avoid flicker or incorrect measurements.

```javascript
import { useLayoutEffect, useRef, useState } from 'react';

function Measure() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    setWidth(ref.current.getBoundingClientRect().width);
  }, []);

  return <div ref={ref}>Width: {width}</div>;
}

function App() {

  return (
    <main style={{ padding: 16 }}>
      <h1>Measure Example</h1>
      <Measure />
    </main>
  );
}

export default App;
```

## Avoiding stale closures

Effects capture values from the render in which they were created. If you read `count` directly inside an effect with an empty dependency list, it will stay stuck on the initial value. Use dependencies to re-run the effect with fresh values, or use a ref to read the latest value without re-running the effect.

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return <div>{count}</div>;
}
```

Note: this effect uses an empty dependency array, but it does not suffer from stale `count` because it uses the functional `setCount`, which always receives the latest state.

Example with a missing dependency (stale `count`):

```javascript
function CounterWithStaleEffect() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []); // Missing `count` dependency: interval always uses the initial value.

  return <div>{count}</div>;
}
```

Here is a complete example using dependencies so the effect sees the latest `count`.

```javascript
import { useEffect, useState } from 'react';

function CounterWithDeps() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}

function App() {

  return (
    <main style={{ padding: 16 }}>
      <h1>Deps Example</h1>
      <CounterWithDeps />
    </main>
  );
}

export default App;
```

Here is a complete example using a ref to read the latest value inside a long-lived effect.

```javascript
import { useEffect, useRef, useState } from 'react';

function CounterWithRef() {
  const [count, setCount] = useState(0);
  const latestCount = useRef(count);

  useEffect(() => {
    latestCount.current = count;
  }, [count]);

  useEffect(() => {
    const id = setInterval(() => {
      console.log('Latest count:', latestCount.current);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}

function App() {

  return (
    <main style={{ padding: 16 }}>
      <h1>Ref Example</h1>
      <CounterWithRef />
    </main>
  );
}

export default App;
```

Note: this ref is not attached to the DOM. It is a mutable container (`latestCount.current`) used to store a value across renders. In React, refs can be attached to DOM elements, class component instances, or used as plain mutable values. The first effect keeps the ref in sync with `count`, while the second sets up a long-lived interval once so it does not re-register on every update.