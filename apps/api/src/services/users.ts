import { db } from "../lib/db";

type AppUserRecord = {
  id: string;
  clerk_user_id: string;
  email: string | null;
  display_name: string | null;
  phone_number: string | null;
  note: string | null;
  tags: string[] | null;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapAppUser(record: AppUserRecord) {
  return {
    id: record.id,
    clerkUserId: record.clerk_user_id,
    email: record.email,
    displayName: record.display_name,
    phoneNumber: record.phone_number,
    note: record.note,
    tags: record.tags ?? [],
    onboardingCompletedAt: record.onboarding_completed_at,
    isOnboarded: Boolean(record.onboarding_completed_at),
    createdAt: record.created_at,
    updatedAt: record.updated_at
  };
}

export async function findOrCreateAppUser(input: {
  clerkUserId: string;
  email: string | null;
  displayName: string | null;
}) {
  const existing = await db<AppUserRecord[]>`
    select *
    from app_users
    where clerk_user_id = ${input.clerkUserId}
    limit 1
  `;

  if (existing[0]) {
    return mapAppUser(existing[0]);
  }

  const inserted = await db<AppUserRecord[]>`
    insert into app_users (clerk_user_id, email, display_name)
    values (${input.clerkUserId}, ${input.email}, ${input.displayName})
    returning *
  `;

  return mapAppUser(inserted[0]);
}

export async function getAppUserById(id: string) {
  const rows = await db<AppUserRecord[]>`
    select *
    from app_users
    where id = ${id}
    limit 1
  `;

  return mapAppUser(rows[0]);
}

export async function updateAppUserProfile(
  id: string,
  input: {
    displayName: string;
    phoneNumber: string;
    note: string | null;
    tags: string[];
  }
) {
  const rows = await db<AppUserRecord[]>`
    update app_users
    set
      display_name = ${input.displayName},
      phone_number = ${input.phoneNumber},
      note = ${input.note},
      tags = ${JSON.stringify(input.tags)}::jsonb,
      onboarding_completed_at = coalesce(onboarding_completed_at, now())
    where id = ${id}
    returning *
  `;

  return mapAppUser(rows[0]);
}
