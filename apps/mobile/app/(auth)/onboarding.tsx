import { Redirect, router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/components/AppButton";
import { ContactHeroMark } from "@/components/ContactHeroMark";
import { hasClerkConfig } from "@/config/env";
import { useCurrentUser, useUpdateCurrentUser } from "@/features/auth/useCurrentUser";
import { colors, radii, spacing, typeScale } from "@/theme/tokens";

function splitTags(input: string) {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function OnboardingScreen() {
  const auth = hasClerkConfig() ? useAuth() : null;
  const currentUser = useCurrentUser();
  const updateUser = useUpdateCurrentUser();
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [note, setNote] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser.data) {
      return;
    }

    setDisplayName((value) => value || currentUser.data?.displayName || "");
    setPhoneNumber((value) => value || currentUser.data?.phoneNumber || "");
    setNote((value) => value || currentUser.data?.note || "");
    setTagsText((value) => value || (currentUser.data?.tags ?? []).join(", "));
  }, [currentUser.data]);

  if (!hasClerkConfig()) {
    return <Redirect href="/(app)/contacts" />;
  }

  if (!auth?.isLoaded || currentUser.isLoading) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Preparing your account...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!auth.isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (currentUser.data?.isOnboarded) {
    return <Redirect href="/(app)/contacts" />;
  }

  async function handleContinue() {
    if (!displayName.trim()) {
      setLocalError("Add your name to continue.");
      return;
    }

    if (!phoneNumber.trim()) {
      setLocalError("Add your phone number to continue.");
      return;
    }

    try {
      setLocalError(null);
      await updateUser.mutateAsync({
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim(),
        note: note.trim() || null,
        tags: splitTags(tagsText)
      });
      router.replace("/(app)/contacts");
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "Unable to save your profile.");
    }
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.hero}>
            <View style={styles.stepPill}>
              <Text style={styles.stepPillText}>Step 1 of 1</Text>
            </View>
            <Text style={styles.kicker}>New account</Text>
            <Text style={styles.title}>Set up your profile</Text>
            <Text style={styles.description}>
              Add the two details you will actually use. The rest can stay tucked away.
            </Text>
            <ContactHeroMark />
          </View>

          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Basics</Text>
              <Text style={styles.sectionMeta}>Required</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={setDisplayName}
                placeholder="Your name"
                placeholderTextColor={colors.mutedSoft}
                style={styles.input}
                value={displayName}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Phone number</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="phone-pad"
                onChangeText={setPhoneNumber}
                placeholder="+91 98765 43210"
                placeholderTextColor={colors.mutedSoft}
                style={styles.input}
                value={phoneNumber}
              />
            </View>

            <Pressable onPress={() => setShowMoreOptions((value) => !value)} style={styles.toggleCard}>
              <View style={styles.toggleCopy}>
                <Text style={styles.toggleTitle}>More details</Text>
                <Text style={styles.toggleHint}>Notes and tags are optional.</Text>
              </View>
              <Text style={styles.toggleCaret}>{showMoreOptions ? "−" : "+"}</Text>
            </Pressable>

            {showMoreOptions ? (
              <View style={styles.optionalFields}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Notes</Text>
                  <TextInput
                    multiline
                    onChangeText={setNote}
                    placeholder="Anything useful to remember"
                    placeholderTextColor={colors.mutedSoft}
                    style={[styles.input, styles.textArea]}
                    textAlignVertical="top"
                    value={note}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Tags</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setTagsText}
                    placeholder="broker, vendor, priority"
                    placeholderTextColor={colors.mutedSoft}
                    style={styles.input}
                    value={tagsText}
                  />
                </View>
              </View>
            ) : null}

            {localError ? <Text style={styles.errorText}>{localError}</Text> : null}

            <View style={styles.footer}>
              <Text style={styles.footerHint}>You can change this later from settings.</Text>
              <AppButton label="Continue" loading={updateUser.isPending} onPress={handleContinue} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.canvas,
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  container: {
    backgroundColor: colors.canvas,
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md
  },
  loadingState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg
  },
  loadingText: {
    color: colors.muted,
    fontSize: typeScale.body
  },
  hero: {
    alignItems: "center",
    gap: 6,
    paddingTop: 4
  },
  stepPill: {
    backgroundColor: colors.accentWash,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  stepPillText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase"
  },
  kicker: {
    color: colors.plum,
    fontSize: typeScale.caption,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1.3
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 284,
    textAlign: "center"
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "800"
  },
  sectionMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase"
  },
  fieldGroup: {
    gap: 8
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "700"
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: typeScale.body,
    minHeight: 56,
    paddingHorizontal: spacing.md
  },
  textArea: {
    minHeight: 96,
    paddingTop: spacing.md
  },
  toggleCard: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: 14
  },
  toggleCopy: {
    flex: 1,
    gap: 2
  },
  toggleTitle: {
    color: colors.plum,
    fontSize: 14,
    fontWeight: "800"
  },
  toggleHint: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18
  },
  toggleCaret: {
    color: colors.plum,
    fontSize: 20,
    fontWeight: "500"
  },
  optionalFields: {
    gap: spacing.md
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20
  },
  footer: {
    gap: 10,
    marginTop: 4
  },
  footerHint: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center"
  }
});
