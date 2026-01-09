# Vue Fundamentals and Templates

## Introduction

Vue templates are HTML with special directives. They compile to render functions, which keeps templates readable while staying performant.

## Template Syntax

```vue
<template>
  <h1>{{ title }}</h1>
  <p v-if="show">Visible text</p>
  <button @click="toggle">Toggle</button>
</template>

<script setup>
import { ref } from 'vue';

const title = 'Hello Vue';
const show = ref(true);

function toggle() {
  show.value = !show.value;
}
</script>
```

## Directives Basics

- `v-if` / `v-else` for conditional rendering
- `v-for` for lists
- `v-bind` (or `:`) for attributes
- `v-on` (or `@`) for events

## Template Expressions

- Use simple expressions only: `{{ user.name }}`
- Avoid side effects in templates; keep logic in script.

## Practical Guidance

- Keep templates declarative and move complex logic into computed properties.
- Prefer `:class` and `:style` bindings for dynamic styling.
