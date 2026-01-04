# React CRUD Sample (Vite)

## What This Sample Includes

A standalone React CRUD app that manages an in-memory list of users seeded from a JSON file.

## Step-by-Step (If You Were Building It)

1) Create the project folder structure.
- `samples/react/crud/`
- `samples/react/crud/src/`
- `samples/react/crud/src/data/`

2) Add `package.json` with React + Vite dependencies and scripts.
- Scripts: `dev`, `build`, `preview`
- This example was created manually, but you could scaffold it with `npm create vite@latest` (React template) or `npx create-react-app` and then replace files as needed.

3) Add `index.html` as the HTML entry file.
- Contains a `<div id="root"></div>` mount point.

4) Add `src/main.jsx` to bootstrap React.
- Creates a root with `createRoot` and renders `<App />`.

5) Add `src/App.jsx` for the CRUD UI.
- Uses `useState` for local state.
- Implements create, read, update, delete for users.

6) Add `src/data/users.json` for initial data.
- This is a simple seed list for the UI.

7) Add `src/App.css` for basic styling.

8) Add `vite.config.js` to enable React support.

## File-by-File Purpose

- `samples/react/crud/package.json`
  - Declares dependencies and scripts.

- `samples/react/crud/index.html`
  - HTML entry point with the `#root` element.

- `samples/react/crud/src/main.jsx`
  - React entry point that mounts the app to `#root`.

- `samples/react/crud/src/App.jsx`
  - Main UI component implementing CRUD.

- `samples/react/crud/src/data/users.json`
  - Seed data loaded into state on startup.

- `samples/react/crud/src/App.css`
  - Basic styling for layout and table.

- `samples/react/crud/vite.config.js`
  - Vite config enabling React plugin.

## How React Hooks Up To The Page

1) `index.html` defines the mount point: `<div id="root"></div>`.
2) `main.jsx` finds that element and renders the React tree there.

## Run It Locally

```bash
npm install
npm run dev
```
