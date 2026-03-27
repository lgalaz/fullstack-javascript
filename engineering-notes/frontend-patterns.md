Core lenses for frontend patterns:

- Mental models: patterns are repeatable solutions to recurring UI and architecture problems, not defaults to apply blindly.
- Systems thinking: layout, state, rendering, accessibility, performance, and rollout strategy interact, so a pattern should be evaluated in the full application context.
- Scheduling awareness: many frontend patterns are really about deciding when work happens on the main thread, on the server, during hydration, or after user input.
- Trade-off reasoning: every pattern buys leverage by constraining choices, but it also introduces cost in complexity, coupling, tooling, or runtime behavior.

## 1) Flexbox layout pattern

Use Flexbox when the layout problem is one-dimensional: distributing and aligning items in a row or column. It is the right pattern for nav bars, button groups, toolbars, stacked forms, and card rows because it handles spacing, alignment, and growth/shrink behavior with minimal markup. I avoid forcing two-dimensional page layout into Flexbox when Grid expresses the structure more directly.

## 2) CSS Grid responsive pattern

Use Grid when the layout is fundamentally two-dimensional and the relationship between rows and columns matters. The responsive pattern is usually `minmax`, `auto-fit` or `auto-fill`, and explicit placement only where needed, so the layout adapts to available space without brittle media-query math. Grid gives stronger structural control than Flexbox, but that control becomes overkill for simple one-axis alignment.

## 3) Virtual scrolling pattern

Virtual scrolling renders only the visible window of a large list plus a small buffer, instead of mounting every row in the DOM. This pattern is essential when DOM size and render cost would otherwise dominate performance, especially for tables, feeds, and log viewers. The trade-off is complexity around measurement, keyboard navigation, sticky elements, and row state, so I use it when the list is genuinely large, not preemptively.

Canonical example: a trading dashboard with 50,000 rows keeps only ~30 visible rows mounted and reuses row containers as the user scrolls.

## 4) Infinite scroll pattern

Infinite scroll progressively loads more data as the user approaches the end of the current list. It helps reduce initial payload and can make discovery-heavy feeds feel continuous, but it also complicates navigation, footer reachability, analytics, and user sense of position. I prefer it for exploratory content and avoid it for task-oriented UIs where pagination provides better control and recoverability.

Canonical example: a social feed loads the next page when an intersection observer detects that the sentinel near the bottom is visible.

## 5) Component composition pattern

Composition means building behavior and structure by combining smaller components rather than centralizing everything in one configurable component. It usually produces cleaner APIs because consumers assemble intent with children, slots, or render props instead of pushing dozens of interdependent props through one abstraction. I reach for composition when structure varies; I keep simple scalar configuration as props.

Canonical example: a modal API like `<Modal><Modal.Header /><Modal.Body /><Modal.Footer /></Modal>` scales better than a single component with twenty layout props.

## 6) Custom hooks pattern

Custom hooks extract reusable stateful behavior without coupling that behavior to a specific UI structure. The pattern works well when multiple components share lifecycle logic, subscriptions, async orchestration, or derived state rules, and the hook can return data plus actions cleanly. A good custom hook hides repetitive mechanics, not important domain decisions or surprising side effects.

Canonical example: `useDebouncedSearch(query)` can own cancellation, debounce timing, loading state, and stale-response protection while leaving rendering to the caller.

## 7) Context API state pattern

Context is best used for dependency propagation or low-frequency shared state such as theme, auth, locale, or injected services. The useful pattern is to keep provider values stable, split contexts by concern, and avoid treating one giant context object as a general-purpose state store. Once updates are frequent or consumers need granular subscriptions, context alone becomes a blunt instrument and a dedicated store is usually the better pattern.

## 8) Performance optimization pattern

The pattern is measure first, optimize second, and optimize at the right layer. I start by identifying whether the real bottleneck is JavaScript execution, rerender propagation, layout, paint, bundle size, network latency, or data volume, then pick the narrowest fix that addresses that cause. The staff-level mistake is not under-optimizing; it is solving the wrong bottleneck and increasing system complexity for no user-visible gain.

## 9) Accessibility ARIA pattern

The correct ARIA pattern is native-first: use semantic HTML whenever possible and add ARIA only when a native element cannot express the required interaction. ARIA should describe state, relationships, and behavior for custom widgets, but it should not be used to reimplement semantics the browser already provides. The pattern is valuable when building advanced controls; it becomes harmful when it overrides correct native behavior.

## 10) CSS-in-JS pattern

CSS-in-JS colocates styling with component logic and often enables dynamic theming, variants, and composition through JavaScript. It can work well in component-driven systems, especially when the tooling extracts styles at build time, but runtime style generation adds JavaScript cost and can complicate SSR and hydration. I use it intentionally when the ergonomics and theming model justify the runtime and tooling trade-offs.

