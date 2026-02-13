import '../__mocks__/HomeStackNavigator.module-mocks';

import React from 'react';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { HomeStackNavigator } from '../HomeStackNavigator';

describe('HomeStackNavigator', () => {
  it('should render stack navigator with header hidden', () => {
    renderWithTheme(<HomeStackNavigator />);

    expect(screen.getByTestId('home-stack-navigator')).toBeTruthy();
    expect(screen.getByTestId('home-stack-navigator').props.screenOptions).toEqual({
      headerShown: false,
    });
  });

  it('should register Home screen', () => {
    renderWithTheme(<HomeStackNavigator />);

    expect(screen.getByTestId('screen-Home')).toBeTruthy();
  });
});
