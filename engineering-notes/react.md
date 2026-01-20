1) Rendering, reconciliation, and keys

I: Walk me through what happens when React re-renders a component. What does “reconciliation” mean, and why do keys matter?

C: When state/props/context change, React schedules a render for the affected subtree. The component function is called again to produce a new React element tree (virtual representation). Then React performs reconciliation: it diffs the new element tree with the previous one to decide what needs to change in the host environment (DOM/native-Fabric).

Reconciliation is heuristic-based (not a perfect deep diff). The main rule is: if element type changes at a position, React tears down the old subtree and mounts a new one. If the type matches, React updates props and continues.

Keys matter for lists because they give React stable identity across renders. Without stable keys, React may match items by index, which can cause incorrect state/DOM reuse (e.g., inputs “moving” their value, wrong component instance preserved). Best practice: keys should be stable and derived from the underlying data identity, not array index (unless the list is static and never reorders).

2) State, derived state, and avoiding unnecessary renders

I: In a large app, what are your rules of thumb for state placement and avoiding “derived state” bugs?

C: I try to keep state:

- As low as possible (closest common ancestor of consumers) to reduce rerender blast radius.
- But not lower than necessary if multiple distant consumers need it; then I use context or a state library.

For derived state: if something can be computed from props/state, I usually don’t store it. Example: const filtered = items.filter(...) instead of const [filtered, setFiltered]. Storing derived data leads to sync bugs (“source of truth” drift).

If computation is expensive, I memoize the computation (useMemo) only when it’s actually a bottleneck. Otherwise keep it simple and correct.

Also: I’m careful with object/array identity. I avoid creating new props unnecessarily (like inline objects) when passing to memoized children, or I deliberately accept rerenders if it’s not a perf issue.

3) useEffect: mental model and common pitfalls

I: Explain useEffect precisely: when does it run, what does cleanup mean, and what are common mistakes?

C: useEffect runs after React commits updates to the DOM (post-paint in most cases). It’s for synchronizing React state with external systems: subscriptions, timers, manual DOM APIs, network side-effects, etc.

The effect runs after a render where dependencies changed.

The cleanup runs before the next time the effect runs (when deps change) and on unmount.

Common mistakes:

Using effects for derived state instead of computing inline.

Missing deps (stale closures). The dependency array must include everything referenced that can change, unless you intentionally stabilize references.

Race conditions with async work: requests finishing out of order. I handle this by aborting fetches (AbortController) or tracking “current request id”.

Infinite loops by setting state unconditionally in an effect that depends on that state.

If I need to read layout before paint, I use useLayoutEffect sparingly because it can block painting.

4) useMemo/useCallback and React.memo: when they help vs hurt

I: When do you use useMemo, useCallback, and React.memo? What’s the trap?

C: They are performance tools, not correctness tools.

React.memo(Component) prevents rerender if props are shallow-equal.

useCallback(fn, deps) stabilizes function identity.

useMemo(valueFactory, deps) stabilizes computed value identity.

They help when:

Child components are expensive and can skip rerenders.

You pass stable props to memoized children, or you want stable identities for dependency arrays (e.g., subscription APIs).

Trap:

Overusing them adds complexity and sometimes worsens performance due to memo bookkeeping.

Memoization doesn’t stop rerenders caused by parent rerenders unless props are stable and shallow-equal.

useMemo doesn’t “cache forever”; it caches until deps change.

My approach: measure first (Profiler), then apply memoization where it reduces real cost.

5) Rendering/perf deep dives

I: What are your go-to techniques and mental models for deep rendering performance work?

C: I start with measurement: React DevTools Profiler, browser Performance tab, and React's scheduling lanes mental model (urgent vs transition). I look for:

Unnecessary renders (props/context churn, new identities).

Expensive renders (heavy computation in render, large lists, expensive child trees).

Long commits (too much work in one frame).

Targeted fixes:

Stabilize props (memoize objects/functions where it matters).

Split context by update frequency, or use selector-based stores.

Virtualize large lists (react-window/react-virtualized).

Move heavy computation to memoized selectors or background workers.

Introduce transitions for non-urgent updates to keep input responsive.

I avoid blanket memoization. If the Profiler shows time dominated by reconciliation, I reduce element churn and ensure keys are stable. If it's dominated by actual render work, I focus on cutting expensive render paths or splitting components to isolate hot paths.

Note: flushSync (react-dom) forces immediate synchronous DOM updates and bypasses normal scheduling. I treat it as a last resort when I must read layout right after a state update, because it can hurt responsiveness.

6) Concurrent rendering, transitions, and Suspense

I: Explain concurrent rendering concepts and how startTransition changes behavior.

C: In modern React, rendering can be interruptible and scheduled with priority. With startTransition, I mark updates as non-urgent. Urgent updates (typing, clicking) remain responsive, while transitions can be deferred and interrupted if needed.

