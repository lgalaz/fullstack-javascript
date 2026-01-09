# Suspense and Async Components

## Introduction

Vue Suspense lets you render fallback UI while async dependencies resolve. Async components enable code splitting and lazy loading.

## Async Component

```javascript
import { defineAsyncComponent } from 'vue';

const UserCard = defineAsyncComponent(() => import('./UserCard.vue'));
```

## Suspense Example

```vue
<template>
  <Suspense>
    <template #default>
      <UserCard />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

## Practical Guidance

- Use async components for routes and heavy widgets.
- Provide a fallback that matches layout size to avoid layout shift.
