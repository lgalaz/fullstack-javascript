## What is JavaScript’s execution model at a high level?

JavaScript is single-threaded for user code, but it runs on top of an event loop that coordinates asynchronous work. The runtime (browser or Node.js) provides task queues for macrotasks (timers, I/O, user events) and microtasks (promise reactions, queueMicrotask). The call stack runs until empty, then the engine drains microtasks, then processes the next macrotask. This model allows concurrency through non-blocking APIs while preserving deterministic single-threaded execution of your code.

## How does the event loop differ between browsers and Node.js?

Browsers have a single event loop that interleaves rendering with task execution. Node.js has a more explicit loop with phases (timers, pending callbacks, idle/prepare, poll, check, close), plus a microtask queue and a nextTick queue. Node’s event loop is optimized for I/O; the browser loop must also coordinate rendering, input, and animation frames. In Node, long-running CPU work blocks the loop and stalls I/O; in browsers it blocks UI updates and input responsiveness.

## What are the practical differences between microtasks and macrotasks?

Microtasks (Promise callbacks, queueMicrotask) run after the current call stack completes and before the next macrotask, which means they can starve rendering and I/O if abused. Macrotasks (setTimeout, I/O, message events) run one at a time between microtask drains. A key implication is that Promise chains can delay timers and UI updates; you should avoid unbounded microtask loops and be mindful of scheduling when coordinating UI and network work.

## Explain how closures work and why they matter in real systems.

A closure is a function plus its lexical environment. It captures variables by reference, not by value, so state can be preserved across invocations. This enables encapsulation (private state), function factories, and higher-order APIs. The trade-off is memory: captured variables keep objects alive, which can cause leaks if closures live longer than expected (e.g., long-lived event handlers retaining large graphs). Good practice is to keep captured state minimal and explicitly remove listeners when no longer needed.

## What’s the difference between lexical scope and dynamic scope?

JavaScript uses lexical scope, which means variable resolution is based on the code’s static structure, not on the call stack at runtime. This makes behavior predictable and allows tools to reason about variables. Dynamic scoping would resolve variables based on the caller’s environment, which JS does not do.

## How does `this` binding work in JavaScript?

`this` depends on how a function is called. In strict mode, plain function calls have `this === undefined`. Method calls bind `this` to the receiver object. Constructors (`new`) bind `this` to a fresh object. Arrow functions do not bind `this`; they capture `this` from the surrounding lexical scope. You can also control `this` explicitly with `call`, `apply`, or `bind`. Most bugs come from losing method context or mixing arrow functions with methods inappropriately.

## What is hoisting and how should it influence style?

Declarations are processed before execution. `var` is hoisted and initialized to `undefined`, which can cause surprising behavior. `let` and `const` are hoisted but remain in the temporal dead zone until initialized, which prevents access before declaration. Function declarations are hoisted with their body. A good style is to prefer `const`/`let` and keep declarations near usage to avoid hoisting surprises.

## What are the most important differences between `var`, `let`, and `const`?

`var` is function-scoped and allows re-declaration, leading to bugs in loops and blocks. `let` is block-scoped and allows reassignment. `const` is block-scoped and disallows reassignment but does not make objects immutable. Prefer `const` by default and `let` only when reassignment is required.

## How does JavaScript’s prototype chain enable inheritance?

Objects inherit from other objects via the prototype chain. Property lookup walks up the chain until it finds a match or reaches `null`. Functions have a `prototype` property used when creating instances with `new`. This is delegation, not classical inheritance: behavior is shared by linking objects rather than copying. ES6 classes are syntactic sugar over prototypal inheritance, with some extra checks and semantics.

## What are the trade-offs between classes and factory functions?

Classes provide a familiar syntax, method sharing via prototype, and `instanceof` checks, which can aid readability in large codebases. Factory functions are flexible, can encapsulate private state via closures, and avoid `this` pitfalls. The trade-off is memory: factories can create per-instance methods, while classes share methods. For complex object graphs, classes are often more memory-efficient; for domain modeling with invariants and privacy, factories can be clearer.

## How does type coercion work and when is it dangerous?

JavaScript performs implicit conversions in many contexts: `+` can mean numeric addition or string concatenation; `==` performs abstract equality with coercion; truthiness is based on a small set of falsy values. Coercion becomes dangerous when it hides intent or introduces edge cases (`[] == ''` is true, `null == undefined` is true). Prefer `===`, explicit conversions (`Number`, `String`, `Boolean`), and avoid relying on truthiness for numeric or nullable values.

