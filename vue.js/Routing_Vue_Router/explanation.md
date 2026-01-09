# Routing with Vue Router

## Introduction

Vue Router is the official router for Vue. It supports nested routes, route guards, and code-splitting.

## Basic Router Setup

```javascript
import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import User from './pages/User.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/users/:id', component: User, props: true }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
```

## Route Guard

```javascript
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return { path: '/login' };
  }
});
```

## Practical Guidance

- Prefer route-level code splitting for large apps.
- Use `props: true` to avoid directly reading route params in components.
- Keep guards small and focused.
