import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  CLERK_SECRET_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  DEFAULT_REGION: z.string().min(2).default("IN")
});

export const env = EnvSchema.parse(Bun.env);
