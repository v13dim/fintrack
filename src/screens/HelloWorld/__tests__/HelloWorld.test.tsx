import '../__mocks__/HelloWorld.module-mocks';

import React from 'react';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { HelloWorld } from '../HelloWorld';

describe('HelloWorld', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display the hello world message', () => {
    renderWithTheme(<HelloWorld />);

    const textElement = screen.getByTestId('hello-world-text');
    expect(textElement).toBeTruthy();
  });

  it('should render the component structure', () => {
    renderWithTheme(<HelloWorld />);

    const textElement = screen.getByTestId('hello-world-text');
    expect(textElement).toBeTruthy();
  });

  it('should render without crashing', () => {
    expect(() => renderWithTheme(<HelloWorld />)).not.toThrow();
  });
});
