import React, { FC } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from 'components/common';

/**
 * Analytics tab placeholder screen.
 * Will be replaced by charts and summary in a later phase.
 */
export const AnalyticsScreen: FC = () => {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text.H3 color='accentDark'>Analytics</Text.H3>
      <Text.Body color='secondary' style={{ marginTop: 8, textAlign: 'center' }}>
        {t('analytics.placeholder', 'Charts and trends coming soon.')}
      </Text.Body>
    </View>
  );
};
