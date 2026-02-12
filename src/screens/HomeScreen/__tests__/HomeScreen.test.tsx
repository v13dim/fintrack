import { mockNavigate } from '../__mocks__/HomeScreen.module-mocks';

import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';

import { AppStackScreens } from 'navigation';

import { renderWithTheme } from 'testUtils';

import { HomeScreen } from '../HomeScreen';

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render HelloWorld and settings button', () => {
    renderWithTheme(<HomeScreen />);

    expect(screen.getByTestId('hello-world')).toBeTruthy();
    expect(screen.getByTestId('home-settings-button')).toBeTruthy();
  });

  it('should show settings title', () => {
    renderWithTheme(<HomeScreen />);

    expect(screen.getByText('settings.title')).toBeTruthy();
  });

  it('should navigate to Settings when settings button is pressed', () => {
    renderWithTheme(<HomeScreen />);

    fireEvent.press(screen.getByTestId('home-settings-button'));

    expect(mockNavigate).toHaveBeenCalledWith(AppStackScreens.Settings);
  });
});
