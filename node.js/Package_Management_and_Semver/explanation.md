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

## Lockfiles

Lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`) freeze exact dependency versions for reproducible builds.

## Example: package.json

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
- Use `npm audit` and `npm outdated` regularly.
