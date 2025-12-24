# Server and Client Components 

## Introduction

In the App Router, components are server components by default. Client components are opt-in with the `'use client'` directive.

Server components render on the server and can access server-only resources. Client components run in the browser and include their JS in the client bundle.

## Server Components

- Render on the server
- Can access server-only resources (DB, secrets)
- Do not include client-side JS unless needed

```javascript
// app/users/page.js
export default async function Users() {
  // getUsers is a server-side data function (DB or API call).
  const users = await getUsers();
  return <pre>{JSON.stringify(users, null, 2)}</pre>;
}
```

Server Components can stream HTML and are cached by default unless you opt out.

Bad practice: using hooks or browser APIs in a server component. Server components do not run in the browser, so hooks like `useState` and APIs like `window` or `document` are unavailable. If you need interactivity, move that part into a client component with `'use client'` and keep the server component focused on data fetching and static UI.

```javascript
import { useState } from 'react';

export default function Page() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## Client Components

Add `'use client'` at the top to enable hooks and browser APIs.

Note: using a browser API does not automatically turn a server component into a client component. You must add `'use client'`, otherwise Next.js will throw an error during build or runtime.

```javascript
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## When to Use Which

- Server components for data fetching and static UI
- Client components for interactivity and state

## Data boundary example

Keep the data on the server, pass only what the client needs.

```javascript
// app/users/page.js
import UserList from './UserList';

export default async function UsersPage() {
  // getUsers is a server-side data function (DB or API call).
  const users = await getUsers();
  // Only pass the fields the client component needs.
  const publicUsers = users.map(({ id, name }) => ({ id, name }));
  return <UserList users={publicUsers} />;
}

// app/users/UserList.js
'use client';
export default function UserList({ users }) {
  return users.map(u => <div key={u.id}>{u.name}</div>);
}
```

## Interview Questions and Answers

### 1. Why are server components useful?

They reduce client bundle size and allow secure data access on the server.

### 2. What does `'use client'` do?

It marks a component and its imports as client-side, enabling hooks and browser APIs.
