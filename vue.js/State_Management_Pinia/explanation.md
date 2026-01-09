# State Management with Pinia

## Introduction

Pinia is the official state management library for Vue. It is modular, type-friendly, and works well with the Composition API.

## Store Example

```javascript
// stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({ name: 'Ada', role: 'admin' }),
  getters: {
    label: (state) => `${state.name} (${state.role})`
  },
  actions: {
    promote() { this.role = 'owner'; }
  }
});
```

```vue
<script setup>
import { useUserStore } from './stores/user';

const user = useUserStore();
</script>

<template>
  <p>{{ user.label }}</p>
  <button @click="user.promote">Promote</button>
</template>
```

## Practical Guidance

- Use local component state by default; use Pinia for shared, app-level state.
- Keep stores small and domain-focused.
- Prefer getters for derived values.
