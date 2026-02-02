# Accessibility Basics in React

## Introduction

Accessibility (a11y) means people can use your UI with keyboards, screen readers, and different abilities. In React, most accessibility work is about correct semantic  HTML, focus management, and consistent labeling.

## Prefer semantic HTML

Use semantic elements (`button`, `label`, `nav`, `main`, `section`) instead of clickable `div`s. Semantics give you keyboard and screen reader behavior for free.

Bad:

```jsx
<div onClick={save}>Save</div>
```

Good:

```jsx
<button type="button" onClick={save}>Save</button>
```

## Labels and form controls

Always associate labels with inputs. If you need a generated id, use `useId` to keep it stable.

```jsx
import { useId } from 'react';

function EmailField() {
  const id = useId();

  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" autoComplete="email" />
    </>
  );
}
```

Use `aria-describedby` for helper text and error messages. The error text can be conditionally rendered or visually hidden until there is an error.

```jsx
function EmailField({ value, onChange, showError }) {
  const id = useId();
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  return (
    <>
      <label htmlFor={id}>Email</label>
      <input
        id={id}
        type="email"
        value={value}
        onChange={onChange}
        aria-describedby={`${helpId} ${showError ? errorId : ''}`.trim()}
        aria-invalid={showError}
      />
      <p id={helpId}>We will not share your email.</p>
      {showError ? (
        <p id={errorId} role="alert">Email is required.</p>
      ) : (
        <p id={errorId} role="status" style={{ display: 'none' }}>
          {/* placeholder so id is stable */}
        </p>
      )}
    </>
  );
}
```

## Keyboard support

If a component is interactive, it must be reachable and usable with the keyboard:

- Use native elements when possible.
- If you must build a custom control, add `tabIndex={0}` and handle `Enter`/`Space` so keyboard users can focus and activate it like a real button.
`tabIndex={0}` puts the custom element into the natural tab order so keyboard users can reach it. Without it, a <div> isn’t focusable, so it’s skipped by Tab. tabIndex={0} also lets it receive keyboard events like Enter/Space.

Quick rules:

tabIndex={0}: focusable in normal order (use for custom controls).
tabIndex={-1}: focusable only via JS (use for programmatic focus).
tabIndex={1+}: creates confusing tab order; avoid.
- Visible focus states are required; do not remove outlines without a replacement.

Example (custom div behaving like a button). A plain div is not focusable and does not respond to Enter/Space, so we add those behaviors explicitly:

```jsx
function CardButton({ onActivate, children }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={handleKeyDown}
      style={{ outlineOffset: 2 }}
    >
      {children}
    </div>
  );
}
```

## Focus management

When UI changes, set focus to the right place:

- After a modal opens, move focus inside it.
- On close, return focus to the trigger.
- After a form error, move focus to the first invalid field.

Example (focus on first error):

```jsx
import { useRef, useState } from 'react';

function LoginForm() {
  const emailRef = useRef(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      setError(true);
      emailRef.current?.focus();
      return;
    }
    setError(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        ref={emailRef}
        value={email}
        onChange={e => setEmail(e.target.value)}
        aria-invalid={error}
      />
      {error ? <p role="alert">Email is required.</p> : null}
      <button type="submit">Sign in</button>
    </form>
  );
}
```

## ARIA as a last resort

ARIA adds semantics only when native HTML cannot. Do not add ARIA to native elements that already have the right role.

## Quick checklist

- Use semantic HTML.
- Label inputs properly.
- Ensure all actions work with keyboard only.
- Provide visible focus styles.
- Announce dynamic changes with `role="alert"` or `aria-live` when needed:
  - `role="alert"`: an assertive live region; screen readers announce immediately (good for errors).
  - `aria-live="polite"` or `"assertive"`: announces changes in that region; polite waits for a pause, assertive interrupts.