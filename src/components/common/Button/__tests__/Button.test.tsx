import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { Button } from '../Button';

describe('Button', () => {
  it('should render children', () => {
    renderWithTheme(<Button onPress={jest.fn()}>Label</Button>);
    expect(screen.getByText('Label')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    renderWithTheme(<Button onPress={onPress}>Press me</Button>);
    fireEvent.press(screen.getByText('Press me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should render with testID', () => {
    renderWithTheme(
      <Button onPress={jest.fn()} testID='submit-btn'>
        Submit
      </Button>,
    );
    expect(screen.getByTestId('submit-btn')).toBeTruthy();
  });

  it('should not call onPress when disabled', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <Button disabled onPress={onPress}>
        Disabled
      </Button>,
    );
    fireEvent.press(screen.getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should render compound Button.Primary', () => {
    renderWithTheme(<Button.Primary onPress={jest.fn()}>Primary</Button.Primary>);
    expect(screen.getByText('Primary')).toBeTruthy();
  });

  it('should render compound Button.Secondary', () => {
    renderWithTheme(<Button.Secondary onPress={jest.fn()}>Secondary</Button.Secondary>);
    expect(screen.getByText('Secondary')).toBeTruthy();
  });

  it('should render compound Button.Third', () => {
    renderWithTheme(<Button.Third onPress={jest.fn()}>Third</Button.Third>);
    expect(screen.getByText('Third')).toBeTruthy();
  });

  it('should render compound Button.Ghost', () => {
    renderWithTheme(<Button.Ghost onPress={jest.fn()}>Ghost</Button.Ghost>);
    expect(screen.getByText('Ghost')).toBeTruthy();
  });

  it('should render compound Button.Danger', () => {
    renderWithTheme(<Button.Danger onPress={jest.fn()}>Danger</Button.Danger>);
    expect(screen.getByText('Danger')).toBeTruthy();
  });
});
