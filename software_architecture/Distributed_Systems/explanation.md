# Distributed Systems

## Introduction

A distributed system is a set of components running on multiple machines that coordinate over a network to achieve a shared goal. It enables scale and fault isolation but introduces network complexity and partial failure.

## What It Is

- Components run on different hosts or processes.
- Communication happens over the network.
- Failures are partial and must be handled explicitly.

## When It Is the Best Solution

- You need horizontal scaling beyond a single machine.
- You need high availability and fault tolerance.
- You are integrating multiple services or data stores.

## Misuse and When It Is Overkill

- Overkill for small apps that fit on one machine.
- Misuse when you distribute before solving basic domain boundaries.
- Debugging and consistency become much harder.

## Example (Simple Distributed Flow)

```text
API Service -> Message Queue -> Worker Service -> Database
```

```javascript
// pseudo: publish work to a queue
queue.publish({ jobId: 123, type: 'thumbnail' });
```
