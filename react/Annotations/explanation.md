# Annotations

## Introduction

React itself does not define annotations. In JavaScript, annotations usually mean JSDoc type comments or attaching metadata to values. In TypeScript-based React projects, type annotations are just standard TypeScript types.

## JSDoc for React Components

```javascript
/**
 * @param {{ title: string }} props
 */
function Header(props) {
  return <h1>{props.title}</h1>;
}
```

## TypeScript Annotations for Props

```typescript
type HeaderProps = { title: string };

function Header(props: HeaderProps) {
  return <h1>{props.title}</h1>;
}
```

## Metadata via Static Properties

```javascript
function Page() {
  return <div>Home</div>;
}

Page.route = '/';
Page.auth = 'public';
```

This pattern is used by some frameworks to read component metadata.

## When Annotations Are a Good Idea

- You want tooling support without migrating everything to TypeScript.
- You need a small amount of metadata for routing or permissions.

## When to Avoid

- The metadata grows complex and warrants a dedicated framework.
- You need runtime guarantees that only TypeScript can provide.
