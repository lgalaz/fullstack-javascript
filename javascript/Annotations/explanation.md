# Annotations

## Introduction

JavaScript does not have built-in type annotations like TypeScript. The closest equivalents are JSDoc comments (used by editors and tooling) and explicit metadata you attach to values at runtime.

## JSDoc Type Annotations

```javascript
/**
 * @param {string} name
 * @returns {string}
 */
function greet(name) {
  return `Hello ${name}`;
}
```

JSDoc lets editors infer types and offer autocomplete without changing runtime behavior.

## Custom Metadata on Functions

```javascript
function route(method, path) {
  return function (handler) {
    handler.route = { method, path };
    return handler;
  };
}

const get = (path) => route('GET', path);

const showUser = get('/users/{id}')(function (id) {
  return { id };
});

console.log(showUser.route);
// { method: 'GET', path: '/users/{id}' }
```

This is a common pattern in frameworks that attach metadata to handlers at runtime.

## When Annotations Are a Good Idea

- You want tooling support without switching to TypeScript.
- You need runtime metadata for routing, validation, or serialization.

## When to Avoid

- You need strict type checking; use TypeScript instead.
- The metadata becomes complex enough to warrant a dedicated framework.

## Practical Guidance

- Use JSDoc at module boundaries or public APIs.
- Prefer explicit composition when metadata makes code harder to trace.
