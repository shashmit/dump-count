import { useAuth, useClerk } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { hasClerkConfig } from "@/config/env";
import { colors, radii, spacing, typeScale } from "@/theme/tokens";

export default function SettingsScreen() {
  const auth = hasClerkConfig() ? useAuth() : null;
  const clerk = hasClerkConfig() ? useClerk() : null;
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    if (!clerk) {
      return;
    }

    try {
      setIsSigningOut(true);
      await clerk.signOut();
      router.replace("/(auth)/sign-in");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>Preferences</Text>
          <Text style={styles.heroTitle}>Private utility, tuned for one-handed use.</Text>
          <Text style={styles.heroBody}>
            Keep the list fast, protected, and disposable. These are the controls that matter on a personal
            contact dump app.
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          {[
            ["PIN lock", "Quick local barrier before the list opens"],
            ["Biometric unlock", "Use the device lock when hardware is available"],
            ["Auto archive later", "Move cooled-off contacts out of the main lane"]
          ].map(([label, copy], index) => (
            <View key={label} style={[styles.settingRow, index === 2 ? styles.settingRowLast : undefined]}>
              <View style={styles.settingCopy}>
                <Text style={styles.settingLabel}>{label}</Text>
                <Text style={styles.settingBody}>{copy}</Text>
              </View>
              <View style={[styles.statusPill, index === 2 ? styles.statusMuted : undefined]}>
                <Text style={[styles.statusText, index === 2 ? styles.statusTextMuted : undefined]}>
                  {index === 2 ? "Soon" : "On"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Account</Text>
          {hasClerkConfig() ? (
            auth?.isSignedIn ? (
              <Pressable
                disabled={isSigningOut}
                onPress={handleSignOut}
                style={({ pressed }) => [styles.signOutButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.signOutButtonText}>{isSigningOut ? "Signing out..." : "Sign out"}</Text>
              </Pressable>
            ) : (
              <Link href="/(auth)/sign-in" asChild>
                <Pressable style={({ pressed }) => [styles.signInButton, pressed && styles.buttonPressed]}>
                  <Text style={styles.signInButtonText}>Go to sign in</Text>
                </Pressable>
              </Link>
            )
          ) : (
            <Text style={styles.helperText}>
              Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to enable account actions here.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas
  },
  container: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },
  hero: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: radii.lg,
    gap: spacing.sm,
    padding: spacing.xl
  },
  heroEyebrow: {
    color: colors.accentStrong,
    fontSize: typeScale.caption,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.ink,
    fontSize: typeScale.hero,
    fontWeight: "900"
  },
  heroBody: {
    color: colors.muted,
    fontSize: typeScale.body,
    lineHeight: 23
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: typeScale.title,
    fontWeight: "800"
  },
  settingRow: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    paddingBottom: spacing.md
  },
  settingRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0
  },
  settingCopy: {
    flex: 1,
    gap: spacing.xs
  },
  settingLabel: {
    color: colors.ink,
    fontSize: typeScale.body,
    fontWeight: "800"
  },
  settingBody: {
    color: colors.muted,
    fontSize: typeScale.body,
    lineHeight: 21
  },
  statusPill: {
    backgroundColor: colors.oliveWash,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  statusMuted: {
    backgroundColor: colors.surfaceStrong
  },
  statusText: {
    color: colors.olive,
    fontSize: typeScale.caption,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  statusTextMuted: {
    color: colors.muted
  },
  signOutButton: {
    alignItems: "center",
    backgroundColor: colors.danger,
    borderRadius: radii.md,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: spacing.md
  },
  signOutButtonText: {
    color: colors.accentText,
    fontSize: typeScale.body,
    fontWeight: "700"
  },
  signInButton: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: spacing.md
  },
  signInButtonText: {
    color: colors.accentText,
    fontSize: typeScale.body,
    fontWeight: "700"
  },
  buttonPressed: {
    opacity: 0.85
  },
  helperText: {
    color: colors.muted,
    fontSize: typeScale.body,
    lineHeight: 22
  }
});
