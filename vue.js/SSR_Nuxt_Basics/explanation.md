# SSR and Nuxt Basics

## Introduction

Nuxt is the official meta-framework for Vue. It provides SSR, routing, data fetching conventions, and deployment tooling.

## Why SSR

- Faster first paint and improved SEO.
- Smaller client bundles when combined with code splitting.

## Nuxt Example

```vue
<script setup>
const { data } = await useFetch('/api/users');
</script>

<template>
  <ul>
    <li v-for="u in data" :key="u.id">{{ u.name }}</li>
  </ul>
</template>
```

## Practical Guidance

- Use SSR when SEO or initial load performance is critical.
- Keep server-side data fetching efficient and cache when possible.
