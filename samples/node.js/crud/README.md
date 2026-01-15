# Node.js CRUD Sample

Full-stack CRUD app with an Express + MySQL API, unit-tested with Supertest, and a simple React SPA.

## Stack
- API: Express, Sequelize (MySQL)
- Tests: Jest + Supertest
- Client: React + Vite

## Setup
All commands below assume you're in the `crud` directory.
1. Create two MySQL databases (one for dev, one for tests).
2. Copy `server/.env.example` to `server/.env` and update credentials.
3. Install dependencies in both apps.

```bash
cd crud

cd server
npm install

cd ../client
npm install
```

## Run the API
```bash
cd server
npm run dev
```

The API runs on `http://localhost:4000` by default.

## Run the client
```bash
cd client
npm run dev
```

The SPA runs on `http://localhost:5173` by default.

## Run tests
```bash
cd server
npm test
```

### Client tests
```bash
cd client
npm test
```

Unit tests (components/hooks):
```bash
cd client
npm run test:unit
```

E2E tests (Playwright):
```bash
cd client
npm run test:e2e
```

E2E tests in headed mode:
```bash
cd client
npm run test:e2e:headed
```

Install Playwright browsers once:
```bash
cd client
npx playwright install
```

E2E tests assume the API and client are running. You can also run the client via:
```bash
E2E_WEB_SERVER="npm run dev -- --host" npm run test:e2e
```

## API Endpoints
- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`
