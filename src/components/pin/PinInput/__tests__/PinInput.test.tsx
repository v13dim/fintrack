import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { PinInput } from '../PinInput';

describe('PinInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title and 4 dots', () => {
    renderWithTheme(
      <PinInput value='' onDigit={() => {}} onBackspace={() => {}} title='Enter PIN' />,
    );

    expect(screen.getByText('Enter PIN')).toBeTruthy();
    expect(screen.getByTestId('pin-input-dot-0')).toBeTruthy();
    expect(screen.getByTestId('pin-input-dot-3')).toBeTruthy();
  });

  it('should show filled dots based on value length', () => {
    renderWithTheme(
      <PinInput value='12' onDigit={() => {}} onBackspace={() => {}} title='Enter PIN' />,
    );

    const dots = [0, 1, 2, 3].map(i => screen.getByTestId(`pin-input-dot-${i}`));
    expect(dots[0]).toBeTruthy();
    expect(dots[1]).toBeTruthy();
  });

  it('should call onDigit when digit key pressed', () => {
    const onDigit = jest.fn();
    renderWithTheme(
      <PinInput value='' onDigit={onDigit} onBackspace={() => {}} title='Enter PIN' />,
    );

    fireEvent.press(screen.getByTestId('pin-input-key-5'));

    expect(onDigit).toHaveBeenCalledWith('5');
  });

  it('should call onBackspace when backspace pressed', () => {
    const onBackspace = jest.fn();
    renderWithTheme(
      <PinInput value='1' onDigit={() => {}} onBackspace={onBackspace} title='Enter PIN' />,
    );

    fireEvent.press(screen.getByTestId('pin-input-key-backspace'));

    expect(onBackspace).toHaveBeenCalled();
  });

  it('should show error message when provided', () => {
    renderWithTheme(
      <PinInput
        value=''
        onDigit={() => {}}
        onBackspace={() => {}}
        title='Enter PIN'
        errorMessage="PINs don't match"
      />,
    );

    expect(screen.getByText("PINs don't match")).toBeTruthy();
    expect(screen.getByTestId('pin-input-error')).toBeTruthy();
  });

  it('should not call onDigit when disabled', () => {
    const onDigit = jest.fn();
    renderWithTheme(
      <PinInput value='' onDigit={onDigit} onBackspace={() => {}} title='Enter PIN' disabled />,
    );

    fireEvent.press(screen.getByTestId('pin-input-key-1'));

    expect(onDigit).not.toHaveBeenCalled();
  });
});
