# Splash Screen Implementation Guide

This guide provides detailed implementation instructions for react-native-bootsplash in FinTrack. For the decision rationale, see [ADR-008: Splash Screen Library Selection](../adr/ADR-008-splash-screen-library-selection.md).

## Table of Contents

- [Installation](#installation)
- [iOS Setup](#ios-setup)
- [Android Setup](#android-setup)
- [Implementation](#implementation)
- [App Initialization](#app-initialization)
- [Usage in App.tsx](#usage-in-apptsx)
- [Programmatic Control](#programmatic-control)
- [Best Practices](#best-practices)

## Installation

```bash
npm install react-native-bootsplash
# or
yarn add react-native-bootsplash
```

## iOS Setup

1. Add splash screen image to `ios/fintrack/Images.xcassets/LaunchImage.imageset/`
2. Update `ios/fintrack/Info.plist`:

```xml
<key>UILaunchStoryboardName</key>
<string>LaunchScreen</string>
```

3. Run:

```bash
cd ios && pod install
```

## Android Setup

1. Add splash screen image to `android/app/src/main/res/drawable/splash.png`
2. Create `android/app/src/main/res/values/styles.xml`:

```xml
<resources>
    <style name="BootTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="android:windowBackground">@drawable/splash</item>
    </style>
</resources>
```

3. Update `android/app/src/main/AndroidManifest.xml`:

```xml
<activity
    android:name=".MainActivity"
    android:theme="@style/BootTheme"
    ...>
</activity>
```

## Implementation

```typescript
// src/components/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

export const SplashScreen: React.FC = () => {
  useEffect(() => {
    const init = async () => {
      // Initialize app (load data, setup, etc.)
      await initializeApp();

      // Hide splash screen
      await RNBootSplash.hide({ fade: true });
    };

    init();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('assets/images/logo.png')} style={styles.logo} resizeMode='contain' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
```

## App Initialization

```typescript
// src/utils/appInitialization.ts
import { getRealm } from 'db';

export const initializeApp = async (): Promise<void> => {
  try {
    // Initialize database
    const realm = getRealm();

    // Realm hooks automatically update components when data changes
    // No hydration needed - components use useQuery/useObject hooks directly

    // Other initialization tasks
    // - Load user settings
    // - Check authentication
    // - Setup notifications
    // etc.

    return Promise.resolve();
  } catch (error) {
    console.error('App initialization failed:', error);
    throw error;
  }
};
```

## Usage in App.tsx

```typescript
// App.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from 'navigation';
import { initializeApp } from 'utils/appInitialization';

export const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeApp();
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsReady(true);
        await RNBootSplash.hide({ fade: true });
      }
    };

    init();
  }, []);

  if (!isReady) {
    return null; // Splash screen is shown natively
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};
```

## Programmatic Control

```typescript
// Show splash screen again (e.g., during logout)
import RNBootSplash from 'react-native-bootsplash';

const handleLogout = async () => {
  // Clear data
  await clearUserData();

  // Show splash screen
  await RNBootSplash.show();

  // Navigate to login
  navigation.navigate('Login');

  // Hide splash screen after navigation
  setTimeout(() => {
    RNBootSplash.hide({ fade: true });
  }, 500);
};
```

## Best Practices

1. **Timing**: Hide splash screen after app initialization
2. **Error Handling**: Always hide splash screen, even on errors
3. **Smooth Transition**: Use fade animation
4. **Native Implementation**: Prefer native splash screen over React component

## References

- [ADR-006: Chart Library Selection](../adr/ADR-006-chart-library-selection.md) - Chart library decision
- [ADR-007: Form Library Selection](../adr/ADR-007-form-library-selection.md) - Form library decision
- [ADR-008: Splash Screen Library Selection](../adr/ADR-008-splash-screen-library-selection.md) - Splash screen library decision
- [react-native-bootsplash Documentation](https://github.com/zoontek/react-native-bootsplash) - Bootsplash docs
- [react-native-bootsplash Lottie Example](https://github.com/zoontek/react-native-bootsplash-lottie-example) - Lottie animation integration example
