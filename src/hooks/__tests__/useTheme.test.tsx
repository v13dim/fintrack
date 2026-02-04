import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from 'contexts/ThemeContext';

import { lightTheme } from 'theme/lightTheme';

import { useTheme } from '../useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return theme when used within ThemeProvider', () => {
    const Consumer = () => {
      const theme = useTheme();
      return <Text testID='theme-value'>{theme.colors.background.primary}</Text>;
    };
    render(
      <ThemeProvider theme={lightTheme}>
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme-value').props.children).toBe(
      lightTheme.colors.background.primary,
    );
  });

  it('should return custom theme when ThemeProvider has theme prop', () => {
    const customPrimary = '#abc123';
    const customTheme = {
      ...lightTheme,
      colors: {
        ...lightTheme.colors,
        background: {
          ...lightTheme.colors.background,
          primary: customPrimary,
        },
      },
    };
    const Consumer = () => {
      const theme = useTheme();
      return <Text testID='theme-value'>{theme.colors.background.primary}</Text>;
    };
    render(
      <ThemeProvider theme={customTheme}>
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme-value').props.children).toBe(customPrimary);
  });

  it('should throw when context value is null', () => {
    const Consumer = () => {
      useTheme();
      return <Text testID='theme-value'>ok</Text>;
    };
    const NullProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <ThemeProvider theme={null as unknown as typeof lightTheme}>{children}</ThemeProvider>
    );
    expect(() =>
      render(
        <NullProvider>
          <Consumer />
        </NullProvider>,
      ),
    ).toThrow('useTheme must be used within a ThemeProvider');
  });
});
