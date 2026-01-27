# Internationalization (i18n) 

## Introduction

Next.js supports internationalized routing using either locale segments or the i18n config. Internationalization (i18n) means building your app so it can show different languages and regional formats. The term "i18n" is a convention: it's shorthand for "internationalization" with 18 letters between the first "i" and last "n", and it's widely used across the industry rather than a formal standard.

## Locale Segment Pattern (App Router)

```javascript
// /en
// app/[locale]/page.js
export default function LocaleHome({ params }) {

  return <div>Locale: {params.locale}</div>;
}

// /en/users
// app/[locale]/users/page.js
export default function UsersPage({ params }) {

  return <div>Locale: {params.locale}</div>;
}

// /en/users/companies
// app/[locale]/users/companies/page.js
export default function CompaniesPage({ params }) {

  return <div>Locale: {params.locale}</div>;
}
```

`params.locale` comes from the dynamic route segment name `[locale]`. The first path segment is treated as the locale because the folder is `app/[locale]/...`. In the Pages Router, you configure locale routing via `i18n` in `next.config.js` instead of a `[locale]` segment.

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

Use `Intl` for formatting numbers, dates, and currencies:

```javascript
const price = new Intl.NumberFormat(params.locale, {
  style: 'currency',
  currency: 'USD'
}).format(1999);
```

Example `tsconfig.json` alias for `@`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
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

Pages Router: read and switch locale.

```javascript
// pages/index.js
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <p>Locale: {router.locale}</p>
      <Link href={router.asPath} locale="en">EN</Link>
      <Link href={router.asPath} locale="es">ES</Link>
    </>
  );
}
```

Note: `router.asPath` preserves the current path (including query/hash) when switching locales.

Pages Router: load messages by locale.

```javascript
// pages/index.js
export async function getStaticProps({ locale }) {
  const messages = await import(`../messages/${locale}.json`);

  return { props: { messages: messages.default } };
}

export default function Home({ messages }) {

  return <p>{messages.welcome}</p>;
}
```

## Locale detection (App Router)

Use middleware to read `Accept-Language` and redirect to a locale segment:

```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const locale = request.headers.get('accept-language')?.split(',')[0] ?? 'en';
  const url = request.nextUrl.clone();
  if (!url.pathname.startsWith(`/${locale}`)) {
    url.pathname = `/${locale}${url.pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
```

## Interview Questions and Answers

### 1. How can you implement i18n in the App Router?

Use a dynamic `[locale]` route segment and load locale data per segment.

### 2. What does the i18n config do?

It enables locale-prefixed routes and automatic locale detection.
