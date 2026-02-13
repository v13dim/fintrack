import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { Text } from 'components/common';

import { useButtonStyles } from './Button.styles';
import type { IButtonCompoundProps, IButtonProps } from './Button.types';

const ButtonRoot: FC<IButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  onPress,
  disabled = false,
  style,
  testID,
}) => {
  const styles = useButtonStyles({ fullWidth, variant });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[styles.root, style]}
      testID={testID}
    >
      <Text.Button style={styles.label}>{children}</Text.Button>
    </TouchableOpacity>
  );
};

type ButtonCompound = FC<IButtonProps> & {
  Primary: FC<IButtonCompoundProps>;
  Secondary: FC<IButtonCompoundProps>;
  Third: FC<IButtonCompoundProps>;
  Ghost: FC<IButtonCompoundProps>;
  Danger: FC<IButtonCompoundProps>;
};

export const Button: ButtonCompound = Object.assign(ButtonRoot, {
  Primary: (props: IButtonCompoundProps) => <ButtonRoot variant='primary' {...props} />,
  Secondary: (props: IButtonCompoundProps) => <ButtonRoot variant='secondary' {...props} />,
  Third: (props: IButtonCompoundProps) => <ButtonRoot variant='third' {...props} />,
  Ghost: (props: IButtonCompoundProps) => <ButtonRoot variant='ghost' {...props} />,
  Danger: (props: IButtonCompoundProps) => <ButtonRoot variant='danger' {...props} />,
});
