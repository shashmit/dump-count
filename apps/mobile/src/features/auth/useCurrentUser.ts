import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { hasClerkConfig } from "@/config/env";
import { apiRequest } from "@/lib/api/client";

export type CurrentUser = {
  id: string;
  clerkUserId: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  note: string | null;
  tags: string[];
  onboardingCompletedAt: string | null;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
};

type UpdateCurrentUserInput = {
  displayName: string;
  phoneNumber: string;
  note?: string | null;
  tags?: string[];
};

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T & {
    error?: {
      message?: string;
    };
  };

  if (!response.ok) {
    throw new Error(payload.error?.message || "Request failed.");
  }

  return payload;
}

export function useCurrentUser() {
  const auth = hasClerkConfig() ? useAuth() : null;

  return useQuery({
    queryKey: ["current-user"],
    enabled: Boolean(hasClerkConfig() && auth?.isLoaded && auth.isSignedIn),
    queryFn: async () => {
      const token = await auth?.getToken();
      const response = await apiRequest("/v1/me", { token });
      const payload = await readJson<{ data: CurrentUser }>(response);
      return payload.data;
    }
  });
}

export function useUpdateCurrentUser() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateCurrentUserInput) => {
      const token = await auth.getToken();
      const response = await apiRequest("/v1/me", {
        method: "PATCH",
        token,
        body: JSON.stringify({
          displayName: input.displayName,
          phoneNumber: input.phoneNumber,
          note: input.note?.trim() || null,
          tags: input.tags ?? []
        })
      });

      const payload = await readJson<{ data: CurrentUser }>(response);
      return payload.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["current-user"], user);
    }
  });
}
