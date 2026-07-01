import React, { useState } from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { View, Text, TextInput } from '@/tw';
import { LANGUAGES, LanguageWithMeta } from '@/data/languages';
import { images } from '@/constants/images';
import { useLanguageStore } from '@/store/language-store';

export default function LanguageSelection() {
  const router = useRouter();
  const { setSelectedLanguage } = useLanguageStore();
  const [selectedId, setSelectedId] = useState<string>('es');
  const [search, setSearch] = useState('');

  const filtered = LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = LANGUAGES.find((l) => l.id === selectedId);

  const handleConfirm = () => {
    setSelectedLanguage(selectedId);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ── */}
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backBtn}
        >
          <Text className="font-[Poppins_700Bold] text-[20px] text-text-primary">‹</Text>
        </TouchableOpacity>
        <Text className="font-[Poppins_700Bold] text-[18px] text-text-primary flex-1 text-center">
          Choose a language
        </Text>
        {/* spacer to keep title centered */}
        <View style={{ width: 36 }} />
      </View>

      {/* ── Search Bar ── */}
      <View className="px-5 pb-4">
        <View
          className="flex-row items-center bg-surface rounded-full px-4"
          style={styles.searchBar}
        >
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
        style={{ flex: 1 }}
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
        <View style={{ height: 28 }} />

        {/* ── Earth Illustration ── */}
        <Image
          source={images.earth}
          style={styles.earthImage}
          resizeMode="cover"
        />
      </ScrollView>

      {/* ── Confirm Button (sticky footer) ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleConfirm}
          activeOpacity={0.85}
          style={styles.confirmBtn}
        >
          <Text className="font-[Poppins_700Bold] text-[16px] text-white">
            {selected ? `Start learning ${selected.name}` : 'Choose a language'}
          </Text>
        </TouchableOpacity>
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
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.languageRow,
          isSelected && styles.languageRowSelected,
        ]}
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
            <Text className="text-white font-[Poppins_700Bold] text-[14px]">✓</Text>
          </View>
        ) : (
          <Text className="text-text-secondary font-[Poppins_400Regular] text-[20px]">›</Text>
        )}
      </TouchableOpacity>

      {/* Divider (not on selected or last item) */}
      {!isSelected && !isLast && (
        <View style={styles.divider} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    height: 50,
    borderRadius: 999,
  },
  searchInput: {
    height: 50,
    paddingVertical: 0,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  languageRowSelected: {
    backgroundColor: '#F0EDFF',
    borderWidth: 2,
    borderColor: '#6C4EF5',
  },
  flagContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  flagImage: {
    width: 48,
    height: 48,
  },
  checkmark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6C4EF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 80,
    marginRight: 16,
  },
  earthImage: {
    width: '100%',
    height: 200,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'android' ? 20 : 12,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmBtn: {
    backgroundColor: '#6C4EF5',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
