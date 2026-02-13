import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AnalyticsScreen } from 'screens';

import type { AnalyticsStackParamList } from './AnalyticsStackNavigator.types';
import { AnalyticsStackScreens } from './AnalyticsStackNavigator.types';

const Stack = createStackNavigator<AnalyticsStackParamList>();

export const AnalyticsStackNavigator: FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={AnalyticsStackScreens.Analytics} component={AnalyticsScreen} />
  </Stack.Navigator>
);
