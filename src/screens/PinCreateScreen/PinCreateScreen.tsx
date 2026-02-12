import React, { FC } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FullScreenLoader, GradientBackground, PinInput } from 'components';

import { usePinCreate } from 'hooks';

import { usePinCreateScreenStyles } from './PinCreateScreen.styles';

export const PinCreateScreen: FC = () => {
  const styles = usePinCreateScreenStyles();
  const { t } = useTranslation();
  const pin = usePinCreate();

  return (
    <GradientBackground>
      <View style={styles.container}>
        <PinInput
          testID='pin-create-input'
          value={pin.value}
          onDigit={pin.handleDigit}
          onBackspace={pin.handleBackspace}
          title={pin.title}
          subtitle={pin.subtitle}
          errorMessage={pin.errorMessage}
        />
      </View>
      {pin.isLoading ? (
        <FullScreenLoader message={t('pin.loading')} testID='pin-create-loader' />
      ) : null}
    </GradientBackground>
  );
};