## 11) Progressive Web App pattern

The PWA pattern combines installability, offline capability, caching strategy, and resilient loading through service workers and a web app manifest. It is valuable when the product benefits from repeat engagement, unreliable networks, or app-like revisit behavior. I treat it as an operational commitment, not a checkbox, because offline correctness, cache invalidation, and update lifecycle are where most PWA failures happen.

## 12) Micro-interactions pattern

Micro-interactions are small, purposeful feedback loops that acknowledge user intent and clarify system status: button press feedback, inline validation, optimistic confirmation, subtle transitions, and focus movement. Their value is cognitive, not decorative; they reduce uncertainty and make interfaces feel responsive. The pattern fails when motion is added without meaning or when it competes with performance and accessibility.

## 13) Design system token pattern

Design tokens turn design decisions like spacing, color, typography, radius, and motion into named primitives that can be reused across components and platforms. The pattern creates consistency and makes brand or theme changes scalable because components depend on semantic values rather than hard-coded literals. Tokens should express stable design intent, not mirror every ad hoc value in the current UI.

## 14) State machine pattern

A state machine models UI behavior as explicit states and transitions instead of scattered booleans and implicit conditions. This pattern is especially strong for multi-step workflows, async request lifecycles, menus/dialogs, and other flows where invalid state combinations create bugs. I use it when correctness matters more than convenience, because the upfront modeling cost pays back through clearer behavior and fewer impossible states.

Canonical example: a checkout flow might move through `cart -> address -> payment -> submitting -> success | failure`, which prevents contradictory states like “submitting” and “editable payment form” being true at the same time.

## 15) Error boundary pattern

An error boundary isolates failure so one broken subtree does not crash the entire React application. The pattern is to place boundaries around feature or route segments, log failures, and provide a recovery path such as retry, reset, or fallback navigation. It is not a substitute for async error handling or defensive programming, but it is essential for keeping partial failure from becoming total failure.

## 16) SSR/SSG hydration pattern

This pattern renders HTML on the server or at build time for fast first paint and SEO, then hydrates on the client to attach interactivity. The key design constraint is that server output and first client render must match, or hydration work becomes noisy, fragile, or expensive. I choose SSR or SSG based on data volatility, personalization, and cacheability, not ideology.

Canonical example: an article page is rendered on the server with content and layout already in HTML, then the comments widget and bookmark button hydrate on the client.

## 17) Feature flags pattern

Feature flags decouple deploy from release by letting teams ship dormant code paths and enable them gradually, conditionally, or per segment. The pattern is useful for progressive rollout, experimentation, and operational kill switches, but it creates long-term complexity if flags are not owned and removed. Good flag systems are governed, observable, and short-lived unless they represent real product configuration.

Canonical example: a new checkout flow is deployed behind a flag, enabled first for internal staff, then 5% of traffic, then all users once conversion and error metrics are stable.

## 18) Memoization pattern

Memoization trades memory and complexity for reduced recomputation or rerender cost. It works when the avoided work is expensive enough and the memo boundary is stable enough to pay for itself, such as costly derived data, stable props for expensive children, or selector outputs reused often. I avoid memoization as reflex; the correct pattern is targeted, measured, and easy to remove if it stops paying rent.

Canonical example: memoizing a filtered and sorted dataset passed into a virtualized grid can prevent recomputing thousands of rows on every keystroke.

## 19) Concurrent rendering pattern

Concurrent rendering is a scheduling pattern where urgent updates stay responsive while lower-priority rendering work can be interrupted, resumed, or deferred. In React, this shows up through transitions, deferred values, and Suspense-driven orchestration rather than true multithreaded UI rendering. The point is not raw speed; it is preserving responsiveness under load by aligning work with user priority.

Canonical example: typing in a search box updates the input immediately, while the expensive result list update runs inside a transition so typing does not feel blocked.

## 20) Skeleton loading pattern

Skeleton loading shows a structural placeholder that resembles the final UI while data is loading. It improves perceived performance because users see layout intent immediately instead of staring at a spinner with no spatial context. The pattern works best when the skeleton closely matches final content shape and does not linger long enough to feel deceptive.

Canonical example: a product card grid renders image boxes, title bars, and price bars in their final positions while the actual catalog data is loading.

## 21) Debounce/throttle pattern

Debounce delays execution until input has stopped for a given interval, while throttle limits execution frequency during continuous input. Debounce is useful for search queries, autosave, and resize handling when only the settled value matters; throttle is better for scroll, drag, and pointer updates where periodic feedback must continue. The trade-off is always latency versus load, so the chosen interval should match user intent rather than arbitrary round numbers.

Canonical example: debounce search API calls after 250ms of idle time, but throttle scroll position updates to once every 100ms.
