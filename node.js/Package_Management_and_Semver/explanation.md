# Package Management and SemVer

## What matters

- Dependency management is part of production reliability.

## Interview points

- SemVer: major breaks compatibility, minor adds backward-compatible features, patch fixes bugs. A lockfile records the exact installed dependency versions.
- Lockfiles matter for reproducible installs.
- Wide version ranges reduce manual work but increase surprise.

## Commands

- Use `npm install / npm i` to add a dependency or to install dependencies during normal local development.
- Use `npm ci` in CI, containers, and reproducible builds when a lockfile already exists and you want a clean install of exactly locked versions.
- Prefer `npm ci` over `npm install` in automation because it is stricter and fails if `package.json` and the lockfile disagree.
- Use `npm install <package>` to add a runtime dependency and update `package.json` plus the lockfile.
- Use `npm install -D <package>` for dev-only tools such as test runners, linters, or bundlers.
- Use `npm audit` to check installed packages against known vulnerability advisories, but do not treat it as a full security review.

## Senior notes

- Review dependency updates, not just direct dependencies.
- Minimize dependencies in critical paths and security-sensitive code.
- For teams, commit the lockfile and make CI use `npm ci`.
