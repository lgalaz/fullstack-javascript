# Security Headers 

## Introduction

Security headers reduce common web vulnerabilities like XSS (injected scripts) and clickjacking (tricking users into clicking hidden UI). Next.js can set headers globally or per route.

## next.config.js Headers

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' }
        ]
      }
    ];
  }
};
```

## Content Security Policy (CSP)

CSP is stricter and often requires nonces. A nonce is a unique, per-request token you add to both the CSP header and specific `<script>` tags, allowing only those inline scripts to run while keeping other inline scripts blocked. CSP is commonly set in middleware.

```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const nonce = crypto.randomUUID();
  const response = NextResponse.next();
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'nonce-${nonce}'`
  );
  response.headers.set('x-nonce', nonce);
  return response;
}
```

Example: use the nonce on inline scripts that must run.

```html
<script nonce="NONCE_FROM_HEADER">window.__BOOTSTRAP__ = {};</script>
```

Bad practice: using an overly permissive CSP.

```javascript
response.headers.set('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval'");
```

Note: `'unsafe-inline'` allows any inline script to execute, and `'unsafe-eval'` allows `eval()`/`new Function()`-style execution. Both reduce CSP to a much weaker protection against XSS.

## Interview Questions and Answers

### 1. Why are security headers important?

They mitigate common web attacks and data leaks:
- XSS (cross-site scripting): injected scripts run in the user's browser.
- Clickjacking: hidden iframes trick users into clicking.
- MIME sniffing: browsers misinterpret file types and execute unsafe content.
- Mixed content: insecure HTTP assets on HTTPS pages.
- Data exfiltration: overly broad resource loading or `connect-src` leaks.
- Referrer leakage: sensitive URLs sent in the `Referer` header.

### 2. Where can you set headers in Next.js?

In `next.config.js`, route handlers, or middleware.
