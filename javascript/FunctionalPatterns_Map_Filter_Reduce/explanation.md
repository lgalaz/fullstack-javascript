# Functional Patterns: Map, Filter, Reduce - Comprehensive Study Guide

## Introduction

Map, filter, and reduce are higher-order functions that operate on arrays, enabling functional programming paradigms in JavaScript. They promote immutability and declarative code.

## Map

The `map` method transforms each element of an array and returns a new array of the same length.

```javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(x => x * 2); // [2, 4, 6, 8]
```

- **Parameters**: Callback function with (element, index, array)

Example using all parameters:

```javascript
const numbers = [10, 20, 30];
const result = numbers.map((element, index, array) => {
  return element + index + array.length;
});
// [13, 24, 35]  // 10+0+3=13, 20+1+3=24, 30+2+3=35
```
- **Return**: New array with transformed elements
- **Immutability**: Original array unchanged

### Advanced Usage

Using index parameter:

```javascript
const items = ['a', 'b', 'c'];
const indexed = items.map((item, index) => `${index}: ${item}`);
// ['0: a', '1: b', '2: c']
```

Having access to the index enables several powerful patterns:

- **Creating numbered lists**: Generate ordered items with sequential numbering
- **Position-based transformations**: Apply different logic based on element position
- **ID generation**: Create unique identifiers based on array position
- **Conditional styling**: Alternate styles or apply different formatting for even/odd indices
- **Mathematical operations**: Use index in calculations (e.g., weighting by position)
- **Grid/matrix creation**: Build 2D structures where row/column depends on index

Example with conditional logic:

```javascript
const items = ['first', 'second', 'third', 'fourth'];
const formatted = items.map((item, index) => 
  index % 2 === 0 ? item.toUpperCase() : item.toLowerCase()
);
// ['FIRST', 'second', 'THIRD', 'fourth']
```

Transforming objects:

```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];
const names = users.map(user => user.name); // ['Alice', 'Bob']
```

## Filter

The `filter` method creates a new array with elements that pass a test implemented by the provided function.

```javascript
const numbers = [1, 2, 3, 4];
const evens = numbers.filter(x => x % 2 === 0); // [2, 4]
```

- **Parameters**: Callback function returning boolean
- **Return**: New array with filtered elements
- **Use Case**: Selecting subsets of data

### Advanced Usage

Complex conditions:

```javascript
const products = [
  { name: 'Apple', price: 1, category: 'fruit' },
  { name: 'Carrot', price: 0.5, category: 'vegetable' },
  { name: 'Banana', price: 0.8, category: 'fruit' }
];

const cheapFruits = products.filter(
  product => product.category === 'fruit' && product.price < 1
);
// [{ name: 'Banana', price: 0.8, category: 'fruit' }]
```

Removing falsy values:

```javascript
const mixed = [0, 1, false, 2, '', 3, null, undefined, 4];
const truthy = mixed.filter(Boolean); // [1, 2, 3, 4]
```

The `Boolean` constructor, when used as a function (not with `new`), converts any value to its boolean equivalent. Falsy values (false, 0, "", null, undefined, NaN) become `false`, while all other values become `true`. This creates a concise way to filter out falsy values from an array.

## Reduce

The `reduce` method executes a reducer function on each element, resulting in a single output value.

```javascript
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((accumulator, current) => accumulator + current, 0); // 10
```

- **Parameters**: Reducer function (accumulator, current, index, array), initial value
- **Return**: Single value
- **Use Case**: Aggregating data, transforming structures

### Advanced Usage

Without initial value (uses first element):

```javascript
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, curr) => acc + curr); // 10
```

Building objects:

```javascript
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana'];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
// { apple: 2, banana: 2, orange: 1 }
```

Flattening arrays:

```javascript
const nested = [[1, 2], [3, 4], [5]];
const flat = nested.reduce((acc, arr) => acc.concat(arr), []);
// [1, 2, 3, 4, 5]
```

## Chaining

These methods can be chained for complex operations.

