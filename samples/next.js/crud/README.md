# Next.js CRUD Sample

## Overview

This sample mirrors the React CRUD example but uses the Next.js App Router. It keeps all data in client state and seeds the initial list from a JSON file.

## File Layout

- `samples/next.js/crud/app/page.jsx`
  - Client component with CRUD logic.
- `samples/next.js/crud/data/users.json`
  - Seed data imported into the client component.
- `samples/next.js/crud/app/globals.css`
  - Styling.

## Run It Locally

```bash
cd samples/next.js/crud
npm install
npm run dev
```
