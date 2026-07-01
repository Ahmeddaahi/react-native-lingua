import "../global.css";

import { useLanguageStore } from "@/store/language-store";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Keep the splash screen visible while fonts + auth load
SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to the .env file.",
  );
}

/**
 * Handles auth + language-selection navigation:
 * - Signed out → redirect to onboarding
 * - Signed in, no language selected → redirect to language-selection
 * - Signed in, language selected, on auth screen → redirect to home (/)
 */
function AuthNavigationGuard() {
  const { isSignedIn, isLoaded } = useAuth();
  const { selectedLanguageId, isHydrated } = useLanguageStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !isHydrated) return;

    const inAuthScreen =
      segments[0] === "sign-in" ||
      segments[0] === "sign-up" ||
      segments[0] === "onboarding";

    const inLanguageSelection = segments[0] === "language-selection";

    if (!isSignedIn && !inAuthScreen && segments[0] !== "oauth-callback") {
      // Not signed in → go to onboarding
      router.replace("/onboarding");
    } else if (isSignedIn && !selectedLanguageId && !inLanguageSelection) {
      // Signed in but no language chosen → pick a language first
      router.replace("/language-selection");
    } else if (
      isSignedIn &&
      selectedLanguageId &&
      (inAuthScreen || inLanguageSelection)
    ) {
      // Signed in + language chosen but on an auth/language screen → go home
      router.replace("/(tabs)");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, isLoaded, isHydrated, segments, selectedLanguageId]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular: require("@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf"),
    Poppins_500Medium: require("@expo-google-fonts/poppins/500Medium/Poppins_500Medium.ttf"),
    Poppins_600SemiBold: require("@expo-google-fonts/poppins/600SemiBold/Poppins_600SemiBold.ttf"),
    Poppins_700Bold: require("@expo-google-fonts/poppins/700Bold/Poppins_700Bold.ttf"),
    Poppins_800ExtraBold: require("@expo-google-fonts/poppins/800ExtraBold/Poppins_800ExtraBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Hold rendering until fonts are ready
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <AuthNavigationGuard />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FFFFFF" },
          animation: "fade",
        }}
      />
    </ClerkProvider>
  );
}
