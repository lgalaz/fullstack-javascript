# TypeScript with Vue

## Introduction

Vue has first-class TypeScript support. `script setup` with typed props and emits is the most ergonomic approach.

## Typed Props and Emits

```vue
<script setup lang="ts">
const props = defineProps<{ id: number; name: string }>();
const emit = defineEmits<{
  (e: 'save', id: number): void;
}>();

function save() {
  emit('save', props.id);
}
</script>
```

## Typed Composables

```typescript
import { ref } from 'vue';

export function useToggle(initial = false) {
  const value = ref<boolean>(initial);
  const toggle = () => (value.value = !value.value);

  return { value, toggle };
}
```

## Practical Guidance

- Use `lang="ts"` in Vue SFCs.
- Prefer typed props and emits to document component contracts.
- Avoid `any` in shared composables.
