# Databases and Connection Pooling

## Introduction

Database connections are expensive. In Node.js, you should use connection pools to reuse connections, control concurrency, and avoid exhausting the database.

## Why Pooling Matters

- Avoids reconnecting for every query.
- Limits the number of simultaneous connections.
- Improves throughput under load.

## Example: Postgres with pg Pool

This example creates a shared pool, borrows a client for a query, and returns it to the pool in a `finally` block to avoid leaks.

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

- Always release connections back to the pool (if you do not, the pool runs out of available connections and requests start to hang).
- Keep pool sizes aligned with database limits (databases cap concurrent connections; a pool that is too large can exhaust the DB and slow everyone down).
- Use parameterized queries to avoid SQL injection (placeholders separate data from SQL so user input cannot change the query structure).

Example: always release connections:

```javascript
// release.js
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getUser(id) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, name FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } finally {
    client.release();
  }
}
```

Example: pool size aligned with DB limits:

```javascript
// pool-size.js
const { Pool } = require('pg');

// If your DB allows 100 connections total, keep pool sizes small per service.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});
```

Example: parameterized queries:

```javascript
// parameterized.js
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function searchByEmail(email) {
  const result = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);

  return result.rows;
}
```
