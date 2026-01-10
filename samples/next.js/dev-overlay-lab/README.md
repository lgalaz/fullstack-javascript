# Next.js Dev Overlay Lab

This app intentionally triggers warnings and runtime errors so you can see the Next.js dev overlay.

## Run It Locally

```bash
cd samples/next.js/dev-overlay-lab
npm install
npm run dev
```

## What to Expect

- On first load, a hydration warning appears because the page renders a timestamp on both server and client.
- Click "Trigger Runtime Error" to throw a client error and see the overlay.
