import { colors } from "@/theme";
import { Text, View, Link } from "@/tw";
import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native";

/**
 * Design System Preview Screen (Home)
 * Showcases the Lingua brand colors, typography, and spacing tokens.
 * Protected — redirects to onboarding if not signed in.
 */
export default function Index() {
  const { isSignedIn, isLoaded, signOut } = useAuth();

  // Wait for Clerk to load before deciding
  if (!isLoaded) return null;

  // Not signed in → go to onboarding
  if (!isSignedIn) return <Redirect href="/onboarding" />;
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* ── Header ── */}
      <View className="bg-lingua-purple px-6 pt-16 pb-10 flex-row items-center justify-between">
        <View>
          <Text className="font-[Poppins_700Bold] text-[32px] leading-[38px] text-white">
            Lingua
          </Text>
          <Text className="font-[Poppins_400Regular] text-[14px] leading-[22px] text-white opacity-80 mt-1">
            Design System Preview
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => signOut()}
          activeOpacity={0.7}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 9999,
          }}
        >
          <Text className="font-[Poppins_600SemiBold] text-[13px] text-white">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Onboarding Navigation Link ── */}
      <Link href="/onboarding" className="mx-4 mt-5">
        <View className="bg-lingua-purple rounded-2xl px-5 py-4 flex-row items-center justify-between">
          <View className="gap-0.5">
            <Text className="font-[Poppins_700Bold] text-[15px] text-white">
              Onboarding Screen
            </Text>
            <Text className="font-[Poppins_400Regular] text-[12px] text-white opacity-70">
              Tap to preview the onboarding flow
            </Text>
          </View>
          <Text className="font-[Poppins_700Bold] text-[18px] text-white opacity-80">
            →
          </Text>
        </View>
      </Link>

      {/* ── Language Selection Navigation Link ── */}
      <Link href="/language-selection" className="mx-4 mt-3">
        <View className="bg-lingua-blue rounded-2xl px-5 py-4 flex-row items-center justify-between">
          <View className="gap-0.5">
            <Text className="font-[Poppins_700Bold] text-[15px] text-white">
              Language Selection
            </Text>
            <Text className="font-[Poppins_400Regular] text-[12px] text-white opacity-70">
              Tap to choose your learning language
            </Text>
          </View>
          <Text className="font-[Poppins_700Bold] text-[18px] text-white opacity-80">
            →
          </Text>
        </View>
      </Link>


      <View className="px-4 pt-6 gap-8">

        {/* ── Colors ── */}
        <View className="gap-4">
          <Text className="font-[Poppins_700Bold] text-[11px] tracking-widest text-lingua-purple uppercase">
            Colors
          </Text>

          {/* Primary */}
          <Text className="font-[Poppins_600SemiBold] text-[13px] text-text-secondary uppercase tracking-wide">
            Primary
          </Text>
          <View className="flex-row gap-3 flex-wrap">
            <ColorSwatch color={colors.linguaPurple} label="Purple" hex="#6C4EF5" />
            <ColorSwatch color={colors.linguaDeepPurple} label="Deep Purple" hex="#5B3BF6" />
            <ColorSwatch color={colors.linguaBlue} label="Blue" hex="#4D8BFF" />
            <ColorSwatch color={colors.linguaGreen} label="Green" hex="#21C16B" />
          </View>

          {/* Semantic */}
          <Text className="font-[Poppins_600SemiBold] text-[13px] text-text-secondary uppercase tracking-wide mt-2">
            Semantic
          </Text>
          <View className="flex-row gap-3 flex-wrap">
            <ColorSwatch color={colors.success} label="Success" hex="#21C16B" />
            <ColorSwatch color={colors.warning} label="Warning" hex="#FFC800" />
            <ColorSwatch color={colors.streak} label="Streak" hex="#FF8A00" />
            <ColorSwatch color={colors.error} label="Error" hex="#FF4D4F" />
            <ColorSwatch color={colors.info} label="Info" hex="#4D8BFF" />
          </View>

          {/* Neutrals */}
          <Text className="font-[Poppins_600SemiBold] text-[13px] text-text-secondary uppercase tracking-wide mt-2">
            Neutrals
          </Text>
          <View className="flex-row gap-3 flex-wrap">
            <ColorSwatch color={colors.textPrimary} label="Text" hex="#0D132B" border />
            <ColorSwatch color={colors.textSecondary} label="Secondary" hex="#6B7280" border />
            <ColorSwatch color={colors.border} label="Border" hex="#E5E7EB" border />
            <ColorSwatch color={colors.surface} label="Surface" hex="#F6F7FB" border />
            <ColorSwatch color={colors.background} label="Background" hex="#FFFFFF" border />
          </View>
        </View>

        {/* ── Typography ── */}
        <View className="gap-4">
          <Text className="font-[Poppins_700Bold] text-[11px] tracking-widest text-lingua-purple uppercase">
            Typography · Poppins
          </Text>

          <TypographyRow
            label="H1 · Page Title"
            spec="32px · Bold · 1.2"
            fontClass="font-[Poppins_700Bold] text-[32px] leading-[38px]"
          />
          <TypographyRow
            label="H2 · Section Title"
            spec="24px · SemiBold · 1.3"
            fontClass="font-[Poppins_600SemiBold] text-[24px] leading-[31px]"
          />
          <TypographyRow
            label="H3 · Card Title"
            spec="20px · SemiBold · 1.3"
            fontClass="font-[Poppins_600SemiBold] text-[20px] leading-[26px]"
          />
          <TypographyRow
            label="H4 · Subheading"
            spec="16px · Medium · 1.4"
            fontClass="font-[Poppins_500Medium] text-[16px] leading-[22px]"
          />
          <TypographyRow
            label="Body Large"
            spec="16px · Regular · 1.6"
            fontClass="font-[Poppins_400Regular] text-[16px] leading-[26px]"
          />
          <TypographyRow
            label="Body Medium"
            spec="14px · Regular · 1.6"
            fontClass="font-[Poppins_400Regular] text-[14px] leading-[22px]"
          />
          <TypographyRow
            label="Body Small"
            spec="13px · Regular · 1.6"
            fontClass="font-[Poppins_400Regular] text-[13px] leading-[21px]"
          />
          <TypographyRow
            label="Caption"
            spec="11px · Regular · 1.4"
            fontClass="font-[Poppins_400Regular] text-[11px] leading-[15px]"
          />
        </View>

        {/* ── Buttons ── */}
        <View className="gap-4">
          <Text className="font-[Poppins_700Bold] text-[11px] tracking-widest text-lingua-purple uppercase">
            Buttons
          </Text>

          <View className="bg-lingua-purple rounded-2xl py-4 items-center">
            <Text className="font-[Poppins_600SemiBold] text-[16px] text-white">
              Primary Button
            </Text>
          </View>

          <View className="bg-surface border border-border rounded-2xl py-4 items-center">
            <Text className="font-[Poppins_600SemiBold] text-[16px] text-lingua-purple">
              Secondary Button
            </Text>
          </View>

          <View className="bg-success rounded-2xl py-4 items-center">
            <Text className="font-[Poppins_600SemiBold] text-[16px] text-white">
              Success Button
            </Text>
          </View>

          <View className="bg-error rounded-2xl py-4 items-center">
            <Text className="font-[Poppins_600SemiBold] text-[16px] text-white">
              Danger Button
            </Text>
          </View>
        </View>

        {/* ── Cards ── */}
        <View className="gap-4">
          <Text className="font-[Poppins_700Bold] text-[11px] tracking-widest text-lingua-purple uppercase">
            Cards
          </Text>

          <View className="bg-background border border-border rounded-2xl p-4 gap-1">
            <Text className="font-[Poppins_600SemiBold] text-[16px] text-text-primary">
              Lesson Card
            </Text>
            <Text className="font-[Poppins_400Regular] text-[14px] text-text-secondary">
              The default card used for lesson modules.
            </Text>
          </View>

          <View className="bg-surface rounded-2xl p-4 gap-1">
            <Text className="font-[Poppins_600SemiBold] text-[16px] text-text-primary">
              Surface Card
            </Text>
            <Text className="font-[Poppins_400Regular] text-[14px] text-text-secondary">
              Used for highlighted sections or widgets.
            </Text>
          </View>
        </View>

        {/* ── Badges ── */}
        <View className="gap-4">
          <Text className="font-[Poppins_700Bold] text-[11px] tracking-widest text-lingua-purple uppercase">
            Badges
          </Text>

          <View className="flex-row gap-3 flex-wrap">
            <View className="bg-warning rounded-full px-3 py-1">
              <Text className="font-[Poppins_600SemiBold] text-[11px] text-text-primary">
                +50 XP
              </Text>
            </View>
            <View className="bg-streak rounded-full px-3 py-1">
              <Text className="font-[Poppins_600SemiBold] text-[11px] text-white">
                🔥 7 Day Streak
              </Text>
            </View>
            <View className="bg-success rounded-full px-3 py-1">
              <Text className="font-[Poppins_600SemiBold] text-[11px] text-white">
                ✓ Completed
              </Text>
            </View>
            <View className="bg-error rounded-full px-3 py-1">
              <Text className="font-[Poppins_600SemiBold] text-[11px] text-white">
                ✗ Missed
              </Text>
            </View>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

// ── Internal sub-components (single-use, not extracted) ──

type ColorSwatchProps = {
  color: string;
  label: string;
  hex: string;
  border?: boolean;
};

function ColorSwatch({ color, label, hex, border }: ColorSwatchProps) {
  return (
    <View className="items-center gap-1" style={{ width: 68 }}>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 12,
          backgroundColor: color,
          borderWidth: border ? 1 : 0,
          borderColor: "#E5E7EB",
        }}
      />
      <Text className="font-[Poppins_500Medium] text-[10px] text-text-primary text-center">
        {label}
      </Text>
      <Text className="font-[Poppins_400Regular] text-[9px] text-text-secondary text-center">
        {hex}
      </Text>
    </View>
  );
}

type TypographyRowProps = {
  label: string;
  spec: string;
  fontClass: string;
};

function TypographyRow({ label, spec, fontClass }: TypographyRowProps) {
  return (
    <View className="border-b border-border pb-3 gap-1">
      <Text className={`${fontClass} text-text-primary`}>{label}</Text>
      <Text className="font-[Poppins_400Regular] text-[11px] text-text-secondary">
        {spec}
      </Text>
    </View>
  );
}
