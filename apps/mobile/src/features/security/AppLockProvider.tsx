import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

type AppLockContextValue = {
  isLockEnabled: boolean;
  isUnlocked: boolean;
  hasBiometricSupport: boolean;
  refreshCapabilities: () => Promise<void>;
};

const AppLockContext = createContext<AppLockContextValue | null>(null);

export function AppLockProvider({ children }: PropsWithChildren) {
  const [hasBiometricSupport, setHasBiometricSupport] = useState(false);
  const [isLockEnabled, setIsLockEnabled] = useState(false);

  useEffect(() => {
    void refreshCapabilities();
  }, []);

  async function refreshCapabilities() {
    const [hardwareAvailable, savedPin] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      SecureStore.getItemAsync("dumcont.pin")
    ]);

    setHasBiometricSupport(hardwareAvailable);
    setIsLockEnabled(Boolean(savedPin));
  }

  const value = useMemo<AppLockContextValue>(
    () => ({
      isLockEnabled,
      isUnlocked: !isLockEnabled,
      hasBiometricSupport,
      refreshCapabilities
    }),
    [hasBiometricSupport, isLockEnabled]
  );

  return <AppLockContext.Provider value={value}>{children}</AppLockContext.Provider>;
}

export function useAppLock() {
  const context = useContext(AppLockContext);

  if (!context) {
    throw new Error("useAppLock must be used within AppLockProvider.");
  }

  return context;
}