## Explain the differences between `==` and `===`.

`===` checks strict equality without coercion, so types must match. `==` performs type coercion with complex rules; it’s only safe when you explicitly want the loose semantics (for example, `value == null` as a compact check for `null` or `undefined`). In most cases, `===` is the correct default because it makes intent explicit.

## How do Promises work internally, and how do you avoid common pitfalls?

Promises represent a value that may be available in the future. They transition from pending to fulfilled/rejected once, then notify attached handlers as microtasks. Pitfalls include forgetting to return a promise in a chain (breaking sequencing), mixing `async/await` with bare `new Promise` wrappers, and missing error handling (unhandled rejections). Use `await` for linear flow, `Promise.all` for parallelism, `Promise.allSettled` for partial failure tolerance, and always consider cancellation or timeouts via `AbortController`.

## What is the difference between `async/await` and Promise chaining?

They are the same model expressed differently. `async/await` is syntax sugar over Promises that makes control flow read like synchronous code, improving readability. The same execution semantics apply: `await` yields back to the event loop and resumes in a microtask. The main decision is readability and error handling style; try/catch around `await` is often clearer than chained `.then/.catch`.

## How would you implement cancellation for async operations in JavaScript?

The standard mechanism is `AbortController` and `AbortSignal`. You pass the signal to APIs like `fetch`, and you propagate the signal into your own async functions by checking `signal.aborted` and wiring `signal.addEventListener('abort', ...)` to reject. Cancellation is cooperative; it doesn’t stop arbitrary JS code mid-execution. The design goal is to make cancellation explicit and consistent across your async boundaries.

## What are iterables, iterators, and generators, and where do they fit?

An iterable exposes a `[Symbol.iterator]` that returns an iterator with `next()` returning `{ value, done }`. Generators create iterators conveniently and can yield values over time. They are useful for lazy sequences, data pipelines, or implementing custom control flow. In async contexts, `async` generators and `for await...of` let you consume streams of async values, which is powerful for processing paginated APIs or I/O streams.

## When would you use Map/Set over Object/Array?

Use `Map` when keys are not strings/symbols or when you want reliable key insertion order and predictable iteration. Use `Set` for unique collections with fast membership checks. Objects are still great for fixed-shape records and JSON-compatible data. Arrays are for ordered lists, but membership checks are O(n), so prefer `Set` for large collections with frequent lookups.

## What are WeakMap and WeakSet used for?

They hold weak references to keys, which allows garbage collection when there are no other references. This is useful for caches or metadata associated with objects without preventing cleanup. Weak collections are not enumerable, which is a deliberate trade-off to preserve GC semantics.

## How does the module system work in Node.js vs the browser?

Browsers primarily use ESM with static imports that enable tree-shaking and preloading. Node.js supports both CommonJS (CJS) and ESM, with different resolution rules and interop semantics. CJS uses `require` and runtime evaluation; ESM uses `import` and is more static. In Node, mixing ESM and CJS requires careful boundaries; for example, CJS can `require` ESM only via dynamic `import()`.

## How does package resolution and module caching work in Node.js?

Node resolves modules by walking up `node_modules` directories, then uses `package.json` fields like `main`, `exports`, and `type` to determine entry points. Modules are cached by resolved path, so requiring the same module twice returns the same instance, which can be used for singletons but can cause state leakage across tests. Understanding resolution helps avoid subtle production differences (e.g., with `exports` maps).

## What are Node.js streams and why are they important?

Streams provide incremental processing of data to avoid buffering everything in memory. Readable streams emit chunks; writable streams accept chunks; transform streams modify data as it flows. They matter for large files, network pipes, and backpressure management. Good stream usage keeps memory stable and throughput high, which is critical for server reliability.

## Explain backpressure and how you handle it with streams.

Backpressure is the mechanism by which a slow consumer signals a fast producer to pause. In Node streams, `write()` returning false indicates the buffer is full; the producer should wait for the `drain` event. In `pipe()`, backpressure is handled automatically. Ignoring backpressure leads to memory growth and unstable throughput.

## What are the key security concerns for JavaScript in the browser?

