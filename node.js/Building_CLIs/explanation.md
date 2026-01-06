# Building Command-Line Tools (CLIs)

## Introduction

Node.js is excellent for developer tooling. A good CLI parses arguments, validates input, and returns meaningful exit codes.

## Example: Simple CLI

This CLI reads arguments from `process.argv`, validates input, and returns a non-zero exit code on failure.

```javascript
// cli.js
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: node cli.js <name> <count>');
  process.exitCode = 1;
} else {
  const name = args[0];
  const count = Number(args[1]);
  if (Number.isNaN(count)) {
    console.error('count must be a number');
    process.exitCode = 1;
  } else {
    for (let i = 0; i < count; i += 1) {
      console.log(`Hello ${name}`);
    }
  }
}
```

Run:

```
node cli.js Ada 3
```

## Practical Guidance

- Use `process.exitCode` instead of calling `process.exit()` directly.
- Provide help and examples for users.
- Consider a parser library (commander, yargs) for complex CLIs.
