# Refs and DOM Interaction 

## Introduction

Refs provide a way to access DOM nodes or persist mutable values across renders without causing re-renders. Unlike state, updating a ref does not trigger a render (e.g., focusing an input or reading its value via a ref does not re-render the component).

## Accessing DOM Nodes

```javascript
import { useRef } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>
        Focus
      </button>
    </div>
  );
}
```

## Mutable Values

Refs can store values that do not trigger a re-render.

```javascript
function Counter() {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return <p>Renders: {renderCount.current}</p>;
}
```

## Forwarding Refs

Use `forwardRef` to pass refs to child components.

```javascript
const TextInput = React.forwardRef(function TextInput(props, ref) {
  return <input ref={ref} {...props} />;
});

function Form() {
  const inputRef = React.useRef(null);
  return (
    <>
      <TextInput ref={inputRef} placeholder="Name" />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </>
  );
}
```

## useImperativeHandle

Expose a controlled imperative API from a child component. This means the child decides which methods/fields the parent can call via the ref (e.g., `focus`, `reset`), instead of exposing the raw DOM node.

```javascript
const FancyInput = React.forwardRef(function FancyInput(_props, ref) {
  const inputRef = React.useRef(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  return <input ref={inputRef} />;
});

function App() {
  const fancyRef = React.useRef(null);
  return (
    <>
      <FancyInput ref={fancyRef} />
      <button onClick={() => fancyRef.current?.focus()}>Focus</button>
    </>
  );
}
```

## Interview Questions and Answers

### 1. When should you use refs?

When you need direct DOM access or a mutable value that should not re-render the component.

### 2. Why should refs be used sparingly?

Overusing refs can bypass React's data flow and make components harder to reason about.
