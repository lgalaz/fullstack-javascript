# 'this', bind, call, and apply in JavaScript 

## Introduction

`this` refers to the context in which a function is executed. Its value depends on how the function is called. Understanding `this` is crucial for object-oriented programming and event handling in JavaScript.

## Default Binding

In global scope, `this` refers to the global object (window in browser, global in Node.js).

```javascript
console.log(this); // window (in browser)
function globalFunc() {
  console.log(this); // also window
}
globalFunc();
```

In strict mode:

```javascript
'use strict';
console.log(this); // window
function strictFunc() {
  console.log(this); // undefined
}
strictFunc();
```

In a browser, top-level `this` still points to `window` (unless the script is a module), but inside a regular function called without an explicit receiver, strict mode leaves `this` as `undefined`. An explicit receiver is the object you call a function on (like `obj.method()`), or a manual binding via `call`, `apply`, or `bind`.

```javascript
const obj = {
  name: 'Ada',
  show() {
    console.log(this.name);
  }
};

obj.show();           // explicit receiver: obj
obj.show.call(null);  // explicit receiver: null (strict mode -> this is null)
const f = obj.show;
f();                  // no receiver (strict mode -> this is undefined)
```

In non-strict mode, that last call would default `this` to `window`, which is why strict mode is useful for catching accidental `this` usage.

## Implicit Binding

When a function is called as a method of an object, `this` refers to that object.

```javascript
const obj = {
  name: 'Alice',
  greet() {
    console.log(this.name);
  }
};
obj.greet(); // Alice
```

Nested objects:

```javascript
const parent = {
  name: 'Parent',
  child: {
    name: 'Child',
    greet() {
      console.log(this.name); // Child
    }
  }
};
parent.child.greet();
```

Lost context:

```javascript
const obj = {
  name: 'Alice',
  greet() {
    console.log(this.name);
  }
};
const greetFunc = obj.greet;
greetFunc(); // undefined (default binding)
```

## Explicit Binding: call, apply, bind

### `call`

Calls a function with a given `this` value and arguments provided individually.

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}
const person = { name: 'Bob' };
greet.call(person, 'Hello', '!'); // Hello, Bob!
```

### `apply`

Similar to `call`, but arguments are provided as an array.

```javascript
greet.apply(person, ['Hi', '.']); // Hi, Bob.
```

Use case: When you have arguments as an array.

```javascript
const numbers = [1, 2, 3];
const max = Math.max.apply(null, numbers); // 3
```

Apart from how arguments are passed, `call` and `apply` are the same: both invoke the function immediately and set `this` explicitly. The names reflect that difference: `call` takes a normal argument list, while `apply` "applies" an array (or array-like) of arguments. In modern JS, `call` + spread often replaces `apply`:

```javascript
Math.max.call(null, ...numbers);
```

### `bind`

Returns a new function with `this` bound to the provided value. The new function can be called later.

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const boundGreet = greet.bind(person, 'Hey');
boundGreet('?'); // Hey, Bob?
```

Partial application:

```javascript
const boundGreetHi = greet.bind(person, 'Hi');
boundGreetHi('!'); // Hi, Bob!
```

`bind` can pre-fill arguments in addition to setting `this`, which is why this is partial application: the first argument is fixed to `'Hi'` and the remaining argument is supplied later.

## Arrow Functions

Arrow functions don't have their own `this`; they inherit `this` from the lexical scope (the scope where they are defined).

```javascript
const obj = {
  name: 'Charlie',
  greet: () => console.log(this.name), // inherits from global
  greetRegular() {
    const arrow = () => console.log(this.name); // inherits from obj
    arrow();
  }
};
obj.greet(); // undefined (global this)
obj.greetRegular(); // Charlie
```

Cannot be bound:

```javascript
const arrow = () => console.log(this.name);
const obj = { name: 'Test' };
arrow.bind(obj)(); // still global this
```

