import { images } from "@/constants/images";
import { LANGUAGES, LanguageWithMeta } from "@/data/languages";
import { useLanguageStore } from "@/store/language-store";
import { Pressable, ScrollView, Text, TextInput, View } from "@/tw";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LanguageSelection() {
  const router = useRouter();
  const { setSelectedLanguage } = useLanguageStore();
  const [selectedId, setSelectedId] = useState<string>("es");
  const [search, setSearch] = useState("");

  const filtered = LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = LANGUAGES.find((l) => l.id === selectedId);

  const handleConfirm = () => {
    setSelectedLanguage(selectedId);
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ── */}
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 items-center justify-center"
        >
          <Text className="font-[Poppins_700Bold] text-[20px] text-text-primary">
            ‹
          </Text>
        </Pressable>
        <Text className="font-[Poppins_700Bold] text-[18px] text-text-primary flex-1 text-center">
          Choose a language
        </Text>
        {/* spacer to keep title centered */}
        <View className="w-9" />
      </View>

      {/* ── Search Bar ── */}
      <View className="px-5 pb-4">
        <View className="flex-row items-center bg-surface rounded-full px-4 h-12">
          <Text className="text-[18px] mr-3 text-text-secondary">🔍</Text>
          <TextInput
            className="flex-1 font-[Poppins_400Regular] text-[15px] text-text-primary"
            placeholder="Search languages"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Popular Section ── */}
        <Text className="font-[Poppins_700Bold] text-[17px] text-text-primary px-5 mb-2">
          Popular
        </Text>

        <View className="px-5 gap-1">
          {filtered.map((lang, index) => (
            <LanguageRow
              key={lang.id}
              lang={lang}
              isSelected={lang.id === selectedId}
              isLast={index === filtered.length - 1}
              onPress={() => setSelectedId(lang.id)}
            />
          ))}
        </View>

        {/* ── Spacer before earth image ── */}
        <View className="h-7" />

        {/* ── Earth Illustration ── */}
        <Image
          source={images.earth}
          style={styles.earthImage}
          resizeMode="cover"
        />
      </ScrollView>

      {/* ── Confirm Button (sticky footer) ── */}
      <View
        className="px-5 pt-3 bg-white border-t border-slate-200"
        style={styles.footer}
      >
        <Pressable
          onPress={handleConfirm}
          className="bg-[#6C4EF5] rounded-2xl py-4 items-center justify-center"
        >
          <Text className="font-[Poppins_700Bold] text-[16px] text-white">
            {selected ? `Start learning ${selected.name}` : "Choose a language"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ── Language Row ──

type LanguageRowProps = {
  lang: LanguageWithMeta;
  isSelected: boolean;
  isLast: boolean;
  onPress: () => void;
};

function LanguageRow({ lang, isSelected, isLast, onPress }: LanguageRowProps) {
  return (
    <>
      <Pressable
        onPress={onPress}
        className={`flex-row items-center px-4 py-3 rounded-2xl bg-white ${isSelected ? "border border-[#6C4EF5] bg-[#F0EDFF]" : ""}`}
      >
        {/* Flag */}
        <View style={styles.flagContainer}>
          <Image
            source={{ uri: lang.flagImage }}
            style={styles.flagImage}
            resizeMode="cover"
          />
        </View>

        {/* Name + learner count */}
        <View className="flex-1 ml-4">
          <Text className="font-[Poppins_600SemiBold] text-[16px] text-text-primary">
            {lang.name}
          </Text>
          <Text className="font-[Poppins_400Regular] text-[13px] text-text-secondary mt-0.5">
            {lang.learnerCount}
          </Text>
        </View>

        {/* Right indicator: checkmark if selected, chevron if not */}
        {isSelected ? (
          <View style={styles.checkmark}>
            <Text className="text-white font-[Poppins_700Bold] text-[14px]">
              ✓
            </Text>
          </View>
        ) : (
          <Text className="text-text-secondary font-[Poppins_400Regular] text-[20px]">
            ›
          </Text>
        )}
      </Pressable>

      {/* Divider (not on selected or last item) */}
      {!isSelected && !isLast && (
        <View className="h-px bg-slate-300 ml-[80px] mr-4" />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchInput: {
    height: 50,
    paddingVertical: 0,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  flagContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
  },
  flagImage: {
    width: 48,
    height: 48,
  },
  checkmark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#6C4EF5",
    alignItems: "center",
    justifyContent: "center",
  },
  earthImage: {
    width: "100%",
    height: 200,
  },
  footer: {
    paddingBottom: Platform.OS === "android" ? 20 : 12,
  },
});
