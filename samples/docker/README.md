# Docker Tutorial Sample

Minimal Node.js app to practice practical Docker usage:

- build and run an image
- map container ports to your host
- use Docker Compose
- persist data with a named volume
- hot-reload code in a container during local dev

## Files

- `Dockerfile`: image build recipe
- `docker-compose.yml`: local multi-container-style workflow (one service here)
- `src/server.js`: tiny HTTP API with a persisted hit counter

## Prerequisites

- Docker Desktop (or Docker Engine + Compose plugin)

## Run With Docker Compose (recommended)

From `samples/docker`:

```bash
docker compose up --build
```

Open another terminal:

```bash
curl http://localhost:3000/
curl http://localhost:3000/hits
curl http://localhost:3000/hits
curl -X POST http://localhost:3000/reset
curl http://localhost:3000/env
```

Stop:

```bash
docker compose down
```

The hit counter persists in named volume `app-data`, so it survives container recreation.

To remove the volume too:

```bash
docker compose down -v
```

## Run With Plain Docker Commands

From `samples/docker`:

```bash
docker build -t docker-tutorial-sample:dev .
docker run --rm -p 3000:3000 -e PORT=3000 -e DATA_DIR=/data docker-tutorial-sample:dev
```

## Try Live Reload

Compose mounts `./src` into the container and runs:

```bash
node --watch /app/src/server.js
```

Edit `src/server.js` while `docker compose up` is running; the process reloads automatically.

## Useful Debug Commands

```bash
docker compose ps            # Show compose services, status, and port mappings
docker compose logs -f web   # Stream live logs from the web service
docker compose exec web sh   # Open an interactive shell inside the running web container
docker volume ls             # List Docker volumes (including app-data if created)
```
