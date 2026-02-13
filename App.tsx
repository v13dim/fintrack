/**
 * FinTrack - Personal finance tracking app
 *
 * @format
 */

import React, { FC, Suspense, useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import Config from 'react-native-config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Sentry from '@sentry/react-native';
import { AuthProvider, TabBarVisibilityProvider, ThemeProvider, useAuth } from 'contexts';

import { AppNavigator, AuthNavigator } from 'navigation';

import { AppErrorBoundary, AppSuspenseFallback } from 'components';

import { useAppInit } from 'hooks/useAppInit';
import { useAppStateLock } from 'hooks/useAppStateLock';

import 'localization/i18n';

Sentry.init({
  dsn: Config.SENTRY_DSN,
  sendDefaultPii: __DEV__,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],
});

interface INavSwitcherProps {
  isFirstLaunch: boolean;
  hasPin: boolean;
}

interface IAppStateLockHandlerProps {
  signOut: () => void;
}

const AppStateLockHandler: FC<IAppStateLockHandlerProps> = ({ signOut }) => {
  useAppStateLock(signOut);
  return null;
};

const NavSwitcher: FC<INavSwitcherProps> = ({ isFirstLaunch, hasPin }) => {
  const { isAuthenticated, signOut } = useAuth();
  return isAuthenticated ? (
    <>
      <AppStateLockHandler signOut={signOut} />
      <TabBarVisibilityProvider>
        <AppNavigator />
      </TabBarVisibilityProvider>
    </>
  ) : (
    <AuthNavigator isFirstLaunch={isFirstLaunch} hasPin={hasPin} />
  );
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { isReady, isFirstLaunch, hasPin } = useAppInit();

  useEffect(() => {
    if (isReady) {
      RNBootSplash.hide({ fade: true });
    }
  }, [isReady]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppErrorBoundary>
            <Suspense fallback={<AppSuspenseFallback />}>
              <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
              <AuthProvider>
                {isReady ? (
                  <BottomSheetModalProvider>
                    <NavigationContainer>
                      <NavSwitcher isFirstLaunch={isFirstLaunch} hasPin={hasPin} />
                    </NavigationContainer>
                  </BottomSheetModalProvider>
                ) : null}
              </AuthProvider>
            </Suspense>
          </AppErrorBoundary>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
