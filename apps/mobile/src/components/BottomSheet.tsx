import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { PropsWithChildren } from "react";

import { colors, radii, spacing, typeScale } from "@/theme/tokens";

type BottomSheetProps = PropsWithChildren<{
  visible: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  size?: "default" | "large";
}>;

export function BottomSheet({ visible, title, description, onClose, size = "default", children }: BottomSheetProps) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, size === "large" ? styles.sheetLarge : undefined]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
          </View>
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(32, 32, 32, 0.18)",
    flex: 1,
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    gap: spacing.md,
    maxHeight: "72%",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl
  },
  sheetLarge: {
    minHeight: "58%"
  },
  handle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: radii.pill,
    height: 5,
    width: 56
  },
  header: {
    gap: spacing.xs
  },
  title: {
    color: colors.ink,
    fontSize: typeScale.title,
    fontWeight: "900"
  },
  description: {
    color: colors.muted,
    fontSize: typeScale.body,
    lineHeight: 22
  },
  content: {
    flexGrow: 1,
    gap: spacing.md
  }
});
