import { createElement, ElementType } from 'react';

/**
 * Creates a React element (e.g. `<View />`) for use in Jest mocks.
 *
 * Use this when defining mock components that must return a renderable element.
 * The result is a React element, not a component (function/class).
 *
 * @example Correct – mock component that returns an element
 * jest.mock('react-native', () => ({
 *   View: (props: Record<string, unknown>) =>
 *     mockCreateReactElement('View', props),
 * }));
 *
 * @example Correct – mock wrapper component
 * jest.mock('components/Layout', () => ({
 *   Layout: (props: { children?: unknown }) =>
 *     mockCreateReactElement('View', props),
 * }));
 *
 * @example Incorrect – do not assign the element directly to a JSX component
 * // BAD: GradientBackground is used as <GradientBackground />, so it must be a
 * // component (function), not an element. This causes "Element type is invalid".
 * jest.mock('components/common/GradientBackground', () => ({
 *   GradientBackground: (props: any) =>
 *     mockCreateReactElement('GradientBackground', { testID: 'gradient-background', ...props }),
 * }));
 *
 * @example Correct – mock used as JSX must be a component
 * jest.mock('components/GradientBackground', () => {
 *   const React = require('react');
 *   const { View } = require('react-native');
 *   return {
 *     GradientBackground: (props: { children?: unknown }) =>
 *       React.createElement(View, props),
 *   };
 * });
 *
 * @param component - Tag name (e.g. 'View', 'Text') or custom component string for test output.
 * @param props - Props object for the element.
 * @returns A React element (result of createElement).
 */
export const mockCreateReactElement = (component: string, props: Record<string, any> = {}) => {
  return createElement(component as ElementType, props);
};
