# Microfrontends with Module Federation (Next.js)

This is a "real" microfrontend architecture using Module Federation:

- `shell` loads remote components at runtime.
- `analytics`, `users`, and `ops` are independent Next.js apps.
- Each remote exposes a component via `@module-federation/nextjs-mf`.

## How it works

The shell imports remote components like:

```js
const AnalyticsDashboard = dynamic(() => import('analytics/AnalyticsDashboard'), {
  ssr: false,
});
```

Each remote publishes a `remoteEntry.js` at:

- `http://localhost:3001/_next/static/chunks/remoteEntry.js`
- `http://localhost:3002/_next/static/chunks/remoteEntry.js`
- `http://localhost:3003/_next/static/chunks/remoteEntry.js`

## Run it

First, set the required env var in each app (the module federation plugin needs it).

```bash
cp shell/.env.example shell/.env.local
cp analytics/.env.example analytics/.env.local
cp users/.env.example users/.env.local
cp ops/.env.example ops/.env.local
```

Open four terminals and run the following in each folder:

```bash
cd samples/next.js/microfrontends-mf/analytics
npm install
npm run dev
```

```bash
cd samples/next.js/microfrontends-mf/users
npm install
npm run dev
```

```bash
cd samples/next.js/microfrontends-mf/ops
npm install
npm run dev
```

```bash
cd samples/next.js/microfrontends-mf/shell
npm install
npm run dev
```

Then visit `http://localhost:3000`.

## Key files

- `shell/next.config.js`: defines the remotes.
- `shell/pages/index.js`: dynamically imports remote components.
- `analytics/next.config.js`: exposes `./AnalyticsDashboard`.
- `users/next.config.js`: exposes `./UserManagement`.
- `ops/next.config.js`: exposes `./OpsPulse`.
