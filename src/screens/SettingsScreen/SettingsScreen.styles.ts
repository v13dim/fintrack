import { createStyles } from 'theme';

export const useSettingsScreenStyles = createStyles(({ theme: { spacing } }) => ({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['40'],
  },
  title: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  },
  rowTouchable: {
    marginBottom: spacing.xs,
  },
}));
