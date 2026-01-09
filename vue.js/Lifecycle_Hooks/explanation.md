# Lifecycle Hooks

## Introduction

Lifecycle hooks let you run code at specific points in a component's life (mount, update, unmount).

## Common Hooks

```vue
<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

onMounted(() => {
  console.log('mounted');
});

onBeforeUnmount(() => {
  console.log('cleanup');
});
</script>
```

## Options API Equivalent

```vue
<script>
export default {
  mounted() {
    console.log('mounted');
  },
  beforeUnmount() {
    console.log('cleanup');
  }
};
</script>
```

## Practical Guidance

- Use hooks for side effects and resource cleanup.
- Avoid heavy work in `mounted` if it blocks rendering.
- Use `onBeforeUnmount` to remove listeners and timers.
