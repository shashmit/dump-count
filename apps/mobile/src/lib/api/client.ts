import { publicEnv } from "@/config/env";

type ApiRequestInit = RequestInit & {
  token?: string | null;
};

export async function apiRequest(path: string, init?: ApiRequestInit) {
  if (!publicEnv.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error("EXPO_PUBLIC_API_BASE_URL is not configured.");
  }

  const { token, ...requestInit } = init ?? {};

  const response = await fetch(new URL(path, publicEnv.EXPO_PUBLIC_API_BASE_URL).toString(), {
    ...requestInit,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(requestInit.headers ?? {})
    }
  });

  return response;
}
