# Assets, Images, Fonts, and Scripts 

## Introduction

Next.js provides optimized helpers for images, fonts, and scripts.

## Images

Use `next/image` for automatic optimization.

```javascript
import Image from 'next/image';

<Image src="/avatar.png" width={64} height={64} alt="Avatar" />
```

Image optimization requires width/height to avoid layout shift (the page jumping as images load). For dynamic sizes, use `fill` with a parent that has position and size. `fill` is a Next.js `next/image` prop, not a standard HTML attribute, and it makes the image absolutely fill its parent box.

```javascript
// Good: parent has size and position for fill
<div style={{ position: 'relative', width: 200, height: 200 }}>
  <Image src="/avatar.png" alt="Avatar" fill />
</div>
```

Bad practice: using plain `<img>` for large or responsive images misses Next.js optimizations.

```javascript
<img src="/avatar.png" alt="Avatar" />
```

Image optimizations available:

- Automatic resizing per device and layout (responsive `srcset`).
- Modern format conversion when supported by the browser (for example, WebP/AVIF).
- Lazy loading by default for offscreen images.
- Placeholder support (blur-up) to reduce perceived loading time.
- On-demand optimization and caching on the server/edge.

Remote images require config in `next.config.js`:

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.example.com' }
    ]
  }
};
```

Useful props:
- `sizes` to control responsive image selection
- `priority` for above-the-fold images. Note: Starting with Next.js 16, the priority property has been deprecated in favor of the preload property in order to make the behavior clear.
- In most cases, you should use loading="eager" or fetchPriority="high" instead of preload.
- `placeholder="blur"` with `blurDataURL` for low-quality placeholders

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

Bad practice: loading fonts via a remote stylesheet causes extra network hops and can delay text rendering.

```html
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
```

Font optimizations available:

- Self-hosting with automatic download and bundling.
- Subsetting to reduce font file size.
- Automatic preload of critical font files.
- CSS inlining to avoid additional render-blocking requests.
- Controlled `font-display` behavior to reduce layout shifts.

Local fonts:

```javascript
import localFont from 'next/font/local';

const brand = localFont({ src: './Brand.woff2', variable: '--font-brand' });
```

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

Bad practice: dropping a blocking script tag into the page can delay interactivity.

```html
<script src="https://example.com/sdk.js"></script>
```

These strategies control when the script is executed. They do not replace `preload`/`prefetch` for all cases, but most apps can rely on `next/script` without manually adding resource hints unless you have a specific performance need.

If a script can run `afterInteractive` but you want to reduce its load time, a `preload` hint can help by fetching it earlier. Use it selectively: preloading consumes bandwidth and can compete with more critical resources, so only preload when you know the script is needed immediately after hydration.

`afterInteractive` and `lazyOnload` load without blocking rendering (async/deferred behavior). `beforeInteractive` loads as early as possible and can block interactivity because it must run before hydration. Hydration is the process where React attaches event listeners and makes the server-rendered HTML interactive on the client.

Example of a specific need: preloading a critical third-party script that must be ready immediately after first paint (like a payment SDK on a checkout page) to avoid visible delays when the user interacts. This is a good fit for `beforeInteractive` because it runs before hydration, ensuring the SDK is ready for immediate user actions.

Script optimizations available:

- Precise loading strategy (`beforeInteractive`, `afterInteractive`, `lazyOnload`).
- Non-blocking loading by default for non-critical scripts.
- Optional preloading when early execution is required.

## Public Assets

Files in `public/` are served at the root path.

Public asset optimizations available:

- None by default; files are served as-is. Use `next/image` or other tooling for optimization.
