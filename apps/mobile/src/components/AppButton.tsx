import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { colors, radii, spacing, typeScale } from "@/theme/tokens";

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
  disabled,
  loading,
  style
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        style,
        (pressed || isDisabled) && styles.pressed
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.accentText : colors.ink} />
      ) : (
        <Text style={[styles.label, textStyles[variant]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.accentStrong,
    borderColor: colors.accentStrong,
    shadowColor: "#cf5a31",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 18
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: colors.border
  }
});

const textStyles = StyleSheet.create({
  primary: {
    color: colors.accentText
  },
  secondary: {
    color: colors.ink
  },
  ghost: {
    color: colors.muted
  }
});

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radii.pill,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 58,
    paddingHorizontal: spacing.lg
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.995 }]
  },
  label: {
    fontSize: typeScale.body,
    fontWeight: "800"
  }
});
