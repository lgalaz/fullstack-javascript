# Error Boundaries in React 

## Introduction

Error boundaries catch JavaScript errors in rendering, lifecycle methods, and constructors of their child components. They prevent a whole app crash.

Lifecycle methods are class component methods that run at key points like mount, update, and unmount (for example, `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`). The function component equivalent is using `useEffect` (and `useLayoutEffect`) to run logic on mount/update and to perform cleanup on unmount. Note: error boundaries only exist as class components today, so their own lifecycle methods are class-based.

## Creating an Error Boundary

Error boundaries must be class components. The class name is not special; `ErrorBoundary` is just a common convention and could be `MyErrorBoundary` or `MyError`. It is a pattern to isolate parts of the UI so a failure does not crash the entire app.
An error boundary is a class component that implements `static getDerivedStateFromError` and/or `componentDidCatch`. `getDerivedStateFromError` lets you render a fallback UI, and `componentDidCatch` lets you log/report the error.

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // You can inspect the error if you want
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

Usage:

```javascript
<ErrorBoundary>
  <Profile />
</ErrorBoundary>
```

## Limitations

Error boundaries do not catch:

- Errors inside event handlers
- Errors in async code
- Errors in the error boundary itself

## Resetting a boundary

Use a `key` or state to reset after an error.

```javascript
function App() {
  const [resetKey, setResetKey] = React.useState(0);
  return (
    <ErrorBoundary key={resetKey}>
      <Profile onRetry={() => setResetKey(k => k + 1)} />
    </ErrorBoundary>
  );
}
```

Explanation: calling `setResetKey(k => k + 1)` increments the `key` prop. Changing the `key` forces React to unmount and remount `ErrorBoundary`, resetting its internal error state and re-rendering its children.

Note: `key` is a special React prop used for element identity during reconciliation. It is not passed to the component via `props`. You commonly use `key` when rendering lists (e.g., `items.map(...)`), when returning arrays of siblings, when rendering lists of fragments, and when you intentionally want to force a remount by changing the `key`.

## Placement

Place boundaries around independent UI regions so a failure does not blank the whole page.

## Interview Questions and Answers

### 1. What do error boundaries catch?

Errors during rendering, lifecycle methods, and constructors of child components.

### 2. Why are error boundaries class components?

React currently provides error boundary APIs only for class components. The APIs are `static getDerivedStateFromError` and `componentDidCatch`. `getDerivedStateFromError` returns state updates (like `{ hasError: true }`), which triggers a re-render so you can show a fallback UI, and `componentDidCatch` is for logging/reporting the error.
