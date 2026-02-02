# Component Composition and Children 

## Componenet
A React component is a reusable, self‑contained piece of UI logic that returns what should appear on screen. It can be a function or class, can accept inputs called props, manage its own state, and render other components to build complex interfaces.

## Introduction

React encourages composition over inheritance. You build complex UIs by combining small components.

Composition is preferred because it keeps components flexible and decoupled by letting each component focus on one concern (visuals, layout, or behavior) and be assembled in different combinations without sharing internal state or implementation details, avoids deep inheritance hierarchies, and makes behavior easier to reuse by composing components and passing props/children instead of extending base classes.

## Class Components vs Function Components

Both can render UI and accept props. The modern default is function components with hooks.

### Function components (recommended)
- Use `useState`, `useEffect`, `useMemo`, `useCallback`, etc. for state and side effects.
- Shorter, easier to reuse logic with custom hooks.
- Aligns with the direction of the React ecosystem and new APIs.

```javascript
function Counter({ initial = 0 }) {
  const [count, setCount] = React.useState(initial);

  React.useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Class components (legacy but supported)
- Use `this.state` and `this.setState` for state.
- Use lifecycle methods like `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`.
- Still common in older codebases and error boundaries.

```javascript
class Counter extends React.Component {
  state = { count: this.props.initial ?? 0 };
  
  componentDidMount() {
    document.title = `Count: ${this.state.count}`;
  }

  componentDidUpdate() {
    document.title = `Count: ${this.state.count}`;
  }

  render() {
    return (
      <button onClick={() => this.setState(s => ({ count: s.count + 1 }))}>
        {this.state.count}
      </button>
    );
  }
}
```

### When to choose what
- New code: function components + hooks.
- Existing class code: keep as-is unless you are already refactoring.
- Error boundaries: class components are still the standard approach.

Example contrast (inheritance vs composition):

```javascript
// Inheritance
class ButtonBase extends React.Component {
  render() {
    return <button className={`btn ${this.props.variant}`}>{this.props.label}</button>;
  }
}
// here PrimaryButton is just an alias with the same behavior.
class PrimaryButton extends ButtonBase {}

// use:
// <PrimaryButton variant="primary" label="Save" />
```

```javascript
// Composition
function Button({ children, variant }) {

  return <button className={`btn ${variant}`}>{children}</button>;
}
function PrimaryButton() {

  return <Button variant="primary">Save</Button>;
}
```

Inheritance with override (to hardcode "primary"):
```javascript
class PrimaryButton2 extends ButtonBase {
  render() {
    return <button className="btn primary">{this.props.label}</button>;
  }
}
// use:
// <PrimaryButton2 label="Save" />
```

## Basic Composition

```javascript
function Avatar({ name }) {

  return <div className="avatar">{name}</div>;
}

function Header() {

  return (
    <header>
      <Avatar name="Ada" />
      <h1>Dashboard</h1>
    </header>
  );
}
```

## Children as a Slot

`props.children` lets parents pass arbitrary JSX into a component.

```javascript
function Panel({ title, children }) {

  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

<Panel title="Info">
  <p>Details go here.</p>
</Panel>
```

## Render props

Children can be a function to pass data down without additional components.
This is useful for sharing logic while letting the caller control markup.
It is more flexible than HOCs for one-off sharing, but can get noisy and is often replaced by custom hooks in function components.

```javascript
function Mouse({ children }) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {children(pos)}
    </div>
  );
}

<Mouse>{pos => <span>{pos.x}, {pos.y}</span>}</Mouse>;
```

Custom hook alternative:

```javascript
function useMousePosition() {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const onMouseMove = React.useCallback(
    e => setPos({ x: e.clientX, y: e.clientY }),
    []
  );

  return { pos, onMouseMove };
}

function MouseTracker() {
  const { pos, onMouseMove } = useMousePosition();

  return <div onMouseMove={onMouseMove}>{pos.x}, {pos.y}</div>;
}
```

## Multiple Slots

You can pass multiple regions via props.

```javascript
function Layout({ header, sidebar, content }) {

  return (
    <div>
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{content}</main>
    </div>
  );
}

<Layout
  header={<h1>Dashboard</h1>}
  sidebar={<nav>Links</nav>}
  content={<section>Main content</section>}
/>;

or

function Header() {

  return <h1>Dashboard</h1>;
}

function Sidebar() {

  return <nav>Links</nav>;
}

function Content() {

  return <section>Main content</section>;
}

<Layout header={<Header />} sidebar={<Sidebar />} content={<Content />} />;
```

## Compound components

Compound components share state implicitly via context.
The `null` passed to `createContext` is the default value used when a component reads the context without a matching provider.

```javascript
const TabsContext = React.createContext(null);

function Tabs({ children }) {
  const [active, setActive] = React.useState(0);

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  );
}

function Tab({ index, children }) {
  const ctx = React.useContext(TabsContext);

  return (
    <button onClick={() => ctx.setActive(index)}>
      {children}
    </button>
  );
}
```

```javascript
<Tabs>
  <Tab index={0}>Overview</Tab>
  <Tab index={1}>Settings</Tab>
  <Tab index={2}>Billing</Tab>
</Tabs>
```

All `Tab` children read and update the shared `active` state from `TabsContext`.

Example without a matching provider (ctx is `null`, so `Tab` would throw):

```javascript
<Tab index={0}>Overview</Tab>
```