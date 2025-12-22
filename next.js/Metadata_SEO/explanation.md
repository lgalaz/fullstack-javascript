# Metadata and SEO - Comprehensive Study Guide

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

## Robots

```javascript
export const metadata = {
  robots: { index: true, follow: true }
};
```

## Interview Questions and Answers

### 1. How do you define page metadata in the App Router?

Export a `metadata` object or a `generateMetadata` function.

### 2. Why is metadata important?

It improves SEO, link previews, and discoverability.
