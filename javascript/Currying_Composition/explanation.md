# Currying and Function Composition 

## Introduction

Currying and function composition are advanced functional programming techniques that enable more modular and reusable code.

## Currying

Currying is the process of transforming a function that takes multiple arguments into a sequence of functions that each take a single argument.

### Basic Example

```javascript
// Regular function
function add(a, b, c) {

  return a + b + c;
}

// Curried version
const curriedAdd = a => b => c => a + b + c;

// Usage
const add5 = curriedAdd(5);
const add5And3 = add5(3);
const result = add5And3(2); // 10
```

### Benefits

- **Partial application**: Allows fixing some arguments of a function to create a new function with fewer parameters, enabling code reuse and specialization.
  ```javascript
  const multiply = (a, b, c) => a * b * c;
  const curriedMultiply = a => b => c => a * b * c;
  const double = curriedMultiply(2);
  const doubleAndTriple = double(3);
  console.log(doubleAndTriple(4)); // 24
  ```

- **Delayed evaluation**: Functions can be partially applied and stored for later execution, allowing for lazy evaluation and better control over when computations occur.
  ```javascript
  const fetchWithAuth = token => url =>
    fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  const apiFetch = fetchWithAuth(process.env.API_TOKEN);
  // Later...
  apiFetch('/api/projects').then(res => res.json());
  ```

- **More flexible function composition**: Curried functions integrate seamlessly with composition techniques, making it easier to build complex functions from simpler ones.
  ```javascript
  const compose = (f, g) => x => f(g(x));
  const add = x => x + 1;
  const multiply = x => x * 2;
  const curriedAdd = a => b => a + b;
  const addTwo = curriedAdd(2); // Curried for composition
  const composed = compose(multiply, addTwo);
  console.log(composed(3)); // 10 (multiply(addTwo(3)) = 2 * (3 + 2))
  ```

### Implementation

```javascript
const curry = (fn) => {

  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...args2) {

        return curried.apply(this, args.concat(args2));
      };
    }
  };
};
```

This `curry` function creates a curried version of any given function `fn`. It works by:

1. Returning an inner function `curried` that collects arguments using rest parameters (`...args`).
2. Checking if enough arguments have been collected (`args.length >= fn.length`):
   - If yes, it calls the original function `fn` with all arguments using `fn.apply(this, args)`.
   - If not, it returns another function that collects more arguments (`...args2`), concatenates them with the existing ones, and recursively calls `curried` with the combined arguments.
3. This process repeats until all required arguments are provided, enabling partial application.

**Note on recursion timing**: In this pattern, recursion is postponed until the next invocation. The returned `(...args2) => curried(...args, ...args2)` does not call `curried` immediately; it returns a new function that will call `curried` later when enough arguments have been supplied to satisfy the original function's arity. That means the curried function can be called multiple times until `args.length >= fn.length`. Recursion here simply means a function calls itself (directly or indirectly) to continue the process.


### Advanced Currying

#### Infinite Currying

```javascript
function infiniteAdd(a) {

  return function(b) {
    if (b !== undefined) {
      return infiniteAdd(a + b);
    }

    return a;
  };
}

const result = infiniteAdd(1)(2)(3)(4)(); // 10
```

#### Real-World Example: E-commerce Cart Total

Infinite currying can be useful in e-commerce for calculating running totals, such as adding item prices to a shopping cart dynamically. Here's an example:

```javascript
function addToCart(total = 0) {

  return function(price) {
    if (price !== undefined) {
      return addToCart(total + price);
    }

    return total;
  };
}

// Usage: Add items one by one, then call with no argument to get total
const cart = addToCart(); // Start with empty cart
const afterShirt = cart(25); // Add shirt for $25
const afterPants = afterShirt(50); // Add pants for $50
const afterShoes = afterPants(80); // Add shoes for $80
const finalTotal = afterShoes(); // Get total: 155

console.log(finalTotal); // 155
```

This pattern allows users to build up a cart total incrementally, and the final call with no arguments computes the sum. It's particularly useful in interactive UIs where items are added dynamically.

#### Currying with Placeholders

