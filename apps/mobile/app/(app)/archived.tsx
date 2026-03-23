import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { AppFlashList } from "@/components/AppFlashList";
import { useContacts } from "@/features/contacts/ContactsProvider";
import { colors, radii, spacing, typeScale } from "@/theme/tokens";

export default function ArchivedScreen() {
  const { contacts } = useContacts();
  const archivedContacts = contacts.filter((contact) => contact.archived);

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppFlashList
        data={archivedContacts}
        estimatedItemSize={122}
        contentContainerStyle={styles.container}
        ItemSeparatorComponent={() => <View style={styles.rowSpacer} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>Cold storage</Text>
            <Text style={styles.title}>Out of sight, not out of reach.</Text>
            <Text style={styles.body}>
              Archive the contacts that solved their moment so the main list stays tight and mobile-friendly.
            </Text>
          </View>
        }
        renderItem={({ item: contact }) => (
          <View style={styles.archiveRow}>
            <View style={styles.archiveCopy}>
              <Text style={styles.archiveName}>{contact.name}</Text>
              <Text style={styles.archiveNote}>{contact.note}</Text>
            </View>
            <View style={styles.restoreChip}>
              <Text style={styles.restoreText}>Restore</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas
  },
  container: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },
  hero: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: radii.lg,
    gap: spacing.sm,
    padding: spacing.xl
  },
  eyebrow: {
    color: colors.plum,
    fontSize: typeScale.caption,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: typeScale.hero,
    fontWeight: "900"
  },
  body: {
    color: colors.muted,
    fontSize: typeScale.body,
    lineHeight: 23
  },
  archiveRow: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    padding: spacing.lg
  },
  rowSpacer: {
    height: spacing.md
  },
  archiveCopy: {
    flex: 1,
    gap: spacing.xs
  },
  archiveName: {
    color: colors.ink,
    fontSize: typeScale.title,
    fontWeight: "800"
  },
  archiveNote: {
    color: colors.muted,
    fontSize: typeScale.body,
    lineHeight: 22
  },
  restoreChip: {
    backgroundColor: colors.oliveWash,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  restoreText: {
    color: colors.olive,
    fontSize: typeScale.caption,
    fontWeight: "800",
    textTransform: "uppercase"
  }
});
