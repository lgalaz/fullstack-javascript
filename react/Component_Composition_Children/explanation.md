# Component Composition and Children - Comprehensive Study Guide

## Introduction

React encourages composition over inheritance. You build complex UIs by combining small components.

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
```

## Compound components

Compound components share state implicitly via context.

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

## Interview Questions and Answers

### 1. Why does React favor composition over inheritance?

Composition keeps components small, reusable, and easier to reason about.

### 2. What is `props.children` used for?

It allows a component to render nested content passed from its parent.
