# CSS in JS (React)

## Definition

CSS in JS means authoring styles inside JavaScript (or TypeScript) and scoping them to components. Libraries generate class names at runtime, inject CSS into the document, and often support theme objects, dynamic props, and server-side rendering (SSR) extraction.

## Why teams use it

- Co-locate styles with components for easier refactors.
- Avoid global naming collisions via hashed class names.
- Dynamic styling based on props, theme, or state.
- Build-time or runtime theming with shared tokens.

## Caveats and hydration issues

- **Hydration mismatches**: If the server and client generate different class names (due to non-deterministic input, different library versions, or insertion order), React can warn and re-render the subtree.
- **Style order differences**: If styles are injected in a different order on the client, specificity can change and cause flicker or incorrect styles.
- **FOUC** (flash of unstyled content): If styles are not extracted on the server and inlined in the HTML, the client may briefly render without styles.
- **Runtime cost**: Generating styles on the client adds JavaScript work and can impact performance for large trees.

Mitigations: enable the library's SSR extraction/injection, keep style generation deterministic, and avoid using values like `Date.now()` or `Math.random()` in style props.

## Best Practices

- Prefer static CSS (CSS Modules or build-time extraction) for most styles to avoid runtime overhead.
- Keep dynamic styling to class toggles; predefine variants instead of inline style objects.
- Ensure SSR extracts styles into the initial HTML to prevent FOUC.
- Avoid non-deterministic values in render (random IDs, timestamps) that change between server and client.
- Use stable theming tokens and keep style insertion order consistent.

## Emotion example

```javascript
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const Button = styled.button`
  background: ${props => (props.primary ? '#0ea5e9' : '#e2e8f0')};
  color: ${props => (props.primary ? '#0b1220' : '#0f172a')};
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
`;

function Card({ title }) {

  return (
    <div
      css={css`
        border: 1px solid #e2e8f0;
        padding: 16px;
        border-radius: 10px;
      `}
    >
      <h3>{title}</h3>
      <Button primary>Save</Button>
    </div>
  );
}
```

## styled-components example

```javascript
import styled, { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    brand: '#f97316',
    text: '#0f172a',
  },
};

const Badge = styled.span`
  background: ${props => props.theme.colors.brand};
  color: ${props => props.theme.colors.text};
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
`;

function Profile() {

  return (
    <ThemeProvider theme={theme}>
      <div>
        <h2>Ada Lovelace</h2>
        <Badge>Pro</Badge>
      </div>
    </ThemeProvider>
  );
}
```

## When to consider alternatives

If bundle size or runtime overhead is a major concern, consider static extraction tools (like vanilla-extract or Linaria) or CSS Modules, which avoid runtime style generation and reduce hydration risk.

## Build-time CSS (Static Extraction)

Build-time CSS means styles are compiled to real `.css` files during the build step, so the browser loads them like normal stylesheets. The JavaScript still lets you write styles near components, but the CSS is extracted ahead of time, avoiding runtime style injection and reducing hydration/FOUC risk. This is not server-rendered "dynamic CSS" per request; it is generated once at build time.

Example with `vanilla-extract` (build-time extraction):

```javascript
// styles.css.ts
import { style } from '@vanilla-extract/css';
import { themeTokens } from './themeTokens';

const borderColor = themeTokens.mode === 'light' ? '#e2e8f0' : '#334155';

export const card = style({
  padding: themeTokens.spacing.md,
  borderRadius: themeTokens.radius.md,
  border: `1px solid ${borderColor}`,
});

// themeTokens.ts (build-time constants, not runtime fetch)
export const themeTokens = {
  mode: 'light',
  spacing: { md: 16 },
  radius: { md: 10 },
};

// Card.tsx
import { card } from './styles.css';

export function Card({ title }) {

  return <div className={card}>{title}</div>;
}
```

If you need runtime-driven styles (e.g., after a fetch), keep them separate from build-time extraction:

```javascript
import { useEffect, useState } from 'react';
import { card } from './styles.css';

export function Card({ title }) {
  const [accent, setAccent] = useState('#0ea5e9');

  useEffect(() => {
    fetch('/api/theme')
      .then((res) => res.json())
      .then((data) => setAccent(data.accent));
  }, []);

  return (
    <div className={card} style={{ borderColor: accent }}>
      {title}
    </div>
  );
}
```
