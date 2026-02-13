import type { ReactNode } from 'react';

import { mockCreateReactElement } from 'testUtils/mockCreateReactElement';

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: ReactNode }) =>
      mockCreateReactElement('TabNavigator', {
        testID: 'app-tab-navigator',
        children,
      }),
    Screen: (props: {
      name: string;
      options?: { tabBarIcon?: (opts: { color: string; size: number }) => ReactNode };
    }) => {
      const icon = props.options?.tabBarIcon?.({ color: '#000', size: 24 }) ?? null;
      return mockCreateReactElement('TabScreen', {
        testID: `tab-${props.name}`,
        icon,
      });
    },
  }),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: { children: ReactNode }) =>
      mockCreateReactElement('StackNavigator', { children }),
    Screen: (props: { name: string }) =>
      mockCreateReactElement('Screen', { testID: `screen-${props.name}` }),
  }),
}));

jest.mock('components/navigation/TabBarIsland', () => ({
  TabBarIsland: (props: Record<string, unknown>) =>
    mockCreateReactElement('TabBarIsland', { testID: 'tab-bar-island', ...props }),
}));

jest.mock('screens', () => ({
  HomeScreen: () => mockCreateReactElement('HomeScreen', { testID: 'home-screen' }),
  SettingsScreen: () => mockCreateReactElement('SettingsScreen', { testID: 'settings-screen' }),
  AnalyticsScreen: () => mockCreateReactElement('AnalyticsScreen', { testID: 'analytics-screen' }),
  PinChangeScreen: () => mockCreateReactElement('PinChangeScreen', { testID: 'pin-change-screen' }),
}));

jest.mock('assets/svg', () => ({
  IconAnalytics: () => mockCreateReactElement('IconAnalytics', {}),
  IconBack: () => mockCreateReactElement('IconBack', {}),
  IconClose: () => mockCreateReactElement('IconClose', {}),
  IconHome: () => mockCreateReactElement('IconHome', {}),
  IconRightArrow: () => mockCreateReactElement('IconRightArrow', {}),
  IconSettings: () => mockCreateReactElement('IconSettings', {}),
}));
