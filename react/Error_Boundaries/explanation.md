# Error Boundaries in React - Comprehensive Study Guide

## Introduction

Error boundaries catch JavaScript errors in rendering, lifecycle methods, and constructors of their child components. They prevent a whole app crash.

## Creating an Error Boundary

Error boundaries must be class components.

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
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

## Interview Questions and Answers

### 1. What do error boundaries catch?

Errors during rendering, lifecycle methods, and constructors of child components.

### 2. Why are error boundaries class components?

React currently provides error boundary APIs only for class components.
