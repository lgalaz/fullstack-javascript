# Lists and Keys in React - Comprehensive Study Guide

## Introduction

Rendering lists is common in React. Keys help React identify which items change, are added, or are removed.

## Rendering Lists

```javascript
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

## Choosing Keys

- Use stable, unique IDs when possible.
- Avoid array indices if items can be reordered, inserted, or removed.

Bad:

```javascript
{todos.map((todo, index) => (
  <li key={index}>{todo.text}</li>
))}
```

## Why Keys Matter

Without stable keys, React may reuse DOM nodes incorrectly, leading to bugs like wrong input values or broken animations.

## Interview Questions and Answers

### 1. Why does React need keys?

Keys let React track list items between renders and update the DOM efficiently and correctly.

### 2. When is it acceptable to use an index as a key?

When the list is static and never reorders, adds, or removes items.
