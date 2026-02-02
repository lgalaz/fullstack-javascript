# Docker

## Summary

Docker lets you package an app and its runtime dependencies into a portable unit (an image) that runs as an isolated process (a container).  
For day-to-day development, Docker mainly helps you get:

- repeatable local environments
- easier onboarding
- fewer "works on my machine" issues
- safer production rollouts

## Core Concepts You Actually Need

### Image

- A read-only template with your app code and runtime setup.
- Built from a `Dockerfile`.

### Container

- A running instance of an image.
- Containers are ephemeral by default; if removed, in-container state is gone unless persisted.

### Dockerfile

- Recipe for building an image.
- Typical flow:
  1. choose a base image
  2. copy app files
  3. install dependencies
  4. set startup command

### Volume

- Persistent storage managed by Docker.
- Use for data that must survive container restarts/re-creates (databases, uploaded files, caches as needed).

### Network

- Containers in the same Docker Compose project can reach each other by service name.
- Example: app service connects to database service using hostname `db`.

### Docker Compose

- Defines multi-container apps in `docker-compose.yml`.
- Main command set:
  - `docker compose up --build`
  - `docker compose down`
  - `docker compose logs -f`
  - `docker compose exec <service> sh`

## Practical Workflow

1. Write a small `Dockerfile` for your app.
2. Start with `docker build` and `docker run` for one container.
3. Move to `docker compose` when you need app + database + cache together.
4. Add volumes for persistent data.
5. Use environment variables for config (`PORT`, DB credentials, API URLs).
6. Keep the image lean (`alpine` base when practical, `.dockerignore`, only needed files).

## How to Take Advantage Without Going Deep

- Standardize local setup: one command to run everything.
- Match production shape early (services, ports, env vars).
- Isolate dependencies from your host machine.
- Reuse the same image artifact in CI/CD and deployment.
- Use logs and `exec` for fast debugging inside containers.

## Common Commands

```bash
# Build image from Dockerfile in current directory
docker build -t my-app:dev .

# Run container
docker run --rm -p 3000:3000 my-app:dev

# List running containers
docker ps

# Stop a container
docker stop <container_id>

# Start full stack from compose file
docker compose up --build

# Tear down stack
docker compose down
```

## Basic Best Practices

- Keep one process per container in most cases.
- Pin base image tags (avoid floating `latest` in serious projects).
- Use `.dockerignore` to avoid copying unnecessary files.
- Run as non-root when practical.
- Store secrets outside images (env vars, secret managers).
- Rebuild regularly to pick up security updates.

## When to Split Into Subtopics

If this Docker section grows, split into subdirectories like:

- `docker/Images_and_Dockerfiles/explanation.md`
- `docker/Compose_and_Multi_Service/explanation.md`
- `docker/Volumes_and_Persistence/explanation.md`
- `docker/Networking/explanation.md`
- `docker/CI_CD_and_Deployment/explanation.md`

For now, this single file covers the practical baseline.
