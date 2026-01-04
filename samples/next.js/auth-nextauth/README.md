# NextAuth Credentials Demo

## Overview

This sample uses NextAuth with a credentials provider and a local JSON user list. It mirrors the React JWT demo but uses Next.js and NextAuth to manage the session.

## File Layout

- `samples/next.js/auth-nextauth/app/page.jsx`
  - Client UI using `useSession`, `signIn`, and `signOut`.
- `samples/next.js/auth-nextauth/app/api/auth/[...nextauth]/route.js`
  - NextAuth route with a credentials provider.
- `samples/next.js/auth-nextauth/data/users.json`
  - Local user list for demo logins.
- `samples/next.js/auth-nextauth/.env.local.example`
  - Environment variables needed by NextAuth.

## Run It Locally

```bash
cd samples/next.js/auth-nextauth
cp .env.local.example .env.local
npm install
npm run dev
```

Sign in with:

- name: `luis`
- password: `password`
