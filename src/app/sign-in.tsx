import { images } from "@/constants/images";
import { Text, View, TextInput } from "@/tw";
import { useSignIn, useSSO } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import VerificationModal from "@/components/VerificationModal";

// Required for OAuth redirect to complete
WebBrowser.maybeCompleteAuthSession();

/**
 * Sign In Screen
 * Same layout as Sign Up but with sign-in copy.
 * Now includes a password field and is wired to Clerk's useSignIn hook.
 */
export default function SignIn() {
  const router = useRouter();
  const { signIn, errors: clerkErrors, fetchStatus } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);

  const isLoading = fetchStatus === "fetching";

  /**
   * Attempt sign-in with email + password.
   * Handles complete, needs_client_trust (MFA), and needs_second_factor states.
   */
  async function handleSignIn() {
    if (!email || !password) return;

    try {
      const { error } = await signIn.password({
        emailAddress: email,
        password,
      });

      if (error) {
        console.error("Sign-in error:", JSON.stringify(error, null, 2));
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log("Session task:", session.currentTask);
              return;
            }
            router.replace("/");
          },
        });
      } else if (signIn.status === "needs_second_factor") {
        // MFA required — show verification modal for email code
        await signIn.mfa.sendEmailCode();
        setModalVisible(true);
      } else if (signIn.status === "needs_client_trust") {
        // Client trust verification — send email code
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor: { strategy: string }) => factor.strategy === "email_code"
        );
        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
          setModalVisible(true);
        }
      } else {
        console.error("Sign-in not complete:", signIn.status);
      }
    } catch (err) {
      console.error("Sign-in error:", err);
    }
  }

  /**
   * Verify the MFA/trust email code entered in the modal.
   */
  async function handleVerifyCode(code: string) {
    setVerificationError("");
    setVerificationLoading(true);

    try {
      await signIn.mfa.verifyEmailCode({ code });

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log("Session task:", session.currentTask);
              return;
            }
            setModalVisible(false);
            router.replace("/");
          },
        });
      } else {
        console.error("Sign-in not complete after verify:", signIn.status);
        setVerificationError("Verification incomplete. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Verification error:", err);
      const message =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors: { message: string }[] }).errors?.[0]?.message
          : "Invalid verification code. Please try again.";
      setVerificationError(message || "Invalid verification code.");
    } finally {
      setVerificationLoading(false);
    }
  }

  /**
   * Resend the MFA email code.
   */
  async function handleResendCode() {
    setVerificationError("");
    try {
      await signIn.mfa.sendEmailCode();
    } catch (err) {
      console.error("Resend error:", err);
      setVerificationError("Failed to resend code. Please try again.");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Back Arrow ── */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
            id="sign-in-back-btn"
          >
            <Text className="font-[Poppins_600SemiBold] text-[22px] text-text-primary">
              ‹
            </Text>
          </TouchableOpacity>

          {/* ── Headline ── */}
          <View className="px-6 mt-2">
            <Text className="font-[Poppins_700Bold] text-[28px] leading-[36px] text-text-primary">
              Welcome back!
            </Text>
            <Text className="font-[Poppins_400Regular] text-[15px] leading-[24px] text-text-secondary mt-1">
              Continue your language journey 🌟
            </Text>
          </View>

          {/* ── Mascot ── */}
          <View className="items-center mt-4 mb-2">
            <Image
              source={images.mascotAuth}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </View>

          {/* ── Form ── */}
          <View className="px-6 gap-3">
            {/* Email input */}
            <View style={styles.inputCard}>
              <Text className="font-[Poppins_400Regular] text-[12px] text-text-secondary mb-1">
                Email
              </Text>
              <TextInput
                className="font-[Poppins_400Regular] text-[15px] text-text-primary"
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                id="sign-in-email-input"
              />
            </View>
            {/* Clerk email/identifier error */}
            {clerkErrors?.fields?.identifier ? (
              <Text className="font-[Poppins_400Regular] text-[12px] text-error -mt-1">
                {clerkErrors.fields.identifier.message}
              </Text>
            ) : null}

            {/* Password input */}
            <View style={styles.inputCard}>
              <Text className="font-[Poppins_400Regular] text-[12px] text-text-secondary mb-1">
                Password
              </Text>
              <View style={styles.passwordRow}>
                <TextInput
                  className="font-[Poppins_400Regular] text-[15px] text-text-primary flex-1"
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  id="sign-in-password-input"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  activeOpacity={0.7}
                  id="sign-in-toggle-password"
                >
                  <Text className="text-[18px] text-text-secondary">
                    {showPassword ? "🙈" : "👁"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Clerk password error */}
            {clerkErrors?.fields?.password ? (
              <Text className="font-[Poppins_400Regular] text-[12px] text-error -mt-1">
                {clerkErrors.fields.password.message}
              </Text>
            ) : null}

            {/* Sign In button */}
            <TouchableOpacity
              onPress={handleSignIn}
              style={[
                styles.primaryBtn,
                (!email || !password || isLoading) && styles.disabledBtn,
              ]}
              activeOpacity={0.85}
              disabled={!email || !password || isLoading}
              id="sign-in-btn"
            >
              <Text className="font-[Poppins_700Bold] text-[17px] text-white">
                {isLoading ? "Signing in…" : "Sign In"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text className="font-[Poppins_400Regular] text-[13px] text-text-secondary mx-3">
                or continue with
              </Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <SocialButton
              id="sign-in-google-btn"
              icon="G"
              iconColor="#4285F4"
              iconBg="#EEF4FF"
              label="Continue with Google"
              strategy="oauth_google"
            />
            <SocialButton
              id="sign-in-facebook-btn"
              icon="f"
              iconColor="#FFFFFF"
              iconBg="#1877F2"
              label="Continue with Facebook"
              strategy="oauth_facebook"
            />
            <SocialButton
              id="sign-in-apple-btn"
              icon=""
              iconColor="#FFFFFF"
              iconBg="#000000"
              label="Continue with Apple"
              strategy="oauth_apple"
              isApple
            />
          </View>

          {/* ── Footer ── */}
          <View className="items-center py-8">
            <View className="flex-row">
              <Text className="font-[Poppins_400Regular] text-[14px] text-text-secondary">
                {"Don't have an account? "}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/sign-up")}
                activeOpacity={0.7}
                id="sign-in-go-signup"
              >
                <Text className="font-[Poppins_600SemiBold] text-[14px] text-lingua-purple">
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Verification Modal (for MFA/trust verification) ── */}
      <VerificationModal
        visible={modalVisible}
        email={email}
        onSubmitCode={handleVerifyCode}
        onResendCode={handleResendCode}
        onClose={() => setModalVisible(false)}
        error={verificationError}
        loading={verificationLoading}
      />
    </SafeAreaView>
  );
}

