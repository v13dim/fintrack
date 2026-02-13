import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from 'screens';

import type { HomeStackParamList } from './HomeStackNavigator.types';
import { HomeStackScreens } from './HomeStackNavigator.types';

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeStackNavigator: FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={HomeStackScreens.Home} component={HomeScreen} />
  </Stack.Navigator>
);
