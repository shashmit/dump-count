# dumcont

`dumcont` is a private contact-dump app for the people you want to remember without polluting your real phonebook.

Think:
- brokers
- delivery people
- freelancers
- guards
- vendors
- one-off leads
- temporary helpers

The product idea is simple: keep these contacts searchable, organized, and easy to act on, while your real address book stays clean.

## What This Repo Contains

This repo is a small monorepo with two apps:

- `apps/mobile`: the React Native / Expo mobile app
- `apps/api`: the Bun / Hono backend API

## Current Product Direction

Right now the app includes:

- sign-in with Clerk
  - Google
  - Apple
  - email verification code
- new-user onboarding flow
- a mobile-first contacts experience
- archive and settings screens
- floating add and search actions
- custom visual system and reusable UI components
- a backend with Clerk auth verification and Postgres-backed contacts endpoints

The mobile app is currently ahead on UI and interaction work. Some contact flows are already wired to local app state, while full backend persistence and sync are still being filled in across the app.

## Tech Stack

### Mobile

- Expo
- React Native
- Expo Router
- TypeScript
- Clerk Expo
- TanStack Query
- FlashList

Important:
- the mobile app is managed with `npm`
- the mobile app is not run through Bun

### API

- Bun
- Hono
- TypeScript
- Clerk backend SDK
- Postgres client
- Neon Postgres via `DATABASE_URL`

## Repo Structure

```text
dumcont/
  apps/
    api/        Bun + Hono backend
    mobile/     Expo + React Native app
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 20+
- npm 10+
- Bun 1.3+
- Xcode and/or Android Studio if you want to run native mobile builds
- a Clerk application
- a Neon Postgres database

## Environment Setup

### 1. Backend env

Create:

`/Users/shashmit/Drai/dumcont/apps/api/.env`

Use:

```env
PORT=3000
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL=your_neon_database_url
DEFAULT_REGION=IN
```

### 2. Mobile env

Create:

`/Users/shashmit/Drai/dumcont/apps/mobile/.env`

Use:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

If your backend runs on a different port, update `EXPO_PUBLIC_API_BASE_URL` to match.

## Database Setup

Apply both SQL files in order:

- `/Users/shashmit/Drai/dumcont/apps/api/db/001_init.sql`
- `/Users/shashmit/Drai/dumcont/apps/api/db/002_app_users_onboarding.sql`

These create:

- `app_users`
- `contacts`
- onboarding-related user fields
- indexes and update triggers

If you skip the second migration, new-user onboarding will not work correctly.

## Install Dependencies

### Root

The root package is only for convenience scripts:

```bash
bun install
```

### Mobile

The mobile app should be installed with npm:

```bash
cd /Users/shashmit/Drai/dumcont/apps/mobile
npm install
```

## How To Run

### Run the backend

From the repo root:

```bash
bun run dev:api
```

Or directly:

```bash
cd /Users/shashmit/Drai/dumcont/apps/api
bun run dev
```

Default backend URL:

```text
http://localhost:3000
```

If `3000` is taken:

```bash
PORT=3001 bun run dev
```

Then update the mobile API URL:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Run the mobile app

From the repo root:

```bash
npm --prefix apps/mobile run dev
```

Or directly:

```bash
cd /Users/shashmit/Drai/dumcont/apps/mobile
npm run dev
```

Useful mobile commands:

```bash
npm run ios
npm run android
npm run web
```

## Root Convenience Commands

From `/Users/shashmit/Drai/dumcont`:

```bash
bun run dev:api
bun run typecheck:api
npm --prefix apps/mobile run dev
npm --prefix apps/mobile run typecheck
```

## Type Checking

### API

```bash
cd /Users/shashmit/Drai/dumcont/apps/api
bun run typecheck
```

### Mobile

```bash
cd /Users/shashmit/Drai/dumcont/apps/mobile
npm run typecheck
```

## Authentication Flow

Current intended flow:

- `Sign in -> Existing user -> Home`
- `Sign in -> New user -> Onboarding -> Home`

Auth is handled by Clerk.

Backend behavior:

- verifies Clerk token
- finds or creates an internal `app_users` record
- exposes `/v1/me` for onboarding and profile state

## API Overview

Current API routes include:

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

## Mobile UI Overview

The mobile app currently has:

- auth flow
- onboarding flow
- app shell
- contacts home screen
- archived screen
- settings screen
- contact detail
- add contact
- edit contact
- unlock screen

Reusable mobile building blocks live under:

- `/Users/shashmit/Drai/dumcont/apps/mobile/src/components`
- `/Users/shashmit/Drai/dumcont/apps/mobile/src/theme`
- `/Users/shashmit/Drai/dumcont/apps/mobile/src/features`

Design-system notes for the mobile app live in:

- [/Users/shashmit/Drai/dumcont/apps/mobile/AGENTS.md](/Users/shashmit/Drai/dumcont/apps/mobile/AGENTS.md)

## Notes About The Current State

This repo is actively being built. A few important things to know:

- the mobile app is visually much more developed than the persistence layer
- some mobile contact flows currently rely on local provider state for UI iteration
- the backend shape is in place, but not every mobile screen is fully connected to it yet
- the architecture is moving toward a local-first mobile flow with backend-backed sync

## Common Issues

### Mobile auth buttons do not work

Check:

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- Clerk providers are configured in your Clerk dashboard
- if you are using native Clerk features, use a development build when required by Clerk

### Backend returns auth errors

Check:

- `CLERK_SECRET_KEY` is set in `/Users/shashmit/Drai/dumcont/apps/api/.env`
- mobile is sending requests to the correct API base URL
- the backend is running on the same port configured in mobile env

### New users do not reach onboarding

Check:

- both SQL migrations were applied
- `/v1/me` is reachable
- the app user row is being created successfully

### Mobile app cannot reach the API on device

If you are testing on a real phone, `localhost` usually points to the phone, not your laptop. Use your machine's LAN IP for `EXPO_PUBLIC_API_BASE_URL` when needed.

## Where To Start

If you are opening this repo fresh, the safest order is:

1. install dependencies
2. set both env files
3. run both SQL migrations
4. start the backend
5. start the mobile app
6. verify sign-in
7. verify new-user onboarding

## App-Specific Docs

- API details: [/Users/shashmit/Drai/dumcont/apps/api/README.md](/Users/shashmit/Drai/dumcont/apps/api/README.md)
- Mobile details: [/Users/shashmit/Drai/dumcont/apps/mobile/README.md](/Users/shashmit/Drai/dumcont/apps/mobile/README.md)