```javascript
const result = numbers
  .filter(x => x > 2)
  .map(x => x * 3)
  .reduce((acc, x) => acc + x, 0); // 27
```

### Real-world Example

```javascript
const orders = [
  { id: 1, items: [{ price: 10 }, { price: 20 }] },
  { id: 2, items: [{ price: 15 }, { price: 25 }] }
];

const totalRevenue = orders
  .map(order => order.items)
  .reduce((acc, items) => acc.concat(items), [])
  .map(item => item.price)
  .reduce((acc, price) => acc + price, 0);
// 70
```

## Performance Considerations

- `map` and `filter` create new arrays, potentially memory-intensive for large datasets
- `reduce` can be more memory-efficient for aggregations
- For large arrays, consider imperative loops for performance-critical code

## Polyfills and Custom Implementations

### Custom Map

```javascript
Array.prototype.myMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};
```

### Custom Filter

```javascript
Array.prototype.myFilter = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};
```

### Custom Reduce

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
  let accumulator = initialValue !== undefined ? initialValue : this[0];
  let startIndex = initialValue !== undefined ? 0 : 1;

  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }
  return accumulator;
};
```

When no `initialValue` is provided, the first element becomes the accumulator and iteration starts from index 1. This matches the native `reduce` behavior: the callback receives the accumulator (first element) and the current element (starting from the second element).

## Interview Questions and Answers

### 1. Explain the difference between `map`, `filter`, and `reduce`.

`map` transforms each element and returns an array of the same length. `filter` selects elements based on a condition and returns a subset. `reduce` accumulates values into a single result, potentially of any type.

### 2. How do these methods promote functional programming?

They encourage immutability (no mutation of original arrays), pure functions (same input always produces same output), and declarative code (what to do, not how). They enable method chaining and composition.

### 3. Can you implement `map` using `reduce`?

```javascript
Array.prototype.mapWithReduce = function(callback) {
  return this.reduce((acc, curr, index, array) => {
    acc.push(callback(curr, index, array));
    return acc;
  }, []);
};
```

### 4. What are the performance implications of chaining these methods?

Chaining creates intermediate arrays, which can be memory-intensive for large datasets. Each method in the chain allocates a new array. For performance-critical code with large arrays, consider using a single reduce or imperative loops.

**Best Practice Alternatives:**

- **Single reduce approach**: Combine operations into one reduce call to avoid intermediate arrays
- **Imperative loops**: Use traditional for/while loops for maximum performance
- **Early termination**: Break out of loops when possible to avoid unnecessary iterations
- **Chunking**: Process data in smaller batches for very large datasets

**Example - Single reduce instead of chaining:**

```javascript
// Instead of chaining:
const result = numbers
  .filter(x => x > 2)
  .map(x => x * 3)
  .reduce((acc, x) => acc + x, 0);

// Use single reduce:
const optimizedResult = numbers.reduce((acc, x) => {
  if (x > 2) {
    acc += x * 3;
  }
  return acc;
}, 0);
```

**Example - Imperative loop for maximum performance:**

```javascript
function processLargeArray(arr) {
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];
    if (x > 2) {
      result += x * 3;
    }
  }
  return result;
}
```

**Performance Comparison:**
- **Chaining (filter + map + reduce)**: Creates 2 intermediate arrays, multiple iterations
- **Single reduce**: One iteration, no intermediate arrays, similar performance to imperative loop
- **Imperative loop**: One iteration, no intermediate arrays, minimal function call overhead

**Why imperative loops are typically fastest:**
- **Function call overhead**: Reduce/map/filter invoke callback functions on each iteration, while imperative loops execute inline code
- **No abstraction penalty**: Direct array access without method dispatch
- **Better optimization**: JavaScript engines can more effectively optimize simple loops
- **Memory efficiency**: No object creation for callbacks or intermediate results

The imperative loop is typically the fastest, but the performance difference is often negligible for arrays under 10,000 elements. Choose based on code readability and team conventions.