Example: typing in a search input updates query urgently, but expensive filtering/list rendering can be transitioned.

Suspense is React’s mechanism for coordinating async boundaries: when a subtree suspends (e.g., data not ready), React can show fallback UI while keeping the rest interactive. In practice, Suspense is most powerful with frameworks (like Next) that integrate data fetching and streaming, but it’s also useful for code-splitting (lazy).

7) Context: performance and architecture

I: Context is easy to misuse. What’s the real performance behavior and how do you structure context in a big app?

C: Context updates cause all consuming components to rerender when the provider value changes (based on reference equality). So if I put {state, dispatch} in a single provider and recreate the object every render, I can trigger broad rerenders.

Patterns I use:

Split contexts by update frequency (e.g., AuthContext vs ThemeContext).

Provide stable values: memoize provider value (useMemo) or keep the value primitive/stable.

Sometimes use context for dependencies (like services, clients) rather than frequently-changing state.

For complex global state, a dedicated library (Redux, Zustand, Jotai, Recoil, etc.) can give more granular subscriptions.

8) Forms: controlled vs uncontrolled, React Hook Form

I: Compare controlled vs uncontrolled inputs. When would you pick React Hook Form?

C: Controlled inputs store value in React state (value + onChange). Benefits: easy validation, immediate derived UI, single source of truth. Costs: rerenders on each keystroke and more boilerplate.

Uncontrolled inputs let the DOM hold the value (defaultValue, refs). Benefits: fewer rerenders and simpler for large forms. Costs: you read values on submit or via refs; validation patterns differ.

React Hook Form works well because it leans toward uncontrolled patterns with refs, minimizing rerenders while still offering validation and form state tracking. I use it for large, complex forms where performance and ergonomics matter.

9) Server Components vs Client Components (framework-level)

I: In Next.js App Router terms: what are Server Components, what are Client Components, and what are the practical boundaries?

C: Server Components render on the server, can access server-only resources (DB, secrets), and don’t ship their code to the browser. Client Components run in the browser, can use hooks like useState/useEffect, interact with the DOM, and handle client-side interactivity.

Boundaries:

A Server Component can render Client Components, but not the other way around (client cannot import server-only modules).

Props passed from server to client must be serializable.

Practical architecture: keep data fetching and heavy lifting in server components, push interactive widgets to client components, and be explicit about boundaries to avoid shipping unnecessary JS.

10) Testing strategy for senior-level apps

I: What’s your testing pyramid for React? Tools and what you avoid?

C: I aim for:

Unit tests for pure logic and utilities.

Component tests with React Testing Library focused on user behavior (queries by role/text, interaction via user-event).

A small set of E2E tests (Playwright or Cypress) for critical flows.

I avoid:

Testing implementation details (like internal state shape).

Over-mocking React itself or verifying exact component tree structure unless it’s a library component.

Also: I like running lint/unit tests in CI and often set up pre-commit hooks for fast checks.

11) Debugging a real issue: “Why is this component re-rendering?”

I: You see excessive rerenders and sluggish UI. What’s your step-by-step approach?

C:

Use React DevTools Profiler to identify what commits are expensive and which components rerender frequently.

Check if rerenders are normal (parent rerender) or caused by new prop identities.

Look for obvious issues: inline objects/functions passed down, context value churn, selectors recomputing.

If state is global, ensure subscription granularity (split context or use a store with selectors).

Apply targeted memoization (React.memo, useCallback, useMemo) where it reduces real work.

Consider list virtualization (react-window) for large lists and ensure keys are stable.

If rendering is blocked by heavy computations, move to a transition or background compute (web worker) depending on needs.

12) Component API & composition design

I: You’re designing a reusable component library (design system). How do you decide between props vs composition (children, render props, slots)?

C:
I default to composition over configuration, but with intent.

Props are best for:

Simple, scalar configuration (disabled, size, variant)

Things that are unlikely to vary structurally

Composition (children) is best when:

Consumers need control over structure or content

The component represents a layout or behavior, not fixed UI

Render props / function-as-children are useful when:

Consumers need access to internal state but full rendering control

Example decision:

<Button variant="primary" /> → prop

<Modal><Header /><Body /><Footer /></Modal> → composition

<List items={items}>{item => <Row item={item} />}</List> → render prop

Example List implementation:

function List({ items, children }) {
  return <div>{items.map((item) => children(item))}</div>;
}

I avoid APIs that require many interdependent props — that’s a smell that composition is needed.

12) Controlled vs uncontrolled components (not just inputs)

I: What does it mean for a component to be “controlled” or “uncontrolled” at a higher level?

C:
A component is controlled when its state is driven entirely by props, and uncontrolled when it manages its own internal state.

A strong reusable component often supports both.

Example pattern:

// Uncontrolled: internal state, parent does not pass a value.
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}

