import { SafeAreaView, StyleSheet, View } from "react-native";

import { ScreenCard } from "@/components/ScreenCard";
import { colors, spacing } from "@/theme/tokens";

export default function UnlockScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScreenCard
          eyebrow="Security"
          title="Unlock gate scaffolded"
          description="PIN and biometric unlock will sit in the app flow after sign-in. The provider is already in place so we can wire native auth without restructuring navigation again."
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg
  }
});
