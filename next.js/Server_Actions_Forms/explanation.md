# Server Actions and Forms 

## Introduction

Server actions let you run server-side code directly from forms or client components without building a separate API route. They are functions marked with `'use server'` that always execute on the server.

## Basic Server Action

```javascript
// app/users/actions.js
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createUser(formData) {
  const name = formData.get('name');
  if (!name || typeof name !== 'string') {
    throw new Error('Name is required');
  }

  // Replace with your DB call.
  await db.users.create({ name });

  // Update the users list and navigate back.
  revalidatePath('/users');
  redirect('/users');
}
```

```javascript
// app/users/page.js
import { createUser } from './actions';

export default function UsersPage() {
  return (
    <form action={createUser}>
      <label>
        Name
        <input name="name" required />
      </label>
      <button type="submit">Create</button>
    </form>
  );
}
```

## Client Components

Client components can call server actions, but must pass them down as props or import them directly.

Example: pass the action down from a server component.

```javascript
// app/users/page.js
import { createUser } from './actions';
import CreateUserForm from './CreateUserForm';

export default function UsersPage() {
  return <CreateUserForm action={createUser} />;
}
```

```javascript
// app/users/CreateUserForm.js
'use client';

export default function CreateUserForm({ action }) {
  return (
    <form action={action}>
      <input name="name" />
      <button type="submit">Create</button>
    </form>
  );
}
```

Example: import the action directly in a client component.

```javascript
'use client';
import { createUser } from '../actions';

export default function CreateUser() {
  return (
    <form action={createUser}>
      <input name="name" />
      <button type="submit">Create</button>
    </form>
  );
}
```

Bad practice: skipping validation on the server action.

```javascript
'use server';

export async function createUser(formData) {
  // missing validation
  await db.users.create({ name: formData.get('name') });
}
```

## Security and Validation

Always validate input on the server. Server actions run with server privileges.

Use `useFormState` and `useFormStatus` for optimistic UI and validation feedback.

`useFormState` stores server action results in component state. `useFormStatus` exposes pending state for the current form submission.

Note: `useFormState(action, initialState, permalink?)` returns `[state, formAction]`. The `formAction` is a wrapped action you pass to `<form action={...}>`, and the server action receives `(prevState, formData)`.

Note: `useFormStatus()` returns an object like `{ pending, data, method, action }` for the nearest parent `<form>`. `pending` is the most commonly used flag for loading states.

```javascript
'use server';

export async function createUser(prevState, formData) {
  const name = formData.get('name');
  if (!name) return { error: 'Name is required' };
  // Replace with your DB call.
  await db.users.create({ name });
  return { error: null };
}
```

```javascript
'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { createUser } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Saving...' : 'Create'}</button>;
}

export default function CreateUserForm() {
  const [state, formAction] = useFormState(createUser, { error: null });
  return (
    <form action={formAction}>
      <input name="name" />
      {state.error ? <p>{state.error}</p> : null}
      <SubmitButton />
    </form>
  );
}
```

## Action Inputs and State

Server actions only accept serializable inputs. When you call an action from a client component, arguments are serialized and sent to the server.

If you are on React 19+, `useActionState` is the newer name for `useFormState` and works the same way.

## Interview Questions and Answers

### 1. What problem do server actions solve?

They remove boilerplate API routes for simple mutations.

### 2. Where does a server action run?

On the server, even if invoked from a client component.
