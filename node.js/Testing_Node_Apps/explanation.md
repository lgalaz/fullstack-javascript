# Testing Node.js Applications

## Introduction

Testing ensures correctness and supports refactoring. Node.js includes a built-in test runner (`node:test`) that is fast and dependency-free.

## Example: Unit Test with node:test

```javascript
// math.js
function add(a, b) {
  return a + b;
}

module.exports = { add };
```

```javascript
// math.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { add } = require('./math');

test('add returns the sum', () => {
  assert.equal(add(2, 3), 5);
});
```

Run:

```
node --test
```

## Example: Integration Test for an HTTP Server

```javascript
// server.js
const http = require('http');

function createServer() {
  return http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
  });
}

module.exports = { createServer };
```

```javascript
// server.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { createServer } = require('./server');

test('server responds with ok', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, resolve));
  const { port } = server.address();

  const body = await new Promise(resolve => {
    http.get(`http://localhost:${port}`, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(data));
    });
  });

  server.close();
  assert.equal(body, 'ok');
});
```

## Practical Guidance

- Cover core logic with unit tests and use integration tests for I/O.
- Keep tests deterministic and avoid real network calls when possible.
- Use test doubles (stubs/mocks) for external services.
