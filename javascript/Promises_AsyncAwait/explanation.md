# Promises and Async/Await in JavaScript - Comprehensive Study Guide

## Introduction

Promises and async/await are essential for handling asynchronous operations in JavaScript. Promises provide a cleaner way to handle callbacks, while async/await makes asynchronous code look synchronous.

## Promises

A promise represents the eventual completion or failure of an asynchronous operation. It can be in one of three states: pending, fulfilled, or rejected.

### Creating Promises

```javascript
const promise = new Promise((resolve, reject) => {
  // Asynchronous operation
  setTimeout(() => {
    const success = Math.random() > 0.5;
    if (success) {
      resolve('Operation successful');
    } else {
      reject(new Error('Operation failed'));
    }
  }, 1000);
});
```

### Consuming Promises

```javascript
promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('Operation complete'));
```

## Promise States

- **Pending**: Initial state, neither fulfilled nor rejected.
- **Fulfilled**: Operation completed successfully.
- **Rejected**: Operation failed.

Once settled (fulfilled or rejected), a promise cannot change state.

## Chaining Promises

Promises can be chained to handle sequential asynchronous operations.

```javascript
fetch('https://api.example.com/user')
  .then(response => {
    if (!response.ok) throw new Error('Network error');
    return response.json();
  })
  .then(user => {
    console.log('User:', user);
    return fetch(`https://api.example.com/posts/${user.id}`);
  })
  .then(response => response.json())
  .then(posts => console.log('Posts:', posts))
  .catch(error => console.error('Error:', error));
```

Each `.then()` returns a new promise, allowing chaining.

## Promise Methods

### `Promise.all()`

Waits for all promises to resolve or any to reject.

```javascript
const promises = [
  fetch('/api/user'),
  fetch('/api/posts'),
  fetch('/api/comments')
];

Promise.all(promises)
  .then(results => {
    console.log('All results:', results.map(r => r.status));
  })
  .catch(error => console.log('One failed:', error));
```

If one rejects, the whole `Promise.all` rejects.

### `Promise.race()`

Resolves or rejects as soon as one promise settles.

```javascript
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 5000)
);

Promise.race([fetch('/api/data'), timeout])
  .then(result => console.log('Result:', result))
  .catch(error => console.log('Error or timeout:', error));
```

### `Promise.allSettled()`

Waits for all promises to settle (resolve or reject).

```javascript
Promise.allSettled([promise1, promise2, promise3])
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log('Fulfilled:', result.value);
      } else {
        console.log('Rejected:', result.reason);
      }
    });
  });
```

### `Promise.any()`

Resolves when any promise resolves, rejects only if all reject.

```javascript
Promise.any([promise1, promise2, promise3])
  .then(result => console.log('First resolved:', result))
  .catch(error => console.log('All rejected:', error));
```

## Async/Await

Async/await is syntactic sugar over promises, making asynchronous code look synchronous.

### Basic Usage

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Async Function Rules

- Functions declared with `async` return a promise.
- `await` can only be used inside `async` functions.
- `await` pauses execution until the promise resolves.

```javascript
async function example() {
  const result = await Promise.resolve('Hello');
  console.log(result); // Hello
  return 'Done';
}

example().then(result => console.log(result)); // Done
```

### Error Handling

There are several ways to handle errors in promises, depending on whether you're using promise chains or async/await.

#### With Promises

##### 1. Chaining `.catch()`

Attach a `.catch()` at the end of a promise chain to handle any rejection in the chain.

```javascript
fetch('/api/data')
  .then(response => {
    if (!response.ok) throw new Error('HTTP error');
    return response.json(); 
  })
  .then(data => console.log(data))
  .catch(error => console.error('Fetch failed:', error));
