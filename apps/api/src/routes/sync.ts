import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const pushSchema = z.object({
  operations: z.array(
    z.object({
      operationId: z.string().min(1),
      type: z.enum(["create", "update", "delete", "archive", "restore"]),
      entity: z.literal("contact"),
      entityId: z.string().uuid().optional(),
      clientTimestamp: z.string().datetime(),
      payload: z.record(z.any()).optional()
    })
  )
});

const pullSchema = z.object({
  cursor: z.string().datetime().optional()
});

const syncRouter = new Hono();

syncRouter.post("/push", zValidator("json", pushSchema), async (c) => {
  const body = c.req.valid("json");

  return c.json({
    data: {
      results: body.operations.map((operation) => ({
        operationId: operation.operationId,
        status: "pending"
      })),
      serverCursor: new Date().toISOString()
    }
  });
});

syncRouter.get("/pull", zValidator("query", pullSchema), async (c) => {
  return c.json({
    data: {
      items: [],
      nextCursor: c.req.valid("query").cursor ?? new Date().toISOString()
    }
  });
});

export default syncRouter;
