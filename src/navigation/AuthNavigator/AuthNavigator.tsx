import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingScreen, PinCreateScreen, PinLoginScreen } from 'screens';

import { getAuthInitialRoute } from 'utils';

import type { AuthStackParamList } from './AuthNavigator.types';
import { AuthStackScreens } from './AuthNavigator.types';

const Stack = createStackNavigator<AuthStackParamList>();

export interface IAuthNavigatorProps {
  isFirstLaunch: boolean;
  hasPin: boolean;
}

export const AuthNavigator: FC<IAuthNavigatorProps> = ({ isFirstLaunch, hasPin }) => {
  const initialRoute = getAuthInitialRoute(isFirstLaunch, hasPin);

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AuthStackScreens.Onboarding} component={OnboardingScreen} />
      <Stack.Screen name={AuthStackScreens.PinCreate} component={PinCreateScreen} />
      <Stack.Screen name={AuthStackScreens.PinLogin} component={PinLoginScreen} />
    </Stack.Navigator>
  );
};
