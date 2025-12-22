# Testing with React Testing Library - Comprehensive Study Guide

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

## Key Queries

Prefer queries that match how users find elements:

- `getByRole`
- `getByLabelText`
- `getByText`

## Interview Questions and Answers

### 1. What is the main philosophy of RTL?

Test behavior and user interactions, not internal implementation details.

### 2. Why prefer `getByRole`?

It mirrors accessibility roles and results in more robust tests.
