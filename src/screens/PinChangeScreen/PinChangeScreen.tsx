import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTabBarVisibility } from 'contexts';

import { FullScreenLoader, GradientBackground, PinInput } from 'components';
import { HeaderAction, ScreenHeader } from 'components/navigation';

import { usePinChange } from 'hooks';

import { usePinChangeScreenStyles } from './PinChangeScreen.styles';

export const PinChangeScreen: FC = () => {
  const styles = usePinChangeScreenStyles();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setTabBarHidden } = useTabBarVisibility();
  const pin = usePinChange();

  useEffect(() => {
    setTabBarHidden(true);
    return () => setTabBarHidden(false);
  }, [setTabBarHidden]);

  return (
    <GradientBackground>
      <ScreenHeader
        left={<HeaderAction.Back onPress={() => navigation.goBack()} />}
        center={<HeaderAction.Title>{pin.title}</HeaderAction.Title>}
      />
      <View style={styles.container}>
        <PinInput
          testID='pin-change-input'
          value={pin.value}
          onDigit={pin.handleDigit}
          onBackspace={pin.handleBackspace}
          subtitle={pin.subtitle}
          errorMessage={pin.errorMessage}
        />
      </View>
      {pin.isLoading ? (
        <FullScreenLoader message={t('pin.loading')} testID='pin-change-loader' />
      ) : null}
    </GradientBackground>
  );
};
