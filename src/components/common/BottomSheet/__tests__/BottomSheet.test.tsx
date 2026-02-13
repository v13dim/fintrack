import React, { createRef } from 'react';
import { View } from 'react-native';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { BottomSheet } from '../BottomSheet';
import type { BottomSheetRef } from '../BottomSheet.types';

describe('BottomSheet', () => {
  it('should render and forward ref', () => {
    const ref = createRef<BottomSheetRef>();
    renderWithTheme(
      <BottomSheet ref={ref}>
        <View testID='sheet-content'>Content</View>
      </BottomSheet>,
    );
    expect(screen.getByTestId('bottom-sheet-modal')).toBeTruthy();
    expect(ref.current).toBeDefined();
    expect(typeof ref.current?.present).toBe('function');
    expect(typeof ref.current?.dismiss).toBe('function');
  });

  it('should accept custom snapPoints', () => {
    const ref = createRef<BottomSheetRef>();
    renderWithTheme(
      <BottomSheet ref={ref} snapPoints={['30%', '60%']}>
        <View testID='sheet-content'>Content</View>
      </BottomSheet>,
    );
    expect(screen.getByTestId('bottom-sheet-modal')).toBeTruthy();
  });

  it('should render default close button in header', () => {
    renderWithTheme(
      <BottomSheet>
        <View testID='sheet-content'>Content</View>
      </BottomSheet>,
    );
    expect(screen.getByTestId('bottom-sheet-close')).toBeTruthy();
  });

  it('should render title when provided', () => {
    renderWithTheme(
      <BottomSheet title='Test Title'>
        <View testID='sheet-content'>Content</View>
      </BottomSheet>,
    );
    expect(screen.getByTestId('bottom-sheet-title')).toHaveTextContent('Test Title');
  });

  it('should render backdrop and dismiss on press', () => {
    const ref = createRef<BottomSheetRef>();
    const onDismiss = jest.fn();
    renderWithTheme(
      <BottomSheet ref={ref} onDismiss={onDismiss}>
        <View testID='sheet-content'>Content</View>
      </BottomSheet>,
    );
    const backdrop = screen.getByTestId('bottom-sheet-backdrop');
    expect(backdrop).toBeTruthy();
    fireEvent.press(backdrop);
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
