import React, { FC, ReactNode } from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AnalyticsStackNavigator } from 'navigation/AnalyticsStackNavigator';
import { HomeStackNavigator } from 'navigation/HomeStackNavigator';
import { SettingsStackNavigator } from 'navigation/SettingsStackNavigator';

import { TabBarIsland } from 'components/navigation';

import { IconAnalytics, IconHome, IconSettings } from 'assets/svg';

import type { MainTabParamList } from './AppNavigator.types';
import { MainTabScreens } from './AppNavigator.types';

function RenderTabBar(props: BottomTabBarProps): ReactNode {
  return <TabBarIsland {...props} />;
}

const Tab = createBottomTabNavigator<MainTabParamList>();

const renderHomeIcon = ({ color, size }: { color: string; size: number }) => (
  <IconHome size={size} color={color} />
);
const renderAnalyticsIcon = ({ color, size }: { color: string; size: number }) => (
  <IconAnalytics size={size} color={color} />
);
const renderSettingsIcon = ({ color, size }: { color: string; size: number }) => (
  <IconSettings size={size} color={color} />
);

const tabScreenOptions = {
  headerShown: false,
  tabBarShowLabel: true,
};

export const AppNavigator: FC = () => (
  <Tab.Navigator screenOptions={tabScreenOptions} tabBar={RenderTabBar}>
    <Tab.Screen
      name={MainTabScreens.Home}
      component={HomeStackNavigator}
      options={{ title: 'Home', tabBarIcon: renderHomeIcon }}
    />
    <Tab.Screen
      name={MainTabScreens.Analytics}
      component={AnalyticsStackNavigator}
      options={{ title: 'Analytics', tabBarIcon: renderAnalyticsIcon }}
    />
    <Tab.Screen
      name={MainTabScreens.Settings}
      component={SettingsStackNavigator}
      options={{ title: 'Settings', tabBarIcon: renderSettingsIcon }}
    />
  </Tab.Navigator>
);
