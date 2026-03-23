import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { jsonError } from "../lib/errors";
import { getAppUserById, updateAppUserProfile } from "../services/users";

const meRouter = new Hono();

const updateMeSchema = z.object({
  displayName: z.string().trim().min(1).max(120),
  phoneNumber: z.string().trim().min(1).max(30),
  note: z.string().trim().max(2000).optional().nullable(),
  tags: z.array(z.string().trim().min(1).max(30)).max(20).default([])
});

meRouter.get("/", async (c) => {
  const appUserId = c.get("appUserId");
  const appUser = await getAppUserById(appUserId);

  return c.json({
    data: appUser
  });
});

meRouter.patch("/", zValidator("json", updateMeSchema), async (c) => {
  const appUserId = c.get("appUserId");
  const payload = c.req.valid("json");

  const updatedUser = await updateAppUserProfile(appUserId, {
    displayName: payload.displayName,
    phoneNumber: payload.phoneNumber,
    note: payload.note?.trim() || null,
    tags: payload.tags.map((tag) => tag.trim()).filter(Boolean)
  });

  if (!updatedUser) {
    return jsonError(c, 404, "NOT_FOUND", "User profile not found.");
  }

  return c.json({
    data: updatedUser
  });
});

export default meRouter;
