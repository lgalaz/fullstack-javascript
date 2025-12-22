# Middleware - Comprehensive Study Guide

## Introduction

Middleware runs before a request is completed. It can rewrite, redirect, or set headers.

## Basic Middleware

```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  if (!request.cookies.get('auth')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
```

## Rewrites vs redirects

`rewrite` serves content from a different path without changing the URL, while `redirect` changes the URL in the browser.

```javascript
return NextResponse.rewrite(new URL('/maintenance', request.url));
```

## Matchers

```javascript
export const config = {
  matcher: ['/dashboard/:path*']
};
```

## Interview Questions and Answers

### 1. What is middleware used for?

Auth checks, rewrites, redirects, and adding headers before a route runs.

### 2. Where does middleware run?

On the edge runtime by default.
