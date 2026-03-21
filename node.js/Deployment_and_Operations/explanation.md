# Deployment and Operations

## What matters

- Production Node apps need reproducible builds, health checks, and supervision.

## Interview points

- Build once, run the same artifact everywhere.
- Expose liveness/readiness endpoints if the platform expects them, often with routes like `/health` or `/live` and `/ready`. Liveness is usually a simple “process is alive” check; readiness is stricter and should return success only when the instance can safely receive traffic.
- Run behind a supervisor: systemd, containers, or an orchestrator. A supervisor restarts crashed processes and manages lifecycle.

## Senior notes

- Logging, metrics, memory limits, and graceful shutdown are deployment concerns too.
- A good Dockerfile and predictable startup path are part of application design.
