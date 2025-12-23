# JSX and Rendering 

## Introduction

JSX is a syntax extension for JavaScript that looks like HTML. It compiles to `React.createElement` calls (or to the new `jsx` runtime functions when using the modern transform).

With the modern JSX transform (`react-jsx`), you usually do not need to import React in every file because the compiler auto-injects the needed runtime calls. Before this transform, JSX compiled to `React.createElement`, so `React` had to be in scope for every JSX file:

```javascript
// Before (classic transform)
import React from 'react';

const element = <h1>Hello</h1>;
```

```javascript
// After (react-jsx transform)
const element = <h1>Hello</h1>;
```

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

## JSX is just expressions

You can assign JSX to variables, pass it as props, or return it from functions.

```javascript
const Empty = () => null;
const content = condition ? <span>Yes</span> : <Empty />;
```

## Dangerous HTML

Use `dangerouslySetInnerHTML` only with sanitized content.

```javascript
<div dangerouslySetInnerHTML={{ __html: safeHtml }} />
```

Note: This bypasses React's normal HTML escaping and inserts raw HTML into the DOM. Use it for trusted or sanitized content only. Common use cases include rendering CMS/Markdown content or embedding preformatted HTML from a WYSIWYG editor.

## Interview Questions and Answers

### 1. What does JSX compile to?

It compiles to `React.createElement` calls.

### 2. Why does JSX use `className`?

Because `class` is a reserved keyword in JavaScript.
