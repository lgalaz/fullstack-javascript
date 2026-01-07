# Microfrontends

## Introduction

Microfrontends apply microservices ideas to the frontend. A UI is split into independently built and deployed pieces that compose into a single experience.

## What It Is

- Multiple frontend apps integrated into one shell.
- Teams can deploy features independently.
- Integration via build-time composition or runtime federation.

## When It Is the Best Solution

- Large frontend teams with separate release cycles.
- Multiple domains in one UI that can be isolated.
- You need independent deployment for UI features.

## Misuse and When It Is Overkill

- Overkill for small teams or simple UIs.
- Can introduce inconsistent UX and performance issues.
- Complex shared state and routing if not designed carefully.

## Example (Runtime Composition)

```text
Shell App
  - Loads Header App
  - Loads Account App
  - Loads Orders App
```

```javascript
// pseudo: render remote components
renderShell([
  loadRemote('header'),
  loadRemote('account'),
  loadRemote('orders'),
]);
```
