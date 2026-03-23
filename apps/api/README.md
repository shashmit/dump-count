# dumcont API

This is the backend for `dumcont`.

It is responsible for:

- verifying Clerk auth tokens
- finding or creating internal app users
- reading and writing contacts in Postgres
- exposing the user profile and onboarding endpoints
- providing sync-oriented contact endpoints

## Stack

- Bun
- Hono
- TypeScript
- Clerk backend SDK
- Postgres
- Neon via `DATABASE_URL`

## Scripts

From `/Users/shashmit/Drai/dumcont/apps/api`:

```bash
bun run dev
bun run start
bun run check
bun run typecheck
```

## Environment

Create:

`/Users/shashmit/Drai/dumcont/apps/api/.env`

Example:

```env
PORT=3000
CLERK_SECRET_KEY=
DATABASE_URL=
DEFAULT_REGION=IN
```

## Database

Run these SQL files in order against your Neon database:

1. `/Users/shashmit/Drai/dumcont/apps/api/db/001_init.sql`
2. `/Users/shashmit/Drai/dumcont/apps/api/db/002_app_users_onboarding.sql`

The backend expects those tables and columns to exist before authenticated flows are used.

## Current Route Surface

- `GET /health`
- `GET /v1/me`
- `PATCH /v1/me`
- `GET /v1/contacts`
- `GET /v1/contacts/:id`
- `POST /v1/contacts`
- `PATCH /v1/contacts/:id`
- `POST /v1/contacts/:id/archive`
- `POST /v1/contacts/:id/restore`
- `DELETE /v1/contacts/:id`
- `POST /v1/sync/push`
- `GET /v1/sync/pull`

## Code Layout

```text
src/
  index.ts
  middleware/
  routes/
  services/
  lib/
```

Main areas:

- `src/middleware/auth.ts`: Clerk token verification
- `src/routes/me.ts`: current user and onboarding profile updates
- `src/routes/contacts.ts`: contact CRUD routes
- `src/routes/sync.ts`: sync endpoints
- `src/services/users.ts`: internal app user logic
- `src/services/contacts.ts`: contact read/write logic

## Notes

- This backend talks directly to Postgres. Supabase is no longer used here.
- The route surface is real, but parts of the overall mobile product are still catching up to the backend.
- The root project guide has the full run flow:
  - [/Users/shashmit/Drai/dumcont/README.md](/Users/shashmit/Drai/dumcont/README.md)
