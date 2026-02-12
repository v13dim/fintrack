import React from 'react';
import { View } from 'react-native';

/**
 * Manual mock for @shopify/react-native-skia (native module, not runnable in Jest).
 * Used when testing components that depend on Skia (e.g. GradientBackground).
 */
export const Canvas = (props: Record<string, unknown>) =>
  React.createElement(View, { ...props, testID: 'skia-canvas' });
export const Rect = (props: Record<string, unknown>) =>
  React.createElement(View, { ...props, testID: 'skia-rect' });
export const LinearGradient = (props: Record<string, unknown>) =>
  React.createElement(View, { ...props, testID: 'skia-linear-gradient' });
export const vec = (x: number, y: number) => ({ x, y });
