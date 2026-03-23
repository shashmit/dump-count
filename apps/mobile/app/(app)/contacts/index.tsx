import { Link, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppFlashList } from "@/components/AppFlashList";
import { BottomSheet } from "@/components/BottomSheet";
import { useContacts } from "@/features/contacts/ContactsProvider";
import { useFloatingControls } from "@/features/navigation/FloatingControlsProvider";
import { colors, radii, spacing, typeScale } from "@/theme/tokens";

export default function ContactsScreen() {
  const { contacts } = useContacts();
  const { isSearchOpen, setSearchOpen, setSearchVisible } = useFloatingControls();
  const insets = useSafeAreaInsets();
  const [inlineSearchQuery, setInlineSearchQuery] = useState("");
  const [sheetSearchQuery, setSheetSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const activeContacts = useMemo(() => contacts.filter((contact) => !contact.archived), [contacts]);
  const archivedThisMonth = useMemo(() => contacts.filter((contact) => contact.archived).length, [contacts]);
  const availableFilters = useMemo(() => {
    const tags = Array.from(new Set(activeContacts.map((contact) => contact.tag.trim().toLowerCase())));
    return ["all", ...tags];
  }, [activeContacts]);

  const filteredContacts = useMemo(() => {
    const query = inlineSearchQuery.trim().toLowerCase();
    const byFilter =
      selectedFilter === "all"
        ? activeContacts
        : activeContacts.filter((contact) => contact.tag.trim().toLowerCase() === selectedFilter);

    if (!query) {
      return byFilter;
    }

    return byFilter.filter((contact) =>
      [contact.name, contact.phoneNumber, contact.note, contact.city, contact.tag, contact.vibe]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [activeContacts, inlineSearchQuery, selectedFilter]);

  const sheetFilteredContacts = useMemo(() => {
    const query = sheetSearchQuery.trim().toLowerCase();

    if (!query) {
      return activeContacts;
    }

    return activeContacts.filter((contact) =>
      [contact.name, contact.phoneNumber, contact.note, contact.city, contact.tag, contact.vibe]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [activeContacts, sheetSearchQuery]);

  useEffect(() => {
    setSearchVisible(false);

    return () => {
      setSearchVisible(true);
    };
  }, [setSearchVisible]);

  function handleOpenSearchSheet() {
    setSheetSearchQuery(inlineSearchQuery);
    setSearchOpen(true);
  }

  return (
    <View style={styles.safeArea}>
      <AppFlashList
        data={filteredContacts}
        estimatedItemSize={210}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={[styles.hero, { paddingTop: insets.top + spacing.md }]}>
              <View style={styles.heroGlowLeft} />
              <View style={styles.heroGlowRight} />
              <View style={styles.heroArcMain} />
              <View style={styles.heroArcInner} />
              <View style={styles.topBar}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push("/(app)/archived")}
                  style={styles.topIconButton}
                >
                  <Image
                    source={require("../../../assets/archive-icon.png")}
                    style={styles.topIcon}
                    resizeMode="contain"
                  />
                </Pressable>
                <Text style={styles.topTitle}>Contacts</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push("/(app)/settings")}
                  style={styles.topIconButton}
                >
                  <Image
                    source={require("../../../assets/setting-icon.png")}
                    style={styles.topIcon}
                    resizeMode="contain"
                  />
                </Pressable>
              </View>

              <View style={styles.heroHeaderCopy}>
                <Text style={styles.heroEyebrow}>Quiet utility</Text>
                <Text style={styles.heroQuestion}>Who do you need to find today?</Text>
              </View>

              <View style={styles.searchBar}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={handleOpenSearchSheet}
                  placeholder="Search Contacts"
                  placeholderTextColor={colors.muted}
                  style={styles.searchField}
                  value={inlineSearchQuery}
                  onChangeText={setInlineSearchQuery}
                />
                <Pressable accessibilityRole="button" onPress={handleOpenSearchSheet} style={styles.searchButton}>
                  <Text style={styles.searchButtonText}>🔎</Text>
                </Pressable>
              </View>

              <View style={styles.heroStats}>
                <View style={styles.statBlock}>
                  <Text style={styles.statValue}>{String(activeContacts.length).padStart(2, "0")}</Text>
                  <Text style={styles.statLabel}>total live contacts</Text>
                </View>
                <View style={[styles.statBlock, styles.statTint]}>
                  <Text style={styles.statValue}>{String(archivedThisMonth).padStart(2, "0")}</Text>
                  <Text style={styles.statLabel}>archived month</Text>
                </View>
              </View>
            </View>

            <AppFlashList
              data={availableFilters}
              estimatedItemSize={108}
              horizontal
              keyExtractor={(item) => item}
              contentContainerStyle={styles.filters}
              ItemSeparatorComponent={() => <View style={styles.filterSpacer} />}
              renderItem={({ item: filter }) => (
                <Pressable
                  onPress={() => setSelectedFilter(filter)}
                  style={[styles.filterChip, selectedFilter === filter ? styles.filterChipActive : undefined]}
                >
                  <Text style={[styles.filterText, selectedFilter === filter ? styles.filterTextActive : undefined]}>
                    {filter}
                  </Text>
                </Pressable>
              )}
            />

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>
                {selectedFilter === "all" ? "Today’s useful people" : `${selectedFilter} contacts`}
              </Text>
              <Text style={styles.sectionMeta}>{filteredContacts.length} shown</Text>
            </View>
          </>
        }
        ListFooterComponent={
          inlineSearchQuery.trim() ? null : (
            <Link href="/(app)/contact/new" asChild>
              <Pressable style={styles.composer}>
                <View>
                  <Text style={styles.composerTitle}>Drop a new contact fast</Text>
                  <Text style={styles.composerBody}>
                    One-tap entry for people you need later but never want in your real contact list.
                  </Text>
                </View>
              </Pressable>
            </Link>
          )
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No contacts match this view</Text>
            <Text style={styles.emptyStateBody}>Try another filter or search term.</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.cardSpacer} />}
        keyExtractor={(item) => item.id}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          setSearchVisible(offsetY > 72);
        }}
        renderItem={({ item: contact }) => (
          <Link href={`/(app)/contact/${contact.id}`} asChild>
            <Pressable style={styles.contactCard}>
              <View style={styles.contactTop}>
                <View style={[styles.badge, badgeStyles[contact.color]]}>
                  <Text style={styles.badgeText}>{contact.tag}</Text>
                </View>
                <Text style={styles.city}>{contact.city}</Text>
              </View>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.phoneText}>{contact.phoneNumber}</Text>
              <Text style={styles.contactNote}>{contact.note}</Text>
              <View style={styles.contactFooter}>
                <View style={styles.vibePill}>
                  <Text style={styles.vibe}>{contact.vibe}</Text>
                </View>
                <View style={styles.openAction}>
                  <Text style={styles.openHint}>Open</Text>
                  <Text style={styles.openArrow}>↗</Text>
                </View>
              </View>
            </Pressable>
          </Link>
        )}
        scrollEventThrottle={16}
      />

      <BottomSheet
        visible={isSearchOpen}
        title="Search contacts"
        description="Find people by name, note, city, number, or tag."
        size="large"
        onClose={() => {
          setSearchOpen(false);
          setSheetSearchQuery("");
        }}
      >
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Type a name, number, city, or tag"
          placeholderTextColor={colors.mutedSoft}
          style={styles.searchInput}
          value={sheetSearchQuery}
          onChangeText={setSheetSearchQuery}
        />

        <AppFlashList
          data={sheetFilteredContacts.slice(0, 6)}
          estimatedItemSize={74}
          style={styles.searchResultsList}
          ItemSeparatorComponent={() => <View style={styles.searchResultSpacer} />}
          keyExtractor={(item) => item.id}
          renderItem={({ item: contact }) => (
            <Pressable
              onPress={() => {
                setSearchOpen(false);
                setSheetSearchQuery("");
                router.push(`/(app)/contact/${contact.id}`);
              }}
              style={styles.searchResultRow}
            >
              <View style={styles.searchResultCopy}>
                <Text style={styles.searchResultName}>{contact.name}</Text>
                <Text style={styles.searchResultMeta}>
                  {contact.city} · {contact.phoneNumber}
                </Text>
              </View>
              <Text style={styles.searchResultTag}>{contact.tag}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptySearchState}>
              <Text style={styles.emptySearchTitle}>No contact found</Text>
              <Text style={styles.emptySearchBody}>Try a different name, tag, city, or number.</Text>
            </View>
          }
        />
      </BottomSheet>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  accent: { backgroundColor: colors.accentWash },
  olive: { backgroundColor: colors.oliveWash },
  plum: { backgroundColor: colors.plumWash }
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fefeff"
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    backgroundColor: "#4a7ff8",
    gap: spacing.md,
    marginBottom: spacing.lg,
    overflow: "hidden",
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    shadowColor: "#1d4f96",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 26
  },
  heroGlowLeft: {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderRadius: 240,
    height: 280,
    left: -120,
    position: "absolute",
    top: -150,
    width: 280
  },
  heroGlowRight: {
    backgroundColor: "rgba(255, 199, 103, 0.24)",
    borderRadius: 260,
    height: 320,
    position: "absolute",
    right: -130,
    top: -170,
    width: 320
  },
  heroArcMain: {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: 420,
    height: 420,
    position: "absolute",
    right: -170,
    top: -210,
    width: 420
  },
  heroArcInner: {
    backgroundColor: "rgba(240, 239, 235, 0.18)",
    borderRadius: 330,
    height: 330,
    position: "absolute",
    right: -120,
    top: -165,
    width: 330
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm
  },
  topIconButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  topIcon: {
    height: 28,
    width: 28
  },
  topTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800"
  },
  heroHeaderCopy: {
    gap: spacing.xs,
    marginBottom: spacing.sm
  },
  heroEyebrow: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    fontWeight: "500"
  },
  heroQuestion: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -1.1,
    lineHeight: 39,
    maxWidth: 300
  },
  heroStats: {
    flexDirection: "row",
    gap: spacing.sm
  },
  statBlock: {
    backgroundColor: "#ffffff",
    borderRadius: radii.md,
    flex: 1,
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  statTint: {
    backgroundColor: "#f0efeb"
  },
  statValue: {
    color: "#202020",
    fontSize: 24,
    fontWeight: "900"
  },
  statLabel: {
    color: "#6f675f",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
    textTransform: "uppercase"
  },
  searchBar: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm
  },
  searchPlaceholder: {
    color: colors.mutedSoft,
    flex: 1,
    fontSize: typeScale.body,
    paddingHorizontal: spacing.sm
  },
  searchField: {
    color: "#ffffff",
    flex: 1,
    fontSize: typeScale.body,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  searchButton: {
    alignItems: "center",
    backgroundColor: "#fffefe",
    borderRadius: radii.pill,
    justifyContent: "center",
    minHeight: 42,
    minWidth: 42,
    paddingHorizontal: spacing.sm
  },
  searchButtonText: {
    color: "#4a7ff8",
    fontSize: 17,
    fontWeight: "800"
  },
  searchInput: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: typeScale.body,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md
  },
  searchResults: {
    paddingTop: spacing.sm
  },
  searchResultsList: {
    maxHeight: 320,
    minHeight: 180
  },
  searchResultRow: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderRadius: radii.md,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
    padding: spacing.md
  },
  searchResultSpacer: {
    height: spacing.sm
  },
  searchResultCopy: {
    flex: 1,
    gap: 4
  },
  searchResultName: {
    color: colors.ink,
    fontSize: typeScale.body,
    fontWeight: "800"
  },
  searchResultMeta: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  searchResultTag: {
    color: colors.accentStrong,
    fontSize: typeScale.caption,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  emptySearchState: {
    alignItems: "center",
    paddingVertical: spacing.lg
  },
  emptySearchTitle: {
    color: colors.ink,
    fontSize: typeScale.body,
    fontWeight: "800"
  },
  emptySearchBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
    textAlign: "center"
  },
  filters: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg
  },
  filterSpacer: {
    width: spacing.sm
  },
  filterChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  filterChipActive: {
    backgroundColor: "#ff7648",
    borderColor: "#ff7648"
  },
  filterText: {
    color: colors.muted,
    fontSize: typeScale.caption,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  filterTextActive: {
    color: colors.accentText
  },
  sectionRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm
  },
  sectionTitle: {
    color: "#202020",
    fontSize: typeScale.title,
    fontWeight: "800"
  },
  sectionMeta: {
    color: "#b07357",
    fontSize: typeScale.caption,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  contactCard: {
    backgroundColor: "#fffefe",
    borderColor: "#efe8de",
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    shadowColor: "#d9d6d0",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18
  },
  cardSpacer: {
    height: spacing.md
  },
  contactTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8
  },
  badgeText: {
    color: "#202020",
    fontSize: typeScale.caption,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  city: {
    color: "#9a9083",
    fontSize: typeScale.caption,
    fontWeight: "700"
  },
  contactName: {
    color: "#202020",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.6
  },
  phoneText: {
    color: "#ff7648",
    fontSize: 18,
    fontWeight: "700"
  },
  contactNote: {
    color: "#6f675f",
    fontSize: typeScale.body,
    lineHeight: 23
  },
  contactFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  vibePill: {
    backgroundColor: "#edf2ff",
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  vibe: {
    color: "#4a7ff8",
    fontSize: typeScale.caption,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  openAction: {
    alignItems: "center",
    backgroundColor: "#fff3ed",
    borderRadius: radii.pill,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  openHint: {
    color: "#ff7648",
    fontSize: typeScale.caption,
    fontWeight: "700"
  },
  openArrow: {
    color: "#ff7648",
    fontSize: 14,
    fontWeight: "800",
    marginTop: -1
  },
  composer: {
    backgroundColor: "#f0efeb",
    borderRadius: radii.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.xl
  },
  composerTitle: {
    color: "#202020",
    fontSize: typeScale.title,
    fontWeight: "800"
  },
  composerBody: {
    color: "#6f675f",
    fontSize: typeScale.body,
    lineHeight: 22,
    marginTop: spacing.xs,
    maxWidth: 260
  },
  emptyState: {
    alignItems: "center",
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.xl
  },
  emptyStateTitle: {
    color: colors.ink,
    fontSize: typeScale.title,
    fontWeight: "800"
  },
  emptyStateBody: {
    color: colors.muted,
    fontSize: typeScale.body,
    lineHeight: 22,
    marginTop: spacing.xs,
    textAlign: "center"
  }
});
