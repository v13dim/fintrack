import React, { forwardRef, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';

import { Text } from 'components/common';
import { HeaderAction } from 'components/navigation';

import { useBottomSheetStyles } from './BottomSheet.styles';
import type { BottomSheetRef, IBottomSheetProps } from './BottomSheet.types';

const BottomSheetBackdrop = ({ style, ...props }: BottomSheetBackdropProps) => {
  const { dismiss } = useBottomSheetModal();
  const styles = useBottomSheetStyles();
  return (
    <Pressable
      style={[style, StyleSheet.absoluteFill, styles.backdrop]}
      onPress={() => dismiss()}
      {...props}
      testID='bottom-sheet-backdrop'
    />
  );
};

interface IBottomSheetHeaderProps {
  title?: string;
  right?: ReactNode;
  left?: ReactNode;
}

const BottomSheetHeader = ({ title, right, left }: IBottomSheetHeaderProps) => {
  const { dismiss } = useBottomSheetModal();
  const styles = useBottomSheetStyles();

  return (
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>{left ?? null}</View>
      <View style={styles.headerCenter}>
        {title != null && title !== '' ? (
          <Text.H4 color='accentDark' testID='bottom-sheet-title'>
            {title}
          </Text.H4>
        ) : null}
      </View>
      <View style={styles.headerRight}>
        {right ?? <HeaderAction.Close onPress={() => dismiss()} testID='bottom-sheet-close' />}
      </View>
    </View>
  );
};

export const BottomSheet = forwardRef<BottomSheetRef, IBottomSheetProps>(
  ({ children, title, onDismiss, snapPoints = ['50%'], enableDynamicSizing = false }, ref) => {
    const styles = useBottomSheetStyles();

    return (
      <BottomSheetModal
        ref={ref}
        backdropComponent={BottomSheetBackdrop}
        snapPoints={enableDynamicSizing ? undefined : snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        onDismiss={onDismiss}
        backgroundStyle={styles.background}
      >
        <BottomSheetView style={styles.contentContainer}>
          <BottomSheetHeader title={title} />
          <View style={styles.contentArea}>{children}</View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';
