import { images } from '@/constants/images';
import { LANGUAGES } from '@/data/languages';
import { PlanItem, TODAY_PLAN } from '@/data/today-plan';
import { UNITS } from '@/data/units';
import { useLanguageStore } from '@/store/language-store';
import { useProgressStore } from '@/store/progress-store';
import { ScrollView, Text, View } from '@/tw';
import { useAuth, useUser } from '@clerk/expo';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

// ── Plan item icon components ─────────────────────────────────

function BookIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} width={size} height={size}>
      <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </Svg>
  );
}

function HeadphonesIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: size * 0.8,
        height: size * 0.45,
        borderTopLeftRadius: size * 0.4,
        borderTopRightRadius: size * 0.4,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: color,
      }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: size * 0.8, marginTop: -1 }}>
        <View style={{ width: 5, height: 7, borderRadius: 2, backgroundColor: color }} />
        <View style={{ width: 5, height: 7, borderRadius: 2, backgroundColor: color }} />
      </View>
    </View>
  );
}

function ChatIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} width={size} height={size}>
      <Path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </Svg>
  );
}

function BellIcon({ size = 22, color = '#0D132B' }: { size?: number; color?: string }) {
  return (
    <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} width={size} height={size}>
      <Path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </Svg>
  );
}

function CheckIcon({ size = 18 }: { size?: number }) {
  return (
    <View style={{
      width: size + 8,
      height: size + 8,
      borderRadius: (size + 8) / 2,
      backgroundColor: '#6C4EF5',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#fff" width={size} height={size}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </Svg>
    </View>
  );
}

function EmptyCircle({ size = 26 }: { size?: number }) {
  return (
    <View style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 2,
      borderColor: '#E5E7EB',
    }} />
  );
}

// ── Plan Item Icon ────────────────────────────────────────────

function PlanIcon({ type, iconBg }: { type: PlanItem['iconName']; iconBg: string }) {
  return (
    <View style={[styles.planIcon, { backgroundColor: iconBg }]}>
      {type === 'book' && <BookIcon size={20} color="#fff" />}
      {type === 'headphones' && <HeadphonesIcon size={20} color="#fff" />}
      {type === 'chat' && <ChatIcon size={20} color="#fff" />}
    </View>
  );
}

// ── Main Home Screen ──────────────────────────────────────────

