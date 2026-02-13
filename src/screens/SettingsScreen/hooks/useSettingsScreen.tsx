import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AutoLockInterval } from 'services';

import type { SettingsStackParamList } from 'navigation/SettingsStackNavigator/SettingsStackNavigator.types';
import { SettingsStackScreens } from 'navigation/SettingsStackNavigator/SettingsStackNavigator.types';

import { type BottomSheetRef, Switch } from 'components/common';

import { AutoLockStorageService, BiometricAuthService } from 'services';

import { IconRightArrow } from 'assets/svg';

export interface ISettingsSecurityAction {
  id: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onPress?: () => void;
  testID: string;
}

export const AUTO_LOCK_OPTIONS: { value: AutoLockInterval; labelKey: string }[] = [
  { value: '30', labelKey: 'autoLock.options.30sec' },
  { value: '60', labelKey: 'autoLock.options.1min' },
  { value: '300', labelKey: 'autoLock.options.5min' },
  { value: 'never', labelKey: 'autoLock.options.never' },
];

export function getAutoLockLabelKey(value: AutoLockInterval): string {
  const opt = AUTO_LOCK_OPTIONS.find(o => o.value === value);
  return opt?.labelKey ?? 'autoLock.options.1min';
}

export function useSettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<SettingsStackParamList>>();
  const autoLockSheetRef = useRef<BottomSheetRef>(null);
  const [autoLockInterval, setAutoLockInterval] = useState<AutoLockInterval>('60');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const loadAutoLock = useCallback(async () => {
    const value = await AutoLockStorageService.getAutoLockInterval();
    setAutoLockInterval(value);
  }, []);

  const loadBiometric = useCallback(async () => {
    const [available, enabled] = await Promise.all([
      BiometricAuthService.isBiometricAvailable(),
      BiometricAuthService.isBiometricEnabled(),
    ]);
    setBiometricAvailable(available);
    setBiometricEnabled(enabled);
  }, []);

  useEffect(() => {
    loadAutoLock();
    loadBiometric();
  }, [loadAutoLock, loadBiometric]);

  const handleAutoLockPress = useCallback(() => {
    autoLockSheetRef.current?.present();
  }, []);

  const handleAutoLockSelect = useCallback(async (value: AutoLockInterval) => {
    setAutoLockInterval(value);
    await AutoLockStorageService.setAutoLockInterval(value);
    autoLockSheetRef.current?.dismiss();
  }, []);

  const handleChangePinPress = useCallback(() => {
    navigation.navigate(SettingsStackScreens.PinChange);
  }, [navigation]);

  const handleBiometricChange = useCallback(
    async (value: boolean) => {
      try {
        if (value) {
          const permitted = await BiometricAuthService.requestBiometricPermission();
          if (!permitted) {
            Alert.alert(t('common.error'), t('biometric.unavailable'));
            return;
          }
          await BiometricAuthService.enableBiometric();
          setBiometricEnabled(true);
        } else {
          await BiometricAuthService.disableBiometric();
          setBiometricEnabled(false);
        }
      } catch {
        Alert.alert(t('common.error'), t('biometric.failed'));
      }
    },
    [t],
  );

  const securityActions = useMemo<ISettingsSecurityAction[]>(
    () => [
      {
        id: 'biometric',
        title: t('biometric.enable'),
        subtitle: !biometricAvailable ? t('biometric.unavailable') : undefined,
        right: (
          <Switch
            value={biometricEnabled}
            onValueChange={handleBiometricChange}
            disabled={!biometricAvailable}
          />
        ),
        testID: 'settings-row-biometric',
      },
      {
        id: 'changePin',
        title: t('settings.changePin'),
        right: <IconRightArrow />,
        onPress: handleChangePinPress,
        testID: 'settings-row-change-pin',
      },
      {
        id: 'autoLock',
        title: t('autoLock.title'),
        subtitle: t(getAutoLockLabelKey(autoLockInterval)),
        onPress: handleAutoLockPress,
        testID: 'settings-row-auto-lock',
      },
    ],
    [
      t,
      biometricAvailable,
      biometricEnabled,
      autoLockInterval,
      handleBiometricChange,
      handleChangePinPress,
      handleAutoLockPress,
    ],
  );

  return {
    autoLockSheetRef,
    autoLockInterval,
    securityActions,
    handleAutoLockSelect,
    handleBiometricChange,
  };
}
