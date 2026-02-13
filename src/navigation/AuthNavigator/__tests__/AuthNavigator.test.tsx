import '../__mocks__/AuthNavigator.module-mocks';

import React from 'react';
import { screen } from '@testing-library/react-native';

import { getAuthInitialRoute } from 'utils';

import { renderWithTheme } from 'testUtils';

import { AuthNavigator } from '../AuthNavigator';
import { AuthStackScreens } from '../AuthNavigator.types';

describe('AuthNavigator', () => {
  beforeEach(() => {
    jest.mocked(getAuthInitialRoute).mockReturnValue(AuthStackScreens.PinLogin);
  });

  it('should render stack navigator', () => {
    renderWithTheme(<AuthNavigator isFirstLaunch={false} hasPin={true} />);

    expect(screen.getByTestId('auth-stack-navigator')).toBeTruthy();
  });

  it('should call getAuthInitialRoute with isFirstLaunch and hasPin', () => {
    renderWithTheme(<AuthNavigator isFirstLaunch={true} hasPin={false} />);

    expect(getAuthInitialRoute).toHaveBeenCalledWith(true, false);
  });

  it('should set initialRouteName from getAuthInitialRoute', () => {
    jest.mocked(getAuthInitialRoute).mockReturnValue(AuthStackScreens.Onboarding);

    renderWithTheme(<AuthNavigator isFirstLaunch={true} hasPin={false} />);

    expect(screen.getByTestId('auth-stack-navigator').props.initialRouteName).toBe(
      AuthStackScreens.Onboarding,
    );
  });

  it('should show PinLogin as initial route when not first launch and has pin', () => {
    jest.mocked(getAuthInitialRoute).mockReturnValue(AuthStackScreens.PinLogin);

    renderWithTheme(<AuthNavigator isFirstLaunch={false} hasPin={true} />);

    expect(screen.getByTestId('auth-stack-navigator').props.initialRouteName).toBe(
      AuthStackScreens.PinLogin,
    );
  });

  it('should show PinCreate as initial route when not first launch and no pin', () => {
    jest.mocked(getAuthInitialRoute).mockReturnValue(AuthStackScreens.PinCreate);

    renderWithTheme(<AuthNavigator isFirstLaunch={false} hasPin={false} />);

    expect(screen.getByTestId('auth-stack-navigator').props.initialRouteName).toBe(
      AuthStackScreens.PinCreate,
    );
  });

  it('should register Onboarding, PinCreate and PinLogin screens', () => {
    renderWithTheme(<AuthNavigator isFirstLaunch={false} hasPin={true} />);

    expect(screen.getByTestId(`screen-${AuthStackScreens.Onboarding}`)).toBeTruthy();
    expect(screen.getByTestId(`screen-${AuthStackScreens.PinCreate}`)).toBeTruthy();
    expect(screen.getByTestId(`screen-${AuthStackScreens.PinLogin}`)).toBeTruthy();
  });
});
