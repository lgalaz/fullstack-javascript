# Directives

## Introduction

Directives are special attributes that apply reactive behavior to the DOM. Vue includes built-ins like `v-if`, `v-for`, and `v-model`, and you can define custom directives for low-level DOM logic.

## Built-in Examples

```vue
<template>
  <p v-if="visible">Visible</p>
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  <input v-model="query" />
</template>
```

## Custom Directive

```javascript
// main.js
app.directive('focus', {
  mounted(el) {
    el.focus();
  }
});
```

```vue
<input v-focus />
```

## Practical Guidance

- Use directives for DOM-only concerns (focus, measurements, integration).
- Prefer components for reusable UI logic.
