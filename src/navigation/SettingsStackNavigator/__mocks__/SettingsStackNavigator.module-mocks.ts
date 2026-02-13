import React from 'react';

import { mockCreateReactElement } from 'testUtils/mockCreateReactElement';

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: (props: { screenOptions?: unknown; children: React.ReactNode }) =>
      mockCreateReactElement('Navigator', {
        testID: 'settings-stack-navigator',
        screenOptions: props.screenOptions,
        children: props.children,
      }),
    Screen: (props: { name: string }) =>
      mockCreateReactElement('Screen', { testID: `screen-${props.name}` }),
  }),
}));

jest.mock('screens', () => ({
  SettingsScreen: () => mockCreateReactElement('SettingsScreen', { testID: 'settings-screen' }),
  PinChangeScreen: () => mockCreateReactElement('PinChangeScreen', { testID: 'pin-change-screen' }),
}));
