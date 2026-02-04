import '../__mocks__/ThemeContext.module-mocks';

import React from 'react';
import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

import { useTheme } from 'hooks/useTheme';

import { lightTheme } from 'theme/lightTheme';
import { ITheme } from 'theme/theme.types';

import { ThemeProvider } from '../ThemeContext';

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <ThemeProvider>
        <View testID='child' />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('should provide default lightTheme when theme prop is not passed', () => {
    const Consumer = () => {
      const theme = useTheme();
      return <Text testID='theme-default'>{theme === lightTheme ? 'default' : 'custom'}</Text>;
    };
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme-default').props.children).toBe('default');
  });

  it('should provide custom theme when theme prop is passed', () => {
    const customTheme: ITheme = {
      ...lightTheme,
      colors: {
        ...lightTheme.colors,
        background: {
          ...lightTheme.colors.background,
          primary: '#custom-bg',
        },
      },
    };
    const Consumer = () => {
      const theme = useTheme();
      return <Text testID='theme-custom'>{theme.colors.background.primary}</Text>;
    };
    render(
      <ThemeProvider theme={customTheme}>
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme-custom').props.children).toBe('#custom-bg');
  });
});
