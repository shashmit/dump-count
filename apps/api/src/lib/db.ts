import postgres from "postgres";

import { env } from "./env";

export const db = postgres(env.DATABASE_URL, {
  max: 5,
  prepare: false
});
