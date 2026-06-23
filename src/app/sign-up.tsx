import { images } from "@/constants/images";
import { Text, View, TextInput } from "@/tw";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VerificationModal from "@/components/VerificationModal";

/**
 * Sign Up Screen
 * Matches the provided design: back arrow, headline, mascot, email + password
 * inputs, Sign Up CTA, social auth buttons, and "Already have an account?" link.
 */
export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  function handleSignUp() {
    if (!email) return;
    setModalVisible(true);
  }

  function handleVerified() {
    setModalVisible(false);
    router.replace("/");
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
            id="sign-up-back-btn"
          >
            <Text className="font-[Poppins_600SemiBold] text-[22px] text-text-primary">
              ‹
            </Text>
          </TouchableOpacity>

          {/* ── Headline ── */}
          <View className="px-6 mt-2">
            <Text className="font-[Poppins_700Bold] text-[28px] leading-[36px] text-text-primary">
              Create your account
            </Text>
            <Text className="font-[Poppins_400Regular] text-[15px] leading-[24px] text-text-secondary mt-1">
              Start your language journey today ✨
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
                id="sign-up-email-input"
              />
            </View>

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
                  id="sign-up-password-input"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  activeOpacity={0.7}
                  id="sign-up-toggle-password"
                >
                  <Text className="text-[18px] text-text-secondary">
                    {showPassword ? "🙈" : "👁"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up button */}
            <TouchableOpacity
              onPress={handleSignUp}
              style={styles.primaryBtn}
              activeOpacity={0.85}
              id="sign-up-btn"
            >
              <Text className="font-[Poppins_700Bold] text-[17px] text-white">
                Sign Up
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
              id="sign-up-google-btn"
              icon="G"
              iconColor="#4285F4"
              iconBg="#EEF4FF"
              label="Continue with Google"
              onPress={() => {}}
            />
            <SocialButton
              id="sign-up-facebook-btn"
              icon="f"
              iconColor="#FFFFFF"
              iconBg="#1877F2"
              label="Continue with Facebook"
              onPress={() => {}}
            />
            <SocialButton
              id="sign-up-apple-btn"
              icon=""
              iconColor="#FFFFFF"
              iconBg="#000000"
              label="Continue with Apple"
              onPress={() => {}}
              isApple
            />
          </View>

          {/* ── Footer ── */}
          <View className="items-center py-8">
            <View className="flex-row">
              <Text className="font-[Poppins_400Regular] text-[14px] text-text-secondary">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/sign-in")}
                activeOpacity={0.7}
                id="sign-up-go-signin"
              >
                <Text className="font-[Poppins_600SemiBold] text-[14px] text-lingua-purple">
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Verification Modal ── */}
      <VerificationModal
        visible={modalVisible}
        email={email}
        onVerified={handleVerified}
        onClose={() => setModalVisible(false)}
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
  onPress: () => void;
  isApple?: boolean;
};

function SocialButton({
  id,
  icon,
  iconColor,
  iconBg,
  label,
  onPress,
  isApple,
}: SocialButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
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
