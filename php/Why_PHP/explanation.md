# Why PHP

## Introduction

PHP (Hypertext Preprocessor) is a server-side language built for the web. The best reason to choose PHP is that it maximizes time-to-value for web products: it is easy to deploy, easy to hire for, and has mature tooling that makes common web tasks fast.

## What PHP Does Better

- Web-native execution model: request-in, response-out fits the shape of most web apps.
- Simple deployment: shared hosting, managed VPS, and serverless platforms support PHP out of the box.
- Strong ecosystem for web apps: Laravel, Symfony, WordPress, Magento, and a huge package ecosystem.
- Cost-effective hosting: PHP stacks are cheap to run at scale for typical CRUD workloads.
- Rapid iteration: good defaults, excellent DX (developer experience: fast feedback, good tooling), and tooling built around web conventions.

## Tradeoffs and Limitations

- Inconsistent legacy APIs and historical quirks across extensions.
- Performance is good for web workloads but not ideal for CPU-heavy tasks.
- Concurrency model is request-based; long-running tasks require extra tooling.
Note: for background jobs, PHP apps usually rely on queues (Redis, RabbitMQ, SQS) and worker processes rather than keeping long-lived state in web workers.

## When It Is a Good Fit

- Server-rendered web apps and APIs.
- Content-heavy platforms and CRUD (Create, Read, Update, Delete) systems.
- Teams that value fast delivery with mainstream hosting.

## When It Is Not the Best Fit

- High-performance, low-latency systems with tight compute budgets.
- Services that need long-lived in-memory state without external stores.

## PHP vs Node.js / Python / Java (Short Answer)

- Choose PHP when web delivery speed and hosting simplicity matter most.
- Choose Node.js when you want a single language across frontend and backend or need real-time, long-lived connections.
- Choose Python when data science/ML ecosystems matter or you want fast scripting with strong scientific libraries.
- Choose Java when you need long-lived, high-throughput services, strict tooling, or large enterprise ecosystems.

PHP wins when the primary goal is to ship and maintain web apps quickly with minimal operational overhead.

## Example: Basic Web Response

```php
<?php
// public/index.php

declare(strict_types=1);

header('Content-Type: text/plain');

echo "Hello from PHP";
```

This is a complete request handler: the web server routes a request to this file, PHP runs it, and the output becomes the HTTP response.

## Example: Simple CLI Script

CLI (Command Line Interface) scripts run from a terminal.

```php
<?php
// bin/hello.php

declare(strict_types=1);

$name = $argv[1] ?? 'world';

echo "Hello, {$name}\n";
```
