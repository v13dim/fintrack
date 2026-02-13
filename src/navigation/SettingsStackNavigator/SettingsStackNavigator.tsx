import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PinChangeScreen, SettingsScreen } from 'screens';

import type { SettingsStackParamList } from './SettingsStackNavigator.types';
import { SettingsStackScreens } from './SettingsStackNavigator.types';

const Stack = createStackNavigator<SettingsStackParamList>();

export const SettingsStackNavigator: FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={SettingsStackScreens.Settings} component={SettingsScreen} />
    <Stack.Screen name={SettingsStackScreens.PinChange} component={PinChangeScreen} />
  </Stack.Navigator>
);
