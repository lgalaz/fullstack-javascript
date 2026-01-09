# Teleport

## Introduction

Teleport renders a component's DOM outside its parent hierarchy. It is useful for modals, tooltips, and overlays.

## Example

```vue
<template>
  <Teleport to="body">
    <div class="modal">Modal Content</div>
  </Teleport>
</template>
```

## Practical Guidance

- Use Teleport for UI that should escape layout constraints.
- Combine with aria attributes for accessibility.
