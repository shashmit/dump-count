import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { useContacts } from "@/features/contacts/ContactsProvider";
import { colors, radii, spacing, typeScale } from "@/theme/tokens";

export default function EditContactScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getContactById, updateContact } = useContacts();
  const contact = getContactById(id);
  const [name, setName] = useState(contact?.name ?? "");
  const [phoneNumber, setPhoneNumber] = useState(contact?.phoneNumber ?? "");
  const [tag, setTag] = useState(contact?.tag ?? "");
  const [city, setCity] = useState(contact?.city ?? "");
  const [vibe, setVibe] = useState(contact?.vibe ?? "");
  const [note, setNote] = useState(contact?.note ?? "");

  if (!contact) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>Refine</Text>
        <Text style={styles.title}>Update the context while the memory is fresh.</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Phone number</Text>
            <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Contact type</Text>
            <TextInput style={styles.input} value={tag} onChangeText={setTag} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>City</Text>
            <TextInput style={styles.input} value={city} onChangeText={setCity} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Vibe</Text>
            <TextInput style={styles.input} value={vibe} onChangeText={setVibe} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Context note</Text>
            <TextInput multiline style={[styles.input, styles.textarea]} value={note} onChangeText={setNote} />
          </View>
        </View>

        <Pressable
          style={styles.saveButton}
          onPress={() => {
            updateContact(contact.id, {
              city,
              name,
              note,
              phoneNumber,
              tag,
              vibe
            });
            router.replace(`/(app)/contact/${contact.id}`);
          }}
        >
          <Text style={styles.saveText}>Update contact</Text>
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
  textarea: {
    minHeight: 110,
    textAlignVertical: "top"
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.plum,
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
