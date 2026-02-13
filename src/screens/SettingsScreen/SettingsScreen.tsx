import React, { FC } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { BottomSheet, Divider, GradientBackground, Text } from 'components/common';
import { HeaderAction, ScreenHeader } from 'components/navigation';

import { useTheme } from 'hooks/useTheme';

import { IconCheck } from 'assets/svg';

import { SectionHeader, SettingsCard, SettingsRow } from './components';
import type { ISettingsSecurityAction } from './hooks';
import { AUTO_LOCK_OPTIONS, useSettingsScreen } from './hooks';
import { useSettingsScreenStyles } from './SettingsScreen.styles';

export const SettingsScreen: FC = () => {
  const styles = useSettingsScreenStyles();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { autoLockSheetRef, autoLockInterval, securityActions, handleAutoLockSelect } =
    useSettingsScreen();

  return (
    <GradientBackground>
      <ScreenHeader center={<HeaderAction.Title>{t('settings.title')}</HeaderAction.Title>} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title={t('settings.security')} />
        <SettingsCard>
          {securityActions.map((action: ISettingsSecurityAction, index: number) => (
            <React.Fragment key={action.id}>
              {index > 0 ? <Divider /> : null}
              <SettingsRow
                title={action.title}
                subtitle={action.subtitle}
                right={action.right}
                onPress={action.onPress}
                testID={action.testID}
              />
            </React.Fragment>
          ))}
        </SettingsCard>
      </ScrollView>
      <BottomSheet ref={autoLockSheetRef} title={t('autoLock.title')} snapPoints={['40%']}>
        {AUTO_LOCK_OPTIONS.map(opt => (
          <Pressable
            key={opt.value}
            style={({ pressed }) => [
              styles.bottomSheetOption,
              autoLockInterval === opt.value && styles.bottomSheetOptionSelected,
              pressed && styles.bottomSheetOptionPressed,
            ]}
            onPress={() => handleAutoLockSelect(opt.value)}
            testID={`auto-lock-option-${opt.value}`}
          >
            <Text.Body color={autoLockInterval === opt.value ? 'accentGreenText' : 'accentDark'}>
              {t(opt.labelKey)}
            </Text.Body>
            {autoLockInterval === opt.value ? (
              <IconCheck size={22} color={colors.accent.green} testID='auto-lock-option-check' />
            ) : null}
          </Pressable>
        ))}
      </BottomSheet>
    </GradientBackground>
  );
};