```javascript
const curry = (fn, arity = fn.length) => {

  return function curried(...args) {
    const remaining = arity - args.length;
    if (remaining <= 0) {
      return fn.apply(this, args);
    }

    return (...moreArgs) => curried(...args, ...moreArgs);
  };
};
```

**Note on `fn.length`**: All functions have a `length` property, but it only counts parameters before the first default or rest parameter. That can make it smaller than the "real" arity you want to curry, so you may need to pass `arity` explicitly.

```javascript
const withRest = (...args) => args.join(',');
withRest.length; // 0

const withDefault = (a, b = 1, c) => [a, b, c];
withDefault.length; // 1 (stops counting at the first default)

const withOptional = (a, b, c) => [a, b, c];
withOptional.length; // 3 (even if you call it with fewer args)

const curriedRest = curry(withRest, 2);
const curriedDefault = curry(withDefault, 3);
const curriedOptional = curry(withOptional, 3);

// arity controls how many arguments must be collected before invoking
curriedRest('hello'); // returns a function (1/2 collected)
curriedRest('hello')('my'); // "hello,my" (2/2 collected, now runs)
```

## Function Composition

Function composition is the process of combining two or more functions to produce a new function.

### Basic Example

```javascript
const add = x => x + 1;
const multiply = x => x * 2;

// Manual composition
const addThenMultiply = x => multiply(add(x));

// Using compose function
const compose = (f, g) => x => f(g(x));
const composed = compose(multiply, add);
console.log(composed(3)); // 8 ( (3+1)*2 )
```

### Right-to-Left Composition

```javascript
const pipe = (f, g) => x => g(f(x)); // Left-to-right
const piped = pipe(add, multiply);
console.log(piped(3)); // 8 ( 2*(3+1) )
```

### Multiple Functions

```javascript
const composeMultiple = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
const pipeMultiple = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);
```

**Explanation of `reduce` and `reduceRight`**:

- **`reduce`**: A method on arrays that iterates from left to right, applying a callback function to accumulate a single value. It takes an initial value and combines array elements step by step. For example: `[1,2,3].reduce((sum, num) => sum + num, 0)` returns `6`.

- **`reduceRight`**: Similar to `reduce`, but iterates from right to left. For example: `[1,2,3].reduceRight((acc, num) => acc - num, 0)` would compute `3-2-1-0 = 0`.

In `composeMultiple`, `reduceRight` applies functions from the last to the first (right-to-left composition). In `pipeMultiple`, `reduce` applies them from first to last (left-to-right piping). Both accumulate the result by passing the output of one function as input to the next.
For unary functions, you can think of `compose` as `reduceRight` and `pipe` as `reduce` over a list of functions.

### Point-Free Style

```javascript
// Helper functions
const compose = (f, g) => x => f(g(x));
const join = separator => array => array.join(separator);
const props = keys => obj => keys.map(key => obj[key]);

// Not point-free
const getFullName = user => `${user.firstName} ${user.lastName}`;

// Point-free
const getFullNamePointFree = compose(
  join(' '),
  props(['firstName', 'lastName'])
);

console.log(getFullNamePointFree({ firstName: 'John', lastName: 'Doe' })); // 'John Doe'
```

**Point-free style** (also called tacit programming) is a functional programming approach where functions are defined without explicitly naming their arguments. Instead of writing `f(x) => ...`, you compose existing functions to create new ones. This leads to more concise, reusable code that focuses on function composition rather than data manipulation. In the example above, `getFullNamePointFree` is created by composing `join` and `props` without mentioning the `user` parameter directly.

Here, `join(' ')` is a function that joins an array of strings with a space, and `props(['firstName', 'lastName'])` extracts the specified properties from an object as an array. When composed, `props` first extracts `['firstName', 'lastName']` from the user object, then `join` combines them with a space.

## Real-World Use Cases

### Middleware in Express.js

```javascript
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

const middleware = compose(
  logger,
  auth,
  bodyParser
);

app.use(middleware);
```

### Data Transformation Pipelines

