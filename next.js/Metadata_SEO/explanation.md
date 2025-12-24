# Metadata and SEO 

## Introduction

Next.js provides a Metadata API for defining SEO-friendly titles, descriptions, and Open Graph tags. SEO (search engine optimization) helps pages appear in search results. Open Graph metadata controls link previews on social platforms.

## Static Metadata
Example route (App Router):

```text
app/dashboard/page.js
```

```javascript
// app/dashboard/page.js
export const metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard',
  openGraph: {
    title: 'Dashboard',
    images: ['/og.png']
  }
};

export default function DashboardPage() {
  return <h1>Dashboard</h1>;
}
```

## Dynamic Metadata

Example route (dynamic segment):

```text
app/users/[id]/page.js
```

```javascript
// app/users/[id]/page.js
export async function generateMetadata({ params }) {
  return {
    title: `User ${params.id}`,
    description: `Profile page for user ${params.id}`
  };
}

export default function UserPage({ params }) {
  return <h1>User {params.id}</h1>;
}
```

If you need data for metadata, fetch it here on the server:

```javascript
// app/users/[id]/page.js
export async function generateMetadata({ params }) {
  const user = await fetch(`https://example.com/api/users/${params.id}`, {
    next: { revalidate: 60 }
  }).then((res) => res.json());

  return {
    title: user.name,
    description: user.bio
  };
}
```

Dynamic metadata runs on the server and can fetch data. Use caching or revalidation to avoid repeated fetches.

Bad practice: fetching metadata on the client for SEO-critical tags.

```javascript
'use client';
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    document.title = 'User 123';
  }, []);
  return <div>User</div>;
}
```

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
