import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { Switch } from '../Switch';

describe('Switch', () => {
  it('renders with testID', () => {
    renderWithTheme(<Switch value={false} onValueChange={jest.fn()} />);
    expect(screen.getByTestId('switch')).toBeTruthy();
  });

  it('calls onValueChange with true when pressed and value is false', () => {
    const onValueChange = jest.fn();
    renderWithTheme(<Switch value={false} onValueChange={onValueChange} />);
    fireEvent.press(screen.getByTestId('switch'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('calls onValueChange with false when pressed and value is true', () => {
    const onValueChange = jest.fn();
    renderWithTheme(<Switch value={true} onValueChange={onValueChange} />);
    fireEvent.press(screen.getByTestId('switch'));
    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it('does not call onValueChange when disabled', () => {
    const onValueChange = jest.fn();
    renderWithTheme(<Switch value={false} onValueChange={onValueChange} disabled />);
    fireEvent.press(screen.getByTestId('switch'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
