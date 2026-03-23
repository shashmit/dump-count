import { Hono } from "hono";
import { cors } from "hono/cors";

import { env } from "./lib/env";
import { authMiddleware } from "./middleware/auth";
import contactsRouter from "./routes/contacts";
import healthRouter from "./routes/health";
import meRouter from "./routes/me";
import syncRouter from "./routes/sync";

const app = new Hono();

app.use("*", cors());

app.route("/health", healthRouter);

app.use("/v1/*", authMiddleware);
app.route("/v1/me", meRouter);
app.route("/v1/contacts", contactsRouter);
app.route("/v1/sync", syncRouter);

app.notFound((c) =>
  c.json(
    {
      error: {
        code: "NOT_FOUND",
        message: "Route not found."
      }
    },
    404
  )
);

app.onError((error, c) => {
  console.error(error);

  return c.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Unexpected server error."
      }
    },
    500
  );
});

if (import.meta.main) {
  Bun.serve({
    port: env.PORT,
    fetch: app.fetch
  });

  console.log(`API listening on http://localhost:${env.PORT}`);
}

export default app;
