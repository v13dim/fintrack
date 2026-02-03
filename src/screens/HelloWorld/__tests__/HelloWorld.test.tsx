import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { HelloWorld } from '../HelloWorld';

// Import the mock to ensure it's loaded
// The mock replaces react-native's Text component with a mocked version
import '../__mocks__/HelloWorld.module-mocks';

describe('HelloWorld', () => {
  it('displays the hello world message', () => {
    render(<HelloWorld />);

    // The mock replaces Text with testID 'hello-world'
    const textElement = screen.getByTestId('hello-world-text');
    expect(textElement).toBeTruthy();
  });

  it('renders the component structure', () => {
    render(<HelloWorld />);

    // Verify the mocked Text component exists with testID
    const textElement = screen.getByTestId('hello-world-text');
    expect(textElement).toBeTruthy();
  });

  it('renders without crashing', () => {
    expect(() => render(<HelloWorld />)).not.toThrow();
  });
});
