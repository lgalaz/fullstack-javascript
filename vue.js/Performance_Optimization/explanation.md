# Performance Optimization

## Introduction

Vue is fast by default, but large apps still need discipline around rendering, data size, and component boundaries.

## Common Techniques

- Use `v-memo` to skip unnecessary re-renders for stable subtrees.
- Use `defineAsyncComponent` for code splitting.
- Keep reactive state minimal; avoid large reactive objects if only parts change.
- Use `shallowRef` or `markRaw` for non-reactive heavy objects.
- Prefer computed properties over inline template expressions.

## Example: v-memo

```vue
<template>
  <div v-memo="[user.id, user.role]">
    {{ user.name }}
  </div>
</template>
```

## Practical Guidance

- Profile with Vue DevTools and browser performance tools.
- Watch for large lists and use virtualization when needed.
- Avoid unnecessary watchers and deep reactivity when not required.
