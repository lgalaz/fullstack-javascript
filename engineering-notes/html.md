1) Semantic HTML and accessibility

Note: Explain why semantic elements matter and how they affect accessibility and SEO.

Semantic elements (header, nav, main, article, section, footer) carry meaning that assistive tech and search engines use. They reduce the need for ARIA, improve keyboard navigation landmarks, and make documents easier to scan. Semantics also come from attributes like label `for` + input `id`, table `scope`, and meaningful `alt` text. My rule: use semantic tags first, ARIA only to fill gaps, because redundant or incorrect ARIA can override native semantics in the accessibility tree and cause worse screen reader behavior.

2) Document structure and landmarks

Note: How do you structure a page for screen readers?

I ensure a single main landmark, a proper heading outline, and obvious navigation regions. I avoid skipping heading levels because screen readers build an outline; jumping from h2 to h4 can make the structure confusing. There’s no fixed number of levels, but they should be nested logically (h1 → h2 → h3). Landmarks (main, nav, header, footer, aside, section with accessible name) let users jump between regions quickly. This is a baseline a11y win with zero JS.

3) Forms and native validation

Note: How do you build accessible, reliable forms?

Every input needs a label (explicit or implicit). Explicit label: `<label for="email">` paired with `id="email"`. Implicit label: wrapping the input inside `<label>...</label>`. I use fieldset/legend for grouped options. I leverage native validation (required, type, minlength, pattern) and add accessible error text via aria-describedby. Validation should be predictable, not only after submit.

4) ARIA: when and when not

Note: What’s your ARIA philosophy?

ARIA is a supplement, not a replacement for proper HTML. If a native element exists (button, input, select), use it. Only add ARIA when semantics are missing or custom widgets need role/state. Incorrect ARIA is worse than none.

5) Images and media

Note: How do you handle images for performance and accessibility?

Use meaningful alt text for content images, empty alt (`alt=""`) for decorative images so screen readers skip them. Prefer modern formats (AVIF/WebP), size images responsively with srcset/sizes, and add loading="lazy" for below-the-fold. Always set width/height to avoid CLS.

6) Script loading and performance

Note: Explain defer vs async and module scripts.

"defer" preserves order and runs after HTML parse; "async" runs ASAP and can reorder. For app bundles I prefer type="module" + defer semantics because modules are deferred by default, preserve dependency order, and avoid blocking HTML parsing while still executing predictably. Modules also use `import`/`export` (ES Modules), giving the browser a dependency graph it can preload/parallelize and cache more effectively. That static graph is also what bundlers use for tree-shaking (dead-code elimination), even though the browser itself doesn’t remove unused exports; the benefit is a smaller bundle at build time, which reduces download/parse/execute cost. I keep third-party scripts async if order doesn’t matter.

7) Progressive enhancement

Note: How do you avoid fragile JS-only UX?

Start with functional HTML forms/links, then enhance with JS. This keeps the app usable when JS fails and improves SEO. I avoid replacing native behaviors unless needed.

8) Links, navigation, and SPA routing

Note: What’s important for links?

Always use real <a href> for navigation. It preserves accessibility, right-click/open-in-new-tab, and proper browser behavior. SPA routers should intercept, not replace, standard link semantics. Using divs with onClick used to be a common SPA shortcut to avoid full page reloads, but it breaks keyboard support, semantics, and browser features. Modern routers intercept real links (e.g., `preventDefault` + History API), so you get SPA navigation without sacrificing native behavior.

9) Tables and data semantics

Note: When do you use tables, and how do you do them correctly?

Tables are for tabular data. Use <th>, scope, and captions for accessibility. Avoid tables for layout; use CSS instead (flex/grid with semantic containers like div/section/article).

10) DOM events and delegation

How do you handle large lists of events?

Prefer event delegation at a parent when many similar elements exist. It reduces the number of listeners, makes dynamic content work without re-binding, and avoids per-node overhead.
Note: Most events bubble up the DOM by default (except a few like focus/blur), so a parent can handle child interactions unless propagation is stopped.
This can also reduce JS overhead by avoiding per-node listeners, which means less memory for listener closures and less work when large lists update or rerender.

Bad (listener per item):

