create extension if not exists pgcrypto;

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  email text,
  display_name text,
  phone_number text,
  note text,
  tags jsonb not null default '[]'::jsonb,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  name text,
  phone_number text,
  phone_number_normalized text,
  note text,
  tags jsonb not null default '[]'::jsonb,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint contacts_name_or_phone_required check (
    coalesce(nullif(btrim(name), ''), null) is not null
    or coalesce(nullif(btrim(phone_number), ''), null) is not null
  )
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_app_users_updated_at on app_users;
create trigger set_app_users_updated_at
before update on app_users
for each row
execute function set_updated_at();

drop trigger if exists set_contacts_updated_at on contacts;
create trigger set_contacts_updated_at
before update on contacts
for each row
execute function set_updated_at();

create index if not exists contacts_user_updated_idx
  on contacts (user_id, updated_at desc);

create index if not exists contacts_user_archived_idx
  on contacts (user_id, is_archived);

create index if not exists contacts_user_deleted_idx
  on contacts (user_id, deleted_at);

create index if not exists contacts_phone_normalized_idx
  on contacts (phone_number_normalized);

create unique index if not exists contacts_user_phone_unique_idx
  on contacts (user_id, phone_number_normalized)
  where phone_number_normalized is not null and deleted_at is null;

create index if not exists contacts_tags_gin_idx
  on contacts using gin (tags);
