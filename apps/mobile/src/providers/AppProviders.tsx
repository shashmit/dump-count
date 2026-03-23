import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { PropsWithChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { publicEnv } from "@/config/env";
import { ContactsProvider } from "@/features/contacts/ContactsProvider";
import { FloatingControlsProvider } from "@/features/navigation/FloatingControlsProvider";
import { AppLockProvider } from "@/features/security/AppLockProvider";
import { QueryProvider } from "@/providers/QueryProvider";

const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  }
};

function InnerProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <AppLockProvider>
          <ContactsProvider>
            <FloatingControlsProvider>{children}</FloatingControlsProvider>
          </ContactsProvider>
        </AppLockProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}

export function AppProviders({ children }: PropsWithChildren) {
  if (!publicEnv.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <InnerProviders>{children}</InnerProviders>;
  }

  return (
    <ClerkProvider publishableKey={publicEnv.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <InnerProviders>{children}</InnerProviders>
    </ClerkProvider>
  );
}
