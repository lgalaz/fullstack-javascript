# Variable Declarations, Scope, and Hoisting in JavaScript 

## Introduction

In JavaScript, variable declarations are fundamental to understanding how variables are created, accessed, and managed. The introduction of `let` and `const` in ES6 brought significant changes to scoping and hoisting compared to the traditional `var`. This topic covers the differences between `var`, `let`, and `const`, the concepts of scope, and hoisting.

## Variable Declaration Keywords

### `var`

- **Declaration**: Variables declared with `var` are function-scoped or globally scoped.
- **Hoisting**: `var` declarations are hoisted to the top of their scope.
- **Reassignment**: Can be reassigned and redeclared.

Example:

```javascript
function example() {
  console.log(a); // undefined (hoisted)
  var a = 10;
  console.log(a); // 10
}
```

Edge cases:
- Redeclaration allowed: `var a = 1; var a = 2;` is valid.
- No block scope: Variables leak out of blocks.

```javascript
if (true) {
  var x = 'inside';
}
console.log(x); // 'inside'
```

### `let`

- **Declaration**: Block-scoped.
- **Hoisting**: Hoisted but not initialized (Temporal Dead Zone).
- **Reassignment**: Can be reassigned but not redeclared in the same scope.

Example:

```javascript
function example() {
  console.log(a); // ReferenceError: Cannot access 'a' before initialization
  let a = 10;
  console.log(a); // 10
}
```

Edge cases:
- TDZ prevents access before declaration.
- Block scope prevents leakage.

```javascript
if (true) {
  let y = 'inside';
}
console.log(y); // ReferenceError
```

### `const`

- **Declaration**: Block-scoped.
- **Hoisting**: Same as `let`, hoisted but in TDZ.
- **Reassignment**: Cannot be reassigned or redeclared. For objects, properties can be mutated.

Example:

```javascript
const a = 10;
a = 20; // TypeError: Assignment to constant variable
```

For objects:

```javascript
const obj = { name: 'Alice' };
obj.name = 'Bob'; // Allowed
obj = {}; // TypeError
```

Edge cases:
- Must be initialized: `const x;` is invalid.
- Arrays can be modified:

```javascript
const arr = [1, 2, 3];
arr.push(4); // Allowed
arr = [5, 6]; // TypeError
```

### Const and Arrays

`const` prevents reassignment, but you can still mutate the array itself:

```javascript
const arr = [1, 2, 3];
arr.push(4); // Allowed
// arr = [5, 6]; // TypeError

// Replace contents without reassigning
arr.splice(0, arr.length, 5, 6);
console.log(arr); // [5, 6]

// Another option: clear then push
arr.length = 0;
arr.push(7, 8);
console.log(arr); // [7, 8]
```

Note: `slice` returns a new array, so you'd have to reassign the result (which `const` does not allow).

## Destructuring Assignment

Destructuring lets you unpack values from arrays or properties from objects into distinct variables in a single step. It is just syntax for assignment, so it works with `let`, `const`, and reassignment.

### Array Destructuring

```javascript
const coords = [10, 20, 30];
const [x, y] = coords;
console.log(x, y); // 10 20

const [first, , third] = coords; // skip items
console.log(first, third); // 10 30

const [a = 1, b = 2] = [5]; // defaults
console.log(a, b); // 5 2
```

### Object Destructuring

```javascript
const user = { id: 7, name: 'Ada', role: 'admin' };
const { id, name } = user;
console.log(id, name); // 7 Ada

const { role: userRole } = user; // rename
console.log(userRole); // admin

const { missing = 'default' } = user; // default
console.log(missing); // default
```

### Rest and Nested Patterns

```javascript
const [head, ...tail] = [1, 2, 3, 4];
console.log(head, tail); // 1 [2, 3, 4]

const settings = { theme: { mode: 'dark' }, lang: 'en' };
const { theme: { mode } } = settings;
console.log(mode); // dark
```

Why use it: it reduces repetitive property access, makes intent clear, and pairs well with returning multiple values from functions.


## Scope

Scope determines the accessibility of variables.

- **Global Scope**: Variables accessible everywhere.

```javascript
var globalVar = 'global';
function test() {
  console.log(globalVar); // accessible
}
```

- **Function Scope**: Variables accessible within the function.

```javascript
function test() {
  var funcVar = 'function';
  console.log(funcVar); // accessible
}
console.log(funcVar); // ReferenceError
```

- **Block Scope**: Introduced with `let` and `const`, variables accessible within the block `{}`.

Example:

```javascript
if (true) {
  var a = 1; // function or global
  let b = 2; // block
  const c = 3; // block
}
console.log(a); // 1
console.log(b); // ReferenceError
console.log(c); // ReferenceError
```

Nested scopes:

```javascript
function outer() {
  var outerVar = 'outer';
  function inner() {
    var innerVar = 'inner';
    console.log(outerVar); // accessible
    console.log(innerVar); // accessible
  }
  inner();
  console.log(innerVar); // ReferenceError
}
```

## Hoisting

Hoisting is the behavior where variable and function declarations are moved to the top of their scope before code execution.

- `var`: Declaration hoisted, initialization not.

```javascript
console.log(hoistedVar); // undefined
var hoistedVar = 'value';
```

- `let`/`const`: Declaration hoisted, but in TDZ until initialization.

```javascript
console.log(hoistedLet); // ReferenceError
let hoistedLet = 'value';
```

- Functions: Fully hoisted.

```javascript
hoistedFunction(); // Works
function hoistedFunction() { console.log('Hoisted'); }
```

Function expressions:

```javascript
hoistedFunc(); // TypeError: hoistedFunc is not a function
var hoistedFunc = function() { console.log('Not hoisted'); };
```

Why use function expressions:

- Treat functions as values (pass, return, assign).
- Choose implementations at runtime (conditional assignment).
- Avoid accidental hoisting; call sites are more explicit.
- Named expressions can improve stack traces (e.g., `const fn = function doThing() {}`).

Example (conditional assignment):

```javascript
const handler = isAdmin
  ? function () { console.log('Admin mode'); }
  : function () { console.log('User mode'); };
```

Order of hoisting: Function declarations first, then variables.

## Interview Questions and Answers

### 1. What is the difference between `var`, `let`, and `const`?

- `var`: Function-scoped, hoisted with initialization undefined, can be redeclared and reassigned.
- `let`: Block-scoped, hoisted but in TDZ, can be reassigned but not redeclared in same scope.
- `const`: Block-scoped, hoisted in TDZ, cannot be reassigned or redeclared, but object properties can be mutated.

### 2. Explain hoisting with examples.

Hoisting moves declarations to the top of their scope. For `var`, the declaration is hoisted but not the assignment, resulting in `undefined`. For `let`/`const`, the declaration is hoisted but accessing it before initialization throws a ReferenceError due to TDZ. Function declarations are fully hoisted.

### 3. What is the Temporal Dead Zone?

The TDZ is the period between entering a scope and the variable's declaration. During this time, accessing the variable throws a ReferenceError. It applies to `let` and `const` to prevent bugs from hoisting.

### 4. How does scope affect variable accessibility?

Scope defines where variables are accessible. Global scope variables are accessible everywhere. Function scope variables are only accessible within the function. Block scope (with `let`/`const`) limits accessibility to the block, preventing variable leakage and reducing bugs.
