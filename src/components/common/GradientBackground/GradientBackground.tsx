import React, { FC, ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';

import { useTheme } from 'hooks/useTheme';

import { useGradientBackgroundStyles } from './GradientBackground.styles';

interface IGradientBackgroundProps {
  children?: ReactNode;
}

/**
 * Full-screen gradient background (green-bg → medium-bg → light-bg).
 * Use for Onboarding and PIN screens to match wireframes.
 */
export const GradientBackground: FC<IGradientBackgroundProps> = ({ children }) => {
  const styles = useGradientBackgroundStyles();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, height)}
            colors={[colors.accent.greenBg, colors.accent.mediumBg, colors.accent.lightBg]}
            positions={[0, 0.5, 1]}
          />
        </Rect>
      </Canvas>
      {children ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
};
