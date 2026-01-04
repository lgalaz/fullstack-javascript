# Databases and Connection Pooling

## Introduction

Database connections are expensive. In Node.js, you should use connection pools to reuse connections, control concurrency, and avoid exhausting the database.

## Why Pooling Matters

- Avoids reconnecting for every query.
- Limits the number of simultaneous connections.
- Improves throughput under load.

## Example: Postgres with pg Pool

Install dependency:

```
npm install pg
```

```javascript
// db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

async function getUsers() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, name FROM users');
    return result.rows;
  } finally {
    client.release();
  }
}

module.exports = { getUsers, pool };
```

```javascript
// app.js
const { getUsers, pool } = require('./db');

getUsers()
  .then(users => {
    console.log(users);
  })
  .catch(error => {
    console.error(error.message);
  })
  .finally(() => pool.end());
```

## Practical Guidance

- Always release connections back to the pool.
- Keep pool sizes aligned with database limits.
- Use parameterized queries to avoid SQL injection.
