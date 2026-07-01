import { Text } from '@/tw';
import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AITeacherIcon,
  ChatIcon,
  HomeIcon,
  LearnIcon,
  ProfileIcon,
} from './tab-icons';

// ── Constants ────────────────────────────────────────────────
const CIRCLE_SIZE = 50;
const TAB_BAR_HEIGHT = 64;   // fixed height of the visible tab row
const ICON_SIZE_ACTIVE = 26;
const ICON_SIZE_INACTIVE = 24;
const PURPLE = '#6C4EF5';
const INACTIVE_COLOR = '#9CA3AF';
// Distance from top of tab to the TOP of the icon wrapper.
// We want the icon's vertical centre at TAB_BAR_HEIGHT/2 = 32.
// iconWrapper is CIRCLE_SIZE px tall, so its top = 32 - CIRCLE_SIZE/2 = 32 - 25 = 7.
const ICON_TOP = TAB_BAR_HEIGHT / 2 - CIRCLE_SIZE / 2; // 7
const LABEL_AREA_HEIGHT = 14;

type IconComponent = React.ComponentType<{ color: string; size: number }>;

interface TabDefinition {
  name: string;
  label: string;
  Icon: IconComponent;
}

const TAB_DEFINITIONS: TabDefinition[] = [
  { name: 'index', label: 'Home', Icon: HomeIcon },
  { name: 'learn', label: 'Learn', Icon: LearnIcon },
  { name: 'ai-teacher', label: 'AI Teacher', Icon: AITeacherIcon },
  { name: 'chat', label: 'Chat', Icon: ChatIcon },
  { name: 'profile', label: 'Profile', Icon: ProfileIcon },
];

// ── Types ─────────────────────────────────────────────────────
interface RouteItem { name: string; key: string }
interface NavEvent { defaultPrevented: boolean }
interface CustomTabBarProps {
  state: { index: number; routes: RouteItem[] };
  navigation: {
    emit: (e: { type: string; target: string; canPreventDefault: boolean }) => NavEvent;
    navigate: (name: string) => void;
  };
}

// ── Component ─────────────────────────────────────────────────
export default function CustomTabBar({ state, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const tabWidthRef = useRef(0);
  const layoutDone = useRef(false);

  // Shared X for the sliding circle
  const translateX = useSharedValue(-1000);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Animate circle when active tab changes
  useEffect(() => {
    if (!layoutDone.current || tabWidthRef.current === 0) return;
    // eslint-disable-next-line react-hooks/immutability
    translateX.value = withSpring(state.index * tabWidthRef.current, {
      damping: 18,
      stiffness: 220,
      mass: 0.7,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index]);

  const onBarLayout = (totalWidth: number) => {
    const tabW = totalWidth / TAB_DEFINITIONS.length;
    tabWidthRef.current = tabW;
    // eslint-disable-next-line react-hooks/immutability
    translateX.value = state.index * tabW; // instant snap on first render
    layoutDone.current = true;
  };

  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <View
      style={[styles.container, { paddingBottom: bottomPad }]}
      onLayout={(e) => onBarLayout(e.nativeEvent.layout.width)}
    >
      {/* ── Sliding purple circle (behind everything) ── */}
      <Animated.View pointerEvents="none" style={[styles.circleWrapper, circleStyle]}>
        <View style={styles.circle} />
      </Animated.View>

      {/* ── Tab buttons ── */}
      {state.routes.map((route, index) => {
        const tabDef = TAB_DEFINITIONS.find((t) => t.name === route.name) ?? TAB_DEFINITIONS[0];
        const isActive = state.index === index;
        const { Icon } = tabDef;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityLabel={tabDef.label}
            accessibilityState={{ selected: isActive }}
          >
            {/*
              Icon wrapper: positioned so its vertical centre is at
              TAB_BAR_HEIGHT/2 — matching the circle's centre exactly.
              marginTop = ICON_TOP pins the top of this CIRCLE_SIZE-tall
              wrapper so centre = ICON_TOP + CIRCLE_SIZE/2 = 32.
            */}
            <View style={styles.iconWrapper}>
              <Icon
                color={isActive ? '#FFFFFF' : INACTIVE_COLOR}
                size={isActive ? ICON_SIZE_ACTIVE : ICON_SIZE_INACTIVE}
              />
            </View>

            {/* Label — occupies a fixed slot so icon Y never shifts */}
            <View style={styles.labelWrapper}>
              {!isActive && (
                <Text style={styles.label}>{tabDef.label}</Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    // Use flex-start so we can manually pin icon Y via marginTop
    alignItems: 'flex-start',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },

  // Absolutely-positioned circle indicator
  circleWrapper: {
    position: 'absolute',
    top: ICON_TOP,          // aligns with the iconWrapper top
    left: 0,
    width: '20%',
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: PURPLE,
  },

  // Each tab = 1/5 of the bar width, full bar height
  tab: {
    flex: 1,
    height: TAB_BAR_HEIGHT,
    alignItems: 'center',
    // No justifyContent — we pin vertically via marginTop on iconWrapper
  },

  /*
   * Icon wrapper: CIRCLE_SIZE tall, centred horizontally.
   * marginTop = ICON_TOP positions it so its vertical centre sits at
   * TAB_BAR_HEIGHT/2 — exactly matching the circle centre.
   */
  iconWrapper: {
    marginTop: ICON_TOP,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Fixed-height slot for the label so icon Y never shifts
  labelWrapper: {
    height: LABEL_AREA_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    lineHeight: 13,
    color: INACTIVE_COLOR,
    textAlign: 'center',
  },
});
