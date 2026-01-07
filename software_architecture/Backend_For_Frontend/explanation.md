# Backend for Frontend (BFF)

## Introduction

BFF is an architecture where each frontend (web, mobile, TV) gets a tailored backend that aggregates and shapes data for that client.

## What It Is

- A dedicated backend per client type.
- Aggregates calls to multiple services.
- Returns data in the exact shape the UI needs.

## When It Is the Best Solution

- Multiple frontends with very different needs.
- You want to reduce over-fetching and under-fetching.
- Frontend teams need autonomy.

## Misuse and When It Is Overkill

- Overkill for a single frontend.
- Misuse when BFF becomes a duplicate business logic layer.
- Can add latency if it calls many downstream services poorly.

## Example (Aggregated Response)

```javascript
// bff.js
async function getHomePage(userId) {
  const [profile, feed] = await Promise.all([
    usersService.getProfile(userId),
    feedService.getFeed(userId),
  ]);
  return { profile, feed };
}
```
