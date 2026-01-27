# Controlled vs Uncontrolled Inputs 

## Introduction

Forms in React can be controlled (state drives the input) or uncontrolled (DOM holds the value). Both are valid, with different tradeoffs.

## Controlled Inputs

The input value is stored in React state and updated on every change.

```javascript
import { useState } from 'react';

function NameForm() {
  const [name, setName] = useState('');

  return (
    <input
      value={name}
      onChange={e => setName(e.target.value)}
      placeholder="Name"
    />
  );
}
```

Pros: single source of truth, easy validation, instant UI updates.
Cons: more re-renders, more boilerplate, can be slower for very large forms.

## Uncontrolled Inputs

The DOM manages the value. Use refs to read it when needed.

```javascript
import { useRef } from 'react';

function NameForm() {
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(inputRef.current.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="" />
      <button type="submit">Save</button>
    </form>
  );
}
```

Pros: fewer re-renders, simpler for large forms with rare reads.
Cons: harder to validate as you type, less predictable UI state, manual syncing when needed.

Note: In React, you aren’t writing raw HTML attributes; you’re setting properties on DOM nodes via JSX. `defaultValue` sets the initial DOM value for uncontrolled inputs without making them controlled.
Note: To pass refs through function components, use `forwardRef`, and expose custom instance methods with `useImperativeHandle` when needed.
Note: This pattern is best for small imperative actions (focus/scroll or integration with non-React libs.), but prefer props/state and composition for most UI logic.

```javascript
const FancyInput = React.forwardRef(function FancyInput(props, ref) {
  const inputRef = React.useRef(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      if (inputRef.current) inputRef.current.value = '';
    },
  }));

  return <input ref={inputRef} {...props} />;
});

function App() {
  const fancyRef = React.useRef(null);

  return (
    <>
      <FancyInput ref={fancyRef} />
      <button onClick={() => fancyRef.current.focus()}>Focus</button>
    </>
  );
}
```

## Avoid switching modes

React warns if an input switches between controlled and uncontrolled. Keep `value` defined (even empty string) for controlled inputs, and use `defaultValue` for uncontrolled.

```javascript
function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value ?? ''}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

function UncontrolledInput() {
  const inputRef = useRef(null);

  return <input ref={inputRef} defaultValue="" />;
}
```

Good practice: for controlled inputs, always pass a string (use `value ?? ''`) so `value` never flips between `undefined` and a string, which triggers React's warning.

## Hybrid patterns

You can keep inputs uncontrolled for typing performance, then sync on submit or blur.

```javascript
function Search() {
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');

  function onSubmit(e) {
    e.preventDefault();
    setQuery(inputRef.current.value);
  }

  return (
    <form onSubmit={onSubmit}>
      <input ref={inputRef} defaultValue={query} />
    </form>
  );
}
```

## When to Use Each

- Controlled: validation, dynamic UI, dependent fields.
- Uncontrolled: quick forms, legacy integrations, performance-sensitive forms.

## Interview Questions and Answers

### 1. What is a controlled input?

An input whose value is driven by React state and updated via `onChange` (similar to two-way binding or reactivity in other frameworks).

### 2. When would you choose uncontrolled inputs?

When you need less state handling or only read values on submit.
