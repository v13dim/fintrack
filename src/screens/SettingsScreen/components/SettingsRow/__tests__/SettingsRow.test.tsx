import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { SettingsRow } from '../SettingsRow';

describe('SettingsRow', () => {
  it('renders title', () => {
    renderWithTheme(<SettingsRow title='Auto-lock' />);
    expect(screen.getByText('Auto-lock')).toBeTruthy();
  });

  it('renders subtitle when provided', () => {
    renderWithTheme(<SettingsRow title='Auto-lock' subtitle='1 minute' />);
    expect(screen.getByText('1 minute')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    renderWithTheme(<SettingsRow title='Change PIN' onPress={onPress} />);
    fireEvent.press(screen.getByTestId('settings-row'));
    expect(onPress).toHaveBeenCalled();
  });
});
