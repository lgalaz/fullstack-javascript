# JSX and Rendering 

## Introduction

JSX is a syntax extension for JavaScript that looks like HTML. It compiles to `React.createElement` calls (or to the new `jsx` runtime functions when using the modern transform).

With the modern JSX transform (`react-jsx`), you usually do not need to import React in every file because the compiler auto-injects the needed runtime calls. Before this transform, JSX compiled to `React.createElement`, so `React` had to be in scope for every JSX file.

The JSX syntax you write is the same, but the compiled output and runtime imports differ:

- Classic transform: emits `React.createElement(...)` calls and requires `React` to be in scope.
- `react-jsx` transform: emits `jsx`/`jsxs` calls from `react/jsx-runtime` and does not require `React` in scope.

Here is the same JSX compiled both ways to show the difference clearly:

```javascript
// Before (classic transform)
import React from 'react';

const element = <h1>Hello</h1>;
```

```javascript
// After (react-jsx transform)
const element = <h1>Hello</h1>;
```

```javascript
// Classic transform output (simplified)
import React from 'react';

const element = React.createElement('h1', null, 'Hello');
```

```javascript
// react-jsx transform output (simplified)
import { jsx as _jsx } from 'react/jsx-runtime';

const element = _jsx('h1', { children: 'Hello' });
```

Note on signatures:

- `React.createElement(type, props, ...children)`
- `jsx(type, props, key?)` / `jsxs(type, props, key?)` where `children` live inside `props.children`

Practical differences besides the import:

- No global `React` dependency in every JSX file.
- The new runtime enables better tree-shaking and smaller bundles in many cases.
- Newer tooling can avoid injecting `React` even when you only use JSX, while still letting you import `React` when you actually need it (hooks, APIs).

## Expressions in JSX

You can embed any JS expression inside `{}`.

```javascript
const name = 'Ada';
const element = <h1>Hello, {name}</h1>;
```

Common expression patterns:

```javascript
const isLoggedIn = true;
const element = <div>{isLoggedIn ? 'Welcome' : 'Sign in'}</div>;
```

```javascript
const hasNotifications = true;
const element = <div>{hasNotifications && <span>New</span>}</div>;
```

```javascript
const items = ['a', 'b'];
const list = <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
```

Move statements above JSX:

```javascript
function Profile({ user }) {
  let message;
  if (user) {
    message = `Hello, ${user.name}`;
  } else {
    message = 'Sign in';
  }

  return <h1>{message}</h1>;
}
```

IIFE for complex logic (still returns an expression):

```javascript
const element = (
  <div>
    {(() => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Morning';
      if (hour < 18) return 'Afternoon';

      return 'Evening';
    })()}
  </div>
);
```

## Attributes and Class Names

Use `className` and `htmlFor` instead of `class` and `for`.

```javascript
<label htmlFor="email" className="label">Email</label>
```

Note: JSX sets DOM properties, not raw HTML attributes. `class` and `for` are reserved JS keywords, so React uses `className` and `htmlFor` and maps them to the correct HTML attributes.

## Rendering Lists

```javascript
const items = ['a', 'b'];
<ul>{items.map(i => <li key={i}>{i}</li>)}</ul>
```

Keys help React preserve element identity during reorders and updates. They are not passed as props.

Note: Using the item value as a key only works if values are unique and stable. If duplicates are possible or order changes, prefer a unique id (e.g., `item.id`) to avoid key collisions.

## Conditional Rendering in JSX

```javascript
{isLoggedIn ? <Logout /> : <Login />}
```

## Fragments

Use fragments when you need to return multiple elements without extra DOM.

```javascript
// Both <React.Fragment> and the shorthand <>...</> are valid and equivalent. The long form is required if you need to add a key prop.
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);
```

Keyed fragment example (needed when rendering a list of fragments so React can track identity across reorders):

```javascript
function Rows({ items }) {

  return items.map(item => (
    <React.Fragment key={item.id}>
      <dt>{item.label}</dt>
      <dd>{item.value}</dd>
    </React.Fragment>
  ));
}
```

## JSX is just expressions

You can assign JSX to variables, pass it as props, or return it from functions.

```javascript
const Empty = () => null;
const condition = true;
const content = condition ? <span>Yes</span> : <Empty />;

function Panel() {

  return <div>{content}</div>;
}
```

## Dangerous HTML

Use `dangerouslySetInnerHTML` only with sanitized content.

```javascript
<div dangerouslySetInnerHTML={{ __html: safeHtml }} />
```

Note: This bypasses React's normal HTML escaping and inserts raw HTML into the DOM. Use it for trusted or sanitized content only. Common use cases include rendering CMS/Markdown content or embedding preformatted HTML from a WYSIWYG editor.

## Virtual DOM (React element tree)

When you render, React builds an in-memory tree of elements (a lightweight description of the UI). On the next render, it builds a new tree, compares it to the previous one (reconciliation), and commits only the minimal DOM changes. This is often called the "virtual DOM."