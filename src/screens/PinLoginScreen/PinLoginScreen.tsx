import React, { FC } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FullScreenLoader, GradientBackground, PinInput } from 'components';

import { usePinLogin } from 'hooks';

import { usePinLoginScreenStyles } from './PinLoginScreen.styles';

export const PinLoginScreen: FC = () => {
  const styles = usePinLoginScreenStyles();
  const { t } = useTranslation();
  const pin = usePinLogin();

  const showLoader = pin.isCheckingBiometric || pin.isLoading;
  const loaderMessage = pin.isCheckingBiometric ? t('pin.login.biometricPrompt') : t('pin.loading');

  return (
    <GradientBackground>
      <View style={styles.container}>
        <PinInput
          testID='pin-login-input'
          value={pin.value}
          onDigit={pin.handleDigit}
          onBackspace={pin.handleBackspace}
          onBiometricPress={pin.biometricKeyTappable ? pin.handleBiometricPress : undefined}
          disabled={pin.disabled}
          title={pin.title}
          subtitle={pin.subtitle}
          errorMessage={pin.errorMessage}
          showBiometricPlaceholder={pin.showBiometricKey}
        />
      </View>
      {showLoader ? <FullScreenLoader message={loaderMessage} testID='pin-login-loader' /> : null}
    </GradientBackground>
  );
};
