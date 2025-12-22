# Assets, Images, Fonts, and Scripts - Comprehensive Study Guide

## Introduction

Next.js provides optimized helpers for images, fonts, and scripts.

## Images

Use `next/image` for automatic optimization.

```javascript
import Image from 'next/image';

<Image src="/avatar.png" width={64} height={64} alt="Avatar" />
```

## Fonts

Use `next/font` for self-hosted, optimized fonts.

```javascript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }) {
  return <body className={inter.className}>{children}</body>;
}
```

## Scripts

Use `next/script` to control script loading strategy.

```javascript
import Script from 'next/script';

<Script src="https://example.com/sdk.js" strategy="afterInteractive" />
```

## Public Assets

Files in `public/` are served at the root path.

## Interview Questions and Answers

### 1. Why use `next/image`?

It provides optimized images, responsive sizing, and lazy loading by default.

### 2. What is the `public/` folder for?

Hosting static assets at the root URL path.
