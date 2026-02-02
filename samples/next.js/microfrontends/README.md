# Next.js Microfrontends Sample

A simple, single-repo demo that explains the microfrontend idea using a Next.js shell and three independently themed feature areas.

If you want a “real” module-federation setup, see `samples/next.js/microfrontends-mf`.

## How to run

```bash
cd samples/next.js/microfrontends
nvm use
npm install
npm run dev
```

## Node version

This sample expects Node 20.x. See `.nvmrc`.

## What this shows

- A shell that owns layout, navigation, and shared styling.
- Three microfrontend-style feature areas: Analytics, User Management, Ops.
- Clear visual boundaries so it is easy to see the composition model.

## Project structure

- `app/page.jsx` is the shell layout and composition entry point.
- `components/microfrontends/AnalyticsDashboard.jsx` represents the Analytics UI.
- `components/microfrontends/UserManagement.jsx` represents the Users UI.
- `components/microfrontends/SupportInbox.jsx` represents the Ops UI.
- `data/` holds mock JSON data for each feature.
- `app/api/*` exposes lightweight BFF endpoints for each feature area.
- `components/ui/` is a tiny shared design system.
- `.storybook/` and `stories/` power Storybook for the shared UI.

## How this maps to real microfrontends

In a production microfrontend architecture, each feature area would typically live in a separate repo and deploy independently. The shell would load them via module federation, iframes, or edge composition. This sample keeps everything in one repo so the structure is easy to follow.

## Sample BFF endpoints

- `GET /api/analytics`
- `GET /api/users`
- `GET /api/ops`

## Storybook

```bash
npm run storybook
```
