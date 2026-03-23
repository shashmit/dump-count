alter table app_users
  add column if not exists phone_number text,
  add column if not exists note text,
  add column if not exists tags jsonb not null default '[]'::jsonb,
  add column if not exists onboarding_completed_at timestamptz;
