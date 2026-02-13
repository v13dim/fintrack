import React from 'react';
import { View } from 'react-native';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { SettingsCard } from '../SettingsCard';

describe('SettingsCard', () => {
  it('renders card and children', () => {
    renderWithTheme(
      <SettingsCard>
        <View testID='card-content' />
      </SettingsCard>,
    );
    expect(screen.getByTestId('settings-card')).toBeTruthy();
    expect(screen.getByTestId('card-content')).toBeTruthy();
  });
});
