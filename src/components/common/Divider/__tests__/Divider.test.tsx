import React from 'react';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { Divider } from '../Divider';

describe('Divider', () => {
  it('renders with testID', () => {
    renderWithTheme(<Divider />);
    expect(screen.getByTestId('divider')).toBeTruthy();
  });
});
