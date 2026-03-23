import { db } from "../lib/db";
import { normalizePhoneNumber } from "../lib/phone";

type ContactRecord = {
  id: string;
  user_id: string;
  name: string | null;
  phone_number: string | null;
  phone_number_normalized: string | null;
  note: string | null;
  tags: string[];
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type ContactInput = {
  name?: string | null;
  phoneNumber?: string | null;
  note?: string | null;
  tags?: string[];
};

function mapContact(record: ContactRecord) {
  return {
    id: record.id,
    name: record.name,
    phoneNumber: record.phone_number,
    phoneNumberNormalized: record.phone_number_normalized,
    note: record.note,
    tags: record.tags ?? [],
    isArchived: record.is_archived,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    deletedAt: record.deleted_at
  };
}

async function findDuplicateByNormalizedPhone(userId: string, normalizedPhone: string) {
  const rows = await db<{ id: string }[]>`
    select id
    from contacts
    where user_id = ${userId}
      and phone_number_normalized = ${normalizedPhone}
      and deleted_at is null
    limit 1
  `;

  return rows[0] ?? null;
}

export async function listContacts(
  userId: string,
  options: { archived: boolean; search?: string; limit: number }
) {
  const searchTerm = options.search ? `%${options.search}%` : null;

  const rows = await db<ContactRecord[]>`
    select *
    from contacts
    where user_id = ${userId}
      and deleted_at is null
      and is_archived = ${options.archived}
      and (
        ${searchTerm}::text is null
        or name ilike ${searchTerm}
        or phone_number ilike ${searchTerm}
        or phone_number_normalized ilike ${searchTerm}
        or note ilike ${searchTerm}
        or exists (
          select 1
          from jsonb_array_elements_text(tags) as tag
          where tag ilike ${searchTerm}
        )
      )
    order by updated_at desc
    limit ${options.limit}
  `;

  return rows.map(mapContact);
}

export async function getContactById(userId: string, contactId: string) {
  const rows = await db<ContactRecord[]>`
    select *
    from contacts
    where id = ${contactId}
      and user_id = ${userId}
    limit 1
  `;

  return rows[0] ? mapContact(rows[0]) : null;
}

export async function createContact(userId: string, input: ContactInput) {
  const normalizedPhone = normalizePhoneNumber(input.phoneNumber);

  if (input.phoneNumber && !normalizedPhone) {
    throw new Error("Invalid phone number.");
  }

  if (normalizedPhone) {
    const duplicate = await findDuplicateByNormalizedPhone(userId, normalizedPhone);

    if (duplicate) {
      return { duplicateContactId: duplicate.id };
    }
  }

  const rows = await db<ContactRecord[]>`
    insert into contacts (
      user_id,
      name,
      phone_number,
      phone_number_normalized,
      note,
      tags
    )
    values (
      ${userId},
      ${input.name ?? null},
      ${input.phoneNumber ?? null},
      ${normalizedPhone},
      ${input.note ?? null},
      ${JSON.stringify(input.tags ?? [])}::jsonb
    )
    returning *
  `;

  return mapContact(rows[0]);
}

export async function updateContact(userId: string, contactId: string, input: ContactInput) {
  const existingRows = await db<ContactRecord[]>`
    select *
    from contacts
    where id = ${contactId}
      and user_id = ${userId}
      and deleted_at is null
    limit 1
  `;

  const existing = existingRows[0];

  if (!existing) {
    return null;
  }

  const nextPhone = input.phoneNumber ?? existing.phone_number;
  const normalizedPhone = normalizePhoneNumber(nextPhone);

  if (nextPhone && !normalizedPhone) {
    throw new Error("Invalid phone number.");
  }

  if (normalizedPhone && normalizedPhone !== existing.phone_number_normalized) {
    const duplicate = await findDuplicateByNormalizedPhone(userId, normalizedPhone);

    if (duplicate && duplicate.id !== contactId) {
      return { duplicateContactId: duplicate.id };
    }
  }

  const rows = await db<ContactRecord[]>`
    update contacts
    set
      name = ${input.name ?? existing.name},
      phone_number = ${nextPhone},
      phone_number_normalized = ${normalizedPhone},
      note = ${input.note ?? existing.note},
      tags = ${JSON.stringify(input.tags ?? existing.tags)}::jsonb
    where id = ${contactId}
      and user_id = ${userId}
    returning *
  `;

  return mapContact(rows[0]);
}

async function setArchivedState(userId: string, contactId: string, isArchived: boolean) {
  const rows = await db<ContactRecord[]>`
    update contacts
    set is_archived = ${isArchived}
    where id = ${contactId}
      and user_id = ${userId}
      and deleted_at is null
    returning *
  `;

  return rows[0] ? mapContact(rows[0]) : null;
}

export function archiveContact(userId: string, contactId: string) {
  return setArchivedState(userId, contactId, true);
}

export function restoreContact(userId: string, contactId: string) {
  return setArchivedState(userId, contactId, false);
}

export async function deleteContact(userId: string, contactId: string) {
  const timestamp = new Date().toISOString();
  const rows = await db<{ id: string; deleted_at: string }[]>`
    update contacts
    set deleted_at = ${timestamp}
    where id = ${contactId}
      and user_id = ${userId}
      and deleted_at is null
    returning id, deleted_at
  `;

  if (!rows[0]) {
    return null;
  }

  return {
    id: rows[0].id,
    deletedAt: rows[0].deleted_at
  };
}
