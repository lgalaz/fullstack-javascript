# Provide and Inject

## Introduction

Provide/inject lets ancestors pass values to deep descendants without prop drilling. It is useful for dependency injection and shared services.

## Example

```vue
<!-- App.vue -->
<script setup>
import { provide } from 'vue';

provide('theme', 'dark');
</script>
```

```vue
<!-- Child.vue -->
<script setup>
import { inject } from 'vue';

const theme = inject('theme', 'light');
</script>

<template>
  <div>Theme: {{ theme }}</div>
</template>
```

## Practical Guidance

- Use provide/inject for app-level services (i18n, theming, clients).
- Prefer props for explicit component APIs.
