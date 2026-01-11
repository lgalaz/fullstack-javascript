# Hydration in React

## Introduction

Hydration is the process of attaching React's event handlers and internal state to server-rendered HTML on the client. React expects the existing DOM to match what it would render for the same component tree.

## Phases (SSR + Hydration vs Client-Only)

Hydration is a special first mount that reuses server HTML. The render and commit phases are the same high-level phases React always uses: render builds the next virtual tree and decides what should happen, and commit applies those decisions to the host environment (the DOM on web; in React Native, the native UI layer via Fabric/UIManager). The difference is in the commit work: during hydration, React mostly attaches event handlers and refs and "claims" existing DOM nodes instead of creating them. On a client-only first render, React must create all DOM nodes from scratch.

### SSR + Hydration (first client render only)

HTML already exists.

Render phase (hydrating render):
- React renders components.
- It reconciles the current fiber tree with new elements and marks effects for the commit.

Note: the "fiber tree" is React's internal data structure for the component tree. Each "fiber" is a unit of work that stores a component's state, props, and links to parent/child/sibling fibers. It is a tree represented by linked nodes (often a linked list of siblings), not a single linear linked list. React uses fibers to schedule work, compare previous output to new output, and decide what changes to commit. On the client, the fiber tree is created during the render phase (including the initial hydration render).

Commit phase (hydration commit):
- Attach event listeners.
- Attach refs.
- Claim existing DOM nodes for the fiber tree.
- Do not create DOM nodes unless React detects a mismatch and falls back to client rendering for that subtree.
  Note: a mismatch usually triggers a hydration warning in the console. React can recover by re-rendering that subtree on the client (not a hard crash), but the mismatch still indicates that server and client output differed.

Effects:
- `useLayoutEffect` runs after the commit and before paint.
- Browser paint happens.
- `useEffect` runs after paint.

### Client-Only Render (no SSR)

Render phase:
- React renders components and builds a work-in-progress fiber tree.

Commit phase:
- Create DOM nodes.
- Attach event listeners.
- Attach refs.

Effects run with the same ordering as above.

### Subsequent Renders (both cases)

Render phase:
- Recompute the virtual tree and reconcile against current fibers.

Commit phase:
- Update, create, or remove DOM nodes as needed.

Effects run.

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

Example use case: timestamps or random IDs that intentionally differ between server and client.

- Ensure server and client render the same initial markup.

```javascript
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```
