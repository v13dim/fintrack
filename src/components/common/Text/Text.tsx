import React, { FC } from 'react';
import { Text as RNText } from 'react-native';

import { useTextStyles } from './Text.styles';
import type { ITextCompoundProps, ITextProps } from './Text.types';

const TextRoot: FC<ITextProps> = ({
  children,
  variant = 'body',
  color = 'primary',
  center = false,
  style,
  testID,
}) => {
  const styles = useTextStyles({ variant, color, center });

  return (
    <RNText style={[styles.text, style]} testID={testID}>
      {children}
    </RNText>
  );
};

type TextCompound = FC<ITextProps> & {
  H1: FC<ITextCompoundProps>;
  H2: FC<ITextCompoundProps>;
  H3: FC<ITextCompoundProps>;
  H4: FC<ITextCompoundProps>;
  Body: FC<ITextCompoundProps>;
  BodySmall: FC<ITextCompoundProps>;
  Caption: FC<ITextCompoundProps>;
  Label: FC<ITextCompoundProps>;
  Button: FC<ITextCompoundProps>;
};

export const Text: TextCompound = Object.assign(TextRoot, {
  H1: (props: ITextCompoundProps) => <TextRoot variant='h1' {...props} />,
  H2: (props: ITextCompoundProps) => <TextRoot variant='h2' {...props} />,
  H3: (props: ITextCompoundProps) => <TextRoot variant='h3' {...props} />,
  H4: (props: ITextCompoundProps) => <TextRoot variant='h4' {...props} />,
  Body: (props: ITextCompoundProps) => <TextRoot variant='body' {...props} />,
  BodySmall: (props: ITextCompoundProps) => <TextRoot variant='bodySmall' {...props} />,
  Caption: (props: ITextCompoundProps) => <TextRoot variant='caption' {...props} />,
  Label: (props: ITextCompoundProps) => <TextRoot variant='label' {...props} />,
  Button: (props: ITextCompoundProps) => <TextRoot variant='button' {...props} />,
});
