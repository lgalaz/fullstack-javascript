# Client-Server Architecture

## Introduction

Client-server architecture splits a system into clients that request services and servers that provide them. It is the dominant model for web and API-based systems.

## What It Is

- Clients initiate requests (browser, mobile app, other services).
- Servers handle requests, perform work, and return responses.
- Communication usually happens over HTTP or WebSocket.

## When It Is the Best Solution

- Most web and mobile applications.
- Systems where clients and servers evolve independently.
- Clear separation between UI concerns and backend logic.

## Misuse and When It Is Overkill

- Overkill for local scripts or single-process tools.
- Misuse when the server becomes a thin proxy with no domain logic (a proxy forwards requests to another service without doing much itself; it adds hops without adding business validation, orchestration, or security).
- Overuse of chatty client-server interactions can create latency issues (many small round trips amplify network delay). Best practice: batch or aggregate requests (BFF, GraphQL, or tailored endpoints) and return data in fewer calls.

## GraphQL (Basic Artifacts, Workflow, and Why)

GraphQL is a query language and runtime for APIs that lets clients ask for exactly the data they need. It’s often used to reduce over‑fetching/under‑fetching and to collapse multiple REST requests into a single round trip.

Basic artifacts:
- **Schema**: the contract that defines types, fields, and relationships.
- **Queries/Mutations/Subscriptions**: operations for read, write, and real‑time updates.
- **Resolvers**: server functions that map fields to data sources.

Basic workflow:
- Client sends a query specifying fields and shapes.
- Server validates the query against the schema.
- Resolvers fetch/compose data (DBs, services) for each field.
- Server returns a response matching the requested shape.

Why use it:
- Avoids many small requests by fetching related data in one call.
- Client-driven shape reduces over‑fetching and brittle endpoint churn.
- Works well with complex UIs that evolve frequently.

Tradeoffs:
- More server complexity (schema design, resolver performance, caching).
- Requires guardrails for query cost and access control.

Example: client query + server response building

```javascript
# Frontend query
query GetUserCard($id: ID!) {
  user(id: $id) {
    id
    name
    posts(limit: 2) {
      id
      title
    }
  }
}
```

```json
// Variables sent with the query
{ "id": "123" }
```

```javascript
// Frontend: send the query over HTTP (leaves the browser)
fetch("/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: `
      query GetUserCard($id: ID!) {
        user(id: $id) {
          id
          name
          posts(limit: 2) {
            id
            title
          }
        }
      }
    `,
    variables: { id: "123" },
  }),
});
```

```javascript
// Backend: wire a /graphql endpoint to the schema + resolvers
import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./schema.js";
import { resolvers } from "./resolvers.js";

const app = express();
app.use("/graphql", express.json(), createHandler({ schema, rootValue: resolvers }));
app.listen(3000);
```

```javascript
// Backend: resolvers that build the response shape
const resolvers = {
  Query: {
    user: (_, { id }, { dataSources }) =>
      dataSources.users.getById(id),
  },
  User: {
    posts: (user, { limit }, { dataSources }) =>
      dataSources.posts.getByUserId(user.id, limit),
  },
};
```

```json
// Response returned by GraphQL (matches the query shape)
{
  "data": {
    "user": {
      "id": "123",
      "name": "Ada",
      "posts": [
        { "id": "p1", "title": "Intro to GraphQL" },
        { "id": "p2", "title": "Resolvers in Practice" }
      ]
    }
  }
}
```

## Example of client server architecture (Request/Response Flow)

```text
Client -> GET /users/123 -> Server -> Database -> Server -> JSON -> Client
```

```javascript
// server.js
const http = require('http');

http.createServer((req, res) => {
  if (req.url === '/users/123') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ id: 123, name: 'Ada' }));
    return;
  }
  res.writeHead(404);
  res.end('not found');
}).listen(3000);
```
