# Context API in React - Comprehensive Study Guide

## Introduction

Context provides a way to pass data through the component tree without manually passing props at every level.

## Creating and Using Context

```javascript
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value="dark">
      {children}
    </ThemeContext.Provider>
  );
}

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

## When to Use Context

- Global app settings (theme, locale)
- User auth data
- Feature flags

## Performance Considerations

Any change to the provider value causes all consumers to re-render. Keep the context value stable and split contexts if needed.

## Interview Questions and Answers

### 1. What problem does Context solve?

It avoids prop drilling by making values available to deeply nested components.

### 2. How can you prevent unnecessary re-renders with Context?

Memoize the context value and split large contexts into smaller ones.
