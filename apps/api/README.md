# API

Bun + Hono backend for dumcont.

## Scripts

- `bun run dev`
- `bun run start`
- `bun run typecheck`

## Environment

Copy `.env.example` to `.env` and set:

- `PORT`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`
- `DEFAULT_REGION`

## Database

Apply `db/001_init.sql` to the Neon/Postgres database before running authenticated flows.

## Current scope

- Health endpoint
- Clerk auth middleware
- App user bootstrap
- Contacts CRUD skeleton
- Sync route skeleton
