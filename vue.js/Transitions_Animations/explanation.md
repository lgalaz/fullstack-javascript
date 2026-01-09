# Transitions and Animations

## Introduction

Vue provides built-in transition components to animate element entry, exit, and list updates.

## Basic Transition

```vue
<template>
  <button @click="show = !show">Toggle</button>
  <Transition name="fade">
    <p v-if="show">Hello</p>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';

const show = ref(true);
</script>
```

```css
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
```

## List Transitions

```vue
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item.id">{{ item.label }}</li>
</TransitionGroup>
```

## Practical Guidance

- Keep transitions short and subtle.
- Use `TransitionGroup` for list reordering animations.
