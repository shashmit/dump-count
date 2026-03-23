# Mobile UI System

This file explains how the mobile UI is organized so future agents can extend it without guessing.

## Theme

Primary theme tokens live in:
- `src/theme/tokens.ts`

Use those tokens first before introducing new raw values.

Current visual direction:
- warm editorial utility
- mobile-first density
- high-contrast cream, rust, olive, and plum palette
- rounded shapes with soft depth

## Shared Components

Reusable UI primitives live in:
- `src/components/AppButton.tsx`
- `src/components/BottomSheet.tsx`
- `src/components/ContactHeroMark.tsx`
- `src/components/ScreenCard.tsx`

Rules:
- prefer `AppButton` over ad hoc `Pressable` buttons
- prefer `BottomSheet` for mobile data entry or lightweight task flows
- keep one-off visual marks isolated as components, not in route files

## Routing

Main app routes live in:
- `app/(tabs)/...`
- `app/contact/...`
- `app/(auth)/...`

Auth entry is currently:
- `app/(auth)/sign-in.tsx`

The sign-in screen uses:
- `AppButton`
- `BottomSheet`
- `ContactHeroMark`

## Mock Data

Current UI shells use mock contact data from:
- `src/mocks/contacts.ts`

When wiring real data:
- preserve the same view model shape where possible
- move data access into features/lib, not route files

## Interaction Conventions

- Primary actions use filled rust buttons
- Secondary actions use bordered cream buttons
- Supporting flows can use bottom sheets instead of modal-style full-screen interruptions
- Mobile copy should stay short and clear

## When Editing

- keep layouts mobile-native, not web-card clones
- preserve the existing color language unless deliberately redesigning the whole app
- avoid introducing random new component patterns if an existing primitive can be extended
- if you add a new reusable visual primitive, document it here
