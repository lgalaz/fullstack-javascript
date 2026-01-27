# Conditional Rendering in React 

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

Be careful: `0 && <Component />` renders `0`. Use boolean checks when needed (e.g., `!!message && <p>{message}</p>` or `message ? <p>{message}</p> : null`).

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

## Mapping status to components

For complex UIs, map statuses to components instead of large switch blocks.

```javascript
const views = {
  loading: <Spinner />,
  error: <ErrorBanner />,
  ready: <Dashboard />,
};

function Screen({ state }) {

  return views[state] ?? null;
}
```

`Screen` looks up the component for the current `state` key. If the key doesn't exist, it renders `null`.

```javascript
<Screen state="loading" />
<Screen state="ready" />
```

Rendering `null` removes the element from the tree without errors.

```javascript
function MaybeMessage({ show }) {
  if (!show) return null;

  return <p>Hello</p>;
}
```

Equivalent `&&` version:

```javascript
function MaybeMessage2({ show }) {

  return show && <p>Hello</p>;
}
```

## Interview Questions and Answers

### 1. What is the safest way to conditionally render a component?

Use `if`/`return` for clarity, or a ternary operator for simple cases.

### 2. What is a common pitfall with `&&`?

Falsy values like `0` will render in the output. Use explicit boolean checks when needed.

```javascript
// Pitfall: items.length is 0, so the expression evaluates to 0 and React renders it
{items.length && <ItemList items={items} />}

// Safer: explicit boolean check, renders nothing when length is 0
{items.length > 0 && <ItemList items={items} />}
```