Arrow functions capture `this` from the surrounding scope when they are created, so `bind`, `call`, and `apply` have no effect. In this example, `arrow` is created at the top level, so it keeps the top-level `this` forever. If you need a bindable function, use a regular function:

```javascript
function regular() {
  console.log(this.name);
}
regular.bind(obj)(); // Test
```

## Constructor Functions

In constructors, `this` refers to the new instance being created.

```javascript
function Person(name) {
  this.name = name;
  this.greet = function() {
    console.log(`Hello, I'm ${this.name}`);
  };
}
const p = new Person('Dave');
p.greet(); // Hello, I'm Dave
```

Without `new`:

```javascript
// Without `new`, `this` is the global object in non-strict mode.
Person('Eve');
console.log(global.name); // Eve (Node)
// console.log(window.name); // Eve (browser)
// In strict mode, `this` is undefined here and `this.name = ...` would throw.
```

## Edge Cases and Common Pitfalls

- Event handlers: `this` refers to the element.

```javascript
button.addEventListener('click', function() {
  console.log(this); // the button element
});
```

If you use an arrow function here, `this` is lexical and won't be the button. Use the event target instead:

```javascript
button.addEventListener('click', (e) => {
  console.log(e.currentTarget); // the button element
});
```

- Class methods: In classes, methods are not automatically bound.

```javascript
class MyClass {
  constructor() {
    this.name = 'Class';
  }
  greet() {
    console.log(this.name);
  }
}
const instance = new MyClass();
const method = instance.greet;
method(); // undefined (lost context)
```

To keep the context, either bind the method or wrap the call:

```javascript
const boundMethod = instance.greet.bind(instance);
boundMethod(); // Class
```

```javascript
const method2 = () => instance.greet();
method2(); // Class
```

## Interview Questions and Answers

### 1. What is `this` in JavaScript?

`this` is a keyword that refers to the context object in which a function is executed. Its value is determined by how the function is called, not where it's defined.

### 2. Explain the different ways `this` can be bound.

- **Default binding**: `this` is the global object or undefined in strict mode.
- **Implicit binding**: When called as an object method, `this` is the object.
- **Explicit binding**: Using `call`, `apply`, or `bind` to set `this`.
- **New binding**: In constructors, `this` is the new instance.
- **Lexical binding**: Arrow functions inherit `this` from their defining scope.

### 3. Difference between `call`, `apply`, and `bind`.

- `call`: Invokes function immediately with specified `this` and individual arguments.
- `apply`: Similar to `call`, but takes arguments as an array.
- `bind`: Returns a new function with `this` bound, doesn't invoke immediately. And can prefill arguments for partial application

### 4. How do arrow functions handle `this`?

Arrow functions don't have their own `this`. They capture `this` from their lexical scope at creation time. This makes them useful for callbacks where you want to preserve the outer context, but they cannot be used as constructors or have their `this` explicitly bound.

### 5. What are arrow functions in JavaScript? How do they differ from regular functions?

Arrow functions are a shorthand syntax for function expressions. They are concise and lexically bind `this`, so they inherit `this` from the surrounding scope rather than being set by how they are called. They also do not have their own `arguments`, `super`, or `new.target`, and they cannot be used as constructors (no `prototype`).

```javascript
const add = (a, b) => a + b;

function regular() {
  console.log(arguments.length);
}

const arrow = () => {
  // No `arguments` object here
};
```

Use arrows for callbacks and short functions; use regular functions when you need dynamic `this` or `arguments`.

### 6. Why does `const method = instance.greet; method();` lose `this`, and how do you fix it?

When you detach a method from its object, you remove the implicit receiver. The formal term is the "receiver" (the object a method is called on), as in `instance.greet()` where `instance` is the receiver. Calling `method()` has no receiver, so `this` becomes `undefined` in strict mode. There isn't a standard "right-hand object" term here. Fix it by calling `instance.greet()`, binding (`instance.greet.bind(instance)`), or wrapping (`() => instance.greet()`).
