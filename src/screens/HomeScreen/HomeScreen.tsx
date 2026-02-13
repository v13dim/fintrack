import React, { FC } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { HelloWorld } from 'screens/HelloWorld';

import { type AppStackParamList, AppStackScreens } from 'navigation';

import { Text } from 'components/common';

/**
 * Main app home screen after authentication.
 * Currently wraps HelloWorld; will be replaced by transaction list and FAB in Phase 2.
 */
export const HomeScreen: FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AppStackParamList, AppStackScreens.Home>>();

  return (
    <View style={{ flex: 1 }}>
      <HelloWorld />
      <Pressable
        onPress={() => navigation.navigate(AppStackScreens.Settings)}
        style={{ padding: 16, alignSelf: 'flex-start' }}
        testID='home-settings-button'
      >
        <Text.Body color='accentGreenText'>{t('settings.title')}</Text.Body>
      </Pressable>
    </View>
  );
};
