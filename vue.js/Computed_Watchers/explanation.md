# Computed Properties and Watchers

## Introduction

Computed properties derive values from state and cache the result. Watchers run side effects when data changes.

## Computed

```vue
<script setup>
import { ref, computed } from 'vue';

const first = ref('Ada');
const last = ref('Lovelace');

const fullName = computed(() => `${first.value} ${last.value}`);
</script>

<template>
  <p>{{ fullName }}</p>
</template>
```

## Watch

```vue
<script setup>
import { ref, watch } from 'vue';

const query = ref('');

watch(query, (value) => {
  // perform a side effect, like fetching results
  console.log('search', value);
});
</script>
```

## watchEffect

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const id = ref(1);

watchEffect(() => {
  console.log('fetch for', id.value);
});
</script>
```

## Practical Guidance

- Use computed for derived values used in templates.
- Use watch/watchEffect for side effects (fetching, logging, integration).
- Avoid expensive work directly in templates.
