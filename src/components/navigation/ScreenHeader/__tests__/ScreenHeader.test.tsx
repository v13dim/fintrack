import '../__mocks__/ScreenHeader.module-mocks';

import React from 'react';
import { Platform, View } from 'react-native';
import { screen } from '@testing-library/react-native';

import { HeaderAction, ScreenHeader } from 'components/navigation';

import { renderWithTheme } from 'testUtils';

describe('ScreenHeader', () => {
  it('should render with testID', () => {
    renderWithTheme(<ScreenHeader center={<HeaderAction.Title>Settings</HeaderAction.Title>} />);
    expect(screen.getByTestId('screen-header')).toBeTruthy();
  });

  it('should render left, center and right slots', () => {
    const onBack = jest.fn();
    const onNext = jest.fn();
    renderWithTheme(
      <ScreenHeader
        left={<HeaderAction.Back onPress={onBack} />}
        center={<HeaderAction.Title>Title</HeaderAction.Title>}
        right={<HeaderAction.Action label='Next' onPress={onNext} />}
      />,
    );
    expect(screen.getByTestId('screen-header')).toBeTruthy();
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByTestId('header-action-left')).toBeTruthy();
    expect(screen.getByTestId('header-action-right')).toBeTruthy();
  });

  it('should render only right slot when left and center are omitted', () => {
    renderWithTheme(<ScreenHeader right={<View testID='right-only' />} />);
    expect(screen.getByTestId('screen-header')).toBeTruthy();
    expect(screen.getByTestId('right-only')).toBeTruthy();
  });

  it('should use Android blur amount when Platform.OS is not ios', () => {
    Object.defineProperty(Platform, 'OS', { value: 'android', configurable: true, writable: true });
    renderWithTheme(<ScreenHeader center={<HeaderAction.Title>Title</HeaderAction.Title>} />);
    expect(screen.getByTestId('screen-header')).toBeTruthy();
    Object.defineProperty(Platform, 'OS', { value: 'ios', configurable: true, writable: true });
  });
});
