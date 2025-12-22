# Security Headers - Comprehensive Study Guide

## Introduction

Security headers reduce common web vulnerabilities like XSS and clickjacking. Next.js can set headers globally or per route.

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

CSP is stricter and often requires nonces. It is commonly set in middleware.

## Interview Questions and Answers

### 1. Why are security headers important?

They mitigate attacks like XSS, clickjacking, and MIME sniffing.

### 2. Where can you set headers in Next.js?

In `next.config.js`, route handlers, or middleware.
