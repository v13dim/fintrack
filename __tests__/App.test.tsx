import '../__mocks__/App.module-mocks';

import React from 'react';
import { useColorScheme } from 'react-native';
import { render, screen } from '@testing-library/react-native';

import App from '../App';

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useColorScheme as jest.Mock).mockReturnValue('light');
  });

  it('should render without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it('should render SafeAreaProvider with content', () => {
    render(<App />);

    expect(screen.getByTestId('hello-world')).toBeTruthy();
  });

  it('should render StatusBar', () => {
    render(<App />);

    const statusBar = screen.getByTestId('status-bar');
    expect(statusBar).toBeTruthy();
  });

  it('should pass dark-content barStyle to StatusBar when color scheme is light', () => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
    render(<App />);

    const statusBar = screen.getByTestId('status-bar');
    expect(statusBar.props.barStyle).toBe('dark-content');
  });

  it('should pass light-content barStyle to StatusBar when color scheme is dark', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    render(<App />);

    const statusBar = screen.getByTestId('status-bar');
    expect(statusBar.props.barStyle).toBe('light-content');
  });

  it('should render HelloWorld screen', () => {
    render(<App />);

    const helloWorld = screen.getByTestId('hello-world');
    expect(helloWorld).toBeTruthy();
  });
});
