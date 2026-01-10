# Context API in React 

## Introduction

Context provides a way to pass data through the component tree without manually passing props at every level.

## Creating and Using Context

```javascript
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeProvider>
      <Button />
    </ThemeProvider>
  );
}

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

Resulting HTML (simplified):

```html
<button class="dark">Click</button>
```

`createContext` takes a single `defaultValue` argument (not a context object) and returns a context object with `Provider` and `Consumer` properties. The default value is only used when there is no provider above in the tree.

Example of the created context object (shape):

```javascript
const ThemeContext = createContext('light');

ThemeContext = {
  Provider: /* React component */,
  Consumer: /* React component */,
  // Internal fields
};
```

The default value can be any JavaScript value: primitives, arrays, objects (including nested objects), or functions. A common pattern is passing an object with data and callbacks:

```javascript
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
});

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeToggleButton() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current: {theme}
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemeToggleButton />
    </ThemeProvider>
  );
}
```

## When to Use Context

- Global app settings (theme, locale)
- User auth data
- Feature flags

## Performance Considerations

Any change to the provider value causes all consumers to re-render. Keep the context value stable and split contexts if needed.

```javascript
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeStatus() {
  const { theme } = useContext(ThemeContext);
  console.log('ThemeStatus render');
  return <p>Theme is {theme}</p>;
}

function ThemeToggleButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemeToggleButton />
      <ThemeStatus />
    </ThemeProvider>
  );
}
```

Context is not a state management replacement by itself. For complex derived state or async data, pair it with hooks or external stores.

Example with a custom hook for async data:

```javascript
const UserContext = React.createContext({ status: 'idle', data: null });

function useUserProfile(userId) {
  const [state, setState] = useState({ status: 'idle', data: null });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', data: null });
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) setState({ status: 'ready', data });
      });
    return () => {
      active = false;
    };
  }, [userId]);

  return state;
}

function UserProvider({ userId, children }) {
  const userState = useUserProfile(userId);
  return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
}
```

## useContextSelector

`useContextSelector` (from the `use-context-selector` package or React experimental APIs) lets a component subscribe to only a slice of context. This is useful when a context value is an object with many fields, and you want to avoid re-rendering consumers when unrelated fields change.

Example with a selector to reduce re-renders:

```javascript
import { createContext } from 'react';
import { useContextSelector } from 'use-context-selector';

const ThemeContext = createContext({ theme: 'light', setTheme: () => {} });

function ThemeStatus() {
  const theme = useContextSelector(ThemeContext, (value) => value.theme);
  console.log('ThemeStatus render');
  return <p>Theme is {theme}</p>;
}

function ThemeToggleButton() {
  const setTheme = useContextSelector(ThemeContext, (value) => value.setTheme);
  return <button onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>Toggle</button>;
}
```

By selecting only what you need, updates to other fields won't trigger renders for this component, which can help keep large trees responsive.

## Interview Questions and Answers

### 1. What problem does Context solve?

It avoids prop drilling by making values available to deeply nested components.

### 2. How can you prevent unnecessary re-renders with Context?

Memoize the context value and split large contexts into smaller ones.
