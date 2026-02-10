import '../__mocks__/HelloWorld.module-mocks';

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from 'contexts/ThemeContext';

import { lightTheme } from 'theme/lightTheme';

import { HelloWorld } from '../HelloWorld';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>);

describe('HelloWorld', () => {
  it('should display the hello world message', () => {
    renderWithTheme(<HelloWorld />);

    const textElement = screen.getByTestId('hello-world-text');
    expect(textElement).toBeTruthy();
  });

  it('should render the component structure', () => {
    renderWithTheme(<HelloWorld />);

    const textElement = screen.getByTestId('hello-world-text');
    expect(textElement).toBeTruthy();
  });

  it('should render without crashing', () => {
    expect(() => renderWithTheme(<HelloWorld />)).not.toThrow();
  });
});
