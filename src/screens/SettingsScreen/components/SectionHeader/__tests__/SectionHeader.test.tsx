import React from 'react';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { SectionHeader } from '../SectionHeader';

describe('SectionHeader', () => {
  it('renders title', () => {
    renderWithTheme(<SectionHeader title='Security' />);
    expect(screen.getByText('Security')).toBeTruthy();
  });
});
