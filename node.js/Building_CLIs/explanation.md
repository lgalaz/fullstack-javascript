# Building Command-Line Tools (CLIs)

## What matters

- A good CLI has clear flags, useful help, and meaningful exit codes.

## Interview points

- Parse args predictably and validate input early.
- Write errors to stderr and normal output to stdout.
- Use `process.exitCode` unless immediate termination is required.

## Senior notes

- CLIs are production software too: support `--help`, automation-friendly output, and stable behavior.
- Use a library such as `commander` or `yargs` once flag parsing becomes non-trivial.

## Example

```javascript
const args = process.argv.slice(2);

if (args.includes('--help')) {
  console.log('Usage: node cli.js <name>');
  process.exitCode = 0;
} else if (!args[0]) {
  console.error('Missing name');
  process.exitCode = 1;
} else {
  console.log(`Hello ${args[0]}`);
}
```
