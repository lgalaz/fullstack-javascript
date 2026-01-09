# Options API

## Introduction

The Options API organizes code by options like data, methods, computed, and lifecycle hooks. It is straightforward and still common in many Vue codebases.

## Example

```vue
<script>
export default {
  data() {
    return { count: 0 };
  },
  computed: {
    double() {
      return this.count * 2;
    }
  },
  methods: {
    inc() {
      this.count += 1;
    }
  }
};
</script>

<template>
  <p>{{ count }} / {{ double }}</p>
  <button @click="inc">Inc</button>
</template>
```

## When to Use

- Small to medium components.
- Teams that prefer explicit structure over flexible composition.
- Migrating from Vue 2.
