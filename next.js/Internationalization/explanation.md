# Internationalization (i18n) - Comprehensive Study Guide

## Introduction

Next.js supports internationalized routing using either locale segments or the i18n config.

## Locale Segment Pattern (App Router)

```javascript
// app/[locale]/page.js
export default function Home({ params }) {
  return <div>Locale: {params.locale}</div>;
}
```

## Config-Based i18n (Pages Router)

```javascript
// next.config.js
module.exports = {
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en'
  }
};
```

## Interview Questions and Answers

### 1. How can you implement i18n in the App Router?

Use a dynamic `[locale]` route segment and load locale data per segment.

### 2. What does the i18n config do?

It enables locale-prefixed routes and automatic locale detection.
