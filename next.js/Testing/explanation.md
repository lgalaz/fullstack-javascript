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

Example: test a client component with React Testing Library.

```javascript
// Counter.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '@/app/Counter';

test('increments on click', () => {
  render(<Counter />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveTextContent('1');
});
```

## Jest config (Next.js)

Use `next/jest` to wire up Next.js config and transforms.

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customConfig = {
  testEnvironment: 'jsdom'
};

module.exports = createJestConfig(customConfig);
```

## React Server Components (RSC) Testing

Server components run on the server and can be tested by calling their data helpers directly or by rendering the output of async functions and asserting on the resulting JSX.

```javascript
// app/users/page.js
export default async function UsersPage() {
  const users = await getUsers();
  return <pre>{JSON.stringify(users, null, 2)}</pre>;
}
```

```javascript
// users.test.js
import UsersPage from '@/app/users/page';

test('users page renders JSON', async () => {
  const element = await UsersPage();
  // Example shape: element.type === 'pre', element.props.children === '[{"id":1,"name":"Ada"}]'
  expect(element.type).toBe('pre');
  expect(element.props.children).toMatch(/^\[/);
});
```

Note: in most cases you test the server-side data functions directly and keep UI tests focused on client components.

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

## Mock Service Worker (MSW)

MSW intercepts `fetch` calls in tests and returns mock responses without hitting the network. Use it for integration tests of components that call APIs.

```javascript
// test/setup-msw.js
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const server = setupServer(
  http.get('https://api.example.com/users', () =>
    HttpResponse.json([{ id: 1, name: 'Ada' }])
  )
);
```

```javascript
// users.test.js
import { server } from './setup-msw';
import { render, screen } from '@testing-library/react';
import UsersList from '@/app/UsersList';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders users from mocked API', async () => {
  render(<UsersList />);
  expect(await screen.findByText('Ada')).toBeInTheDocument();
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

Client routing hooks can be mocked too:

```javascript
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams('q=test')
}));
```

## Interview Questions and Answers

### 1. What should be tested with E2E tests?

Critical user flows like login, checkout, and navigation.

### 2. Why use React Testing Library?

It encourages testing the UI the way users interact with it by querying the DOM via accessible text/labels/roles and firing realistic events, rather than poking at component internals or implementation details.
