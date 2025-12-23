# Server and Client Components 

## Introduction

In the App Router, components are server components by default. Client components are opt-in with the `'use client'` directive.

## Server Components

- Render on the server
- Can access server-only resources (DB, secrets)
- Do not include client-side JS unless needed

```javascript
// app/users/page.js
export default async function Users() {
  const users = await getUsers();
  return <pre>{JSON.stringify(users, null, 2)}</pre>;
}
```

Server Components can stream HTML and are cached by default unless you opt out.

## Client Components

Add `'use client'` at the top to enable hooks and browser APIs.

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
  const users = await getUsers();
  return <UserList users={users} />;
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
