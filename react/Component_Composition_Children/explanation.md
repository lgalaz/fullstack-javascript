# Component Composition and Children 

## Introduction

React encourages composition over inheritance. You build complex UIs by combining small components.

Composition is preferred because it keeps components flexible and decoupled, avoids deep inheritance hierarchies, and makes behavior easier to reuse by composing components and passing props/children instead of extending base classes.

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


## Interview Questions and Answers

### 1. Why does React favor composition over inheritance?

Composition keeps components small, reusable, and easier to reason about.

### 2. What is `props.children` used for?

It allows a component to render nested content passed from its parent.
