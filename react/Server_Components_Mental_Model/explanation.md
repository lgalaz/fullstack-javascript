# React Server Components (Mental Model)

## Introduction

React Server Components (RSC) are components that run only on the server and stream a lightweight description of the UI to the client. They do not ship their JavaScript to the browser, which reduces bundle size and improves startup.

Frameworks like Next.js provide the tooling to use RSC in practice, but the concept is React-level.

## Core ideas

- Server Components run on the server only.
- They can access server-only resources (databases, secrets, private APIs).
- They cannot use browser APIs or client hooks like `useState` and `useEffect`.
- They can render Client Components, but not the other way around.
- Props passed to Client Components must be serializable (JSON-like data).

## Why use them

- Reduce JavaScript shipped to the browser.
- Keep data fetching close to the component that needs it.
- Improve performance by moving work to the server.

## How to think about boundaries

Treat Server Components as "data + layout" and Client Components as "interactivity." If a component needs state, effects, or event handlers, it must be a Client Component. If it is static or data-driven, keep it on the server.

## Example (conceptual)

```jsx
// Server component
function UserPage({ id }) {
  const user = db.users.findById(id);
  return <UserProfile user={user} />;
}

// Client component
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={() => alert('Followed!')}>Follow</button>
    </div>
  );
}
```

In a real app, your framework marks Client Components explicitly and handles bundling and streaming for you.

## Interview Questions and Answers

### 1. What does RSC change about bundle size?

Server Components do not ship their JavaScript to the client, so the browser downloads less code.

### 2. Can a Client Component import a Server Component?

No. The boundary is one-way: Server Components can render Client Components, but not the reverse.

### 3. Why must props be serializable?

Server-to-client props cross a network boundary, so they must be JSON-like data.
