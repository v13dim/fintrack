import '../__mocks__/AppNavigator.module-mocks';

import React from 'react';
import { screen } from '@testing-library/react-native';
import { TabBarVisibilityProvider } from 'contexts';

import { renderWithTheme } from 'testUtils';

import { AppNavigator } from '../AppNavigator';
import { MainTabScreens } from '../AppNavigator.types';

const renderAppNavigator = () =>
  renderWithTheme(
    <TabBarVisibilityProvider>
      <AppNavigator />
    </TabBarVisibilityProvider>,
  );

describe('AppNavigator', () => {
  it('should render tab navigator', () => {
    renderAppNavigator();

    expect(screen.getByTestId('app-tab-navigator')).toBeTruthy();
  });

  it('should register Home, Analytics and Settings tabs', () => {
    renderAppNavigator();

    expect(screen.getByTestId(`tab-${MainTabScreens.Home}`)).toBeTruthy();
    expect(screen.getByTestId(`tab-${MainTabScreens.Analytics}`)).toBeTruthy();
    expect(screen.getByTestId(`tab-${MainTabScreens.Settings}`)).toBeTruthy();
  });
});
