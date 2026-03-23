import { router } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { useContacts } from "@/features/contacts/ContactsProvider";
import { colors, radii, spacing, typeScale } from "@/theme/tokens";

export default function NewContactScreen() {
  const { addContact } = useContacts();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tag, setTag] = useState("");
  const [city, setCity] = useState("");
  const [vibe, setVibe] = useState("");
  const [note, setNote] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>Quick add</Text>
        <Text style={styles.title}>Capture the person before they disappear into chat history.</Text>
        <Text style={styles.body}>Keep the entry short, but let the user define the contact type their own way.</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Studio carpenter"
              placeholderTextColor={colors.mutedSoft}
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              placeholder="+91 98765 43210"
              placeholderTextColor={colors.mutedSoft}
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contact type</Text>
            <TextInput
              placeholder="broker, vendor, carpenter, driver"
              placeholderTextColor={colors.mutedSoft}
              style={styles.input}
              value={tag}
              onChangeText={setTag}
            />
            <Text style={styles.helpText}>This becomes a personal filter on your home screen.</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>City</Text>
            <TextInput
              placeholder="Pune"
              placeholderTextColor={colors.mutedSoft}
              style={styles.input}
              value={city}
              onChangeText={setCity}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Vibe</Text>
            <TextInput
              placeholder="Old-school craft"
              placeholderTextColor={colors.mutedSoft}
              style={styles.input}
              value={vibe}
              onChangeText={setVibe}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Context note</Text>
            <TextInput
              multiline
              placeholder="Wardrobe joinery, careful with finish, prefers evening calls"
              placeholderTextColor={colors.mutedSoft}
              style={[styles.input, styles.textarea]}
              value={note}
              onChangeText={setNote}
            />
          </View>
        </View>

        <Pressable
          style={styles.saveButton}
          onPress={() => {
            addContact({
              city,
              name,
              note,
              phoneNumber,
              tag,
              vibe
            });
            router.replace("/(app)/contacts");
          }}
        >
          <Text style={styles.saveText}>Save contact</Text>
        </Pressable>
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
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },
  eyebrow: {
    color: colors.accentStrong,
    fontSize: typeScale.caption,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: typeScale.hero,
    fontWeight: "900",
    lineHeight: 34
  },
  body: {
    color: colors.muted,
    fontSize: typeScale.body,
    lineHeight: 23
  },
  form: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  field: {
    gap: spacing.sm
  },
  label: {
    color: colors.ink,
    fontSize: typeScale.caption,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  input: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: radii.md,
    color: colors.ink,
    minHeight: 54,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  helpText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  textarea: {
    minHeight: 110,
    textAlignVertical: "top"
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.accentStrong,
    borderRadius: radii.pill,
    justifyContent: "center",
    minHeight: 56
  },
  saveText: {
    color: colors.accentText,
    fontSize: typeScale.body,
    fontWeight: "800"
  }
});
