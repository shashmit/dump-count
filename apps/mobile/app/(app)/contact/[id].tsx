import { useLocalSearchParams } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { useContacts } from "@/features/contacts/ContactsProvider";
import { colors, radii, spacing, typeScale } from "@/theme/tokens";

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getContactById } = useContacts();
  const contact = getContactById(id);

  if (!contact) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profile}>
          <View style={[styles.profileTag, pillColors[contact.color]]}>
            <Text style={styles.profileTagText}>{contact.tag}</Text>
          </View>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.phone}>{contact.phoneNumber}</Text>
          <Text style={styles.note}>{contact.note}</Text>
        </View>

        <View style={styles.actions}>
          {["Call", "WhatsApp", "Copy"].map((label, index) => (
            <Pressable
              key={label}
              style={[styles.actionButton, index === 1 ? styles.actionButtonAccent : undefined]}
            >
              <Text
                style={[styles.actionButtonText, index === 1 ? styles.actionButtonTextAccent : undefined]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sheet}>
          <Text style={styles.sectionTitle}>Saved context</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>City</Text>
            <Text style={styles.metaValue}>{contact.city}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Type</Text>
            <Text style={styles.metaValue}>{contact.tag}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Mood</Text>
            <Text style={styles.metaValue}>{contact.vibe}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Reason kept</Text>
            <Text style={styles.metaValue}>High utility, low permanence</Text>
          </View>
        </View>

        <View style={styles.sheet}>
          <Text style={styles.sectionTitle}>Quick notes</Text>
          <View style={styles.notePanel}>
            <Text style={styles.notePanelText}>
              Good candidate for one-tap WhatsApp access. Keep archived once the task cools off, not before.
            </Text>
          </View>
          <View style={styles.inlineButtons}>
            <Pressable style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>Archive</Text>
            </Pressable>
            <Pressable style={[styles.secondaryAction, styles.dangerAction]}>
              <Text style={[styles.secondaryActionText, styles.dangerActionText]}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const pillColors = StyleSheet.create({
  accent: { backgroundColor: colors.accentWash },
  olive: { backgroundColor: colors.oliveWash },
  plum: { backgroundColor: colors.plumWash }
});

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
  profile: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: radii.lg,
    gap: spacing.sm,
    padding: spacing.xl
  },
  profileTag: {
    alignSelf: "flex-start",
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  profileTagText: {
    color: colors.ink,
    fontSize: typeScale.caption,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  name: {
    color: colors.ink,
    fontSize: typeScale.display,
    fontWeight: "900"
  },
  phone: {
    color: colors.accentStrong,
    fontSize: typeScale.title,
    fontWeight: "700"
  },
  note: {
    color: colors.muted,
    fontSize: typeScale.body,
    lineHeight: 24
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    flex: 1,
    minHeight: 54,
    justifyContent: "center"
  },
  actionButtonAccent: {
    backgroundColor: colors.accentStrong,
    borderColor: colors.accentStrong
  },
  actionButtonText: {
    color: colors.ink,
    fontSize: typeScale.body,
    fontWeight: "800"
  },
  actionButtonTextAccent: {
    color: colors.accentText
  },
  sheet: {
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
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  metaLabel: {
    color: colors.mutedSoft,
    fontSize: typeScale.caption,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  metaValue: {
    color: colors.ink,
    fontSize: typeScale.body,
    fontWeight: "700"
  },
  notePanel: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: radii.md,
    padding: spacing.md
  },
  notePanelText: {
    color: colors.muted,
    fontSize: typeScale.body,
    lineHeight: 22
  },
  inlineButtons: {
    flexDirection: "row",
    gap: spacing.sm
  },
  secondaryAction: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderRadius: radii.pill,
    flex: 1,
    minHeight: 50,
    justifyContent: "center"
  },
  secondaryActionText: {
    color: colors.ink,
    fontSize: typeScale.body,
    fontWeight: "800"
  },
  dangerAction: {
    backgroundColor: "#f5d8d4"
  },
  dangerActionText: {
    color: colors.danger
  }
});
