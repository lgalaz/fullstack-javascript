# Assets, Images, Fonts, and Scripts - Comprehensive Study Guide

## Introduction

Next.js provides optimized helpers for images, fonts, and scripts.

## Images

Use `next/image` for automatic optimization.

```javascript
import Image from 'next/image';

<Image src="/avatar.png" width={64} height={64} alt="Avatar" />
```

Image optimization requires width/height to avoid layout shift. For dynamic sizes, use `fill` with a parent that has position and size.

## Fonts

Use `next/font` for self-hosted, optimized fonts.

```javascript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }) {
  return <body className={inter.className}>{children}</body>;
}
```

Fonts are inlined with CSS and preloaded to reduce layout shifts.

## Scripts

Use `next/script` to control script loading strategy.

```javascript
import Script from 'next/script';

<Script src="https://example.com/sdk.js" strategy="afterInteractive" />
```

`strategy` options:

- `beforeInteractive` for critical scripts
- `afterInteractive` for default
- `lazyOnload` for low priority

## Public Assets

Files in `public/` are served at the root path.

## Interview Questions and Answers

### 1. Why use `next/image`?

It provides optimized images, responsive sizing, and lazy loading by default.

### 2. What is the `public/` folder for?

Hosting static assets at the root URL path.
