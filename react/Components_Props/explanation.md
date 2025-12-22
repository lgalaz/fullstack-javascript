# Components and Props in React - Comprehensive Study Guide

## Introduction

Components are the building blocks of a React UI. Props (short for properties) are inputs passed into components to configure how they render and behave. Components should be pure with respect to their props: given the same props, they should render the same output.

React compares props by reference when deciding if a component can skip re-rendering (e.g., `React.memo`). Keeping props stable matters for performance-sensitive components.

## Function Components

Function components are the modern, recommended way to write components.

```javascript
function Greeting(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Usage
<Greeting name="Ada" />
```

You can also destructure props for clarity:

```javascript
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

## Props Basics

- Props are read-only from the child component's perspective.
- Props flow one-way: parent -> child.
- Props can be values, functions, or other components.

```javascript
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

function App() {
  return <Button label="Save" onClick={() => alert('Saved')} />;
}
```

## Referential stability

Passing new object or function instances each render breaks memoization.

```javascript
const MemoButton = React.memo(Button);

function App() {
  const onSave = React.useCallback(() => {
    // save
  }, []);

  const style = React.useMemo(() => ({ color: 'white' }), []);
  return <MemoButton label="Save" onClick={onSave} style={style} />;
}
```

## Children Prop

Any JSX nested inside a component becomes `props.children`.

```javascript
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

Children can also be a render function for advanced composition.

```javascript
function DataFetcher({ children }) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    setData({ name: 'Ada' });
  }, []);
  return children(data);
}

<DataFetcher>{data => <span>{data?.name}</span>}</DataFetcher>;
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

## Interview Questions and Answers

### 1. What are props in React?

Props are inputs passed from a parent component to a child component. They are read-only and used to configure a component's behavior or output.

### 2. Can a child component change its props?

No. Props are immutable from the child's perspective. If changes are needed, the parent should pass new props.
