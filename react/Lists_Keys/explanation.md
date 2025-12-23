# Lists and Keys in React 

## Introduction

Rendering lists is common in React. Keys help React identify which items change, are added, or are removed during reconciliation.

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

```javascript
function Example({ items }) {
  return items.map(item => (
    <input key={item.id} defaultValue={item.label} />
  ));
}
```

If `key` changes (or uses index), React may reuse the wrong input element and preserve the wrong value.

Keys are used by React during reconciliation and are not available inside component props.

## Interview Questions and Answers

### 1. Why does React need keys?

Keys let React track list items between renders and update the DOM efficiently and correctly.

### 2. When is it acceptable to use an index as a key?

When the list is static and never reorders, adds, or removes items.
