/**
 * Lingua Design System — Spacing Tokens
 *
 * A consistent 4px-based spacing scale.
 * Use these in StyleSheet.create() or inline styles
 * where NativeWind cannot be applied.
 */

export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
} as const;

export type SpacingKey = keyof typeof spacing;

/**
 * Border radii
 */
export const radius = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  "2xl": 24,
  full: 9999,
} as const;

export type RadiusKey = keyof typeof radius;
