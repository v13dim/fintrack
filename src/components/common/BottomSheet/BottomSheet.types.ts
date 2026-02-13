import type { ReactNode } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

export interface IBottomSheetProps {
  children: ReactNode;
  /** Optional title shown centered in the header */
  title?: string;
  /** Called when the sheet is dismissed (closed) */
  onDismiss?: () => void;
  /** Snap points as percents or absolute values, e.g. ['25%', '50%'] */
  snapPoints?: (string | number)[];
  /** Enable dynamic height based on content; use when content height is variable */
  enableDynamicSizing?: boolean;
}

export type BottomSheetRef = BottomSheetModal;
