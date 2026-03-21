# Testing Node.js Applications

## What matters

- Cover pure logic with unit tests and boundaries with integration tests.
- Node’s built-in `node:test` runner is enough for many projects. A unit test isolates a small piece of logic; an integration test exercises a real boundary such as HTTP or a database.

## Interview points

- Test startup, shutdown, auth, database transactions, retries, and failure paths, not just happy-path helpers.
- Keep tests deterministic: no real internet, no time-based flakiness, no shared global state.
- Use mocks/stubs carefully; too much mocking can hide integration bugs.

## Senior notes

- Coverage is a floor, not proof of quality.
- Contract tests are valuable for APIs and queue/event payloads.
- Treat flaky tests as real defects.

## Example

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');

test('adds numbers', () => {
  assert.equal(2 + 3, 5);
});
```