function Accordion({ open, defaultOpen, onOpenChange }) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);

  const actualOpen = isControlled ? open : internalOpen;

  function setOpen(value) {
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  }

  // render using actualOpen
}


This allows:

Simple usage (uncontrolled)

Advanced orchestration (controlled)

This pattern is common in mature libraries (Radix, MUI, Reach UI).

13) Custom hooks: design & pitfalls

I: What rules do you follow when designing custom hooks?

C:
A custom hook is an abstraction over behavior, not UI.

Rules I follow:

Hooks should do one conceptual thing

They should be composable with other hooks

Avoid hiding too much magic — surprising side effects are dangerous

Prefer returning data + callbacks, not JSX

Pitfalls:

Stale closures: returning callbacks that capture outdated state

Over-internalizing state: making hooks impossible to coordinate

Effect-heavy hooks that are hard to reason about

Good hook:

const { value, setValue, reset } = useToggle();


Bad hook:

useToggleAndFetchAndLogAndPersist();

14) Refs: escape hatches and advanced usage

I: Besides DOM access, what are legitimate uses of useRef?

C:
useRef is for mutable, persistent values that do not trigger rerenders.

Common advanced uses:

Storing previous values (prev.current)

Holding imperative handles (timers, observers, external instances)

Avoiding stale closures in event handlers

Instance-like variables in function components

Example: latest value without rerenders

const latestValue = useRef(value);
latestValue.current = value;


This is especially useful in subscriptions, event listeners, or async callbacks.

I avoid using refs to “fight React” — if UI depends on it, it probably belongs in state.

15) Error boundaries & resiliency

I: How do you use error boundaries in a real production app?

C:
Error boundaries:

Catch render-time errors (not async or event handlers)

Prevent entire app crashes

Allow graceful degradation

In practice:

I wrap page-level or feature-level boundaries, not every component

I integrate them with logging/observability (Sentry, Datadog, etc.)

I provide user-recoverable actions when possible (retry, reset)

Example strategy:

One global boundary for the app shell

Local boundaries around risky widgets (charts, editors)

I avoid using error boundaries as control flow — they’re for unexpected failures.

16) Performance at scale: lists, memory, scheduling

I: A page renders 10,000 items and is slow. What do you think about first?

C:
In order:

Virtualization (react-window, react-virtualized)

Ensure stable keys

Avoid unnecessary rerenders of rows (memo)

Move expensive work outside render

Check for layout thrashing / heavy DOM nodes

Rendering 10,000 nodes is almost always wrong unless absolutely required.

If interaction still feels slow:

Use startTransition for non-urgent updates

Defer offscreen work

Consider pagination or progressive disclosure

17) Hydration & SSR pitfalls

I: What causes hydration mismatches, and how do you prevent them?

C:
Hydration mismatches happen when server-rendered HTML doesn’t match the client render.

Common causes:

Using window, document, Date.now(), Math.random() during render

Locale/timezone differences

Conditional rendering based on client-only state

CSS-in-JS ordering issues

Mitigations:

Gate client-only logic behind useEffect

Use framework helpers (useId, consistent locale)

Render placeholders consistently on server & client

Be explicit about Client Components in Next.js

Hydration bugs are often architectural, not just “fix this line”.

18) State management libraries: when and why

I: When do you introduce Redux/Zustand/etc. instead of React state?

C:
I introduce a store when:

State is shared across distant trees

Updates are frequent and need fine-grained subscriptions

State needs to exist outside React lifecycle

Debugging/history tooling is valuable

I don’t introduce a store just because an app is “big”.

Today:

Zustand/Jotai for ergonomic, local-global state

Redux Toolkit when structure, predictability, or team scale matters

Context alone is fine for low-frequency state (theme, auth)

19) Event handling & stale state bugs

I: Explain a real-world stale state bug and how you fix it.

C:
Classic bug:

useEffect(() => {
  socket.on("message", () => {
    setCount(count + 1); // stale
  });
}, []);


count is captured once.

Fixes:

Functional updates:

setCount(c => c + 1);


Or refs if reading latest value without rerenders

Or re-subscribe when dependencies change (carefully)

Understanding closures is non-negotiable at senior level.

20) React as a mental model (meta question)

I: How do you think in React when designing systems?

C:
I think in terms of:

- Data flow, not DOM mutations
- Reactivity boundaries
- Identity and lifecycle, not instances
- User intent priority (urgent vs non-urgent)

Good React systems:

- Make invalid states impossible
- Are resilient to re-renders
- Degrade gracefully
- Optimize last, not first

React is less about “components” and more about predictable state transitions.

I design React systems by focusing on state ownership, data flow, and re-render boundaries, treating components as pure projections of state rather than persistent instances.


- storybook in react
- design system
- render components vs ui components vs dumb components
- zustand vs redux
