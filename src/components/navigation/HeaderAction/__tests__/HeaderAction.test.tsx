import React from 'react';
import { View } from 'react-native';
import { fireEvent, screen } from '@testing-library/react-native';

import { HeaderAction, ScreenHeader } from 'components/navigation';

import { renderWithTheme } from 'testUtils';

describe('HeaderAction', () => {
  it('should call onPress when Back is pressed', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <ScreenHeader
        left={<HeaderAction.Back onPress={onPress} />}
        center={<HeaderAction.Title>Test</HeaderAction.Title>}
      />,
    );
    fireEvent.press(screen.getByTestId('header-action-left'));
    expect(onPress).toHaveBeenCalled();
  });

  it('should render Back label when provided', () => {
    renderWithTheme(
      <ScreenHeader
        left={<HeaderAction.Back onPress={() => {}} label='Back' />}
        center={<HeaderAction.Title>Test</HeaderAction.Title>}
      />,
    );
    expect(screen.getByText('Back')).toBeTruthy();
  });

  it('should call onPress when Close is pressed', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <ScreenHeader
        left={<HeaderAction.Close onPress={onPress} />}
        center={<HeaderAction.Title>Test</HeaderAction.Title>}
      />,
    );
    fireEvent.press(screen.getByTestId('header-action-left'));
    expect(onPress).toHaveBeenCalled();
  });

  it('should render Close label when provided', () => {
    renderWithTheme(
      <ScreenHeader
        left={<HeaderAction.Close onPress={() => {}} label='Close' />}
        center={<HeaderAction.Title>Test</HeaderAction.Title>}
      />,
    );
    expect(screen.getByText('Close')).toBeTruthy();
  });

  it('should render Title children', () => {
    renderWithTheme(<ScreenHeader center={<HeaderAction.Title>Settings</HeaderAction.Title>} />);
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('should call onPress when Action is pressed', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <ScreenHeader
        center={<HeaderAction.Title>Test</HeaderAction.Title>}
        right={<HeaderAction.Action label='Next' onPress={onPress} />}
      />,
    );
    fireEvent.press(screen.getByTestId('header-action-right'));
    expect(onPress).toHaveBeenCalled();
  });

  it('should render default icon when Action has no label and no custom icon', () => {
    renderWithTheme(
      <ScreenHeader
        center={<HeaderAction.Title>Test</HeaderAction.Title>}
        right={<HeaderAction.Action onPress={() => {}} />}
      />,
    );
    expect(screen.getByTestId('header-action-right-icon')).toBeTruthy();
  });

  it('should render custom icon when Action icon prop is provided', () => {
    renderWithTheme(
      <ScreenHeader
        center={<HeaderAction.Title>Test</HeaderAction.Title>}
        right={<HeaderAction.Action onPress={() => {}} icon={<View testID='custom-icon' />} />}
      />,
    );
    expect(screen.getByTestId('custom-icon')).toBeTruthy();
  });
});
