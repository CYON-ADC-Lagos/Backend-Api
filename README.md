# CYON ADC Lagos — Backend API

Node/Express + Sequelize backend for the CYON Archdiocese of Lagos frontend.

## Stack

- Node 20+, Express 4
- Sequelize 6 (MySQL in prod, SQLite in test)
- Joi (validation), JWT (auth), bcryptjs (hashing), multer (uploads)
- helmet, express-rate-limit, pino (logging), swagger-ui-express

## Setup

```bash
cp .env.example .env
# edit .env — at minimum set DB_* and JWT_SECRET
npm install
npm run dev
```

Optional admin seed — set these in `.env` to create an initial admin on boot:

```
SEED_ADMIN_EMAIL=admin@cyonadclagos.org
SEED_ADMIN_PASSWORD=a-strong-password
```

## Running

- `npm run dev` — nodemon + pino-pretty logging
- `npm start` — production (`NODE_ENV=production`)
- `npm test` — Jest smoke tests against in-memory SQLite

Schema sync is env-gated: set `DB_SYNC=alter` for dev, `force` to wipe, unset in prod (use migrations).

## Endpoints

Live OpenAPI docs once the server is running:

- `GET /docs` — Swagger UI
- `GET /docs.json` — OpenAPI 3 spec
- `GET /health` — liveness probe

All API routes are mounted under `/api/v1/`. Domains:

| Prefix | Auth | Notes |
|---|---|---|
| `/user` | mixed | `POST /login`, `/register`, `/forgot-password`, `/reset-password` are public |
| `/role` | GET public, writes Admin | |
| `/deanery` | GET public, writes Admin/Executive | `/:id/parishes`, `/:id/paid-parishes`, `/:id/users`, `/:id/events`, `/:id/executives` |
| `/parish` | GET public, writes Admin/Executive | `/paid-parishes`, `/:id/payments` |
| `/event` | GET public, writes Admin/Executive | `/adcEvents` |
| `/executive` | GET public, writes Admin/Executive | `/adcExecutives` |
| `/chaplain` | GET public, writes Admin/Executive | |
| `/ayd` | GET public, writes Admin | `/active` returns current event |
| `/delegate` | `POST /new` public w/ rate limit; reads Admin | Public AYD registration |
| `/news` | GET public, writes Admin/Executive | |
| `/gallery` | GET public, writes Admin/Executive | |
| `/feedback` | `POST` public w/ rate limit; reads Admin | |
| `/policy` | GET public, writes Admin | |
| `/payment` | Admin/Executive | Cross-cutting view; parish-scoped is under `/parish/:id/payments` |

### Auth

Send `Authorization: Bearer <jwt>` on protected requests. Tokens come from `/user/login` or `/user/register`.

Response envelope:

```json
{ "success": true, "message": "...", "data": { ... }, "count": 12 }
```

Paginated endpoints return:

```json
{ "success": true, "data": { "items": [...], "total": 42, "page": 1, "pageSize": 20, "pages": 3 } }
```

## Project layout

```
src/
  config/       db.config.js, seed.js
  controllers/  one per domain
  middlewares/  auth, async, validate, error, rateLimit, requestLogger, storage
  models/       *.model.js (Sequelize definitions)
  routes/       *.routes.js — thin, all logic in controllers
  services/     user.service.js
  utils/        sendResponse, errorResponse, pagination, logger
  validators/   Joi schemas
tests/          Jest + supertest
```

## Uploads

Files are stored under `uploads/` (absolute path) and served from `/uploads/<filename>`. Multer caps single-file uploads at 5 MB and restricts MIME types to `image/*` and `application/pdf`.

## Password reset flow

1. `POST /user/forgot-password` with `{ email }` — always returns 200.
2. The reset token is currently logged by `pino` (integrate an email provider to ship it via email).
3. `POST /user/reset-password` with `{ token, password }`.
