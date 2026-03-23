import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typeScale } from "@/theme/tokens";

type ScreenCardProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
}>;

export function ScreenCard({ eyebrow, title, description, children }: ScreenCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.xl,
    shadowColor: "#bfc7d6",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20
  },
  eyebrow: {
    color: colors.accent,
    fontSize: typeScale.caption,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: typeScale.hero,
    fontWeight: "800"
  },
  description: {
    color: colors.muted,
    fontSize: typeScale.body,
    lineHeight: 24
  }
});
