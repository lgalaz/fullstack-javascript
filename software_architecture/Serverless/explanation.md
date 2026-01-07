# Serverless Architecture

## Introduction

Serverless uses managed runtimes (functions or containers) where you deploy code without managing servers. You pay per execution and scale automatically.

## What It Is

- Functions run on demand (FaaS) or managed containers.
- No server management, scaling handled by provider.
- Event-driven by default (HTTP, queues, cron).

## When It Is the Best Solution

- Spiky or unpredictable traffic.
- Small, focused services and background jobs.
- Teams that want minimal operational overhead.

## Common Use Cases

- Event-driven workloads (file processing, image resizing, webhooks).
- Scheduled jobs (daily reports, cleanup tasks) with EventBridge Scheduler.
- APIs with bursty traffic where pay-per-request is cost-effective.
- Prototyping or MVPs where speed matters more than deep infrastructure control.

Note: serverless is attractive for pay-as-you-go pricing and reduced infrastructure management, but you trade some control and observability (more distributed components, vendor-specific wiring). Many teams use a hybrid: always-on services for core, latency-sensitive paths, and serverless for async jobs and bursty workloads, which balances control with cost efficiency.

## Misuse and When It Is Overkill

- Overkill for long-running, stateful services (functions are short-lived and stateless by design; long-running workloads fit better on servers or containers).
- Cold starts can hurt latency-sensitive workloads (a function may need time to initialize when idle, which adds delay to the first request).
- Complex local development or observability needs (serverless splits logic across many functions, which can make debugging and tracing harder without strong tooling).

## Example (Function Handler)

```javascript
// handler.js
exports.handler = async (event) => {
  return { statusCode: 200, body: 'ok' };
};
```

## Note: How Serverless Apps Are Composed

Serverless apps are composed of many small handlers (functions) plus managed services that trigger and connect them. The logic is split across:

- Function handlers in code (Lambda functions).
- AWS services that route or buffer events (SQS, EventBridge, SNS, API Gateway).
- Orchestration points (schedulers, event rules, or Step Functions) that control when functions run.

This provides scalability and pay-per-use, but it also spreads logic across infrastructure, which increases wiring, testing, and observability needs.

## Example: Scheduled Lambda and SQS Worker (AWS)

How they are called:
- EventBridge Scheduler triggers `scheduled-handler` on a cron or rate schedule.
- SQS triggers `worker-handler` when messages arrive in the queue.

```javascript
// scheduled-handler.js (invoked by EventBridge Scheduler)
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

const client = new SQSClient();
const QUEUE_URL = process.env.QUEUE_URL;

exports.handler = async () => {
  await client.send(
    new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify({ job: 'build-report' }),
    })
  );
  return { ok: true };
};
```

```javascript
// worker-handler.js (Lambda triggered by SQS)
exports.handler = async (event) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    // do work with payload
  }
  return { ok: true };
};
```
