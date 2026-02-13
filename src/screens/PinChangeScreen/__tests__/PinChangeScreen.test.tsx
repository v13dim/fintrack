import React from 'react';
import { act, screen } from '@testing-library/react-native';
import { TabBarVisibilityProvider } from 'contexts';

import { usePinChange } from 'hooks/usePinChange';

import { renderWithTheme } from 'testUtils';

import { PinChangeScreen } from '../PinChangeScreen';

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

const mockSetTabBarHidden = jest.fn();
jest.mock('contexts', () => ({
  TabBarVisibilityProvider: ({ children }: { children: unknown }) => children,
  useTabBarVisibility: () => ({ tabBarHidden: false, setTabBarHidden: mockSetTabBarHidden }),
}));

jest.mock('hooks/usePinChange', () => ({
  usePinChange: jest.fn(() => ({
    value: '',
    handleDigit: jest.fn(),
    handleBackspace: jest.fn(),
    title: 'Enter current PIN',
    subtitle: 'Verify your PIN',
    errorMessage: undefined,
    isLoading: false,
  })),
}));

describe('PinChangeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(usePinChange).mockReturnValue({
      value: '',
      handleDigit: jest.fn(),
      handleBackspace: jest.fn(),
      title: 'Enter current PIN',
      subtitle: 'Verify your PIN',
      errorMessage: undefined,
      isLoading: false,
    });
  });

  it('should render header and pin input', () => {
    renderWithTheme(
      <TabBarVisibilityProvider>
        <PinChangeScreen />
      </TabBarVisibilityProvider>,
    );
    expect(screen.getByTestId('screen-header')).toBeTruthy();
    expect(screen.getByTestId('pin-change-input')).toBeTruthy();
  });

  it('should call setTabBarHidden(true) on mount and setTabBarHidden(false) on unmount', () => {
    const { unmount } = renderWithTheme(
      <TabBarVisibilityProvider>
        <PinChangeScreen />
      </TabBarVisibilityProvider>,
    );
    expect(mockSetTabBarHidden).toHaveBeenCalledWith(true);
    act(() => {
      unmount();
    });
    expect(mockSetTabBarHidden).toHaveBeenCalledWith(false);
  });

  it('should render FullScreenLoader when isLoading is true', () => {
    jest.mocked(usePinChange).mockReturnValue({
      value: '1234',
      handleDigit: jest.fn(),
      handleBackspace: jest.fn(),
      title: 'Enter current PIN',
      subtitle: 'Verify your PIN',
      errorMessage: undefined,
      isLoading: true,
    });
    renderWithTheme(
      <TabBarVisibilityProvider>
        <PinChangeScreen />
      </TabBarVisibilityProvider>,
    );
    expect(screen.getByTestId('pin-change-loader')).toBeTruthy();
  });
});
