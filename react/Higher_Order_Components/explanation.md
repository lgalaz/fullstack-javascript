# Higher-Order Components and Pure Functions

## Introduction

A higher-order component (HOC) is a function that takes a component and returns a new component with added behavior. It comes from the broader idea of higher-order functions: functions that take other functions as input or return them as output.

## Higher-Order Functions (General)

Higher-order functions are not React-specific. They accept functions or return functions.

```javascript
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
```

```javascript
function withPrefix(prefix) {

  return function format(value) {

    return `${prefix}${value}`;
  };
}
const formatId = withPrefix('id-');
formatId('user-1'); // "id-user-1"
```

## Higher-Order Components (HOC)

Signature: `const Enhanced = withThing(WrappedComponent)`.

```javascript
// withAuth.js
export function withAuth(WrappedComponent) {

  return function WithAuth(props) {
    if (!props.user) return <p>Unauthorized</p>;

    return <WrappedComponent {...props} />;
  };
}
```

```javascript
// Usage
function Dashboard({ user }) {

  return <h1>Welcome {user.name}</h1>;
}

const DashboardWithAuth = withAuth(Dashboard);
export default DashboardWithAuth;
```

Example usage:

```javascript
// App.js
import DashboardWithAuth from './DashboardWithAuth';

export default function App() {

  return <DashboardWithAuth user={{ name: 'Ada' }} />;
}
```

Notes:
- HOCs do not modify the original component; they wrap it.
- Forward props so the wrapped component still receives its inputs.
- Set a display name in real apps for better DevTools debugging.

## When to Use HOCs

- Sharing behavior across many components (auth, permissions, analytics).
- Supporting legacy class components.
- Library patterns that need a wrapper component.

Common examples in apps:

- Route guards and redirects (require auth, verify email).
- Feature flags and A/B variants (swap UI based on flags).
- Permissions and roles (hide or disable admin-only actions).
- Data fetching state wrappers (loading, empty, error states).
- Event instrumentation (page views, click tracking).
- Theming or layout shells (inject layout props or wrappers).

Custom hooks are often simpler for new function components, but HOCs are still useful in shared libraries and cross-cutting concerns.

## Pure Functions

A pure function always returns the same output for the same input and has no side effects.

```javascript
function add(a, b) {

  return a + b;
}
```

Impure function example (side effects):

```javascript
let total = 0;
function addToTotal(x) {
  total += x;

  return total;
}
```

## Pure Components

React has helpers that skip re-renders when props are shallowly equal:

- `React.PureComponent` for class components
- `React.memo` for function components

```javascript
const UserCard = React.memo(function UserCard({ user }) {

  return <div>{user.name}</div>;
});
```

Note: shallow comparison means mutated objects can break memoization. Prefer immutable updates (create new objects/arrays).

## Interview Questions and Answers

### 1. What is a higher-order component?

A function that takes a component and returns a new component with additional behavior.

### 2. How is `React.memo` related to pure components?

It memoizes a function component by shallowly comparing props to skip unnecessary renders.
