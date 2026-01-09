# Testing with Vue Test Utils

## Introduction

Vue Test Utils (VTU) is the official library for component testing. Combine it with a test runner like Vitest or Jest.

## Basic Test

```javascript
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Counter from './Counter.vue';

describe('Counter', () => {
  it('increments on click', async () => {
    const wrapper = mount(Counter);
    await wrapper.find('button').trigger('click');
    expect(wrapper.text()).toContain('1');
  });
});
```

## Practical Guidance

- Test behavior, not internal implementation details.
- Prefer mounting small units and stubbing heavy child components.
- Use `data-testid` sparingly; prefer accessible selectors.
