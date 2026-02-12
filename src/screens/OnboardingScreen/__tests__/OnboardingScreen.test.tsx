import { mockReplace } from '../__mocks__/OnboardingScreen.module-mocks';

import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { OnboardingStorageService } from 'services';

import { renderWithTheme } from 'testUtils';

import { OnboardingScreen } from '../OnboardingScreen';

const PIN_CREATE_SCREEN = 'PinCreate';

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(OnboardingStorageService.setOnboardingCompleted).mockResolvedValue(undefined);
  });

  it('should render first step with title from localization', () => {
    renderWithTheme(<OnboardingScreen />);

    expect(screen.getByText('Take Control of Your Finances')).toBeTruthy();
    expect(screen.getByTestId('onboarding-next')).toBeTruthy();
    expect(screen.getByTestId('onboarding-skip')).toBeTruthy();
  });

  it('should advance to next step when Next is pressed', () => {
    renderWithTheme(<OnboardingScreen />);

    fireEvent.press(screen.getByTestId('onboarding-next'));

    expect(screen.getByText('Plan Your Budget')).toBeTruthy();
    expect(screen.getByTestId('onboarding-next')).toBeTruthy();
  });

  it('should show Get Started on last step', () => {
    renderWithTheme(<OnboardingScreen />);

    fireEvent.press(screen.getByTestId('onboarding-next'));
    fireEvent.press(screen.getByTestId('onboarding-next'));

    expect(screen.getByText('Your Data is Protected')).toBeTruthy();
    expect(screen.getByTestId('onboarding-get-started')).toBeTruthy();
    expect(screen.queryByTestId('onboarding-next')).toBeNull();
  });

  it('should call setOnboardingCompleted and replace with PinCreate when Skip is pressed', async () => {
    renderWithTheme(<OnboardingScreen />);

    fireEvent.press(screen.getByTestId('onboarding-skip'));

    await waitFor(() => {
      expect(OnboardingStorageService.setOnboardingCompleted).toHaveBeenCalledWith(true);
      expect(mockReplace).toHaveBeenCalledWith(PIN_CREATE_SCREEN);
    });
  });

  it('should call setOnboardingCompleted and replace with PinCreate when Get Started is pressed', async () => {
    renderWithTheme(<OnboardingScreen />);

    fireEvent.press(screen.getByTestId('onboarding-next'));
    fireEvent.press(screen.getByTestId('onboarding-next'));
    fireEvent.press(screen.getByTestId('onboarding-get-started'));

    await waitFor(() => {
      expect(OnboardingStorageService.setOnboardingCompleted).toHaveBeenCalledWith(true);
      expect(mockReplace).toHaveBeenCalledWith(PIN_CREATE_SCREEN);
    });
  });
});
