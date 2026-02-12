import { mockSignIn } from '../__mocks__/PinCreateScreen.module-mocks';

import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { PinAuthService } from 'services';

import { renderWithTheme } from 'testUtils';

import { PinCreateScreen } from '../PinCreateScreen';

describe('PinCreateScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (PinAuthService.createPin as jest.Mock).mockResolvedValue(undefined);
  });

  it('should render create title and PIN input', () => {
    renderWithTheme(<PinCreateScreen />);

    expect(screen.getByText('pin.create.title')).toBeTruthy();
    expect(screen.getByTestId('pin-create-input')).toBeTruthy();
  });

  it('should go to repeat step after entering 4 digits', () => {
    renderWithTheme(<PinCreateScreen />);

    fireEvent.press(screen.getByTestId('pin-create-input-key-1'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-2'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-3'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-4'));

    expect(screen.getByText('pin.create.repeatPrompt')).toBeTruthy();
  });

  it('should show mismatch error when repeat does not match', () => {
    renderWithTheme(<PinCreateScreen />);

    fireEvent.press(screen.getByTestId('pin-create-input-key-1'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-2'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-3'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-4'));

    fireEvent.press(screen.getByTestId('pin-create-input-key-5'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-5'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-5'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-5'));

    expect(screen.getByText('pin.create.mismatch')).toBeTruthy();
    expect(PinAuthService.createPin).not.toHaveBeenCalled();
  });

  it('should call createPin and navigate to Home when PINs match', async () => {
    renderWithTheme(<PinCreateScreen />);

    fireEvent.press(screen.getByTestId('pin-create-input-key-1'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-2'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-3'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-4'));

    fireEvent.press(screen.getByTestId('pin-create-input-key-1'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-2'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-3'));
    fireEvent.press(screen.getByTestId('pin-create-input-key-4'));

    await waitFor(() => {
      expect(PinAuthService.createPin).toHaveBeenCalledWith('1234');
      expect(mockSignIn).toHaveBeenCalledTimes(1);
    });
  });
});
