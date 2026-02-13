import { createStyles } from 'theme';

export const useSettingsScreenStyles = createStyles(({ theme: { colors, spacing }, insets }) => ({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: insets.top + spacing[82],
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  bottomSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  bottomSheetOptionPressed: {
    opacity: 0.7,
  },
  bottomSheetOptionSelected: {
    backgroundColor: colors.accent.greenBg,
    borderRadius: 12,
    marginHorizontal: -spacing.sm,
    paddingHorizontal: spacing.lg,
  },
}));
