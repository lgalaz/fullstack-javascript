# Long Running Task (React)

This sample intentionally creates a long main-thread task so you can see it in DevTools.

## Run

```bash
npm install
npm run dev
```

Open the app, then in Chrome DevTools:

1. Go to **Performance**.
2. Click **Record**.
3. Click **Trigger Long Task** a few times.
4. Stop recording and inspect the **Main** thread for long tasks.

## What triggers the long task?

The button runs a busy loop for ~120ms on the main thread. This is an intentional anti-pattern used only for profiling practice.
