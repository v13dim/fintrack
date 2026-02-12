import '../__mocks__/GradientBackground.module-mocks';

import React from 'react';
import { View } from 'react-native';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { GradientBackground } from '../GradientBackground';

describe('GradientBackground', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => renderWithTheme(<GradientBackground />)).not.toThrow();
  });

  it('should render Skia canvas structure (mocked)', () => {
    renderWithTheme(<GradientBackground />);

    expect(screen.getByTestId('skia-canvas')).toBeTruthy();
    expect(screen.getByTestId('skia-rect')).toBeTruthy();
    expect(screen.getByTestId('skia-linear-gradient')).toBeTruthy();
  });

  it('should render children when provided', () => {
    const childTestID = 'gradient-background-child';
    renderWithTheme(
      <GradientBackground>
        <View testID={childTestID} />
      </GradientBackground>,
    );

    expect(screen.getByTestId('skia-canvas')).toBeTruthy();
    expect(screen.getByTestId(childTestID)).toBeTruthy();
  });
});
