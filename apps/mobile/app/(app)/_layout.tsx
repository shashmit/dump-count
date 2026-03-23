import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack, router, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hasClerkConfig } from "@/config/env";
import { useCurrentUser } from "@/features/auth/useCurrentUser";
import { useFloatingControls } from "@/features/navigation/FloatingControlsProvider";
import { useAppLock } from "@/features/security/AppLockProvider";
import { colors, radii, spacing } from "@/theme/tokens";

function HeaderButton({
  icon,
  onPress,
  align = "left"
}: {
  icon: "archive" | "settings";
  onPress: () => void;
  align?: "left" | "right";
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.headerButton,
        pressed && styles.headerButtonPressed,
        align === "right" ? styles.headerButtonRight : undefined
      ]}
    >
      <Image
        source={
          icon === "archive"
            ? require("../../assets/archive-icon.png")
            : require("../../assets/setting-icon.png")
        }
        style={icon === "archive" ? styles.archiveIcon : styles.settingsIcon}
        resizeMode="contain"
      />
    </Pressable>
  );
}

function HeaderBackLogo() {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.back()}
      style={({ pressed }) => [styles.backButton, pressed && styles.headerButtonPressed]}
    >
      <Text style={styles.backChevron}>‹</Text>
      <Image source={require("../../assets/contacts-icon.png")} style={styles.backLogo} resizeMode="contain" />
    </Pressable>
  );
}

export default function AppLayout() {
  const auth = hasClerkConfig() ? useAuth() : null;
  const currentUser = useCurrentUser();
  const { isSearchVisible, isSearchOpen, setSearchOpen, setSearchVisible } = useFloatingControls();
  const { isLockEnabled, isUnlocked } = useAppLock();
  const pathname = usePathname();
  const searchFabAnim = useRef(new Animated.Value(0)).current;
  const showFloatingButtons = pathname !== "/unlock";

  useEffect(() => {
    if (pathname !== "/(app)/contacts" && pathname !== "/contacts") {
      setSearchVisible(true);
    }
  }, [pathname, setSearchVisible]);

  useEffect(() => {
    Animated.timing(searchFabAnim, {
      toValue: isSearchVisible ? 1 : 0,
      duration: isSearchVisible ? 240 : 180,
      easing: isSearchVisible ? Easing.out(Easing.exp) : Easing.out(Easing.quad),
      useNativeDriver: true
    }).start();
  }, [isSearchVisible, searchFabAnim]);

  if (hasClerkConfig() && !auth?.isLoaded) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.loadingScreen}>
        <ActivityIndicator color={colors.accent} size="large" />
      </SafeAreaView>
    );
  }

  if (hasClerkConfig() && !auth?.isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (hasClerkConfig() && currentUser.isLoading) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.loadingScreen}>
        <ActivityIndicator color={colors.accent} size="large" />
      </SafeAreaView>
    );
  }

  if (hasClerkConfig() && currentUser.data && !currentUser.data.isOnboarded) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (isLockEnabled && !isUnlocked) {
    return <Redirect href="/(app)/unlock" />;
  }

  const searchFabStyle = {
    opacity: searchFabAnim,
    transform: [
      {
        translateY: searchFabAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0]
        })
      },
      {
        scale: searchFabAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.92, 1]
        })
      }
    ]
  };

  return (
    <View style={styles.shell}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.canvas },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.canvas },
          headerTintColor: colors.ink,
          headerTitleStyle: {
            color: colors.ink,
            fontSize: 22,
            fontWeight: "800"
          }
        }}
      >
        <Stack.Screen
          name="contacts/index"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="archived"
          options={{
            title: "Archived",
            headerBackVisible: false,
            headerLeft: () => <HeaderBackLogo />
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
            headerBackVisible: false,
            headerLeft: () => <HeaderBackLogo />
          }}
        />
        <Stack.Screen
          name="unlock"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="contact/new"
          options={{
            presentation: "modal",
            title: "New Contact",
            headerBackVisible: false,
            headerLeft: () => <HeaderBackLogo />
          }}
        />
        <Stack.Screen
          name="contact/[id]"
          options={{
            title: "Contact",
            headerBackVisible: false,
            headerLeft: () => <HeaderBackLogo />
          }}
        />
        <Stack.Screen
          name="contact/[id]/edit"
          options={{
            presentation: "modal",
            title: "Edit Contact",
            headerBackVisible: false,
            headerLeft: () => <HeaderBackLogo />
          }}
        />
      </Stack>

      {showFloatingButtons ? (
        <>
          <Animated.View pointerEvents={isSearchVisible ? "auto" : "none"} style={[styles.searchFabWrap, searchFabStyle]}>
            <Pressable
              accessibilityLabel="Search contacts"
              accessibilityRole="button"
              onPress={() => {
                if (pathname !== "/(app)/contacts" && pathname !== "/contacts") {
                  router.push("/(app)/contacts");
                }

                if (!isSearchOpen) {
                  setSearchOpen(true);
                }
              }}
              style={({ pressed }) => [styles.searchFab, pressed && styles.headerButtonPressed]}
            >
              <Text style={styles.searchFabIcon}>⌕</Text>
            </Pressable>
          </Animated.View>

          <Pressable
            accessibilityLabel="Add contact"
            accessibilityRole="button"
            onPress={() => router.push("/(app)/contact/new")}
            style={({ pressed }) => [styles.fab, pressed && styles.headerButtonPressed]}
          >
            <Text style={styles.fabPlus}>+</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.canvas,
    flex: 1
  },
  loadingScreen: {
    alignItems: "center",
    backgroundColor: colors.canvas,
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg
  },
  backButton: {
    alignItems: "center",
    borderRadius: radii.pill,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 72,
    paddingHorizontal: 10
  },
  backChevron: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "400",
    lineHeight: 30,
    marginTop: -2
  },
  backLogo: {
    height: 28,
    width: 28
  },
  headerButton: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: radii.md,
    justifyContent: "center",
    minHeight: 48,
    minWidth: 48
  },
  headerButtonRight: {
    alignItems: "flex-end"
  },
  headerButtonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.97 }]
  },
  archiveIcon: {
    height: 34,
    width: 34
  },
  settingsIcon: {
    right: 5,
    height: 36,
    width: 36
  },
  fab: {
    alignItems: "center",
    backgroundColor: colors.accentStrong,
    borderRadius: radii.pill,
    bottom: 40,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 58,
    paddingHorizontal: 30,
    position: "absolute",
    right: 20,
    shadowColor: "#d15b31",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 20
  },
  searchFab: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 58,
    justifyContent: "center",
    shadowColor: "#c9ced8",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    width: 58
  },
  searchFabWrap: {
    bottom: 40,
    left: 20,
    position: "absolute"
  },
  searchFabIcon: {
    color: colors.accentStrong,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 26,
    marginTop: -2
  },
  fabPlus: {
    color: colors.accentText,
    fontSize: 26,
    fontWeight: "500",
    lineHeight: 28,
    marginTop: -2
  },
  fabLabel: {
    color: colors.accentText,
    fontSize: 15,
    fontWeight: "800"
  }
});
