# Debounce and Throttle - Comprehensive Study Guide

## Introduction

Debounce and throttle are techniques to control the rate at which functions are executed, particularly useful for optimizing performance in event-driven applications.

## Debounce

Debounce delays the execution of a function until after a specified time has passed since the last time it was invoked. It's useful for scenarios where you want to wait for a pause in activity.

### Implementation

```javascript
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
}
```

### Use Cases

- Search input: Wait for user to stop typing before making API call
- Window resize: Avoid excessive recalculations during resize
- Button clicks: Prevent double-clicks

### Example

```javascript
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

input.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

## Throttle

Throttle limits the execution of a function to once per specified time interval. It's useful when you want to ensure a function runs at most once in a given time frame.

### Implementation

```javascript
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

### Use Cases

- Scroll events: Update UI at most every 100ms during scroll
- Mouse move: Limit mousemove event handlers
- API calls: Rate limit requests

### Example

```javascript
const throttledScroll = throttle(() => {
  console.log('Scroll event');
}, 100);

window.addEventListener('scroll', throttledScroll);
```

## Key Differences

| Aspect | Debounce | Throttle |
|--------|----------|----------|
| Execution | After delay since last call | At most once per interval |
| Use Case | Wait for pause | Regular execution |
| Behavior | Cancels previous calls | Ignores calls during cooldown |

## Advanced Patterns

### Leading Edge Throttle

Executes immediately, then throttles subsequent calls.

```javascript
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function(...args) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}
```

### Debounce with Immediate Execution

```javascript
function debounce(func, delay, immediate = false) {
  let timeoutId;
  return function(...args) {
    const context = this;
    const callNow = immediate && !timeoutId;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) func.apply(context, args);
    }, delay);
    if (callNow) func.apply(context, args);
  };
}
```

## Libraries and Frameworks

### Lodash

```javascript
import { debounce, throttle } from 'lodash';

// Debounce
const debouncedFunc = debounce(func, 300);

// Throttle
const throttledFunc = throttle(func, 100);
```

### React Hooks

```javascript
import { useCallback, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

## Performance Considerations

- Both techniques reduce function calls, improving performance
- Debounce may delay important updates if delay is too long
- Throttle ensures regular updates but may miss rapid changes
- Consider using `requestAnimationFrame` for UI updates instead of setTimeout

**Why `requestAnimationFrame` for UI updates?** `requestAnimationFrame` synchronizes with the browser's refresh cycle (typically 60fps), ensuring UI updates happen at the optimal time before each repaint. Unlike `setTimeout` with a fixed delay, it prevents dropped frames, reduces CPU usage (pauses when tab is hidden), and creates smoother animations. For debounced/throttled UI functions, wrap the update in `requestAnimationFrame` for better performance.

## Common Pitfalls

### Losing `this` Context

```javascript
// Wrong - can lose 'this' if method is extracted and called separately
const obj = {
  value: 42,
  method: debounce(function() {
    console.log(this.value); // 'this' may not be 'obj' if called incorrectly
  }, 300)
};

// Right - explicitly binds 'this' to 'obj'
const obj2 = {
  value: 42,
  method: debounce(function() {
    console.log(this.value); // 'this' is always 'obj2'
  }.bind(obj2), 300)
};
```

**Why the first is "wrong"**: The debounce function preserves `this` when called as `obj.method()`, but if you extract the method (`const m = obj.method; m();`), `this` becomes `window` (or `undefined` in strict mode) because the returned function's `this` is not bound to `obj`. The `.bind(obj2)` ensures `this` is always the correct object, making it safer.

## Memory Leaks

Clear timeouts when components unmount:

```javascript
useEffect(() => {
  const debounced = debounce(handleSearch, 300);
  return () => {
    // Cleanup if needed
  };
}, []);
```

## Real-World Examples

### Auto-save Functionality

```javascript
const autoSave = debounce((content) => {
  saveToServer(content);
}, 1000);

editor.on('change', (content) => {
  autoSave(content);
});
```

### Infinite Scroll

```javascript
const loadMore = throttle(() => {
  if (nearBottom()) {
    fetchNextPage();
  }
}, 200);

window.addEventListener('scroll', loadMore);
```

### Search with Debounce and Throttle

```javascript
const debouncedSearch = debounce((query) => {
  performSearch(query);
}, 300);

const throttledSuggest = throttle((query) => {
  showSuggestions(query);
}, 100);

input.addEventListener('input', (e) => {
  const query = e.target.value;
  debouncedSearch(query);
  throttledSuggest(query);
});
```

## Interview Questions and Answers

### 1. Explain the difference between debounce and throttle.

Debounce delays execution until a pause occurs, canceling previous calls. Throttle limits execution to once per time interval, allowing calls but ignoring them during cooldown. Debounce is for waiting for inactivity, throttle for rate limiting.

### 2. When would you use debounce vs throttle?

Use debounce for search inputs (wait for typing to stop) or window resize (wait for resizing to finish). Use throttle for scroll events (update UI regularly) or mouse move (limit tracking frequency).

### 3. How would you implement debounce from scratch?

```javascript
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
}
```

### 4. What are the performance implications of using these techniques?

They reduce function call frequency, improving performance by preventing excessive computations. However, debounce may delay important updates, and throttle might miss rapid changes. They add memory overhead from closures and timers.

### 5. Can you think of a scenario where both might be needed?

In a search interface: use throttle for showing suggestions (update every 100ms during typing) and debounce for actual search (wait 300ms after typing stops). This provides immediate feedback while preventing excessive API calls.