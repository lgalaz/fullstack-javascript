# Lists and Keys

## Introduction

Keys help Vue track list items and update the DOM efficiently. Stable keys prevent state bugs when items are reordered.

## Example

```vue
<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>
```

## Practical Guidance

- Always use a stable, unique key (database ID or UUID).
- Avoid using the array index as a key when items can move.
