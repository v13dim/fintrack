import React from 'react';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { Text } from '../Text';

describe('Text', () => {
  it('should render children', () => {
    renderWithTheme(<Text>Hello</Text>);
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('should render with testID', () => {
    renderWithTheme(<Text testID='heading'>Title</Text>);
    expect(screen.getByTestId('heading')).toBeTruthy();
  });

  it('should render with variant and color via compound component', () => {
    renderWithTheme(<Text.H2 color='primary'>Heading</Text.H2>);
    expect(screen.getByText('Heading')).toBeTruthy();
  });

  it('should render compound Text.H2', () => {
    renderWithTheme(<Text.H2 color='primary'>Compound heading</Text.H2>);
    expect(screen.getByText('Compound heading')).toBeTruthy();
  });

  it('should render compound Text.H1', () => {
    renderWithTheme(<Text.H1>H1</Text.H1>);
    expect(screen.getByText('H1')).toBeTruthy();
  });

  it('should render compound Text.H3', () => {
    renderWithTheme(<Text.H3>H3</Text.H3>);
    expect(screen.getByText('H3')).toBeTruthy();
  });

  it('should render compound Text.H4', () => {
    renderWithTheme(<Text.H4>H4</Text.H4>);
    expect(screen.getByText('H4')).toBeTruthy();
  });

  it('should render compound Text.Body', () => {
    renderWithTheme(<Text.Body>Body</Text.Body>);
    expect(screen.getByText('Body')).toBeTruthy();
  });

  it('should render compound Text.BodySmall', () => {
    renderWithTheme(<Text.BodySmall>BodySmall</Text.BodySmall>);
    expect(screen.getByText('BodySmall')).toBeTruthy();
  });

  it('should render compound Text.Caption', () => {
    renderWithTheme(<Text.Caption>Caption</Text.Caption>);
    expect(screen.getByText('Caption')).toBeTruthy();
  });

  it('should render compound Text.Label', () => {
    renderWithTheme(<Text.Label>Label</Text.Label>);
    expect(screen.getByText('Label')).toBeTruthy();
  });

  it('should render compound Text.Button', () => {
    renderWithTheme(<Text.Button>Button</Text.Button>);
    expect(screen.getByText('Button')).toBeTruthy();
  });

  it('should apply color secondary', () => {
    renderWithTheme(<Text color='secondary'>Secondary</Text>);
    expect(screen.getByText('Secondary')).toBeTruthy();
  });

  it('should apply color error', () => {
    renderWithTheme(<Text color='error'>Error</Text>);
    expect(screen.getByText('Error')).toBeTruthy();
  });

  it('should apply color tertiary', () => {
    renderWithTheme(<Text color='tertiary'>Tertiary</Text>);
    expect(screen.getByText('Tertiary')).toBeTruthy();
  });

  it('should apply color accentDark', () => {
    renderWithTheme(<Text color='accentDark'>AccentDark</Text>);
    expect(screen.getByText('AccentDark')).toBeTruthy();
  });

  it('should apply color accentMedium', () => {
    renderWithTheme(<Text color='accentMedium'>AccentMedium</Text>);
    expect(screen.getByText('AccentMedium')).toBeTruthy();
  });

  it('should apply color accentGreenText', () => {
    renderWithTheme(<Text color='accentGreenText'>Green</Text>);
    expect(screen.getByText('Green')).toBeTruthy();
  });

  it('should apply color white', () => {
    renderWithTheme(<Text color='white'>White</Text>);
    expect(screen.getByText('White')).toBeTruthy();
  });

  it('should apply color inverse', () => {
    renderWithTheme(<Text color='inverse'>Inverse</Text>);
    expect(screen.getByText('Inverse')).toBeTruthy();
  });

  it('should apply center alignment when center is true', () => {
    renderWithTheme(<Text center>Centered</Text>);
    expect(screen.getByText('Centered')).toBeTruthy();
  });

  it('should use primary color when color is unknown (default branch)', () => {
    renderWithTheme(<Text color={'unknown' as 'primary'}>Default</Text>);
    expect(screen.getByText('Default')).toBeTruthy();
  });
});
