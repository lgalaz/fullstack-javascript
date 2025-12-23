# Testing Next.js Apps 

## Introduction

Testing in Next.js usually includes unit tests, integration tests, and end-to-end tests.

## Unit and Integration

Use Jest and React Testing Library for component tests.

```javascript
import { render, screen } from '@testing-library/react';

test('renders title', () => {
  render(<h1>Home</h1>);
  expect(screen.getByText('Home')).toBeInTheDocument();
});
```

## API Route Tests

Test route handlers by calling them as functions or using a test server.

```javascript
import { GET } from '@/app/api/users/route';

test('GET users', async () => {
  const res = await GET();
  expect(res.status).toBe(200);
});
```

## E2E Testing

Use Playwright or Cypress for full app flows.

## Mocking Next.js APIs

When testing server components, mock `cookies`, `headers`, or data functions to isolate behavior.

## Interview Questions and Answers

### 1. What should be tested with E2E tests?

Critical user flows like login, checkout, and navigation.

### 2. Why use React Testing Library?

It encourages testing the UI the way users interact with it.