export default function HomeTab() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { selectedLanguageId } = useLanguageStore();
  const { xp, dailyGoalXp, streakDays } = useProgressStore();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/onboarding" />;

  // Derive user display name
  const firstName = user?.firstName ?? user?.username ?? 'there';

  // Derive selected language info
  const selectedLanguage = LANGUAGES.find((l) => l.id === selectedLanguageId);
  const selectedLanguageFlagUrl = selectedLanguage?.flagImage ?? null;

  // Derive current unit
  const currentUnit = selectedLanguageId
    ? UNITS.find((u) => u.languageId === selectedLanguageId)
    : null;

  const unitLabel = currentUnit
    ? `A1 · Unit ${currentUnit.order}`
    : 'A1 · Unit 1';

  // XP progress (0–1 clamped)
  const xpProgress = Math.min(xp / dailyGoalXp, 1);

  // Plan items: state to toggle completion
  const [completedPlanIds, setCompletedPlanIds] = useState<string[]>(['plan_lesson']);

  const togglePlanItem = (id: string) => {
    setCompletedPlanIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          {/* Left: Flag + Greeting */}
          <View style={styles.headerLeft}>
            {selectedLanguageFlagUrl ? (
              <Image
                source={{ uri: selectedLanguageFlagUrl }}
                style={styles.flagCircle}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.flagCircle, styles.flagPlaceholder]}>
                <Text style={styles.flagEmoji}>🌍</Text>
              </View>
            )}
            <Text style={styles.greeting}>
              {`Hola, ${firstName}! 👋`}
            </Text>
          </View>

          {/* Right: Streak + Bell */}
          <View style={styles.headerRight}>
            <View style={styles.streakContainer}>
              <Image source={images.streakFire} style={styles.streakFireIcon} resizeMode="contain" />
              <Text style={styles.streakCount}>{streakDays}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.bellButton}>
              <BellIcon size={22} color="#0D132B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Daily Goal Card ── */}
        <View style={styles.dailyGoalCard}>
          <View style={styles.dailyGoalContent}>
            <Text style={styles.dailyGoalLabel}>Daily goal</Text>
            <View style={styles.xpRow}>
              <Text style={styles.xpCurrent}>{xp}</Text>
              <Text style={styles.xpTotal}> / {dailyGoalXp} XP</Text>
            </View>
            {/* Progress bar */}
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { flex: xpProgress }]} />
            </View>
          </View>
          <Image
            source={images.treasure}
            style={styles.treasureImage}
            resizeMode="contain"
          />
        </View>

        {/* ── Continue Learning Card ── */}
        <View style={styles.continueLearningCard}>
          {/* Text section */}
          <View style={styles.continueLearningContent}>
            <Text style={styles.continueLearningLabel}>Continue learning</Text>
            <Text style={styles.continueLearningLang}>
              {selectedLanguage?.name ?? 'Spanish'}
            </Text>
            <Text style={styles.continueLearningUnit}>{unitLabel}</Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.continueBtn}>
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>

          {/* Illustration */}
          <Image
            source={images.palace}
            style={styles.palaceImage}
            resizeMode="contain"
          />
        </View>

        {/* ── Today's Plan ── */}
        <View style={styles.todayPlanHeader}>
          <Text style={styles.todayPlanTitle}>{"Today's plan"}</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.planList}>
          {TODAY_PLAN.map((item, index) => {
            const isCompleted = completedPlanIds.includes(item.id);
            const isLast = index === TODAY_PLAN.length - 1;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.75}
                onPress={() => togglePlanItem(item.id)}
                style={[styles.planItem, !isLast && styles.planItemBorder]}
              >
                <PlanIcon type={item.iconName} iconBg={item.iconBg} />
                <View style={styles.planItemText}>
                  <Text style={styles.planItemTitle}>{item.title}</Text>
                  <Text style={styles.planItemSubtitle}>{item.subtitle}</Text>
                </View>
                {isCompleted ? <CheckIcon size={16} /> : <EmptyCircle size={26} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Next Up Card ── */}
        <View style={styles.nextUpCard}>
          <View style={styles.nextUpContent}>
            <Text style={styles.nextUpLabel}>Next up</Text>
            <Text style={styles.nextUpTitle}>AI Video Call</Text>
            <Text style={styles.nextUpSubtitle}>Practice speaking</Text>
          </View>
          <View style={styles.nextUpRight}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' }}
              style={styles.teacherAvatar}
              resizeMode="cover"
            />
            <TouchableOpacity activeOpacity={0.85} style={styles.videoCallBtn}>
              {/* Camera icon */}
              <Text style={styles.cameraEmoji}>📹</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flagCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  flagPlaceholder: {
    backgroundColor: '#F6F7FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagEmoji: {
    fontSize: 22,
  },
  greeting: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    color: '#0D132B',
    letterSpacing: -0.2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakFireIcon: {
    width: 34,
    height: 34,
  },
  streakCount: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#0D132B',
  },
  bellButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Daily Goal Card
  dailyGoalCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#FFF8EE',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  dailyGoalContent: {
    flex: 1,
  },
  dailyGoalLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  xpCurrent: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    color: '#0D132B',
    lineHeight: 36,
  },
  xpTotal: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    color: '#6B7280',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#FFE4C4',
    borderRadius: 4,
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    marginRight: 16,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#FF8A00',
    borderRadius: 4,
  },
  treasureImage: {
    width: 80,
    height: 80,
    marginLeft: 12,
  },

  // ── Continue Learning Card
  continueLearningCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#6C4EF5',
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 164,
    shadowColor: '#6C4EF5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  continueLearningContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 20,
  },
  continueLearningLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 2,
  },
  continueLearningLang: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    color: '#FFFFFF',
    lineHeight: 32,
  },
  continueLearningUnit: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 16,
  },
  continueBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 22,
    alignSelf: 'flex-start',
  },
  continueBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#6C4EF5',
  },
  palaceImage: {
    width: 130,
    height: 150,
    marginRight: -4,
    marginBottom: 0,
  },

  // ── Today's Plan Header
  todayPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  todayPlanTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    color: '#0D132B',
  },
  viewAllText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#6C4EF5',
  },

  // ── Plan List
  planList: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  planItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  planIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planItemText: {
    flex: 1,
  },
  planItemTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#0D132B',
    lineHeight: 20,
  },
  planItemSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
  },

  // ── Next Up Card
  nextUpCard: {
    marginHorizontal: 20,
    backgroundColor: '#EEF7EE',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#21C16B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  nextUpContent: {
    flex: 1,
  },
  nextUpLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  nextUpTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: '#0D132B',
    lineHeight: 24,
  },
  nextUpSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#6B7280',
  },
  nextUpRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teacherAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  videoCallBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#21C16B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraEmoji: {
    fontSize: 18,
  },
});
