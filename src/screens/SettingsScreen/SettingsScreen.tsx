import React, { FC, useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { AutoLockInterval } from 'services';

import { GradientBackground, Text } from 'components';

import { AutoLockStorageService } from 'services';

import { useSettingsScreenStyles } from './SettingsScreen.styles';

const AUTO_LOCK_OPTIONS: { value: AutoLockInterval; labelKey: string }[] = [
  { value: '30', labelKey: 'autoLock.options.30sec' },
  { value: '60', labelKey: 'autoLock.options.1min' },
  { value: '300', labelKey: 'autoLock.options.5min' },
  { value: 'never', labelKey: 'autoLock.options.never' },
];

export const SettingsScreen: FC = () => {
  const styles = useSettingsScreenStyles();
  const { t } = useTranslation();
  const [selectedInterval, setSelectedInterval] = useState<AutoLockInterval>('60');

  const loadInterval = useCallback(async () => {
    const value = await AutoLockStorageService.getAutoLockInterval();
    setSelectedInterval(value);
  }, []);

  useEffect(() => {
    loadInterval();
  }, [loadInterval]);

  const handleSelect = useCallback(async (value: AutoLockInterval) => {
    setSelectedInterval(value);
    await AutoLockStorageService.setAutoLockInterval(value);
  }, []);

  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.container}>
        <Text.H3 color='accentDark' style={styles.title}>
          {t('settings.title')}
        </Text.H3>
        <Text.Body color='secondary' style={styles.sectionHeader}>
          {t('settings.security')}
        </Text.Body>
        <Text.Body color='secondary' style={styles.sectionHeader}>
          {t('autoLock.title')}
        </Text.Body>
        {AUTO_LOCK_OPTIONS.map(opt => (
          <Pressable
            key={opt.value}
            style={({ pressed }) => [styles.row, styles.rowTouchable, pressed && { opacity: 0.7 }]}
            onPress={() => handleSelect(opt.value)}
            testID={`settings-auto-lock-${opt.value}`}
          >
            <Text.Body color='accentDark'>{t(opt.labelKey)}</Text.Body>
            {selectedInterval === opt.value ? (
              <Text.BodySmall color='accentGreenText'>✓</Text.BodySmall>
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
    </GradientBackground>
  );
};
