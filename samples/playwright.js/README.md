# Playwright Google Search Sample

This sample uses Playwright to open Google, search for "end to end testing", and verify results.

## Install

```bash
npm install
npx playwright install
```

## Run

```bash
npm test
```

For a visible browser run:

```bash
npm run test:headed
```

Notes:
- Google may show a consent dialog depending on region. The test attempts to accept it if present.
- If Google changes its UI, the selectors may need updates.