```html
<ul id="list">
  <li data-id="1">Item 1</li>
  <li data-id="2">Item 2</li>
</ul>
<script>
  document.querySelectorAll('#list li').forEach((li) => {
    li.addEventListener('click', () => handleClick(li.dataset.id));
  });
</script>
```

Good (delegate to parent):

```html
<ul id="list">
  <li data-id="1">Item 1</li>
  <li data-id="2">Item 2</li>
</ul>
<script>
  document.getElementById('list').addEventListener('click', (e) => {
    const item = e.target.closest('li');
    if (!item) return;
    handleClick(item.dataset.id);
  });
</script>
```

11) Web components and shadow DOM

Note: When are web components appropriate?

They’re useful for framework-agnostic widgets or design system primitives that need to work across multiple apps. Shadow DOM creates a separate DOM subtree with its own scoped styles, so component CSS won’t leak out and global CSS won’t leak in. The tradeoff is theming and accessibility: you need explicit CSS variables or part exports to theme, and you must ensure focus/aria behavior is still correct across the shadow boundary. I use it intentionally when isolation is more valuable than easy global styling.
Note: iframes are different; they create a separate document/browsing context, not a Shadow DOM.

Example (Shadow DOM):

```html
<fancy-card>Shadow content</fancy-card>
<script>
  class FancyCard extends HTMLElement {
    connectedCallback() {
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = \`
        <style>
          :host {
            display: block;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 12px;
            background: white;
          }
          .title {
            font-weight: 600;
          }
        </style>
        <div class="title">Card</div>
        <slot></slot>
      \`;
    }
  }

  customElements.define('fancy-card', FancyCard);
</script>
```

12) Security basics in HTML

Note: What are your HTML-level security concerns?

- Avoid inline scripts: Inline JS makes XSS (cross-site scripting) easier because injected HTML can execute immediately. It also forces CSP to allow `unsafe-inline`, weakening protections. Inline scripts are JavaScript written directly in the HTML document—either inside <script>...</script> tags or as event-handler attributes like onClick="...". They run in the page context without loading an external file. Mitigate by moving JS into external files, using event listeners instead of inline handlers, and enforcing CSP with nonces/hashes instead of `unsafe-inline`.
  - Example (event listener in external JS):
    ```js
    document.getElementById('save').addEventListener('click', save);
    ```
  - CSP nonce: server generates a per-request token, sends it in the CSP header and on allowed script tags.
    ```http
    Content-Security-Policy: script-src 'self' 'nonce-abc123'
    ```
    ```html
    <script nonce="abc123">/* allowed */</script>
    ```
  - CSP hash: CSP includes a hash of a specific inline script’s contents; only that exact script runs.
    ```http
    Content-Security-Policy: script-src 'self' 'sha256-Base64HashHere='
    ```
- Use CSP: A Content Security Policy restricts where scripts, styles, images, and frames can load from (e.g., `script-src`, `style-src`, `img-src`, `connect-src`, `frame-ancestors`). This limits damage if an injection occurs.
  - `script-src`: allowed sources for JavaScript.
  - `style-src`: allowed sources for CSS.
  - `img-src`: allowed sources for images.
  - `connect-src`: allowed endpoints for XHR/fetch/WebSocket/EventSource.
  - `frame-ancestors`: which parents are allowed to embed the page in an iframe/frame/object (clickjacking protection).
    - Legacy equivalent: `X-Frame-Options: DENY | SAMEORIGIN` (use CSP `frame-ancestors` when possible).
  - Clickjacking: a malicious site overlays your page in a hidden/transparent frame to trick users into clicking unintended actions.
- Sanitize user HTML: Any user-generated HTML must be sanitized to remove scripts/events/unsafe URLs to prevent XSS. React names it `dangerouslySetInnerHTML` to highlight the risk; you must sanitize before injecting.
  - How: use a trusted sanitizer (e.g., DOMPurify) to allow only safe tags/attributes and strip scripts, inline event handlers (on*), and `javascript:` URLs. Prefer server-side sanitization where possible.
- Use `rel="noopener noreferrer"` on `target="_blank"`: Prevents the new tab from accessing `window.opener`, which mitigates tab-nabbing (a malicious page can call `window.opener.location = ...` to redirect the original tab to a phishing page).
  - noopener prevents the new tab from getting a reference to window.opener.
  - noreferrer prevents the browser from sending the Referer header and also implies noopener in most browsers.
