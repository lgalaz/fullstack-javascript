# Immutability, Reference vs Value in JavaScript 

## Introduction

Understanding how JavaScript handles data types is crucial for writing predictable code. JavaScript distinguishes between primitive types (passed by value) and reference types (passed by reference), which affects mutability and how data is copied.

## Primitive Types (Pass by Value)

Primitive types are immutable and passed by value. When you assign a primitive to a variable, you're copying its value.

- **Types**: string, number, boolean, null, undefined, symbol, bigint.

```javascript
let a = 5;
let b = a; // b gets a copy of the value 5
b = 10;    // changing b doesn't affect a
console.log(a); // 5
console.log(b); // 10
```

Primitives are immutable - you can't change their value directly:

```javascript
let str = 'hello';
str[0] = 'H'; // Doesn't work, strings are immutable
console.log(str); // 'hello'

str = str.toUpperCase(); // Creates a new string
console.log(str); // 'HELLO'
```

## Reference Types (Pass by Reference)

Objects, arrays, and functions are reference types. When assigned, they share the same reference in memory.

```javascript
let arr1 = [1, 2, 3];
let arr2 = arr1; // arr2 points to the same array
arr2.push(4);
console.log(arr1); // [1, 2, 3, 4] - arr1 is also modified
console.log(arr2); // [1, 2, 3, 4]
```

Same with objects:

```javascript
let obj1 = { name: 'Alice' };
let obj2 = obj1;
obj2.age = 30;
console.log(obj1); // { name: 'Alice', age: 30 }
```

## Immutability

Immutability means data cannot be changed after creation. JavaScript doesn't have built-in immutability, but we can achieve it through patterns.

### Shallow Immutability

Creates a new object/array but nested references remain mutable.

**Example of nested reference issue:**

```javascript
let original = { a: [1, 2], b: { c: 3 } };
let shallowCopy = { ...original };

shallowCopy.a.push(3); // Modifies the nested array in original!
shallowCopy.b.c = 4;   // Modifies the nested object in original!

console.log(original);  // { a: [1, 2, 3], b: { c: 4 } }
console.log(shallowCopy); // { a: [1, 2, 3], b: { c: 4 } }
```

#### Spread Operator

```javascript
let original = [1, 2, 3];
let copy = [...original]; // shallow copy
copy.push(4);
console.log(original); // [1, 2, 3]
console.log(copy); // [1, 2, 3, 4]
```

For objects:

```javascript
let original = { a: 1, b: 2 };
let copy = { ...original, c: 3 };
console.log(original); // { a: 1, b: 2 }
console.log(copy); // { a: 1, b: 2, c: 3 }
```

#### Object.assign

```javascript
let copy = Object.assign({}, original, { c: 3 });
```

**When to use Object.assign:**
- **Shallow copying**: `Object.assign({}, obj)` creates a shallow copy
- **Merging objects**: Combine properties from multiple sources
- **Immutable updates**: Add/modify properties without mutating original
- **Multiple inheritance**: Mix properties from several objects
- **Fallback for older browsers**: Before spread operator was widely supported

**Example - Merging multiple objects:**

```javascript
let defaults = { theme: 'light', lang: 'en' };
let userPrefs = { theme: 'dark' };
let config = { debug: true };

let finalConfig = Object.assign({}, defaults, userPrefs, config);
// { theme: 'dark', lang: 'en', debug: true }
```

### Deep Immutability

Ensures all nested structures are immutable.

#### JSON.parse(JSON.stringify())

Simple but has limitations (no functions, dates, etc.):

```javascript
let original = { a: [1, 2], b: { c: 3 } };
let deepCopy = JSON.parse(JSON.stringify(original));
deepCopy.a.push(3);
console.log(original.a); // [1, 2]
```

#### Recursive Functions

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    let copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }
}
```

#### Libraries

- Immutable.js
- Immer (creates immutable state with mutable syntax)

```javascript
import produce from 'immer';

