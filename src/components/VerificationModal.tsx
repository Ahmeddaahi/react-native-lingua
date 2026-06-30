import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Pressable,
} from "react-native";

type Props = {
  visible: boolean;
  email: string;
  /** Called when the user enters all 6 digits. Parent handles Clerk verification. */
  onSubmitCode: (code: string) => Promise<void>;
  /** Called when user taps "Resend code". Parent re-sends via Clerk. */
  onResendCode: () => Promise<void>;
  /** Called when the modal is dismissed (close button or backdrop tap). */
  onClose: () => void;
  /** Optional error message from Clerk verification (e.g. invalid code). */
  error?: string;
  /** When true, disables inputs and shows a loading indicator. */
  loading?: boolean;
};

const CODE_LENGTH = 6;

/**
 * VerificationModal
 * Shows a 6-digit OTP input above the keyboard.
 * Calls onSubmitCode when all 6 digits are entered — the parent screen
 * handles the actual Clerk verification and navigates on success.
 */
export default function VerificationModal({
  visible,
  email,
  onSubmitCode,
  onResendCode,
  onClose,
  error,
  loading = false,
}: Props) {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const slideAnim = useRef(new Animated.Value(60));
  const opacityAnim = useRef(new Animated.Value(0));

  // Animate in/out
  useEffect(() => {
    if (visible) {
      setTimeout(() => setCode(Array(CODE_LENGTH).fill("")), 0);
      Animated.parallel([
        Animated.spring(slideAnim.current, {
          toValue: 0,
          useNativeDriver: true,
          damping: 18,
          stiffness: 200,
        }),
        Animated.timing(opacityAnim.current, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Focus first input after animation
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      });
    } else {
      Animated.parallel([
        Animated.timing(slideAnim.current, {
          toValue: 60,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim.current, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, opacityAnim]);

  function handleChange(text: string, index: number) {
    if (loading) return;

    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Auto-advance to next input
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // When last digit is entered, submit to parent
    if (digit && index === CODE_LENGTH - 1) {
      const full = newCode.join("");
      if (full.length === CODE_LENGTH) {
        onSubmitCode(full);
      }
    }
  }

  function handleKeyPress(key: string, index: number) {
    if (loading) return;

    if (key === "Backspace" && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  }

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "***" + c)
    : "your email";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      <KeyboardAvoidingView
        style={styles.kavContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              opacity: opacityAnim.current,
              transform: [{ translateY: slideAnim.current }],
            },
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.7}
            id="verification-close-btn"
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {/* Email icon */}
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>✉️</Text>
          </View>

          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{"\n"}
            <Text style={styles.emailHighlight}>{maskedEmail}</Text>
          </Text>

          {/* OTP inputs */}
          <View style={styles.otpRow}>
            {Array(CODE_LENGTH)
              .fill(null)
              .map((_, i) => (
                <TextInput
                  key={i}
                  ref={(r) => {
                    inputRefs.current[i] = r;
                  }}
                  style={[
                    styles.otpBox,
                    code[i] ? styles.otpBoxFilled : styles.otpBoxEmpty,
                    error ? styles.otpBoxError : null,
                  ]}
                  value={code[i]}
                  onChangeText={(t) => handleChange(t, i)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, i)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                  caretHidden
                  editable={!loading}
                  id={`otp-input-${i}`}
                />
              ))}
          </View>

          {/* Error message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Loading indicator */}
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#6C4EF5"
              style={styles.loader}
            />
          ) : null}

          {/* Resend */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.resendBtn}
            onPress={onResendCode}
            disabled={loading}
            id="verification-resend-btn"
          >
            <Text style={styles.resendText}>
              {"Didn't receive it? "}
              <Text style={styles.resendLink}>Resend code</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(13,19,43,0.45)",
  },
  kavContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingBottom: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 24,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginBottom: 16,
  },
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 13,
    color: "#6B7280",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 30,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: "#0D132B",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  emailHighlight: {
    fontFamily: "Poppins_600SemiBold",
    color: "#6C4EF5",
  },
  otpRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 14,
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#0D132B",
  },
  otpBoxEmpty: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#F6F7FB",
  },
  otpBoxFilled: {
    borderWidth: 2,
    borderColor: "#6C4EF5",
    backgroundColor: "#EEF2FF",
  },
  otpBoxError: {
    borderColor: "#FF4D4F",
  },
  errorText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#FF4D4F",
    textAlign: "center",
    marginTop: -16,
    marginBottom: 12,
  },
  loader: {
    marginBottom: 8,
  },
  resendBtn: {
    paddingVertical: 8,
  },
  resendText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#6B7280",
  },
  resendLink: {
    fontFamily: "Poppins_600SemiBold",
    color: "#6C4EF5",
  },
});