The top risks are XSS, CSRF, and clickjacking. XSS is mitigated by output encoding, avoiding unsafe HTML injection, and using CSP. CSRF is mitigated by same-site cookies, CSRF tokens, and proper CORS policies. Clickjacking is mitigated by `X-Frame-Options` or CSP `frame-ancestors`. A senior engineer treats security as a default concern, not an afterthought.

## How do CORS and the Same-Origin Policy work?

The Same-Origin Policy prevents scripts from reading responses from different origins. CORS is a relaxation mechanism controlled by the server via response headers. Browsers enforce it; servers do not. Preflight requests (OPTIONS) happen for non-simple requests. Correct configuration requires explicit allowed origins, methods, and credentials handling, and avoiding wildcard origins when credentials are used.

## What are Service Workers and when are they appropriate?

Service Workers are background scripts that intercept network requests and can cache responses, enable offline behavior, and perform background sync. They are appropriate for performance-critical, offline-capable, or highly interactive web apps. They add complexity: cache invalidation, update lifecycle, and debugging are non-trivial, so they should be used only when the product benefits justify the operational cost.

## What is the rendering pipeline in the browser and how does JS impact it?

The pipeline is style calculation, layout, paint, and compositing. JS can trigger reflows by reading layout properties after mutations (layout thrashing). Heavy JS blocks the main thread and delays rendering and input processing, harming INP and LCP. Performance-sensitive code batches DOM writes, avoids forced synchronous layouts, and leverages CSS for animations where possible.

## How do you reason about memory leaks in JavaScript?

Leaks occur when objects are unintentionally kept alive by references (closures, global caches, event listeners, timers). In browsers, detached DOM nodes referenced by JS are common culprits. In Node, long-lived processes can leak via in-memory caches, module singletons, or unbounded arrays/maps. Diagnose with heap snapshots and tracking retained objects, then remove listeners, null references, or introduce eviction policies.

## What are the differences between `Buffer`, `ArrayBuffer`, and `TypedArray`?

`ArrayBuffer` is a fixed-size raw binary buffer in JS. `TypedArray` views (e.g., `Uint8Array`) provide typed access over an `ArrayBuffer`. Node’s `Buffer` is a subclass of `Uint8Array` with additional APIs and is optimized for I/O. Use `ArrayBuffer`/`TypedArray` for web binary work and `Buffer` for Node I/O and protocol handling.

## How does the V8 engine optimize JavaScript, and what coding practices help or hurt?

V8 uses JIT compilation, inline caches, and hidden classes to optimize hot code paths. Code that is stable in shape (objects with consistent properties), avoids megamorphic access, and keeps hot functions small tends to be faster. Frequent shape changes, polymorphic call sites, and de-optimizing patterns (e.g., `try/catch` in hot paths, mixing types) can degrade performance. The practical approach is to write clean, predictable code and profile before micro-optimizing.

## What’s your approach to testing JavaScript code at scale?

Use a test pyramid with unit tests for logic, integration tests for module interactions, and a smaller set of end-to-end tests for critical flows. Aim for deterministic tests, minimal reliance on timers, and clear boundaries to mock I/O. For async code, test timeouts and cancellation paths explicitly. In Node, prefer dependency injection or module boundaries that are easy to stub without global state.

## What are the most common JavaScript memory leaks, and how do you prevent them?

Most leaks come from references that live longer than intended:

- Closures that capture large objects and outlive their usefulness (long-lived callbacks, caches).
- Event listeners that are never removed, especially on long-lived nodes or global targets (window/document).
- Detached DOM nodes kept alive by JS references.
- Timers, intervals, and subscriptions that keep objects reachable.
- Unbounded in-memory caches, arrays, or maps.

Prevention is mostly lifecycle hygiene: remove listeners on teardown, clear timers, keep closure captures minimal, and add eviction/TTL to caches. In React or similar, ensure effect cleanup runs and avoid storing DOM nodes in module scope.

## Why do closures hold memory longer than expected, and how do you handle that?

Closures capture variables by reference, so anything reachable from that environment stays alive as long as the closure is referenced. This is powerful for encapsulation, but it also means a long-lived callback can keep large graphs in memory (DOM nodes, data blobs).

I treat closures like ownership boundaries: keep captured state small, avoid capturing whole objects when only an ID is needed, and prefer weak references or explicit cleanup when the closure should not retain the data.

## Why does WeakMap exist, and when does it actually help?