```javascript
const validateData = data => {
  if (!data || !data.name) {
    throw new Error('Missing required field: name');
  }

  return data;
};

const normalizeData = data => ({
  ...data,
  name: data.name.trim(),
  email: data.email ? data.email.trim().toLowerCase() : undefined
});

const enrichData = data => ({
  ...data,
  fullName: data.lastName ? `${data.name} ${data.lastName}` : data.name,
  isActive: Boolean(data.lastLoginAt)
});

const formatData = data => ({
  id: data.id,
  name: data.fullName,
  email: data.email,
  isActive: data.isActive
});

const processData = pipe(
  validateData,
  normalizeData,
  enrichData,
  formatData
);

const result = processData(rawData);
```

### Redux Action Creators

```javascript
const curry = (fn) => {

  return function curried(...args) {

    return args.length >= fn.length ?
      fn.apply(this, args) :
      (...more) => curried(...args, ...more);
  };
};

const createAction = curry((type, payload) => ({ type, payload }));

const setUser = createAction('SET_USER');
const action = setUser({ id: 1, name: 'Alice' });

// Step-by-step (expanded):
// 1) createAction returns a curried function.
// 2) createAction('SET_USER') collects the first arg and returns a new function.
// 3) That new function receives the payload and invokes the original fn.
// const createAction = curry((type, payload) => ({ type, payload }));
// const step1 = createAction('SET_USER'); // args = ['SET_USER']
// const step1_1 = (args.length >= fn.length)
//   ? fn.apply(this, args)
//   : (...more) => curried(...args, ...more);
// // args.length is 1 (only 'SET_USER'), which is not >= fn.length (2),
// // so it returns the (...more) function. That function will later call
// // curried again with the existing args plus any new args from ...more.
// const step2 = step1({ id: 1, name: 'Alice' }); // args = ['SET_USER', {..}]
// // args.length >= fn.length, so it runs: fn.apply(this, args)
// // Result: { type: 'SET_USER', payload: { id: 1, name: 'Alice' } }
```

## Performance Considerations

- Currying creates closure chains, which can impact memory. Each partial application returns a new function that closes over the arguments collected so far; long chains mean more small functions and retained data that can increase memory usage.
- Deep composition might be harder to debug
- Consider the trade-off between flexibility and performance

## Libraries

- **Ramda**: Functional programming library with built-in curry and compose
- **Lodash**: Has curry and flow (pipe) functions

```javascript
import { curry, compose } from 'ramda';

const curriedAdd = curry((a, b, c) => a + b + c);
const add5 = curriedAdd(5);
const add5And3 = add5(3);
const result = add5And3(2); // 10

const inc = x => x + 1;
const double = x => x * 2;
const addThenDouble = compose(double, inc);
const composedResult = addThenDouble(3); // 8
```

```javascript
import { flow, flowRight } from 'lodash';

const add1 = x => x + 1;
const double = x => x * 2;

const leftToRight = flow(add1, double); // pipe-style
const rightToLeft = flowRight(double, add1); // compose-style

leftToRight(3); // 8
rightToLeft(3); // 8
```

## Interview Questions and Answers

### 1. What is currying and why is it useful?

Currying transforms a multi-argument function into a sequence of single-argument functions. It's useful for partial application, creating specialized functions from general ones, and enabling function composition. It allows for more flexible and reusable code.

### 2. Explain function composition with an example.

Function composition combines functions to create a new function. For example, `compose(f, g)(x)` is equivalent to `f(g(x))`. It allows building complex operations from simple functions, promoting modularity and reusability.

### 3. What's the difference between `compose` and `pipe`?

`compose` applies functions right-to-left: `compose(f, g, h)(x)` = `f(g(h(x)))`. `pipe` applies left-to-right: `pipe(f, g, h)(x)` = `h(g(f(x)))`. `pipe` is more intuitive for reading data flow.

### 4. How would you implement a generic curry function?

```javascript
const curry = (fn, arity = fn.length) => {

  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    }

    return (...moreArgs) => curried(...args, ...moreArgs);
  };
};
```

### 5. Can you show a practical use case for these techniques?

In a data processing pipeline: `const processUser = pipe(validateUser, normalizeUser, saveUser);`. 
Or in React: `const enhance = compose(withRouter, withAuth, withData); const EnhancedComponent = enhance(BaseComponent);`. These patterns create reusable, composable code.
