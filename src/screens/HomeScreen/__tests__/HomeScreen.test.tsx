import { mockGetParent, mockNavigate } from '../__mocks__/HomeScreen.module-mocks';

import React from 'react';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { HomeScreen } from '../HomeScreen';

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetParent.mockImplementation(() => ({ navigate: mockNavigate }));
  });

  it('should render home content', () => {
    renderWithTheme(<HomeScreen />);

    expect(screen.getByTestId('home-screen-text')).toBeTruthy();
    expect(screen.getByText('Hello world!')).toBeTruthy();
  });
});
