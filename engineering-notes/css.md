1) Cascade and specificity

Note: Explain how the cascade works and how you avoid specificity wars.

Order, specificity, and importance determine the winner. High-level order: user agent styles < user styles < author styles; within author styles, later sources override earlier (inline styles outrank external/embedded), `!important` overrides normal rules, and then specificity decides ties (inline > id > class/attribute/pseudo-class > element). I keep selectors shallow, use class-based selectors, and rely on layering (@layer) to control order instead of increasing specificity. Predictable cascade beats clever selectors.

2) Box model and sizing

Note: How do you prevent layout surprises?

I default to box-sizing: border-box so padding and borders don’t expand layout unexpectedly. The other model is content-box (the default), where width/height only cover the content and padding/border add to the final size. Content-box exists for legacy and occasionally fits when you want the content area to be exact (e.g., images or iframes with fixed content dimensions), but border-box is generally easier to reason about for layouts. I’m explicit about sizing constraints and avoid magic numbers where possible.

3) Layout: Flexbox vs Grid

Note: When do you choose Flexbox vs Grid?

Flexbox is best for one-dimensional layout (row or column). Grid is for two-dimensional layout and alignment of both rows and columns. I choose based on the structure, not preference.

4) Positioning and stacking contexts

Note: What trips people up with position and z-index?

New stacking contexts are isolated painting layers; children can’t escape above elements in other contexts. They’re created by positioned elements with z-index, transforms, opacity < 1, filter, perspective, mix-blend-mode, and other properties. This can trap elements and make z-index “not work.” I debug by identifying which element creates the stacking context and keep z-index values scoped per component.

5) Responsive design and units

Note: How do you make layouts responsive?

Use fluid units (%, vw, vh, rem), modern constraints (clamp), and container queries when appropriate. Media queries are still useful, but container queries reduce coupling to viewport size.

Proportional (relative) vs non‑proportional (absolute) units:
- **Proportional** units scale with a reference: `em` (current element font size), `rem` (root font size), `%` (relative to parent or to the specific property’s reference), `vw`/`vh` (viewport size).
- **Non‑proportional** units are fixed: `px`, `cm`, `in`, etc. They don’t scale with user settings or container size.

Common differences:
- `em`: relative to the **element’s** computed font size → can compound through nesting.
- `rem`: relative to the **root** (`html`) font size → stable across nesting.
- `%`: relative to the **property’s reference** (e.g., width vs height vs font-size differ).
- `vh`/`vw`: relative to viewport height/width → good for full‑screen sections, risky for mobile browser UI changes.

Rule of thumb: use proportional units for layout and type scale, use fixed units only when you need precise, non-scaling values.

6) CSS variables and theming

Note: Why are CSS variables important?

They enable runtime theming and dynamic values without JS-driven style injection. CSS variables are declared with `--name` and referenced via `var(--name)`. I define them at `:root` for global defaults or on a component class to scope them to a subtree, then combine them with calc/clamp for responsive tokens.

Example:

```css
:root {
  --brand: #0f62fe;
  --space: 1rem;
}

.card {
  --brand: #2b8a3e; /* override locally */
  border: 2px solid var(--brand);
  padding: calc(var(--space) * 1.5);
}
```

Theming example (override variables on a wrapper):

```css
.theme-light {
  --bg: #ffffff;
  --text: #111111;
}

.theme-dark {
  --bg: #111111;
  --text: #f5f5f5;
}

.panel {
  background: var(--bg);
  color: var(--text);
}
```

```html
<div class="theme-light">
  <section class="panel">Light theme</section>
</div>

<div class="theme-dark">
  <section class="panel">Dark theme</section>
</div>
```

7) Layers and scope

Note: How do @layer and @scope help at scale?

@layer lets me define cascade order (base, components, utilities) without specificity hacks. @scope limits selector reach to a subtree, reducing leakage and making styles more component-like.

Example:

```css
@layer reset, base, components, utilities;

@layer reset {
  * { box-sizing: border-box; margin: 0; }
}

@layer base {
  body { font-family: system-ui, sans-serif; }
  h1 { font-size: 2rem; }
}

@layer components {
  .card { padding: 1rem; border-radius: 8px; }
}

@layer utilities {
  .p-2 { padding: 0.5rem; }
  .text-center { text-align: center; }
  .card { padding: 2rem; }
}
```

8) Performance: layout and paint

Note: How do you avoid costly reflows and repaints?

I minimize layout thrash by:
- avoiding JS reads/writes in loops
- keeping the DOM shallow/isolated so layout changes affect fewer nodes - use content-visibility for large offscreen content
- prefer transforms/opacity for animations. 

Reflow (layout) recalculates geometry/positions; repaint redraws pixels without changing layout. 
`content-visibility: auto` lets the browser skip rendering work for offscreen elements while still reserving space (often paired with `contain-intrinsic-size` to avoid layout shifts). 
I use will-change sparingly when I know an element will animate.

9) Accessibility in CSS

Note: What CSS choices affect accessibility?

Ensure sufficient color contrast, visible focus states, and readable line lengths. Avoid removing outlines without replacement. Respect user preferences (reduced motion, color scheme).

Example (prefers-color-scheme):

```css
:root {
  color-scheme: light dark;
  --bg: #ffffff;
  --text: #111111;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111111;
    --text: #f5f5f5;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}
```

10) Forms and UI controls

Note: How do you style form controls without breaking them?

I start from native controls, enhance with appearance: none only when necessary, and keep focus/hover/disabled states obvious. I avoid hiding inputs without providing an accessible equivalent. Newer 
`field-sizing: content` lets text inputs size to their content (instead of a fixed width), which can reduce JS-based autosizing.

11) Modern features worth knowing

Note: Which CSS features changed how you build UIs?

- Container queries
- :has()
-  native nesting
- aspect-ratio
- logical properties and cascade tools like @layer and @scope reduced the need for JS and preprocessors. 
- Core layout primitives like Flexbox, Grid, and position: sticky were also major shifts that eliminated large classes of layout JS. 

These features simplify responsive and stateful styling while keeping performance predictable.

12) Sass: @extend vs mixins vs functions

Note: When do you use @extend, mixins, or functions?

- `@extend` merges selectors so they share the same rule set. Best with `%placeholders` to avoid unintended selector bloat.
- `@mixin` emits blocks of CSS (properties, nested rules, media queries). Use for repeated rule sets.
- `@function` returns a value (numbers, colors, strings). Use for calculations you reuse in many declarations.

Rule of thumb: extend for shared selectors, mixins for repeated CSS output, functions for computed values.
