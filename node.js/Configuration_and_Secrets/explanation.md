# Configuration and Secrets

## Introduction

Configuration separates code from environment-specific values (ports, URLs, credentials). Secrets must be handled with care and never committed to source control.

## Example: Loading Environment Variables

This example validates required environment variables at startup and exposes a typed config object to the rest of the app.

```javascript
// config.js
const required = ['PORT', 'DATABASE_URL'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing env var: ${key}`);
  }
}

const config = {
  port: Number(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL,
};

module.exports = { config };
```

## Example: Using dotenv for Local Dev

`dotenv` loads variables from a `.env` file into `process.env`, which is useful for local development. Do not use it to ship secrets in production.

Install dependency:

```
npm install dotenv
```

```javascript
// index.js
require('dotenv').config();
const { config } = require('./config');

console.log('Config:', config);
```

## Practical Guidance

- Validate config at startup and fail fast on missing values.
- Use a secrets manager in production (a managed system that stores and rotates secrets securely, controls access, and provides audit logs; examples include AWS Secrets Manager, GCP Secret Manager, and HashiCorp Vault).
- Avoid printing secrets in logs or error messages.
