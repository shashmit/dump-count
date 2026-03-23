import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { jsonError } from "../lib/errors";
import {
  archiveContact,
  createContact,
  deleteContact,
  getContactById,
  listContacts,
  restoreContact,
  updateContact
} from "../services/contacts";

const contactInputSchema = z
  .object({
    name: z.string().trim().max(120).optional().nullable(),
    phoneNumber: z.string().trim().max(30).optional().nullable(),
    note: z.string().max(2000).optional().nullable(),
    tags: z.array(z.string().trim().min(1).max(30)).max(20).default([])
  })
  .refine((data) => Boolean(data.name || data.phoneNumber), {
    message: "Either name or phone number is required."
  });

const contactPatchSchema = z
  .object({
    name: z.string().trim().max(120).optional().nullable(),
    phoneNumber: z.string().trim().max(30).optional().nullable(),
    note: z.string().max(2000).optional().nullable(),
    tags: z.array(z.string().trim().min(1).max(30)).max(20).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required."
  });

const listQuerySchema = z.object({
  archived: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  search: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().positive().max(100).optional()
});

const contactsRouter = new Hono();

contactsRouter.get("/", zValidator("query", listQuerySchema), async (c) => {
  const appUserId = c.get("appUserId");
  const query = c.req.valid("query");

  const items = await listContacts(appUserId, {
    archived: query.archived ?? false,
    search: query.search,
    limit: query.limit ?? 50
  });

  return c.json({
    data: {
      items,
      nextCursor: null
    }
  });
});

contactsRouter.get("/:id", async (c) => {
  const appUserId = c.get("appUserId");
  const contact = await getContactById(appUserId, c.req.param("id"));

  if (!contact) {
    return jsonError(c, 404, "NOT_FOUND", "Contact not found.");
  }

  return c.json({ data: contact });
});

contactsRouter.post("/", zValidator("json", contactInputSchema), async (c) => {
  const appUserId = c.get("appUserId");
  const payload = c.req.valid("json");

  const result = await createContact(appUserId, payload);

  if ("duplicateContactId" in result) {
    return jsonError(c, 409, "DUPLICATE_CONTACT", "A contact with this number already exists.", {
      existingContactId: result.duplicateContactId
    });
  }

  return c.json({ data: result }, 201);
});

contactsRouter.patch("/:id", zValidator("json", contactPatchSchema), async (c) => {
  const appUserId = c.get("appUserId");
  const result = await updateContact(appUserId, c.req.param("id"), c.req.valid("json"));

  if (!result) {
    return jsonError(c, 404, "NOT_FOUND", "Contact not found.");
  }

  if ("duplicateContactId" in result) {
    return jsonError(c, 409, "DUPLICATE_CONTACT", "A contact with this number already exists.", {
      existingContactId: result.duplicateContactId
    });
  }

  return c.json({ data: result });
});

contactsRouter.post("/:id/archive", async (c) => {
  const appUserId = c.get("appUserId");
  const result = await archiveContact(appUserId, c.req.param("id"));

  if (!result) {
    return jsonError(c, 404, "NOT_FOUND", "Contact not found.");
  }

  return c.json({ data: result });
});

contactsRouter.post("/:id/restore", async (c) => {
  const appUserId = c.get("appUserId");
  const result = await restoreContact(appUserId, c.req.param("id"));

  if (!result) {
    return jsonError(c, 404, "NOT_FOUND", "Contact not found.");
  }

  return c.json({ data: result });
});

contactsRouter.delete("/:id", async (c) => {
  const appUserId = c.get("appUserId");
  const result = await deleteContact(appUserId, c.req.param("id"));

  if (!result) {
    return jsonError(c, 404, "NOT_FOUND", "Contact not found.");
  }

  return c.json({ data: result });
});

export default contactsRouter;
