import { images } from "@/constants/images";
import { Text, View, Pressable } from "@/tw";
import { useAuth } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import { Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Onboarding Screen
 * Introduces Lingua to new users with the mascot, headline, and CTA.
 * Redirects to home if the user is already signed in.
 */
export default function Onboarding() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for Clerk to load before deciding
  if (!isLoaded) return null;

  // Already signed in → go home
  if (isSignedIn) return <Redirect href="/" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 bg-background">

        {/* ── Top Logo + App Name ── */}
        <View className="flex-row items-center justify-center pt-10 gap-2">
          <Image
            source={images.mascotLogo}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text className="font-[Poppins_700Bold] text-[28px] text-text-primary tracking-tight">
            lingua
          </Text>
        </View>

        {/* ── Headline ── */}
        <View className="px-6 mt-8">
          <Text className="font-[Poppins_800ExtraBold] text-[34px] leading-[42px] text-text-primary">
            Your AI language
          </Text>
          <Text className="font-[Poppins_800ExtraBold] text-[34px] leading-[42px] text-lingua-purple">
            teacher
            <Text className="font-[Poppins_800ExtraBold] text-[34px] leading-[42px] text-text-primary">
              .
            </Text>
          </Text>
          <Text className="font-[Poppins_400Regular] text-[15px] leading-[24px] text-text-secondary mt-3">
            Real conversations, personalized{"\n"}lessons, anytime, anywhere.
          </Text>
        </View>

        {/* ── Mascot Illustration + Speech Bubbles ── */}
        <View className="flex-1 items-center justify-center mt-4">
          {/* Hello bubble — left */}
          <View style={[styles.bubble, styles.bubbleLeft]}>
            <Text className="font-[Poppins_500Medium] text-[15px] text-text-primary">
              Hello!
            </Text>
          </View>

          {/* ¡Hola! bubble — top right */}
          <View style={[styles.bubble, styles.bubbleTopRight]}>
            <Text className="font-[Poppins_500Medium] text-[15px] text-lingua-purple">
              ¡Hola!
            </Text>
          </View>

          {/* 你好! bubble — bottom right */}
          <View style={[styles.bubble, styles.bubbleBottomRight]}>
            <Text className="font-[Poppins_500Medium] text-[15px] text-[#E03131]">
              你好！
            </Text>
          </View>

          {/* Mascot */}
          <Image
            source={images.mascotWelcome}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* ── Get Started Button ── */}
        <View className="px-6 pb-10">
          <Pressable
            onPress={() => router.push("/sign-up")}
            className="bg-lingua-purple rounded-2xl py-5 flex-row items-center justify-center"
          >
            <Text className="font-[Poppins_700Bold] text-[17px] text-white mr-2">
              Get Started
            </Text>
            <Text className="font-[Poppins_700Bold] text-[17px] text-white">
              {">"}
            </Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  logoImage: {
    width: 44,
    height: 44,
  },
  mascotImage: {
    width: 280,
    height: 280,
  },
  bubble: {
    position: "absolute",
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleLeft: {
    left: 20,
    top: "20%",
  },
  bubbleTopRight: {
    right: 20,
    top: "5%",
  },
  bubbleBottomRight: {
    right: 20,
    top: "50%",
    backgroundColor: "#FFF0F0",
  },
});