// ── Social Button ──────────────────────────────────────────────────────────

type SocialButtonProps = {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  label: string;
  strategy: "oauth_google" | "oauth_facebook" | "oauth_apple";
  isApple?: boolean;
};

function SocialButton({
  id,
  icon,
  iconColor,
  iconBg,
  label,
  strategy,
  isApple,
}: SocialButtonProps) {
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  async function handlePress() {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: Linking.createURL("/oauth-callback"),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error(`${strategy} error:`, err);
      Alert.alert(
        "Sign in failed",
        "Could not complete social sign-in. Please try again."
      );
    }
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.socialBtn}
      id={id}
    >
      <View style={[styles.socialIcon, { backgroundColor: iconBg }]}>
        <Text
          style={[
            styles.socialIconText,
            { color: iconColor },
            isApple && styles.appleIcon,
          ]}
        >
          {icon}
        </Text>
      </View>
      <Text className="font-[Poppins_500Medium] text-[15px] text-text-primary flex-1 text-center">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { flexGrow: 1 },
  backButton: {
    marginLeft: 20,
    marginTop: 8,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotImage: {
    width: 160,
    height: 160,
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  primaryBtn: {
    backgroundColor: "#6C4EF5",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  socialIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  socialIconText: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
  },
  appleIcon: {
    fontSize: 18,
    lineHeight: 22,
  },
});
