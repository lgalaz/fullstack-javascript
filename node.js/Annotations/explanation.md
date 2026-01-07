# Annotations

## Introduction

Node.js does not add an annotation system. In JavaScript, annotations are usually JSDoc comments or runtime metadata attached to functions and objects. In TypeScript-based Node.js services, type annotations are just standard TypeScript types.

## JSDoc for Node.js APIs

```javascript
/**
 * @param {string} id
 * @returns {Promise<{ id: string }>} 
 */
async function fetchUser(id) {
  return { id };
}
```

## Runtime Metadata Pattern

```javascript
function route(method, path) {
  return function (handler) {
    handler.route = { method, path };
    return handler;
  };
}

const get = (path) => route('GET', path);

const showUser = get('/users/{id}')(async function (id) {
  return { id };
});
```

## When Annotations Are a Good Idea

- You want editor hints without adopting TypeScript.
- You need small bits of metadata for routing or validation.

## When to Avoid

- You need strict type checks; use TypeScript instead.
