import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen, SettingsScreen } from 'screens';

import type { AppStackParamList } from './AppNavigator.types';
import { AppStackScreens } from './AppNavigator.types';

const Stack = createStackNavigator<AppStackParamList>();

export const AppNavigator: FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AppStackScreens.Home} component={HomeScreen} />
      <Stack.Screen name={AppStackScreens.Settings} component={SettingsScreen} />
    </Stack.Navigator>
  );
};
