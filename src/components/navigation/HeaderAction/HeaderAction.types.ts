import type { ReactNode } from 'react';

export interface IHeaderActionBackProps {
  onPress: () => void;
  label?: string;
  testID?: string;
}

export interface IHeaderActionCloseProps {
  onPress: () => void;
  label?: string;
  testID?: string;
}

export interface IHeaderActionTitleProps {
  children: ReactNode;
  testID?: string;
}

export interface IHeaderActionActionProps {
  onPress: () => void;
  label?: string;
  icon?: ReactNode;
  testID?: string;
}
