import { lightThemeColors } from './colors';
import { commonColors } from './commonColors';
import { IShadows } from './theme.types';

/**
 * Shadow variants for FinTrack
 * Based on wireframes shadow styles
 * Supports both iOS and Android platforms
 * Uses commonColors for base shadows to work across different themes
 */
export const shadows: IShadows = {
  // No shadow
  none: {
    shadowColor: commonColors.transparent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  // Extra small shadow
  xs: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  // Small shadow
  sm: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  // Medium shadow
  md: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  // Large shadow
  lg: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  // Extra large shadow
  xl: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  // Accent shadows
  accentMedium: {
    shadowColor: lightThemeColors.accent.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  accentLight: {
    shadowColor: lightThemeColors.accent.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  accentGreen: {
    shadowColor: lightThemeColors.accent.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  accentDark: {
    shadowColor: lightThemeColors.accent.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  // Status shadows
  error: {
    shadowColor: lightThemeColors.status.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  warning: {
    shadowColor: lightThemeColors.status.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  success: {
    shadowColor: lightThemeColors.status.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  info: {
    shadowColor: lightThemeColors.status.info,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  // Specific shadow variants from wireframes
  card: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  transactionItem: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryItem: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  formInput: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  formInputFocus: {
    shadowColor: lightThemeColors.accent.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonPrimary: {
    shadowColor: lightThemeColors.accent.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonSecondary: {
    shadowColor: lightThemeColors.accent.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonThird: {
    shadowColor: lightThemeColors.accent.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDanger: {
    shadowColor: lightThemeColors.status.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  fab: {
    shadowColor: lightThemeColors.accent.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.4,
    elevation: 6,
  },
  fabHover: {
    shadowColor: lightThemeColors.accent.medium,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    shadowOpacity: 0.5,
    elevation: 8,
  },
  pinDot: {
    shadowColor: lightThemeColors.accent.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  pinKey: {
    shadowColor: lightThemeColors.accent.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  amountDisplay: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomNav: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  transactionsSegment: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  progressBar: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  progressFill: {
    shadowColor: lightThemeColors.accent.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  pageDot: {
    shadowColor: lightThemeColors.accent.medium,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetStatus: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  typeToggle: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dateGroup: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dateGroupHover: {
    shadowColor: lightThemeColors.accent.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  noteInput: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  noteInputFocus: {
    shadowColor: lightThemeColors.accent.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  chartPlaceholder: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  mobileContainer: {
    shadowColor: commonColors.shadow.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
} as const;
