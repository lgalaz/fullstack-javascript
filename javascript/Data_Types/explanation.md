# JavaScript Data Types 

## Introduction

JavaScript has primitive types and reference types. Primitives are immutable values, while reference types are objects stored by reference.

## Primitive Types

- **string**: text
- **number**: floating point numbers
- **bigint**: arbitrary precision integers
- **boolean**: true/false
- **undefined**: uninitialized value
- **null**: explicit empty value
- **symbol**: unique identifiers

```javascript
const name = 'Ada';
const count = 42;
const big = 9007199254740991n;
const active = true;
let missing;
const empty = null;
const id = Symbol('id');
```

### Symbol

Symbols are unique even if created with the same description. They are often used as non-colliding object keys, which makes them great for metadata you do not want to clash with user-defined keys. Symbols also power built-in protocols like iteration (`Symbol.iterator`) and custom `toString` behavior. In TypeScript, `unique symbol` can create nominal-like types so two values with the same shape are not interchangeable unless they share the same symbol.

```javascript
const a = Symbol('key');
const b = Symbol('key');
console.log(a === b); // false

const obj = { [a]: 'secret' };
```

```javascript
const iterable = {
  items: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => ({
        value: this.items[index++],
        done: index > this.items.length
      })
    };
  }
};

for (const value of iterable) {
  console.log(value); // 1, then 2, then 3
}
```

```ts
const USER_ID: unique symbol = Symbol('USER_ID');
type UserId = typeof USER_ID;

const id: UserId = USER_ID; // ok
// const other: UserId = Symbol('USER_ID'); // error: different symbol
```

In TypeScript, `unique symbol` is a special type that can only be used with a `const` symbol. It tells the type system that this symbol value is a one-of-a-kind identifier, so only that exact symbol can be assigned to `UserId`. The name (`USER_ID`, `MyUserId`, etc.) is just for readability; the uniqueness comes from the symbol value itself, not the variable name.

## Reference Types

- **object**: plain objects, arrays, functions, dates, maps, sets

```javascript
const user = { id: 1, name: 'Ada' };
const list = [1, 2, 3];
const fn = () => {};
```

## typeof Results

```javascript
typeof 'x'; // "string"
typeof 1; // "number"
typeof 1n; // "bigint"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof null; // "object" (historical bug)
typeof Symbol('x'); // "symbol"
typeof {}; // "object"
typeof []; // "object"
typeof (() => {}); // "function"
typeof new Date(); // "object"
typeof new Map();  // "object"
typeof new Set();  // "object"
```

## Interview Questions and Answers

### 1. What are the primitive types in JavaScript?

string, number, bigint, boolean, undefined, null, and symbol.

### 2. Why is `typeof null` equal to "object"?

It is a historical bug that stuck for compatibility. Early JS engines used type tags: a few low bits in a machine word indicated the value type. `null` was represented as the zero pointer (`0x0`), and the "object" tag was also `0`, so the tag bits matched and the check returned `"object"`. A null pointer being `0x0` is a long-standing convention in many systems where address `0` means "no valid object."
