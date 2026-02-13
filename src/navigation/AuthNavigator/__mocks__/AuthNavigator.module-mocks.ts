/**
 * Co-located mocks for AuthNavigator tests.
 * Mocks @react-navigation/stack, screens and utils; uses imports (no require).
 */

import React from 'react';

import { mockCreateReactElement } from 'testUtils/mockCreateReactElement';

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: (props: { initialRouteName?: string; children: React.ReactNode }) =>
      mockCreateReactElement('Navigator', {
        testID: 'auth-stack-navigator',
        initialRouteName: props.initialRouteName,
        children: props.children,
      }),
    Screen: (props: { name: string }) =>
      mockCreateReactElement('Screen', { testID: `screen-${props.name}` }),
  }),
}));

jest.mock('screens', () => ({
  OnboardingScreen: () =>
    mockCreateReactElement('OnboardingScreen', { testID: 'onboarding-screen' }),
  PinCreateScreen: () => mockCreateReactElement('PinCreateScreen', { testID: 'pin-create-screen' }),
  PinLoginScreen: () => mockCreateReactElement('PinLoginScreen', { testID: 'pin-login-screen' }),
}));

jest.mock('utils', () => ({
  getAuthInitialRoute: jest.fn(),
}));
