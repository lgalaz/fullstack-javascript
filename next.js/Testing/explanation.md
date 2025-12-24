# Testing Next.js Apps 

## Introduction

Testing in Next.js usually includes unit tests, integration tests, and end-to-end tests.

Unit tests cover individual functions or components. Integration tests cover multiple parts working together. End-to-end tests cover real user flows in a browser.

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

Example: call the handler directly.

```javascript
import { GET } from '@/app/api/users/route';
import { NextRequest } from 'next/server';

test('GET users (direct)', async () => {
  const req = new NextRequest('http://localhost/api/users');
  const res = await GET(req);
  expect(res.status).toBe(200);
});
```

Example: spin up a small test server and hit the route with `fetch`.

```javascript
import http from 'http';
import { GET } from '@/app/api/users/route';
import { NextRequest } from 'next/server';

let server;
let baseUrl;

beforeAll(() => {
  server = http.createServer(async (req, res) => {
    const nextReq = new NextRequest(`http://localhost${req.url}`, {
      method: req.method,
    });
    const nextRes = await GET(nextReq);
    res.statusCode = nextRes.status;
    nextRes.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(await nextRes.text());
  });
  return new Promise(resolve => {
    server.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

afterAll(() => {
  server.close();
});

test('GET users (server)', async () => {
  const res = await fetch(`${baseUrl}/api/users`);
  expect(res.status).toBe(200);
});
```

Bad practice: relying on live external APIs in unit tests.

```javascript
test('GET users', async () => {
  const res = await fetch('https://api.example.com/users');
  expect(res.status).toBe(200);
});
```

## E2E Testing

Use Playwright or Cypress for full app flows.

Example flow with Playwright:

```javascript
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'secret');
  await page.click('button:has-text("Sign in")');
  await expect(page).toHaveURL('/dashboard');
});
```

## Mocking Next.js APIs

When testing server components, mock `cookies`, `headers`, or data functions to isolate behavior.

```javascript
import { cookies } from 'next/headers';
import { getSessionId } from '@/lib/session';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

test('uses session cookie', () => {
  cookies.mockReturnValue(new Map([['session', { value: 'abc' }]]));
  expect(getSessionId()).toBe('abc');
});
```

Example helper under test:

```javascript
// lib/session.js
import { cookies } from 'next/headers';

export function getSessionId() {
  return cookies().get('session')?.value ?? null;
}
```

## Interview Questions and Answers

### 1. What should be tested with E2E tests?

Critical user flows like login, checkout, and navigation.

### 2. Why use React Testing Library?

It encourages testing the UI the way users interact with it by querying the DOM via accessible text/labels/roles and firing realistic events, rather than poking at component internals or implementation details.
