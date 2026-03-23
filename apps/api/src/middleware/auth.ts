import { createClerkClient, verifyToken } from "@clerk/backend";
import type { MiddlewareHandler } from "hono";

import { jsonError } from "../lib/errors";
import { env } from "../lib/env";
import { findOrCreateAppUser } from "../services/users";

type AuthVariables = {
  clerkUserId: string;
  appUserId: string;
};

declare module "hono" {
  interface ContextVariableMap extends AuthVariables {}
}

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return jsonError(c, 401, "UNAUTHORIZED", "Missing bearer token.");
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY
    });

    const clerkUserId = payload.sub;

    if (!clerkUserId) {
      return jsonError(c, 401, "UNAUTHORIZED", "Invalid auth token.");
    }

    const clerkUser = await createClerkClient({ secretKey: env.CLERK_SECRET_KEY }).users.getUser(
      clerkUserId
    );

    const appUser = await findOrCreateAppUser({
      clerkUserId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? null,
      displayName:
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
        clerkUser.username ||
        null
    });

    c.set("clerkUserId", clerkUserId);
    c.set("appUserId", appUser.id);

    await next();
  } catch {
    return jsonError(c, 401, "UNAUTHORIZED", "Failed to verify auth token.");
  }
};
