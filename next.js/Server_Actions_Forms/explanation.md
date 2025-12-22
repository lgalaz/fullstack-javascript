# Server Actions and Forms - Comprehensive Study Guide

## Introduction

Server actions let you run server-side code directly from forms or client components without building a separate API route.

## Basic Server Action

```javascript
// app/actions.js
'use server';

export async function createUser(formData) {
  const name = formData.get('name');
  // save to database
}
```

```javascript
// app/users/page.js
import { createUser } from '../actions';

export default function UsersPage() {
  return (
    <form action={createUser}>
      <input name="name" />
      <button type="submit">Create</button>
    </form>
  );
}
```

## Client Components

Client components can call server actions, but must pass them down as props or import them directly.

## Security and Validation

Always validate input on the server. Server actions run with server privileges.

## Interview Questions and Answers

### 1. What problem do server actions solve?

They remove boilerplate API routes for simple mutations.

### 2. Where does a server action run?

On the server, even if invoked from a client component.
