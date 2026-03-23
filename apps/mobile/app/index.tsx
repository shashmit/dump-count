import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { hasClerkConfig } from "@/config/env";
import { useCurrentUser } from "@/features/auth/useCurrentUser";
import { colors } from "@/theme/tokens";

export default function IndexScreen() {
  const clerkEnabled = hasClerkConfig();

  if (!clerkEnabled) {
    return <Redirect href="/(app)/contacts" />;
  }

  return <AuthWrapper />;
}

function AuthWrapper() {
  const auth = useAuth();
  const currentUser = useCurrentUser();
  
  if (!auth?.isLoaded) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
        <ActivityIndicator color={colors.accent} size="large" />
      </SafeAreaView>
    );
  }

  if (!auth.isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (currentUser.isLoading) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
        <ActivityIndicator color={colors.accent} size="large" />
      </SafeAreaView>
    );
  }

  if (currentUser.data && !currentUser.data.isOnboarded) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(app)/contacts" />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.canvas,
    flex: 1,
    justifyContent: "center"
  }
});
