# Components and Props in React 

## Introduction

Components are the building blocks of a React UI.
A React component is a reusable, self‑contained piece of UI logic that returns what should appear on screen. It can be a function or class, can accept inputs called props, manage its own state, and render other components to build complex interfaces.
Props (short for properties) are inputs passed into components to configure how they render and behave. Components should be pure with respect to their props: given the same props, they should render the same output.

React compares props by reference when deciding if a component can skip re-rendering (e.g., `React.memo`). Keeping props stable matters for performance-sensitive components.

Example (lift constants outside render):

```javascript
const BUTTON_STYLE = { color: 'white' };

function App() {

  return <Button label="Save" style={BUTTON_STYLE} />;
}
```

## Class Components

Class components are the older way to define components using ES6 classes. They are still supported, but function components with hooks are now preferred for most new code.

```javascript
class Greeting extends React.Component {
  render() {
    const { name, children } = this.props;
    return (
      <h1>
        Hello, {name}! {children}
      </h1>
    );
  }
}

// Usage
<Greeting name="Ada">Welcome</Greeting>
```

## Function Components

Function components are the modern, recommended way to write components.

A function becomes a component only when rendered as `<MyComponent />`.

Render functions = helpers; components = identity + lifecycle.

```javascript
function Greeting(props) {

  return (
    <h1>
      Hello, {props.name}! {props.children}
    </h1>
  );
}

// Usage
<Greeting name="Ada">Welcome</Greeting>
```

You can also destructure props for clarity:

```javascript
function Greeting({ children, name }) {

  return <h1>Hello, {name}{children ? ` ${children}` : ''}</h1>;
}
```

## Props Basics

- Props are read-only from the child component's perspective.
- Props flow one-way: parent -> child.
- Props can be values, functions (callbacks), or other components/JSX.
- Parents control data; children request changes by calling callbacks.
- Changing a prop causes the child to re-render with the new value.
- If a child tries to modify a prop directly, it will be ignored or overwritten on the next render; the correct pattern is to call a callback prop (e.g., `onChange`, `onClick`) so the parent updates state and passes new props down.

Examples:

```javascript
// values
<Avatar name="Ada" />

// functions (callbacks)
<Button onClick={() => alert('Saved')} />

// other components/JSX
<Card><h2>Title</h2></Card>

// one-way flow + callback back up
function Counter({ count, onInc }) {

  return <button onClick={onInc}>{count}</button>;
}

function CounterApp() {
  const [count, setCount] = React.useState(0);
  // Good: uses functional update, safe with batching
  const handleInc = () => setCount(c => c + 1);

  return <Counter count={count} onInc={handleInc} />;
}
```

Avoid this in event handlers that might be called quickly or batched:

```javascript
function CounterAppBad() {
  const [count, setCount] = React.useState(0);
  // Bad: closes over stale count if updates are batched
  const handleInc = () => setCount(count + 1);

  return <Counter count={count} onInc={handleInc} />;
}
```

```javascript
function Button({ label, onClick }) {

  return <button onClick={onClick}>{label}</button>;
}

function App() {

  return <Button label="Save" onClick={() => alert('Saved')} />;
}
```

In this example, `App` owns the data and behavior (`label`, `onClick`). `Button` is a pure view of those props and cannot mutate them directly; it can only call `onClick` to notify the parent.

## Referential stability

```javascript
function Button({ label, onClick, style }) {

  return (
    <button onClick={onClick} style={style}>
      {label}
    </button>
  );
}

const MemoButton = React.memo(Button);

function App() {
  const onSave = React.useCallback(() => {
    // save
  }, []);

  const style = React.useMemo(() => ({ color: 'white' }), []);

  return <MemoButton label="Save" onClick={onSave} style={style} />;
}
```

`React.memo` skips re-rendering `Button` when its props are referentially equal. `useCallback` memoizes the `onSave` function so it keeps the same reference across renders. `useMemo` memoizes the `style` object for the same reason; otherwise a new object reference would force a re-render even if its contents are identical.

Without memoization, new function/object props are created every render, so memoized children still re-render:

```javascript
function App() {
  const onSave = () => {
    // save
  };
  const style = { color: 'white' };

  return <MemoButton label="Save" onClick={onSave} style={style} />;
}
```

Memoization is more useful when you render many identical children:

```javascript
function App() {
  const onSave = React.useCallback(() => {
    // save
  }, []);
  const style = React.useMemo(() => ({ color: 'white' }), []);

  return (
    <div>
      {Array.from({ length: 100 }).map((_, i) => (
        // Prefer stable keys from data, not array indexes.
        <MemoButton key={i} label={`Save ${i}`} onClick={onSave} style={style} />
      ))}
    </div>
  );
}
```

## Children Prop

Any JSX nested inside a component becomes `props.children`.
In JSX, `className` is used instead of `class` because `class` is a reserved JavaScript keyword, and `className` maps to the HTML `class` attribute.

```javascript
function Card({ children }) {

  return <div className="card">{children}</div>;
}

<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

Renders to:

```html
<div class="card">
  <h2>Title</h2>
  <p>Content</p>
</div>
```

Children can also be a render function for advanced composition.
This is useful when you want to share state/logic but give the consumer full control over the rendered markup and layout.

```javascript
function DataFetcher({ children }) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    setData({ name: 'Ada' });
  }, []);

  return children(data);
}

<DataFetcher>{data => <span>{data?.name}</span>}</DataFetcher>;
// Prints: <span>Ada</span>
```

TypeScript version (typed render prop):

```typescript
function DataFetcher({
  children,
}: {
  children: (data: { name: string } | null) => React.ReactNode;
}) {
  const [data, setData] = React.useState<{ name: string } | null>(null);
  React.useEffect(() => {
    setData({ name: 'Ada' });
  }, []);

  return children(data);
}
```

## Default Props

You can use default values with function parameters or defaultProps.

```javascript
function Badge({ label = 'New' }) {

  return <span>{label}</span>;
}
```

## Prop Drilling

Passing props through multiple layers can be noisy. Context can help when many nested components need the same value.

```javascript
function App() {
  const [theme, setTheme] = React.useState('dark');

  return <Layout theme={theme} />;
}

function Layout({ theme }) {

  return <Sidebar theme={theme} />;
}

function Sidebar({ theme }) {

  return <Profile theme={theme} />;
}

function Profile({ theme }) {

  return <div className={`profile ${theme}`}>Profile</div>;
}
```

Context version to avoid prop drilling:

```javascript
const ThemeContext = React.createContext('light');

function App() {
  const [theme, setTheme] = React.useState('dark');

  return (
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function Layout() {

  return <Sidebar />;
}

function Sidebar() {

  return <Profile />;
}

function Profile() {
  const theme = React.useContext(ThemeContext);

  return <div className={`profile ${theme}`}>Profile</div>;
}
```

## Interview Questions and Answers

### 1. What are props in React?

Props are inputs passed from a parent component to a child component. They are read-only and used to configure a component's behavior or output.

### 2. Can a child component change its props?

Not in a meaningful or supported way. A child can mutate a prop object it receives, but that is an anti-pattern and won't trigger a re-render; the correct approach is to call a callback and let the parent pass new props.
