# Deployment and Operations

## Introduction

Production Node.js apps need predictable builds (reproducible outputs from the same source and lockfile), health checks (simple endpoints or probes that report if the app is alive/ready), and process supervision (tools that restart crashed processes and manage logs). 

## Example: Minimal Dockerfile

This Dockerfile uses a slim Node image, installs production dependencies, and starts the app. It is a baseline for containerized deployments.

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## Example: Health Endpoint

Health endpoints let orchestration systems (tools like Kubernetes, ECS, or systemd that start, stop, and restart services) decide if your service is alive and ready to receive traffic.

```javascript
// server.js
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  res.writeHead(404);
  res.end('Not found');
});

server.listen(3000);
```

Ping the endpoint:

```
curl http://localhost:3000/health
```

## Process Supervision

- Use systemd or PM2 for single-host process supervision, or a container orchestrator for multi-host deployments.
- Configure restart policies and log aggregation.
- Set memory limits to avoid noisy-neighbor issues (when one process consumes excessive resources and degrades others on the same host).

## Practical Guidance

- Separate config from code and inject via environment variables.
- Use health checks and readiness endpoints for orchestration.
- Monitor CPU, memory, latency, and error rates.
