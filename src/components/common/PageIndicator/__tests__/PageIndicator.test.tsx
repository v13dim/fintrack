import React from 'react';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { PageIndicator } from '../PageIndicator';

describe('PageIndicator', () => {
  it('should render as many dots as totalCount', () => {
    renderWithTheme(<PageIndicator currentIndex={0} totalCount={3} testID='indicator' />);

    expect(screen.getByTestId('indicator-container')).toBeTruthy();
    expect(screen.getByTestId('indicator-active')).toBeTruthy();
    expect(screen.getAllByTestId('indicator')).toHaveLength(2);
  });

  it('should mark current index as active', () => {
    renderWithTheme(<PageIndicator currentIndex={1} totalCount={3} testID='step' />);

    expect(screen.getByTestId('step-active')).toBeTruthy();
  });
});
