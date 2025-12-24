# Internationalization (i18n) 

## Introduction

Next.js supports internationalized routing using either locale segments or the i18n config. Internationalization (i18n) means building your app so it can show different languages and regional formats. The term "i18n" is a convention: it's shorthand for "internationalization" with 18 letters between the first "i" and last "n", and it's widely used across the industry rather than a formal standard.

## Locale Segment Pattern (App Router)

```javascript
// app/[locale]/page.js
// Example routes:
// /en
// /en/users
// /en/users/companies
// ...
export default function Home({ params }) {
  return <div>Locale: {params.locale}</div>;
}
```

Load translations per locale and pass them to client components.

```javascript
export default async function Home({ params }) {
  const messages = await import(`../../messages/${params.locale}.json`);
  return <div>{messages.default.title}</div>;
}
```

Bad practice: hard-coding text without a translation layer.

```javascript
export default function Home() {
  return <h1>Welcome</h1>;
}
```

Good practice: load translations based on the active route locale.

```javascript
// app/[locale]/page.js
export default async function Home({ params }) {
  const messages = await import(`@/messages/${params.locale}.json`);
  return <h1>{messages.default.welcome}</h1>;
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
