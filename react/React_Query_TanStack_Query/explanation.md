# React Query / TanStack Query 

## Introduction

TanStack Query (React Query) is a client-side data fetching and caching library. It manages server state: fetching, caching, background updates, retries, and mutations. It does not replace your API or database; it sits in the client to orchestrate requests, keep data fresh, and reduce manual loading/error state code.

## Core Concepts

- Query keys identify cached data
- Queries fetch data and stay in sync
- Mutations update data and can invalidate queries
- Stale time controls refetching behavior

`staleTime` controls when data becomes "stale" (eligible for refetch). `cacheTime` controls how long unused data stays in memory.

## Basic Query Example

```javascript
import { useQuery } from '@tanstack/react-query';

function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json())
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <ul>
      {data.map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

## Mutations

```javascript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function AddUser() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: user => fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user)
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] })
  });

  return (
    <button onClick={() => mutation.mutate({ name: 'Ada' })}>
      Add
    </button>
  );
}

function App() {
  return (
    <>
      <AddUser />
      <Users />
    </>
  );
}
```

## Query key structure

Use array keys for parameterized data so cache entries remain distinct.

```javascript
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json())
});
```

## Optimistic updates

```javascript
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function updateUser(user) {
  const res = await fetch(`/api/users/${user.id}`, {
    method: 'PUT',
    body: JSON.stringify(user)
  });
  return res.json();
}

function UserEditor({ user }) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateUser,
    onMutate: async updated => {
      await qc.cancelQueries({ queryKey: ['user', updated.id] });
      const prev = qc.getQueryData(['user', updated.id]);
      qc.setQueryData(['user', updated.id], updated);
      return { prev };
    },
    onError: (_err, updated, ctx) => {
      qc.setQueryData(['user', updated.id], ctx.prev);
    },
    onSettled: (_data, _err, updated) => {
      qc.invalidateQueries({ queryKey: ['user', updated.id] });
    }
  });

  return (
    <button onClick={() => mutation.mutate({ ...user, name: 'Updated' })}>
      Save
    </button>
  );
}

function App() {
  const user = { id: 1, name: 'Ada' };
  return <UserEditor user={user} />;
}
```

## Interview Questions and Answers

### 1. What problem does React Query solve?

It manages server state: caching, background updates, deduping requests, and built-in loading/error handling.

### 2. What is a query key?

A unique identifier for cached data. It can be an array to include parameters.
