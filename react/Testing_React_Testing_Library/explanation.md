# Testing with React Testing Library 

## Introduction

React Testing Library (RTL) encourages testing components the way users interact with them, focusing on behavior over implementation.

## Basic Example

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}

test('increments count', async () => {
  render(<Counter />);
  const button = screen.getByRole('button');
  await userEvent.click(button);
  expect(button).toHaveTextContent('Count: 1');
});
```

`toHaveTextContent` matches substrings by default and also accepts regular expressions when you need partial or flexible matching.

## Key Queries

Prefer queries that match how users find elements:

- `getByRole`
- `getByLabelText`
- `getByText`

`getByRole` queries by accessibility role (implicit from the element type or explicit via the `role` attribute) and can be refined with the accessible name (e.g., the button text). `getByLabelText` finds form controls by their associated label, `aria-label`, or `aria-labelledby`. `getByText` matches visible text content.

Example:

```javascript
// <button>Save</button>
screen.getByRole('button', { name: /save/i });
```

Explicit role example:

```javascript
// <div role="alert">Saved</div>
screen.getByRole('alert');
```

Use `findBy*` for async elements and `queryBy*` when asserting absence.

```javascript
const alert = await screen.findByRole('alert');
expect(screen.queryByText('Loading')).toBeNull();
```

`findByRole` waits for the element to appear (async). `queryByText` returns `null` if the element is missing, which is useful when you expect something to be gone.

Example: wait for a success alert, then assert the loading text disappeared.

```javascript
import { render, screen } from '@testing-library/react';

test('shows success after loading', async () => {
  render(<Status />);
  expect(screen.getByText('Loading')).toBeInTheDocument();
  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent('Saved');
  expect(screen.queryByText('Loading')).toBeNull();
});
```

## Async behavior

`userEvent` returns promises for interactions that are async under the hood. Use `await` with click/type to avoid flaky tests.

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('type and submit', async () => {
  render(<Login />);
  await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(screen.getByRole('alert')).toHaveTextContent(/welcome/i);
});
```

## Common Testing Tools

Common unit/integration test runners in React projects include Jest, Vitest, Mocha, and Jasmine. React Testing Library is often used alongside them for component testing.

Common end-to-end testing tools include Cypress, Playwright, WebdriverIO, and Selenium.

## Interview Questions and Answers

### 1. What is the main philosophy of RTL?

Test behavior and user interactions, not internal implementation details.

### 2. Why prefer `getByRole`?

It mirrors accessibility roles and results in more robust tests.
