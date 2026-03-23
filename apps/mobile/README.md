# dumcont mobile

This is the mobile app for `dumcont`.

It is a React Native / Expo app focused on a private, mobile-first contact dump experience.

## Stack

- Expo
- React Native
- Expo Router
- TypeScript
- Clerk Expo
- TanStack Query
- FlashList

## Package Manager

Use `npm` for this app.

Do not use Bun to install or run the mobile workspace.

## Scripts

From `/Users/shashmit/Drai/dumcont/apps/mobile`:

```bash
npm install
npm run dev
npm run ios
npm run android
npm run web
npm run typecheck
```

From the repo root:

```bash
npm --prefix apps/mobile run dev
npm --prefix apps/mobile run typecheck
```

## Environment

Create:

`/Users/shashmit/Drai/dumcont/apps/mobile/.env`

Example:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
```

## What The App Includes

- auth flow
- onboarding flow
- app shell
- contacts home screen
- archived screen
- settings screen
- contact detail
- new contact flow
- edit contact flow
- unlock screen

## Code Layout

```text
app/
  (auth)/
  (app)/
src/
  components/
  config/
  features/
  lib/
  providers/
  theme/
```

Useful areas:

- `app/(auth)`: sign-in and onboarding
- `app/(app)`: logged-in app routes
- `src/components`: shared UI pieces
- `src/features/contacts`: local contact state
- `src/features/navigation`: floating add/search controls
- `src/theme`: app tokens
- `src/lib/api`: API client

## Assets

Custom app assets currently live in:

- `/Users/shashmit/Drai/dumcont/apps/mobile/assets`

## Notes

- The app uses Clerk for auth.
- The app is visually ahead of persistence in some places while product flows are still being wired through.
- Some contact interactions currently use local provider-backed state to support fast UI iteration.
- The root project guide has the full setup and backend instructions:
  - [/Users/shashmit/Drai/dumcont/README.md](/Users/shashmit/Drai/dumcont/README.md)

## Design-System Notes

Project-specific UI guidance lives in:

- [/Users/shashmit/Drai/dumcont/apps/mobile/AGENTS.md](/Users/shashmit/Drai/dumcont/apps/mobile/AGENTS.md)
