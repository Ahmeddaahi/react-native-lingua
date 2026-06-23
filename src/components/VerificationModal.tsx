import React, { useEffect, useRef, useState } from "react";
import {
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
  onVerified: () => void;
  onClose: () => void;
};

const CODE_LENGTH = 6;

/**
 * VerificationModal
 * Shows a 6-digit OTP input above the keyboard.
 * Auto-navigates (calls onVerified) when all 6 digits are entered.
 */
export default function VerificationModal({
  visible,
  email,
  onVerified,
  onClose,
}: Props) {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const slideAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Animate in/out
  useEffect(() => {
    if (visible) {
      setCode(Array(CODE_LENGTH).fill(""));
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 18,
          stiffness: 200,
        }),
        Animated.timing(opacityAnim, {
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
        Animated.timing(slideAnim, {
          toValue: 60,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  function handleChange(text: string, index: number) {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Auto-navigate when last digit is entered
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (digit && index === CODE_LENGTH - 1) {
      // All 6 digits filled
      const full = newCode.join("");
      if (full.length === CODE_LENGTH) {
        setTimeout(() => onVerified(), 300);
      }
    }
  }

  function handleKeyPress(key: string, index: number) {
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
              opacity: opacityAnim,
              transform: [{ translateY: slideAnim }],
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
                  id={`otp-input-${i}`}
                />
              ))}
          </View>

          {/* Resend */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.resendBtn}
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
    ...StyleSheet.absoluteFillObject,
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
