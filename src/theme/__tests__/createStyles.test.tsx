import React from 'react';
import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from 'contexts/ThemeContext';

import { createStyles } from '../createStyles';
import { lightTheme } from '../lightTheme';

describe('createStyles', () => {
  it('should return styles when used without extra data', () => {
    const useTestStyles = createStyles(({ theme: { colors } }) => ({
      container: {
        backgroundColor: colors.background.primary,
      },
      label: {
        color: colors.text.primary,
      },
    }));

    const Component = () => {
      const styles = useTestStyles(undefined as void);
      return (
        <View style={styles.container} testID='container'>
          <Text style={styles.label} testID='label'>
            Test
          </Text>
        </View>
      );
    };

    render(
      <ThemeProvider theme={lightTheme}>
        <Component />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('container')).toBeTruthy();
    expect(screen.getByTestId('label')).toBeTruthy();
  });

  it('should return styles when used with extra data', () => {
    interface Extra {
      isActive: boolean;
    }

    const useTestStyles = createStyles(({ theme: { colors } }, { isActive }: Extra) => ({
      box: {
        backgroundColor: isActive ? colors.accent.green : colors.background.primary,
      },
    }));

    const Component = () => {
      const styles = useTestStyles({ isActive: true });
      return <View style={styles.box} testID='box' />;
    };

    render(
      <ThemeProvider theme={lightTheme}>
        <Component />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('box')).toBeTruthy();
  });

  it('should pass dimensions and insets to style function', () => {
    const useTestStyles = createStyles(({ dimensions, insets }) => ({
      root: {
        width: dimensions.width,
        paddingTop: insets.top,
      },
    }));

    const Component = () => {
      const styles = useTestStyles(undefined as void);
      return <View style={styles.root} testID='root' />;
    };

    render(
      <ThemeProvider theme={lightTheme}>
        <Component />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('root')).toBeTruthy();
  });
});
