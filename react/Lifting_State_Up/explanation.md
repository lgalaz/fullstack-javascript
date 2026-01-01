# Lifting State Up 

## Introduction

When multiple components need to share the same state, move that state to their closest common ancestor. This is called lifting state up.

## Example

```javascript
function TemperatureInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  );
}

function Calculator() {
  const [celsius, setCelsius] = useState('');

  return (
    <div>
      <TemperatureInput label="C" value={celsius} onChange={setCelsius} />
      <p>F: {celsius ? (celsius * 9) / 5 + 32 : ''}</p>
    </div>
  );
}

function App() {
  return <Calculator />;
}
```

## Example (Not Lifted)

```javascript
function TemperatureInput({ label }) {
  const [value, setValue] = useState('');

  return (
    <label>
      {label}
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </label>
  );
}

function Calculator() {
  const [celsius, setCelsius] = useState('');

  return (
    <div>
      <TemperatureInput label="C" />
      <TemperatureInput label="F" />
      {/* Not updated: celsius never changes because inputs own their own state. */}
      <p>F: {celsius ? (celsius * 9) / 5 + 32 : ''}</p>
    </div>
  );
}

function App() {
  return <Calculator />;
}
```

## Why It Helps

- Single source of truth
- Consistent updates across related components
- Simpler debugging

## Avoid duplicated state

Compute derived values instead of storing multiple versions of the same data.

```javascript
function Calculator() {
  const [celsius, setCelsius] = useState('');
  const fahrenheit = celsius ? (celsius * 9) / 5 + 32 : '';

  return (
    <div>
      <TemperatureInput label="C" value={celsius} onChange={setCelsius} />
      <p>F: {fahrenheit}</p>
    </div>
  );
}
```

Example of duplicated state (harder to keep in sync):

```javascript
function TemperatureInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  );
}

function Calculator() {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');

  function onCelsiusChange(value) {
    setCelsius(value);
    setFahrenheit(value ? (value * 9) / 5 + 32 : '');
  }

  return (
    <div>
      <TemperatureInput label="C" value={celsius} onChange={onCelsiusChange} />
      <p>F: {fahrenheit}</p>
    </div>
  );
}
```

If lifting causes deep prop chains, consider context or a state store for shared state.

Notes:
- Lifting state up: keep state in the nearest common parent and pass props down; simplest and explicit, but can lead to prop drilling.
- Context: share values without passing props through every level; good for app-wide data like theme or auth, but updates re-render all consumers.
- State store: externalized state (e.g., Zustand/Redux) for complex, shared, or cross-cutting data; good for larger apps and advanced patterns.
- Event bus: less common in React because it hides data flow and makes updates harder to trace; use sparingly if at all.

## State Stores (Zustand vs. Redux)

State stores move shared state out of components so any part of the app can read or update it without deep prop chains.

**Zustand**: Minimal API, uses hooks directly, and doesn't require reducers or action types. Easy to start, flexible for local app state, and low ceremony.

**Redux (Redux Toolkit)**: Opinionated structure with actions/reducers and a single store. Strong tooling, predictable updates, and great for large teams or complex workflows.

**Pure reducer**: A function that returns the next state from the current state and action without side effects or mutation.

**Why choose each**
- Choose **Zustand** when you want simple, fast setup with minimal boilerplate and a flexible store shape.
- Choose **Redux** when you need strict conventions, powerful devtools/time-travel debugging, and shared patterns across a large codebase.

**Rule of thumb (production)**
- Start with **Zustand** for most apps; switch only if you hit scale/coordination pain.
- Reach for **Redux** when multiple teams contribute, state changes are complex, or you need strict, auditable flows.
  - Multiple teams: a shared checkout or profile state used across web, mobile web, and embedded widgets.
    Redux helps here because its conventions and tooling keep a shared mental model across teams; Zustand can drift into inconsistent patterns.
  - Complex state changes: multi-step wizards that sync drafts, validations, and autosave across routes.
    Redux helps here because reducers/middleware make complex transitions explicit and testable; Zustand can become harder to trace as logic grows.
  - Auditable flows: financial or compliance actions where you need a clear log of who changed what and when.
    Redux helps here because action logs and devtools make changes traceable; Zustand offers fewer built-in audit guarantees.
  - Testing/inspection: Redux favors pure reducers and has mature tooling, which makes unit testing and debugging more consistent; Zustand is testable but less standardized.

## Interview Questions and Answers

### 1. What is lifting state up?

Moving shared state to the nearest common parent so multiple children can use it.

### 2. When should you lift state up?

When two or more components need to read or update the same piece of data.
