import { z } from "zod";

const PublicEnvSchema = z.object({
  EXPO_PUBLIC_API_BASE_URL: z.string().url().optional(),
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional()
});

export const publicEnv = PublicEnvSchema.parse({
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
});

export function hasClerkConfig() {
  return Boolean(publicEnv.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY);
}
