import { useAuth, useSSO, useSignIn, useSignUp } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/components/AppButton";
import { BottomSheet } from "@/components/BottomSheet";
import { ContactHeroMark } from "@/components/ContactHeroMark";
import { hasClerkConfig } from "@/config/env";
import { colors, radii, spacing, typeScale } from "@/theme/tokens";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { startSSOFlow } = useSSO();
  const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const [activeStrategy, setActiveStrategy] = useState<"oauth_google" | "oauth_apple" | null>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailStep, setEmailStep] = useState<"collect_email" | "verify_code">("collect_email");
  const [emailFlow, setEmailFlow] = useState<"sign_in" | "sign_up">("sign_in");
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEmailSheetVisible, setIsEmailSheetVisible] = useState(false);

  if (!hasClerkConfig()) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.fallbackTitle}>Clerk key missing</Text>
          <Text style={styles.fallbackBody}>
            Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in the mobile app env file before trying to sign in.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoaded && isSignedIn) {
    return <Redirect href="/" />;
  }

  async function handleSSOSignIn(strategy: "oauth_google" | "oauth_apple") {
    try {
      setErrorMessage(null);
      setActiveStrategy(strategy);

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: Linking.createURL("/")
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to start sign-in.";
      setErrorMessage(message);
    } finally {
      setActiveStrategy(null);
    }
  }

  async function handleEmailSubmit() {
    if (!isSignInLoaded || !isSignUpLoaded || !signIn || !signUp || !emailAddress.trim()) {
      return;
    }

    try {
      setErrorMessage(null);
      setIsEmailSubmitting(true);
      setEmailFlow("sign_in");

      try {
        const createdSignIn = await signIn.create({
          strategy: "email_code",
          identifier: emailAddress.trim()
        });

        if (createdSignIn.status === "complete" && createdSignIn.createdSessionId && setActive) {
          await setActive({ session: createdSignIn.createdSessionId });
          return;
        }

        setEmailStep("verify_code");
        return;
      } catch (error) {
        if (!isAccountNotFoundError(error)) {
          throw error;
        }

        setEmailFlow("sign_up");
        await signUp.create({
          emailAddress: emailAddress.trim(),
          password: generateHiddenPassword()
        });
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code"
        });
        setEmailStep("verify_code");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send verification code.";
      setErrorMessage(message);
    } finally {
      setIsEmailSubmitting(false);
    }
  }

  async function handleEmailVerify() {
    if (!isSignInLoaded || !isSignUpLoaded || !signIn || !signUp || !emailCode.trim()) {
      return;
    }

    try {
      setErrorMessage(null);
      setIsEmailSubmitting(true);

      if (emailFlow === "sign_up") {
        const verificationAttempt = await signUp.attemptEmailAddressVerification({
          code: emailCode.trim()
        });

        if (verificationAttempt.status === "complete" && verificationAttempt.createdSessionId && setActive) {
          await setActive({ session: verificationAttempt.createdSessionId });
        } else {
          setErrorMessage("Verification did not complete. Please request a new code and try again.");
        }
      } else {
        const verificationAttempt = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code: emailCode.trim()
        });

        if (verificationAttempt.status === "complete" && verificationAttempt.createdSessionId && setActive) {
          await setActive({ session: verificationAttempt.createdSessionId });
        } else {
          setErrorMessage("Verification did not complete. Please request a new code and try again.");
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to verify email code.";
      setErrorMessage(message);
    } finally {
      setIsEmailSubmitting(false);
    }
  }

  async function handleResendCode() {
    if (!isSignInLoaded || !isSignUpLoaded || !signIn || !signUp || !emailAddress.trim()) {
      return;
    }

    try {
      setErrorMessage(null);
      setIsEmailSubmitting(true);
      if (emailFlow === "sign_up") {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code"
        });
      } else {
        await signIn.create({
          strategy: "email_code",
          identifier: emailAddress.trim()
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to resend verification code.";
      setErrorMessage(message);
    } finally {
      setIsEmailSubmitting(false);
    }
  }

  function handleStartOver() {
    setEmailAddress("");
    setEmailCode("");
    setEmailStep("collect_email");
    setEmailFlow("sign_in");
    setErrorMessage(null);
  }

  function handleOpenEmailSheet() {
    setErrorMessage(null);
    setIsEmailSheetVisible(true);
  }

  function handleCloseEmailSheet() {
    setIsEmailSheetVisible(false);
    setEmailCode("");
    setEmailStep("collect_email");
    setEmailFlow("sign_in");
    setErrorMessage(null);
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Keep the main contacts clean</Text>
          <Text style={styles.header}>dumpcont</Text>
          <ContactHeroMark />
          <View style={styles.copyBlock}>
            <Text style={styles.subtitle}>Dump your inactive contacts here.</Text>
            <Text style={styles.description}>Save brokers, drivers, vendors, and one-off contacts without cluttering your phonebook.</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <AppButton
            disabled={!isLoaded || activeStrategy !== null}
            label="Continue with Google"
            loading={activeStrategy === "oauth_google"}
            onPress={() => handleSSOSignIn("oauth_google")}
          />
          {Platform.OS === "ios" ? (
            <AppButton
              disabled={!isLoaded || activeStrategy !== null}
              label="Continue with Apple"
              loading={activeStrategy === "oauth_apple"}
              onPress={() => handleSSOSignIn("oauth_apple")}
              variant="secondary"
            />
          ) : null}
          <AppButton label="Continue with Email" onPress={handleOpenEmailSheet} variant="secondary" />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>
      </View>

      <BottomSheet
        description={
          emailStep === "collect_email"
            ? "Enter your email and we will send a verification code."
            : `We sent a code to ${emailAddress}. Enter it below to continue.`
        }
        onClose={handleCloseEmailSheet}
        title={emailStep === "collect_email" ? "Continue with email" : "Verify your email"}
        visible={isEmailSheetVisible}
      >
        {emailStep === "collect_email" ? (
          <>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={setEmailAddress}
              placeholder="you@example.com"
              placeholderTextColor={colors.mutedSoft}
              style={styles.input}
              value={emailAddress}
            />
            <AppButton
              disabled={!isSignInLoaded || !isSignUpLoaded || !emailAddress.trim()}
              label="Send code"
              loading={isEmailSubmitting}
              onPress={handleEmailSubmit}
            />
          </>
        ) : (
          <>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              onChangeText={setEmailCode}
              placeholder="123456"
              placeholderTextColor={colors.mutedSoft}
              style={styles.input}
              value={emailCode}
            />
            <AppButton
              disabled={!isSignInLoaded || !isSignUpLoaded || !emailCode.trim()}
              label="Verify code"
              loading={isEmailSubmitting}
              onPress={handleEmailVerify}
            />
            <View style={styles.sheetActions}>
              <AppButton label="Resend code" onPress={handleResendCode} variant="secondary" />
            </View>
          </>
        )}

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas
  },
  container: {
    backgroundColor: colors.canvas,
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md
  },
  fallbackTitle: {
    color: colors.ink,
    fontSize: typeScale.hero,
    fontWeight: "900"
  },
  fallbackBody: {
    color: colors.muted,
    fontSize: typeScale.body,
    lineHeight: 24,
    marginTop: spacing.sm
  },
  hero: {
    alignItems: "center",
    gap: 4,
    paddingTop: 4
  },
  kicker: {
    color: colors.plum,
    fontSize: typeScale.caption,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: spacing.xs,
    textTransform: "uppercase"
  },
  header: {
    color: colors.ink,
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: -2.2,
    marginBottom: 2
  },
  copyBlock: {
    alignItems: "center",
    gap: 8,
    marginTop: 2
  },
  subtitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 21,
    maxWidth: 268,
    textAlign: "center"
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 300,
    textAlign: "center"
  },
  actions: {
    gap: 12,
    paddingTop: spacing.md
  },
  input: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: typeScale.body,
    minHeight: 56,
    paddingHorizontal: spacing.md
  },
  sheetActions: {
    gap: spacing.sm
  },
  errorText: {
    color: colors.danger,
    fontSize: typeScale.body,
    fontWeight: "600",
    lineHeight: 22
  }
});

function isAccountNotFoundError(error: unknown) {
  const code = getClerkErrorCode(error);
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  return code === "form_identifier_not_found" || message.includes("find your account");
}

function getClerkErrorCode(error: unknown) {
  if (!error || typeof error !== "object") {
    return null;
  }

  const maybeError = error as {
    errors?: Array<{
      code?: string;
    }>;
  };

  return maybeError.errors?.[0]?.code ?? null;
}

function generateHiddenPassword() {
  return `Dumpcont!${Math.random().toString(36).slice(2)}A9`;
}
