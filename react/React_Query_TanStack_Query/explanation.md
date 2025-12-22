# React Query / TanStack Query - Comprehensive Study Guide

## Introduction

TanStack Query (React Query) manages server state: fetching, caching, background updates, and mutations. It reduces manual loading and error state code.

## Core Concepts

- Query keys identify cached data
- Queries fetch data and stay in sync
- Mutations update data and can invalidate queries
- Stale time controls refetching behavior

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
```

## Interview Questions and Answers

### 1. What problem does React Query solve?

It manages server state: caching, background updates, deduping requests, and built-in loading/error handling.

### 2. What is a query key?

A unique identifier for cached data. It can be an array to include parameters.
