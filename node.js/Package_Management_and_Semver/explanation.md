# Package Management and SemVer

## Introduction

Node.js uses npm (or pnpm/yarn) and semantic versioning (SemVer) to manage dependencies. A senior-level understanding prevents production regressions and supply-chain issues.

## SemVer Basics

- MAJOR: breaking changes (1.x -> 2.x)
- MINOR: new features, backward compatible (1.2 -> 1.3)
- PATCH: bug fixes (1.2.3 -> 1.2.4)

## Version Ranges

- `^1.2.3` allows compatible minor/patch updates.
- `~1.2.3` allows patch updates only.
- `1.2.3` is pinned to a single version.

These ranges control how your dependencies float when you run `npm install`. Wider ranges reduce manual upgrades but increase the risk of unexpected behavior.

## Lockfiles

Lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`) freeze exact dependency versions for reproducible builds.

## Example: package.json

This minimal `package.json` shows pinned metadata, a dependency with a caret range, and a start script.

```json
{
  "name": "node-app",
  "version": "1.0.0",
  "type": "commonjs",
  "dependencies": {
    "dotenv": "^16.4.0"
  },
  "scripts": {
    "start": "node index.js"
  }
}
```

## Practical Guidance

- Commit lockfiles for every app and service.
- Review dependency updates and avoid unbounded ranges for critical code.
- Use `npm audit` and `npm outdated` regularly (`npm audit` reports known security vulnerabilities in your dependency tree; `npm outdated` shows which packages have newer versions available).
