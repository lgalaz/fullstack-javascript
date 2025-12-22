# Conditional Rendering in React - Comprehensive Study Guide

## Introduction

Conditional rendering lets you show different UI based on state, props, or other conditions.

## If Statements

```javascript
function Status({ online }) {
  if (online) {
    return <span>Online</span>;
  }
  return <span>Offline</span>;
}
```

## Ternary Operator

```javascript
function Status({ online }) {
  return <span>{online ? 'Online' : 'Offline'}</span>;
}
```

## Short-Circuit with &&

```javascript
function Banner({ message }) {
  return <div>{message && <p>{message}</p>}</div>;
}
```

Be careful: `0 && <Component />` renders `0`. Use boolean checks when needed.

## Switch Pattern

```javascript
function Alert({ type }) {
  switch (type) {
    case 'success':
      return <div>Saved</div>;
    case 'error':
      return <div>Failed</div>;
    default:
      return null;
  }
}
```

## Interview Questions and Answers

### 1. What is the safest way to conditionally render a component?

Use `if`/`return` for clarity, or a ternary operator for simple cases.

### 2. What is a common pitfall with `&&`?

Falsy values like `0` will render in the output. Use explicit boolean checks when needed.
