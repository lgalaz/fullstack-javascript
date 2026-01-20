# Next.js Routing Example

This sample demonstrates App Router fundamentals with a small users → posts → comments dataset.

## How to run

```bash
cd samples/next.js/routing-example
npm install
npm run dev
```

## What it demonstrates

- Route groups: `app/(marketing)/about`, `app/(marketing)/pricing`
- Dynamic routes: `app/users/[userId]`, `app/users/[userId]/posts/[postId]`
- `generateStaticParams` + `dynamicParams = false` whitelist: `app/whitelist-users/[userId]/page.jsx`
- Parallel routes: `app/users/[userId]/@sidebar/page.jsx`
- Intercepting routes: `app/users/[userId]/posts/[postId]/@modal/(.)comments/[commentId]`
- Catch-all: `app/docs/[...slug]`
- Optional catch-all: `app/help/[[...slug]]`

## Suggested clicks

- `/users/1` (dynamic route)
- `/whitelist-users/1` (explicit whitelist demo)
- `/users/1/posts/p1` then click a comment to see the modal intercept
- `/docs/app/router` (catch-all)
- `/help` and `/help/contact` (optional catch-all)

## Data

Data lives in `data/store.js` with in-memory arrays for users, posts, and comments.