```

This catches errors from any `.then()` in the chain.

##### 2. Using `.then()` with a second error callback

The `.then()` method can take two arguments: the first for success, the second for error handling.

```javascript
fetch('/api/data')
  .then(
    response => {
      if (!response.ok) throw new Error('HTTP error');
      return response.json();
    },
    error => console.error('Network error:', error)  // Error callback
  )
  .then(data => console.log(data))
  .catch(error => console.error('Other error:', error));  // Catches errors from second .then()
```

The second argument handles rejections from the previous promise, but subsequent `.then()` errors still need `.catch()`.

#### With Async/Await

Use `try/catch` with async/await:

```javascript
async function fetchWithError() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('HTTP error');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error; // Re-throw if needed
  }
}
```

This is the most readable for complex async logic, as it mimics synchronous error handling.

### Concurrent Operations

```javascript
async function fetchMultiple() {
  const [user, posts] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json())
  ]);
  console.log(user, posts);
}
```

Before promises, you would typically use callbacks plus a small "join" to wait for both requests to finish. The idea is to start both requests, track how many are still pending, and handle the first error immediately.

```javascript
function fetchJson(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        cb(null, JSON.parse(xhr.responseText));
      } catch (e) {
        cb(e);
      }
    } else {
      cb(new Error('Request failed: ' + xhr.status));
    }
  };
  xhr.send();
}

function fetchMultiple() {
  var user, posts, pending = 2, failed = false;

  function done(err) {
    if (failed) return;
    if (err) {
      failed = true;
      console.error(err);
      return;
    }
    if (--pending === 0) console.log(user, posts);
  }

  fetchJson('/api/user', function (err, data) {
    user = data;
    done(err);
  });

  fetchJson('/api/posts', function (err, data) {
    posts = data;
    done(err);
  });
}
```

## Generators

Generators are special functions that can be paused and resumed, allowing them to produce a sequence of values over time. They are defined using `function*` and use `yield` to pause execution.

### Basic Generator Example

```javascript
function* simpleGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

You can also pass a value into the generator with `next(value)`. That value becomes the result of the last paused `yield` expression.

```javascript
function* greeter() {
  const name = yield 'What is your name?';
  yield 'Hello ' + name + '!';
}

const g = greeter();
console.log(g.next().value);        // "What is your name?"
console.log(g.next('Luis').value);  // "Hello Luis!"
```

### Generators and Promises

Promises are not directly based on generators; they are separate ES6 features introduced to handle asynchronous operations. However, generators can be combined with promises for advanced async patterns, such as yielding promises within a generator.

Async/await, which is syntactic sugar over promises, internally uses generator-like behavior to pause and resume execution, making asynchronous code appear synchronous.

## Comparison: Promises vs Callbacks

### Callbacks (old way)

```javascript
function fetchData(callback) {
  setTimeout(() => {
    callback(null, 'Data');
  }, 1000);
}

fetchData((error, data) => {
  if (error) console.error(error);
  else console.log(data);
});
```

Problems: Callback hell, error handling, inversion of control.

#### Callback Hell Example

```javascript
// Nested callbacks leading to callback hell
getUser(userId, (userError, user) => {
  if (userError) {
    console.error(userError);
    return;
  }
  getPosts(user.id, (postsError, posts) => {
    if (postsError) {
      console.error(postsError);
      return;
    }
    getComments(posts[0].id, (commentsError, comments) => {
      if (commentsError) {
        console.error(commentsError);
        return;
      }
      console.log('User:', user, 'Posts:', posts, 'Comments:', comments);
    });
  });
});
```

This illustrates the "pyramid of doom" where callbacks are deeply nested, making code hard to read and maintain.

Real-life style helpers that fetch each resource without promises (XHR):

```javascript
function requestJson(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        cb(null, JSON.parse(xhr.responseText));
      } catch (e) {
        cb(e);
      }
    } else {
      cb(new Error('Request failed: ' + xhr.status));
    }
  };
  xhr.send();
}

function getUser(userId, cb) {
  requestJson('/api/users/' + userId, cb);
}

function getPosts(userId, cb) {
  requestJson('/api/users/' + userId + '/posts', cb);
}

function getComments(postId, cb) {
  requestJson('/api/posts/' + postId + '/comments', cb);
}
```

