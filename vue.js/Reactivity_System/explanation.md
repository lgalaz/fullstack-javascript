# Reactivity System

## Introduction

Vue tracks reactive state and updates the DOM when it changes. In Vue 3, reactivity is built on ES proxies for fine-grained updates.

## ref and reactive

```vue
<script setup>
import { ref, reactive } from 'vue';

const count = ref(0);
const user = reactive({ name: 'Ada', role: 'admin' });

function increment() {
  count.value += 1;
  user.role = 'editor';
}
</script>

<template>
  <p>{{ count }}</p>
  <p>{{ user.name }} - {{ user.role }}</p>
</template>
```

- `ref` wraps primitive values with `.value`.
- `reactive` makes an object reactive directly.

## Pitfalls

- Destructuring reactive objects breaks reactivity unless you use `toRefs`.
- Avoid mutating props; create local state if needed.

## Practical Guidance

- Use `ref` for primitives, `reactive` for objects.
- Keep state minimal and derived values in computed properties.