WeakMap allows keys to be garbage collected when there are no other references, which prevents accidental retention. It is useful for attaching metadata to objects (e.g., memoization, per-element state, private data) without preventing cleanup.

It does not help with non-object keys, and it is not a general cache (not enumerable, no size). Use WeakMap when you want the data to disappear automatically when the object goes away.

## Why do polyfills exist, and what are their limits?

Polyfills exist to provide missing language or web APIs in older environments so developers can rely on modern semantics without branching. They are most effective when the API can be expressed in userland JS and does not require browser internals.

Some things cannot be polyfilled:

- New syntax (optional chaining, decorators) because it requires parser support.
- Low-level browser features (service workers, rendering engine changes, some DOM APIs).
- Exact timing/perf characteristics of native implementations.

When native behavior affects observability (like layout or rendering), polyfills can only approximate.

## What polyfill edge cases trip people up (arrays, thisArg, and order)?

Real-world edge cases:

- Sparse arrays: many array methods skip holes; a polyfill must preserve that behavior.
- thisArg: methods like map/forEach accept a thisArg; forgetting it breaks semantics.
- Execution order: iteration order and side effects must match spec.
- Inherited properties vs own properties: some methods operate on own indexed elements only.

If a polyfill does not mirror the spec exactly, it can create subtle bugs that only show up in older browsers.

## What are the trade-offs of polyfilling versus requiring native APIs?

Polyfills increase bundle size, parse/execute time, and can change performance characteristics. They also increase attack surface if the polyfill is incorrect or outdated. On the other hand, requiring native APIs can break older environments.

My approach is to target a clear browser support matrix, use differential bundling where possible, and include polyfills only for the features actually used. If a feature is core to the product and cannot be polyfilled faithfully, I document the minimum supported browsers and avoid false promises.

## How do microtasks and tasks affect rendering in real scenarios?

The browser drains microtasks after the current call stack and before the next task. This means large microtask chains (Promise callbacks) can delay rendering and input because the browser does not get a chance to paint between them. Tasks (timers, I/O, events) are interleaved with rendering opportunities.

A practical rule: use microtasks for short, immediate follow-ups; use tasks (setTimeout, postMessage) to yield back to the browser when you need to allow rendering or user input.

## What is microtask starvation, and why does it matter?

Microtask starvation happens when code keeps scheduling microtasks faster than they can be drained, so the browser never returns to the task queue and never paints. This can freeze the UI even though the thread is "busy" only with microtasks.

It matters because Promise chains can accidentally create long, unyielding loops. If you need to process a large list, chunk the work and schedule via tasks or requestIdleCallback to allow rendering.

## Why can Promises delay rendering?

Promise callbacks run as microtasks, which are drained before the browser can paint. If a Promise chain does heavy work or schedules more Promises, it can postpone rendering and input handling. This is why long async sequences can still cause jank even though they look "non-blocking".

## When does JavaScript block the browser, and when does it not?

JS blocks the browser when it monopolizes the main thread: long loops, heavy parsing, layout thrashing, or large microtask chains. It does not block when work is offloaded to the browser (native rendering, CSS animations), Web Workers, or when you yield back to the event loop between chunks.

The key is to keep main-thread work short and schedulable, and to push heavy computation or parsing off the main thread whenever possible.

## How do you design for observability in JavaScript services?

Treat observability as a product feature: structured logs, correlation IDs, metrics (latency, error rate, saturation), and tracing across async boundaries. In Node, ensure context propagation across promises and async hooks. For web, instrument performance metrics (LCP/INP/CLS) and key user flows. The goal is fast root-cause analysis without guesswork.

## What’s your strategy for handling breaking changes in a large JavaScript codebase?

Use gradual adoption: codemods for mechanical changes, lint rules to prevent regressions, and compatibility layers or adapters. In Node or front-end platforms, isolate new behavior behind feature flags, ship incrementally, and monitor. For dependencies, lock versions, run CI on update, and avoid reliance on undocumented behavior.

## How do you evaluate when to use Node.js on the server?

Node is excellent for I/O-heavy workloads, real-time systems, and services that benefit from sharing JS code with the front end. It is less ideal for CPU-heavy work unless you offload to worker threads or external services. The decision depends on workload profile, team expertise, and operational constraints; the main risk is blocking the event loop with CPU or synchronous I/O.
