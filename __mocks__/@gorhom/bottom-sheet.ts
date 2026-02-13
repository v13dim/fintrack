import React from 'react';
import { View } from 'react-native';

interface BottomSheetModalProps {
  children?: React.ReactNode;
  backdropComponent?: React.ComponentType<unknown>;
  [key: string]: unknown;
}

const BottomSheetModal = React.forwardRef(
  (props: BottomSheetModalProps, ref: React.Ref<unknown>) => {
    React.useImperativeHandle(ref, () => ({
      present: () => undefined,
      dismiss: () => undefined,
    }));
    const Backdrop = props.backdropComponent;
    return React.createElement(
      View,
      { testID: 'bottom-sheet-modal' },
      Backdrop ? React.createElement(Backdrop, {}) : null,
      props.children,
    );
  },
);

const BottomSheetView = ({ children }: { children?: React.ReactNode }) =>
  React.createElement(View, { testID: 'bottom-sheet-view' }, children);

export const useBottomSheetModal = () => ({ dismiss: () => undefined });

export const BottomSheetModalProvider = ({ children }: { children: React.ReactNode }) =>
  React.createElement(React.Fragment, null, children);

export { BottomSheetModal, BottomSheetView };
