# Components, Props, and Events

## Introduction

Components are the building blocks of Vue apps. Props pass data down, events send messages up.

## Props

```vue
<script setup>
defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 }
});
</script>

<template>
  <h2>{{ title }} ({{ count }})</h2>
</template>
```

## Events

```vue
<script setup>
const emit = defineEmits(['save']);

function onClick() {
  emit('save', { time: Date.now() });
}
</script>

<template>
  <button @click="onClick">Save</button>
</template>
```

## Parent Usage

```vue
<ChildCard title="Profile" :count="items" @save="handleSave" />
```

## Practical Guidance

- Keep props immutable; emit events instead of mutating.
- Use `modelValue` + `update:modelValue` for custom v-model bindings.
- Prefer small, focused components with clear input/output.