Example call:

```javascript
const userId = 42;

function handleUser(userError, user) {
  if (userError) {
    console.error(userError);
    return;
  }
  getPosts(user.id, (postsError, posts) => {
    if (postsError) {
      console.error(postsError);
      return;
    }
    getComments(posts[0].id, (commentsError, comments) => {
      if (commentsError) {
        console.error(commentsError);
        return;
      }
      console.log('User:', user, 'Posts:', posts, 'Comments:', comments);
    });
  });
}

getUser(userId, handleUser);
```

### Promises

```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('Data'), 1000);
  });
}

fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

Promise version of the nested callback flow:

```javascript
function getUser(userId) {
  return fetch('/api/users/' + userId)
    .then(r => r.json())
    .catch(error => {
      console.error('getUser failed:', error);
      throw error;
    });
}

function getPosts(userId) {
  return fetch('/api/users/' + userId + '/posts')
    .then(r => r.json())
    .catch(error => {
      console.error('getPosts failed:', error);
      throw error;
    });
}

function getComments(postId) {
  return fetch('/api/posts/' + postId + '/comments')
    .then(r => r.json())
    .catch(error => {
      console.error('getComments failed:', error);
      throw error;
    });
}

const userId = 42;

getUser(userId)
  .then(user => {
    return getPosts(user.id).then(posts => ({ user, posts }));
  })
  .then(({ user, posts }) => {
    return getComments(posts[0].id).then(comments => ({ user, posts, comments }));
  })
  .then(({ user, posts, comments }) => {
    console.log('User:', user, 'Posts:', posts, 'Comments:', comments);
  })
  .catch(error => console.error('Error:', error));
```

Each `.then` callback receives the resolved value from the previous step. The first `.then` receives `user` from `getUser`. It returns a new promise that resolves to an object containing both `user` and `posts`, so the next `.then` destructures that `{ user, posts }`. That second step returns a promise that resolves to `{ user, posts, comments }`, so the final `.then` can access all three values.

**Note:** While `reject` is not explicitly called here (as the operation always succeeds), it's a required parameter in the executor. In real scenarios, call `reject(error)` for failures to properly handle errors.

Better: Chainable, standardized error handling.

### Async/Await

```javascript
async function fetchData() {
  const data = await new Promise(resolve =>
    setTimeout(() => resolve('Data'), 1000)
  );
  console.log(data);
}
```

Async/await version of the same flow (using the promise helpers above):

```javascript
async function loadUserPostsComments(userId) {
  try {
    const user = await getUser(userId);
    const posts = await getPosts(user.id);
    const comments = await getComments(posts[0].id);
    console.log('User:', user, 'Posts:', posts, 'Comments:', comments);
  } catch (error) {
    console.error('Error:', error);
  }
}

loadUserPostsComments(42);
```

Best: Looks synchronous, easy to read and debug.

## Interview Questions and Answers

### 1. What is a promise?

A promise is an object that represents the eventual completion or failure of an asynchronous operation. It allows you to handle asynchronous code in a more manageable way than callbacks, providing methods like `.then()`, `.catch()`, and `.finally()`.

### 2. Explain promise chaining.

Promise chaining allows you to sequence asynchronous operations. Each `.then()` returns a new promise, so you can chain multiple `.then()` calls. This enables handling the result of one async operation as input to the next, with error handling via `.catch()` at the end.

### 3. How does async/await work?

Async/await is syntactic sugar over promises. An `async` function returns a promise, and `await` pauses the function execution until the promise resolves. It makes asynchronous code look synchronous, improving readability and error handling with `try/catch`.

### 4. Difference between promise and callback?

Promises provide a cleaner way to handle asynchronous operations compared to callbacks. Callbacks can lead to "callback hell" with nested functions. Promises allow chaining, better error handling, and composition. Async/await builds on promises for even more readable code.
