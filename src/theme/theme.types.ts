/**
 * Theme Types for FinTrack
 * Defines TypeScript types for all theme objects
 * All types are readonly to ensure immutability
 */

/**
 * Shadow properties for React Native
 * Supports both iOS (shadowColor, shadowOffset, shadowOpacity, shadowRadius)
 * and Android (elevation)
 */
export type IShadow = Readonly<{
  shadowColor: string;
  shadowOffset: Readonly<{
    width: number;
    height: number;
  }>;
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android
}>;

/**
 * Base colors that are consistent across all themes
 */
export type IBaseColors = Readonly<{
  white: string;
  black: string;
  transparent: string;
}>;

/**
 * Shadow colors with different opacity levels
 */
export type IShadowColors = Readonly<{
  black10: string;
  black40: string;
  black08: string;
  black06: string;
  black05: string;
  black12: string;
  black: string;
}>;

/**
 * Common colors that can be used across different themes
 * (e.g., in shadows, overlays, etc.)
 */
export type ICommonColors = Readonly<{
  white: string;
  black: string;
  transparent: string;
  shadow: IShadowColors;
}>;

/**
 * Spacing keys - available spacing values
 */
export type SpacingKey =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl'
  | '40'
  | '48'
  | '60'
  | '82';

/**
 * Spacing scale for consistent spacing throughout the app
 */
export type ISpacing = Readonly<Record<SpacingKey, number>>;

/**
 * Typography variant properties
 * All text styling properties in one object
 */
export type ITypographyVariant = Readonly<{
  fontSize: number;
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  lineHeight?: number;
  letterSpacing?: number;
  fontFamily?: string;
}>;

/**
 * Typography keys - available typography variants
 */
export type TypographyKey =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'button'
  | 'label';

/**
 * Typography scale with different text variants
 */
export type ITypography = Readonly<Record<TypographyKey, ITypographyVariant>>;

/**
 * Shadow keys - available shadow variants
 */
export type ShadowKey =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'accentMedium'
  | 'accentLight'
  | 'accentGreen'
  | 'accentDark'
  | 'error'
  | 'warning'
  | 'success'
  | 'info'
  | 'card'
  | 'transactionItem'
  | 'categoryItem'
  | 'formInput'
  | 'formInputFocus'
  | 'buttonPrimary'
  | 'buttonSecondary'
  | 'buttonThird'
  | 'buttonDanger'
  | 'fab'
  | 'fabHover'
  | 'pinDot'
  | 'pinKey'
  | 'amountDisplay'
  | 'bottomNav'
  | 'transactionsSegment'
  | 'progressBar'
  | 'progressFill'
  | 'pageDot'
  | 'budgetStatus'
  | 'typeToggle'
  | 'dateGroup'
  | 'dateGroupHover'
  | 'noteInput'
  | 'noteInputFocus'
  | 'chartPlaceholder'
  | 'mobileContainer';

/**
 * Shadow variants with different intensities
 */
export type IShadows = Readonly<Record<ShadowKey, IShadow>>;

/**
 * Accent color palette
 */
export type IAccentColors = Readonly<{
  dark: string;
  medium: string;
  light: string;
  green: string;
  // Background variants
  darkBg: string;
  mediumBg: string;
  lightBg: string;
  greenBg: string;
  // Text variants
  darkText: string;
  mediumText: string;
  lightText: string;
  greenText: string;
  // Hover states
  darkHover: string;
  mediumHover: string;
  lightHover: string;
  greenHover: string;
}>;

/**
 * Category color palette
 */
export type ICategoryColors = Readonly<{
  groceries: string;
  transport: string;
  entertainment: string;
  restaurants: string;
  health: string;
  clothing: string;
  home: string;
  communication: string;
  subscriptions: string;
  other: string;
  // Category backgrounds
  groceriesBg: string;
  transportBg: string;
  entertainmentBg: string;
  restaurantsBg: string;
  healthBg: string;
  clothingBg: string;
  homeBg: string;
  communicationBg: string;
  subscriptionsBg: string;
  otherBg: string;
  // Income categories
  salary: string;
  freelance: string;
  gifts: string;
  incomeOther: string;
}>;

/**
 * Background color palette
 */
export type IBackgroundColors = Readonly<{
  primary: string;
  secondary: string;
  tertiary: string;
  body: string;
}>;

/**
 * Text color palette
 */
export type ITextColors = Readonly<{
  primary: string;
  secondary: string;
  tertiary: string;
}>;

/**
 * Border color palette
 */
export type IBorderColors = Readonly<{
  color: string;
  divider: string;
}>;

/**
 * Status color palette
 */
export type IStatusColors = Readonly<{
  success: string;
  successBg: string;
  successBorder: string;
  successText: string;
  warning: string;
  warningBg: string;
  warningBorder: string;
  warningText: string;
  warningLight: string;
  error: string;
  errorBg: string;
  errorBorder: string;
  errorText: string;
  errorLight: string;
  errorHover: string;
  info: string;
  infoBg: string;
  infoBorder: string;
  infoText: string;
}>;

/**
 * Color palette for the theme
 * Note: white and black are also available in commonColors for theme-agnostic use
 */
export type IColors = Readonly<{
  accent: IAccentColors;
  category: ICategoryColors;
  background: IBackgroundColors;
  text: ITextColors;
  border: IBorderColors;
  status: IStatusColors;
  shadow: IShadowColors;
  white: string;
  black: string;
  toggleInactive: string;
}>;

/**
 * Complete theme interface
 * Combines all theme objects into one cohesive theme
 */
export type ITheme = Readonly<{
  spacing: ISpacing;
  colors: IColors;
  typography: ITypography;
  shadows: IShadows;
  commonColors: ICommonColors;
}>;