let original = { a: [1, 2], b: { c: 3 } };
let newState = produce(original, draft => {
  draft.a.push(3);
  draft.b.c = 4;
});
console.log(original); // unchanged
console.log(newState); // { a: [1, 2, 3], b: { c: 4 } }
```

## When to Use Immutability

- **Redux/Vuex**: State management requires immutable updates.
- **React**: ShouldComponentUpdate optimizations rely on reference equality.
- **Functional Programming**: Pure functions shouldn't mutate inputs.
- **Concurrency**: Prevents race conditions in multi-threaded environments.

## Performance Considerations

- Creating copies has memory and performance costs.
- For large objects, consider structural sharing (sharing unchanged parts).

```javascript
let original = {
  users: {
    alice: { name: 'Alice', age: 30 },
    bob: { name: 'Bob', age: 25 }
  },
  settings: { theme: 'dark' }
};

let updated = {
  ...original,  // Shallow copy root
  users: {
    ...original.users,  // Shallow copy users
    alice: { ...original.users.alice, age: 31 }  // Only copy changed path
  }
};
```

- Libraries like Immutable.js optimize this.

### Types of Copies

In JavaScript, copying objects and arrays can be categorized by depth and technique. Beyond shallow and deep copies, here are the main types and variations:

- **Shallow Copy**: Top-level copy, nested references shared. Methods: spread operator, Object.assign.
- **Deep Copy**: Full recursive copy, no shared references. Methods: JSON.parse/stringify, recursive functions, structuredClone.
- **Structural Sharing**: Hybrid deep copy reusing unchanged parts. Methods: manual spread, Immutable.js/Immer.
- **Other Variations**: Partial deep copy, immutable libraries (e.g., Immutable.js, Immer), reference copy (no copy), frozen copies.

#### Frozen Copies

Object.freeze() creates a shallow frozen copy, preventing additions, deletions, or changes to existing properties. It's useful for protecting configuration objects or constants at runtime, catching accidental mutations in development (especially in strict mode).

```javascript
let config = { theme: 'dark', features: { logging: true } };
let frozenConfig = Object.freeze(config);

frozenConfig.theme = 'light'; // Ignored (no error in non-strict mode)
frozenConfig.newProp = 'value'; // Ignored
delete frozenConfig.features; // Ignored

console.log(frozenConfig); // { theme: 'dark', features: { logging: true } }

// Nested objects are not frozen
frozenConfig.features.logging = false; // Allowed
console.log(frozenConfig.features.logging); // false
```

Why use: Prevents bugs from unintended mutations in shared state. For deep freezing, combine with recursion. In production, it's a lightweight immutability guard without performance overhead of full copies.

## Common Pitfalls

### Accidental Mutation

```javascript
function addItem(arr, item) {
  arr.push(item); // Mutates original array!
  return arr;
}
```

Better:

```javascript
function addItem(arr, item) {
  return [...arr, item];
}
```

### Reference Equality

```javascript
let a = [1, 2];
let b = [1, 2];
console.log(a === b); // false - different references

let c = a;
console.log(a === c); // true - same reference
```

## Interview Questions and Answers

### 1. Difference between pass by value and reference.

Pass by value copies the actual value, so changes to the copy don't affect the original (primitives). Pass by reference copies the memory address, so changes to the copy affect the original (objects/arrays). Primitives are passed by value, reference types by reference.

### 2. How to make objects immutable.

Use spread operator or Object.assign for shallow copies. For deep immutability, use JSON.parse(JSON.stringify()), recursive cloning, or libraries like Immutable.js/Immer. In ES6+, use Object.freeze() for shallow freezing.

### 3. Why are primitives immutable?

Primitives are immutable to ensure predictable behavior and performance. If primitives were mutable, operations like string concatenation would be complex and error-prone. Immutability allows for optimizations like string interning.
