# Composition API

## Introduction

The Composition API organizes logic by feature instead of by option. It makes reuse and testing easier, especially in large components.

## Basic Example

```vue
<script setup>
import { ref, computed } from 'vue';

const count = ref(0);
const double = computed(() => count.value * 2);
</script>

<template>
  <p>{{ count }} / {{ double }}</p>
</template>
```

## Reusable Logic with Composables

```javascript
// useCounter.js
import { ref } from 'vue';

export function useCounter(initial = 0) {
  const count = ref(initial);
  const inc = () => (count.value += 1);

  return { count, inc };
}
```

```vue
<script setup>
import { useCounter } from './useCounter';

const { count, inc } = useCounter(5);
</script>
```

## Practical Guidance

- Use composables to share stateful logic.
- Keep composables small and focused on one concern.
- Prefer `script setup` for concise component code.
