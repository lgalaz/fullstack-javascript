# Refs and DOM Interaction - Comprehensive Study Guide

## Introduction

Refs provide a way to access DOM nodes or persist mutable values across renders without causing re-renders.

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
const renderCount = useRef(0);
renderCount.current += 1;
```

## Forwarding Refs

Use `forwardRef` to pass refs to child components.

```javascript
const TextInput = React.forwardRef(function TextInput(props, ref) {
  return <input ref={ref} {...props} />;
});
```

## Interview Questions and Answers

### 1. When should you use refs?

When you need direct DOM access or a mutable value that should not re-render the component.

### 2. Why should refs be used sparingly?

Overusing refs can bypass React's data flow and make components harder to reason about.
