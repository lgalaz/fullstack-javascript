# Slots and Scoped Slots

## Introduction

Slots let components accept child content. Scoped slots let a child pass data back to the slot content.

## Basic Slot

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <slot />
  </div>
</template>
```

```vue
<Card>
  <h3>Title</h3>
  <p>Body</p>
</Card>
```

## Scoped Slot

```vue
<!-- UserList.vue -->
<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      <slot :user="user" />
    </li>
  </ul>
</template>
```

```vue
<UserList :users="users">
  <template #default="{ user }">
    <strong>{{ user.name }}</strong>
  </template>
</UserList>
```

## Practical Guidance

- Use slots to make components flexible without extra props.
- Prefer scoped slots when parents need to control rendering.
