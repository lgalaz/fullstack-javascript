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

## Common Use Cases

- Large organizations with multiple frontend teams owning separate domains (account, billing, admin), needing independent release cycles.
- Products with distinct surfaces (marketing site + app + embedded widgets) that still share some UI parts.
- Gradual migrations where a legacy frontend is incrementally replaced by new apps.

Note: microfrontends are often chosen for organizational scalability (team autonomy) rather than pure technical necessity; they do add complexity and can introduce security and performance risks if not managed carefully.

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

Note: a shell/container app orchestrates loading and mounting the microfrontends. It can do this at build time (compose bundles) or at runtime (module federation/import maps). A single framework is simplest, but mixed frameworks are possible via Web Components or iframes at the cost of more complexity.
