# Metadata and SEO 

## Introduction

Next.js provides a Metadata API for defining SEO-friendly titles, descriptions, and Open Graph tags.

## Static Metadata

```javascript
export const metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard',
  openGraph: {
    title: 'Dashboard',
    images: ['/og.png']
  }
};
```

## Dynamic Metadata

```javascript
export async function generateMetadata({ params }) {
  return {
    title: `User ${params.id}`
  };
}
```

Dynamic metadata runs on the server and can fetch data. Use caching or revalidation to avoid repeated fetches.

## Robots

```javascript
export const metadata = {
  robots: { index: true, follow: true }
};
```

## Open Graph and Twitter

```javascript
export const metadata = {
  openGraph: {
    title: 'Docs',
    description: 'API docs',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
};
```

## Interview Questions and Answers

### 1. How do you define page metadata in the App Router?

Export a `metadata` object or a `generateMetadata` function.

### 2. Why is metadata important?

It improves SEO, link previews, and discoverability.
