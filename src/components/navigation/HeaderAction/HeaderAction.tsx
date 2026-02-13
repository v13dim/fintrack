import React, { FC } from 'react';
import { Pressable } from 'react-native';

import { Text } from 'components/common';

import { useTheme } from 'hooks/useTheme';

import { IconBack, IconClose, IconRightArrow } from 'assets/svg';

import type {
  IHeaderActionActionProps,
  IHeaderActionBackProps,
  IHeaderActionCloseProps,
  IHeaderActionTitleProps,
} from './HeaderAction.types';

const ICON_SIZE = 24;

/** Extends touch area without changing header layout (matches ~48h × 56w target) */
const HEADER_ACTION_HIT_SLOP = { top: 12, bottom: 12, left: 16, right: 16 };

const baseActionStyle = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: 4,
};

const HeaderActionBack: FC<IHeaderActionBackProps> = ({
  onPress,
  label,
  testID = 'header-action-left',
}) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HEADER_ACTION_HIT_SLOP}
      style={({ pressed }) => [baseActionStyle, { opacity: pressed ? 0.7 : 1 }]}
      testID={testID}
    >
      <IconBack size={ICON_SIZE} color={colors.accent.darkText} testID={`${testID}-icon`} />
      {label ? <Text.Button color='accentDark'>{label}</Text.Button> : null}
    </Pressable>
  );
};

const HeaderActionClose: FC<IHeaderActionCloseProps> = ({
  onPress,
  label,
  testID = 'header-action-left',
}) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HEADER_ACTION_HIT_SLOP}
      style={({ pressed }) => [baseActionStyle, { opacity: pressed ? 0.7 : 1 }]}
      testID={testID}
    >
      <IconClose size={ICON_SIZE} color={colors.accent.darkText} testID={`${testID}-icon`} />
      {label ? <Text.Button color='accentDark'>{label}</Text.Button> : null}
    </Pressable>
  );
};

const HeaderActionTitle: FC<IHeaderActionTitleProps> = ({
  children,
  testID = 'header-action-title',
}) => (
  <Text.H4 color='accentDark' testID={testID}>
    {children}
  </Text.H4>
);

const HeaderActionAction: FC<IHeaderActionActionProps> = ({
  onPress,
  label,
  icon,
  testID = 'header-action-right',
}) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HEADER_ACTION_HIT_SLOP}
      style={({ pressed }) => [baseActionStyle, { opacity: pressed ? 0.7 : 1 }]}
      testID={testID}
    >
      {icon ?? (
        <>
          {label ? <Text.Button color='accentGreenText'>{label}</Text.Button> : null}
          <IconRightArrow
            size={ICON_SIZE}
            color={colors.accent.greenText}
            testID={`${testID}-icon`}
          />
        </>
      )}
    </Pressable>
  );
};

export type HeaderActionCompound = {
  Back: typeof HeaderActionBack;
  Close: typeof HeaderActionClose;
  Title: typeof HeaderActionTitle;
  Action: typeof HeaderActionAction;
};

export const HeaderAction = {
  Back: HeaderActionBack,
  Close: HeaderActionClose,
  Title: HeaderActionTitle,
  Action: HeaderActionAction,
};
