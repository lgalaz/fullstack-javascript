# JSX and Rendering - Comprehensive Study Guide

## Introduction

JSX is a syntax extension for JavaScript that looks like HTML. It compiles to `React.createElement` calls.

## Expressions in JSX

You can embed any JS expression inside `{}`.

```javascript
const name = 'Ada';
const element = <h1>Hello, {name}</h1>;
```

## Attributes and Class Names

Use `className` and `htmlFor` instead of `class` and `for`.

```javascript
<label htmlFor="email" className="label">Email</label>
```

## Rendering Lists

```javascript
const items = ['a', 'b'];
<ul>{items.map(i => <li key={i}>{i}</li>)}</ul>
```

## Conditional Rendering in JSX

```javascript
{isLoggedIn ? <Logout /> : <Login />}
```

## Fragments

Use fragments when you need to return multiple elements without extra DOM.

```javascript
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);
```

## Interview Questions and Answers

### 1. What does JSX compile to?

It compiles to `React.createElement` calls.

### 2. Why does JSX use `className`?

Because `class` is a reserved keyword in JavaScript.
