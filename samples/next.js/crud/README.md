# Next.js Relational CRUD Dashboard Sample

## Overview

This sample is an expanded App Router dashboard that demonstrates:

- Multiple related JSON-backed models (`companies`, `users`, `projects`, `tasks`)
- Rich validation with Zod
- Cross-entity business rules (foreign-key style checks)
- CRUD operations for each entity
- Layered test coverage: unit, integration, React Testing Library, and Playwright e2e

All persistence is in-memory client state seeded from JSON files in `data/`.

## Data Model

- `companies`
  - `id`, `name`, `domain`, `employeeCap`
- `users`
  - `id`, `name`, `email`, `role`, `age`, `companyId`
- `projects`
  - `id`, `name`, `companyId`, `ownerUserId`, `status`, `budget`, `startDate`, `endDate`
- `tasks`
  - `id`, `title`, `projectId`, `assigneeUserId`, `priority`, `status`, `estimateHours`, `dueDate`

## Validation Rules (Examples)

- Company names/domains must be unique
- User email must be unique
- User must belong to an existing company
- Company employee cap cannot be exceeded
- Project owner must exist and belong to the same company
- Project end date must be on/after start date
- Task assignee must belong to the project company
- Task due date must fit in project date range
- Deletes are restricted when dependencies still exist

## File Layout

- `app/page.jsx`
  - Dashboard UI with CRUD forms and relational tables
- `lib/schemas.js`
  - Zod schemas and field-level validation
- `lib/dashboard-store.js`
  - Business rules and immutable CRUD operations
- `tests/unit/`
  - Schema-focused unit tests
- `tests/integration/`
  - Domain-level integration tests
- `tests/rtl/`
  - Component behavior tests with React Testing Library
- `e2e/`
  - Playwright end-to-end tests

## Run Locally

```bash
cd samples/next.js/crud
npm install
npm run dev
```

## Test Commands

```bash
npm run test:unit
npm run test:integration
npm run test:rtl
npm run test
npm run test:coverage
npm run test:e2e
```

For first Playwright run, install browser binaries if needed:

```bash
npx playwright install
```

## Generated Artifacts

These paths are generated locally and ignored by git:

- `.next/`
- `coverage/`
- `test-results/`
- `playwright-report/`
