# Hydration in React

## Introduction

Hydration is the process of attaching React's event handlers and internal state to server-rendered HTML on the client. React expects the existing DOM to match what it would render for the same component tree.

## Why Hydration Can Fail

If the HTML in the DOM changes before or during hydration, React can detect a mismatch and either warn or re-render, which may remove unexpected DOM nodes.

Common causes:

- Third-party scripts mutate the server-rendered DOM before hydration completes.
- Rendering uses non-deterministic values (dates, random numbers) that differ between server and client.
- Client-only data (like window size) is used during the initial render.

## Real-World Example (Ads)

1) The server renders a page with a placeholder div: `<div id="ad-slot"></div>`.
2) An ad script runs early and injects markup inside `#ad-slot`.
3) React hydrates and expects `#ad-slot` to be empty based on the server HTML.
4) React detects the mismatch and replaces the DOM with its own output, removing the ad.

## Mitigations

- Delay third-party DOM mutations until after hydration completes.

```javascript
useEffect(() => {
  // Safe to run after hydration.
  loadAds('#ad-slot');
}, []);
```

Note: `useEffect` never runs on the server. During SSR, it runs on the client after hydration (and after paint), so it is a safe place for DOM mutations.

- Isolate third-party DOM with a client-only component (render nothing on the server, then mount on the client).

```javascript
function AdSlot() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <div id="ad-slot" />;
}

function Page() {
  return (
    <main>
      <h1>Article</h1>
      {/* On the server this renders nothing, so no mismatch. */}
      <AdSlot />
    </main>
  );
}

Note: `AdSlot` returns `null` on the server because `mounted` starts as `false` and `useEffect` doesn't run during SSR. It only renders the div after hydration on the client.
```

- Use `suppressHydrationWarning` for known, safe mismatches (sparingly).

```javascript
<div suppressHydrationWarning>
  {typeof window === 'undefined' ? 'Loading...' : new Date().toLocaleTimeString()}
</div>
```

- Ensure server and client render the same initial markup.

```javascript
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```
