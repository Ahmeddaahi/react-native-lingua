/**
 * Lingua Design System — Typography Tokens
 *
 * Based on the design spec:
 *   H1         32px  Bold(700)    lineHeight 1.2  – Page / Screen Title
 *   H2         24px  SemiBold(600) lineHeight 1.3  – Section Title
 *   H3         20px  SemiBold(600) lineHeight 1.3  – Card / Module Title
 *   H4         16px  Medium(500)  lineHeight 1.4  – Subheading
 *   Body Large 16px  Regular(400) lineHeight 1.6  – Important content
 *   Body Med   14px  Regular(400) lineHeight 1.6  – Body text
 *   Body Small 13px  Regular(400) lineHeight 1.6  – Supporting text
 *   Caption    11px  Regular(400) lineHeight 1.4  – Labels, meta text
 */

export const fontFamily = {
  regular:   "Poppins_400Regular",
  medium:    "Poppins_500Medium",
  semiBold:  "Poppins_600SemiBold",
  bold:      "Poppins_700Bold",
} as const;

export const fontSize = {
  h1:      32,
  h2:      24,
  h3:      20,
  h4:      16,
  bodyLg:  16,
  bodyMd:  14,
  bodySm:  13,
  caption: 11,
} as const;

export const lineHeight = {
  h1:      1.2,
  h2:      1.3,
  h3:      1.3,
  h4:      1.4,
  bodyLg:  1.6,
  bodyMd:  1.6,
  bodySm:  1.6,
  caption: 1.4,
} as const;

export const fontWeight = {
  regular:  "400" as const,
  medium:   "500" as const,
  semiBold: "600" as const,
  bold:     "700" as const,
} as const;

/**
 * Pre-composed text style objects ready for StyleSheet.create() usage.
 * Pair with the correct fontFamily from above.
 */
export const textStyles = {
  h1: {
    fontFamily:  fontFamily.bold,
    fontSize:    fontSize.h1,
    lineHeight:  fontSize.h1 * lineHeight.h1,
    fontWeight:  fontWeight.bold,
  },
  h2: {
    fontFamily:  fontFamily.semiBold,
    fontSize:    fontSize.h2,
    lineHeight:  fontSize.h2 * lineHeight.h2,
    fontWeight:  fontWeight.semiBold,
  },
  h3: {
    fontFamily:  fontFamily.semiBold,
    fontSize:    fontSize.h3,
    lineHeight:  fontSize.h3 * lineHeight.h3,
    fontWeight:  fontWeight.semiBold,
  },
  h4: {
    fontFamily:  fontFamily.medium,
    fontSize:    fontSize.h4,
    lineHeight:  fontSize.h4 * lineHeight.h4,
    fontWeight:  fontWeight.medium,
  },
  bodyLg: {
    fontFamily:  fontFamily.regular,
    fontSize:    fontSize.bodyLg,
    lineHeight:  fontSize.bodyLg * lineHeight.bodyLg,
    fontWeight:  fontWeight.regular,
  },
  bodyMd: {
    fontFamily:  fontFamily.regular,
    fontSize:    fontSize.bodyMd,
    lineHeight:  fontSize.bodyMd * lineHeight.bodyMd,
    fontWeight:  fontWeight.regular,
  },
  bodySm: {
    fontFamily:  fontFamily.regular,
    fontSize:    fontSize.bodySm,
    lineHeight:  fontSize.bodySm * lineHeight.bodySm,
    fontWeight:  fontWeight.regular,
  },
  caption: {
    fontFamily:  fontFamily.regular,
    fontSize:    fontSize.caption,
    lineHeight:  fontSize.caption * lineHeight.caption,
    fontWeight:  fontWeight.regular,
  },
} as const;
