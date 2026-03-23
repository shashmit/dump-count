import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

type FloatingControlsContextValue = {
  isSearchVisible: boolean;
  setSearchVisible: (visible: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
};

const FloatingControlsContext = createContext<FloatingControlsContextValue | null>(null);

export function FloatingControlsProvider({ children }: PropsWithChildren) {
  const [isSearchVisible, setSearchVisible] = useState(true);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const value = useMemo(
    () => ({
      isSearchVisible,
      setSearchVisible,
      isSearchOpen,
      setSearchOpen
    }),
    [isSearchOpen, isSearchVisible]
  );

  return <FloatingControlsContext.Provider value={value}>{children}</FloatingControlsContext.Provider>;
}

export function useFloatingControls() {
  const context = useContext(FloatingControlsContext);

  if (!context) {
    throw new Error("useFloatingControls must be used within FloatingControlsProvider.");
  }

  return context;
}
