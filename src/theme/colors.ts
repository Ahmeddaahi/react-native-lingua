/**
 * Lingua Design System — Color Tokens
 *
 * These mirror the CSS custom properties in global.css.
 * Use these in StyleSheet.create() or inline styles where
 * NativeWind className cannot be applied (SafeAreaView, etc.)
 */

export const colors = {
  // ── Primary Brand ──
  linguaPurple:     "#6C4EF5",
  linguaDeepPurple: "#5B3BF6",
  linguaBlue:       "#4D8BFF",
  linguaGreen:      "#21C16B",

  // ── Semantic ──
  success: "#21C16B",
  warning: "#FFC800",
  streak:  "#FF8A00",
  error:   "#FF4D4F",
  info:    "#4D8BFF",

  // ── Neutral / Text / Surface ──
  textPrimary:   "#0D132B",
  textSecondary: "#6B7280",
  border:        "#E5E7EB",
  surface:       "#F6F7FB",
  background:    "#FFFFFF",
  white:         "#FFFFFF",
  black:         "#000000",
} as const;

export type ColorKey = keyof typeof colors;
