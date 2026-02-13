import '../__mocks__/AnalyticsStackNavigator.module-mocks';

import React from 'react';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { AnalyticsStackNavigator } from '../AnalyticsStackNavigator';

describe('AnalyticsStackNavigator', () => {
  it('should render stack navigator with header hidden', () => {
    renderWithTheme(<AnalyticsStackNavigator />);

    expect(screen.getByTestId('analytics-stack-navigator')).toBeTruthy();
    expect(screen.getByTestId('analytics-stack-navigator').props.screenOptions).toEqual({
      headerShown: false,
    });
  });

  it('should register Analytics screen', () => {
    renderWithTheme(<AnalyticsStackNavigator />);

    expect(screen.getByTestId('screen-Analytics')).toBeTruthy();
  });
});
