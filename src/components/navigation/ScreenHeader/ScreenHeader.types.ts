import type { ReactNode } from 'react';

export interface IScreenHeaderProps {
  /** Left slot: e.g. HeaderAction.Back */
  left?: ReactNode;
  /** Center slot: e.g. HeaderAction.Title */
  center?: ReactNode;
  /** Right slot: e.g. HeaderAction.Action */
  right?: ReactNode;
  testID?: string;
}
