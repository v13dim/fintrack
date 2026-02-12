import React from 'react';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { AppSuspenseFallback } from '../AppSuspenseFallback';

describe('AppSuspenseFallback', () => {
  it('should render loading text', () => {
    renderWithTheme(<AppSuspenseFallback />);

    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('should render without crashing', () => {
    expect(() => renderWithTheme(<AppSuspenseFallback />)).not.toThrow();
  });
});
