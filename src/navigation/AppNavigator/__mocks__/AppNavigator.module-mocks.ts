/**
 * Co-located mocks for AppNavigator tests.
 * Mocks @react-navigation/stack and screens; uses imports (no require).
 */

import React from 'react';

import { mockCreateReactElement } from 'testUtils/mockCreateReactElement';

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) =>
      mockCreateReactElement('Navigator', { testID: 'app-stack-navigator', children }),
    Screen: (props: { name: string }) =>
      mockCreateReactElement('Screen', { testID: `screen-${props.name}` }),
  }),
}));

jest.mock('screens', () => ({
  HomeScreen: () => mockCreateReactElement('HomeScreen', { testID: 'home-screen' }),
  SettingsScreen: () => mockCreateReactElement('SettingsScreen', { testID: 'settings-screen' }),
}));
