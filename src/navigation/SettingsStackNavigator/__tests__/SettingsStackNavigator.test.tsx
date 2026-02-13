import '../__mocks__/SettingsStackNavigator.module-mocks';

import React from 'react';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { SettingsStackNavigator } from '../SettingsStackNavigator';
import { SettingsStackScreens } from '../SettingsStackNavigator.types';

describe('SettingsStackNavigator', () => {
  it('should render stack navigator with header hidden', () => {
    renderWithTheme(<SettingsStackNavigator />);

    expect(screen.getByTestId('settings-stack-navigator')).toBeTruthy();
    expect(screen.getByTestId('settings-stack-navigator').props.screenOptions).toEqual({
      headerShown: false,
    });
  });

  it('should register Settings and PinChange screens', () => {
    renderWithTheme(<SettingsStackNavigator />);

    expect(screen.getByTestId(`screen-${SettingsStackScreens.Settings}`)).toBeTruthy();
    expect(screen.getByTestId(`screen-${SettingsStackScreens.PinChange}`)).toBeTruthy();
  });
});
