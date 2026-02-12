import '../__mocks__/AppNavigator.module-mocks';

import React from 'react';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { AppNavigator } from '../AppNavigator';
import { AppStackScreens } from '../AppNavigator.types';

describe('AppNavigator', () => {
  it('should render stack navigator with header hidden', () => {
    renderWithTheme(<AppNavigator />);

    expect(screen.getByTestId('app-stack-navigator')).toBeTruthy();
  });

  it('should register Home and Settings screens', () => {
    renderWithTheme(<AppNavigator />);

    expect(screen.getByTestId(`screen-${AppStackScreens.Home}`)).toBeTruthy();
    expect(screen.getByTestId(`screen-${AppStackScreens.Settings}`)).toBeTruthy();
  });
});
