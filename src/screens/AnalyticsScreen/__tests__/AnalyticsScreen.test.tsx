import React from 'react';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { AnalyticsScreen } from '../AnalyticsScreen';

describe('AnalyticsScreen', () => {
  it('renders Analytics title', () => {
    renderWithTheme(<AnalyticsScreen />);
    expect(screen.getByText('Analytics')).toBeTruthy();
  });
});
