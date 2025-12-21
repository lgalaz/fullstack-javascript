# Error Handling in JavaScript - Comprehensive Study Guide

## Introduction

Error handling is crucial for robust JavaScript applications. JavaScript has various types of errors and multiple ways to handle them, depending on whether operations are synchronous or asynchronous.

## Types of Errors

### Built-in Error Types

- **Error**: Generic error
- **SyntaxError**: Invalid syntax
- **ReferenceError**: Accessing undefined variable
- **TypeError**: Operation on wrong type
- **RangeError**: Number out of range
- **URIError**: Invalid URI
- **EvalError**: Error in eval() (deprecated)

```javascript
try {
  undefinedVar; // ReferenceError
} catch (e) {
  console.log(e.name); // ReferenceError
}

try {
  null.f(); // TypeError
} catch (e) {
  console.log(e.name); // TypeError
}
```

## Synchronous Error Handling: Try/Catch/Finally

### Basic Try/Catch

```javascript
try {
  // Code that might throw
  riskyOperation();
} catch (error) {
  // Handle the error
  console.error('Error occurred:', error.message);
} finally {
  // Always executes
  console.log('Cleanup code');
}
```

### Nested Try/Catch

```javascript
try {
  try {
    throw new Error('Inner error');
  } catch (innerError) {
    console.log('Inner catch:', innerError.message);
    throw innerError; // Re-throw
  }
} catch (outerError) {
  console.log('Outer catch:', outerError.message);
}
```

### Finally Block

Always executes, regardless of whether an error occurred or not.

```javascript
function example() {
  try {
    if (Math.random() > 0.5) {
      return 'early return';
    }
    throw new Error('Something wrong');
  } catch (e) {
    console.error(e);
  } finally {
    console.log('Finally always runs');
  }
}
```

## Asynchronous Error Handling

### Promises

Use `.catch()` for promise chains:

```javascript
fetchData()
  .then(result => processData(result))
  .then(final => console.log(final))
  .catch(error => {
    console.error('Promise chain error:', error);
    // Handle error
  });
```

Unhandled promise rejections:

```javascript
// In Node.js
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// In browsers
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

### Async/Await

Use try/catch with async functions:

```javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error; // Re-throw to caller
  }
}
```

## Custom Errors

Create custom error classes for better error categorization:

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

// Usage
function validateEmail(email) {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format', 'email');
  }
}

try {
  validateEmail('invalid-email');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Validation failed for ${error.field}: ${error.message}`);
  }
}
```

## Error Handling Best Practices

### Don't Catch Everything

Be specific about what errors to catch:

```javascript
// Bad
try {
  doSomething();
} catch (e) {
  console.log('Something went wrong');
}

// Better
try {
  doSomething();
} catch (e) {
  if (e instanceof TypeError) {
    handleTypeError(e);
  } else if (e instanceof NetworkError) {
    handleNetworkError(e);
  } else {
    throw e; // Re-throw unknown errors
  }
}
```

### Async Error Patterns

```javascript
// Pattern 1: Early return
async function processData(data) {
  if (!data) {
    throw new ValidationError('Data is required');
  }
  // Process data
}

// Pattern 2: Centralized error handling
app.use((error, req, res, next) => {
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Logging and Monitoring

Always log errors for debugging:

```javascript
try {
  riskyOperation();
} catch (error) {
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  // Send to error reporting service
  reportError(error); // Custom function - implement based on your service
}
```

**Note**: `reportError` is not a built-in JavaScript function. It's a placeholder for your error reporting service (e.g., Sentry, Rollbar, Bugsnag). You'd implement it to send errors to your monitoring platform.

## Common Pitfalls

### Swallowing Errors

```javascript
// Bad: Silently ignores errors
try {
  doSomething();
} catch (e) {
  // Do nothing
}
```

### Not Handling Promise Rejections

```javascript
// Bad: Unhandled promise rejection
asyncFunction().then(result => {
  // Handle success
});
// No .catch() - rejection goes unnoticed
```

### Throwing Non-Errors

```javascript
// Bad - technically works but not recommended
throw 'error message';

// Good - proper Error object with stack trace
throw new Error('error message');
```

**Why the first works but is bad**: JavaScript allows throwing any value (strings, numbers, objects), and `catch` blocks will receive it. However, this creates problems: no stack trace, inconsistent error handling, and issues with error reporting tools that expect Error objects. Always use `new Error()` for proper error objects.

## Interview Questions and Answers

### 1. How to handle errors in async code.

For promises, use `.catch()` on the promise chain. For async/await, wrap in try/catch blocks. Always handle potential rejections to avoid unhandled promise rejections. Use finally for cleanup in both cases.

### 2. Difference between throw and return.

`throw` interrupts execution and passes control to the nearest catch block, propagating up the call stack. `return` exits the current function normally, returning a value to the caller. Throw is for exceptional conditions, return for normal flow.

### 3. What is finally used for?

The `finally` block executes regardless of whether an error occurred or not. It's typically used for cleanup operations like closing files, releasing resources, or resetting state that must happen in both success and error cases.