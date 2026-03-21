# Configuration and Secrets

## What matters

- Config is environment-specific input such as ports, URLs, feature flags, or credentials.
- Secrets are sensitive config with stricter handling requirements.

## Interview points

- Validate config at startup and fail fast.
- Keep secrets out of source control and logs.
- Use environment variables or a secrets manager, not hardcoded values.

## Senior notes

- Treat config shape as part of the app contract.
- Rotating secrets and changing config safely is an operational concern, not just a coding concern.

## Example

```javascript
const port = Number(process.env.PORT || 3000);

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL');
}
```
