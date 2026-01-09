# Forms and Validation

## Introduction

Vue makes form handling straightforward with `v-model`. For validation, combine schema validation libraries or lightweight custom checks.

## v-model Basics

```vue
<script setup>
import { ref } from 'vue';

const email = ref('');
</script>

<template>
  <input v-model="email" type="email" />
  <p>{{ email }}</p>
</template>
```

## Custom Validation

```vue
<script setup>
import { ref, computed } from 'vue';

const password = ref('');
const error = computed(() =>
  password.value.length < 8 ? 'Min 8 characters' : ''
);
</script>

<template>
  <input v-model="password" type="password" />
  <span>{{ error }}</span>
</template>
```

## Practical Guidance

- Use `v-model` for two-way binding and keep validation in computed or watchers.
- For complex forms, use a schema validator (e.g., Zod, Yup) with a form library.
- Validate on submit and on blur to avoid noisy UX.
