import React, { FC, useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';

import { type AuthStackParamList, AuthStackScreens } from 'navigation';

import { Button, GradientBackground, PageIndicator, Text } from 'components';

import { OnboardingStorageService } from 'services';

import { useOnboardingScreenStyles } from './OnboardingScreen.styles';

type NavigationProp = StackNavigationProp<AuthStackParamList, AuthStackScreens.Onboarding>;

const ONBOARDING_STEPS = 3;
const SLIDE_DURATION_MS = 250;

const STEP_ICONS = ['📊📈', '🎯💵', '🔒📱'];

const titles = ['onboarding.screen1.title', 'onboarding.screen2.title', 'onboarding.screen3.title'];
const descriptions = [
  'onboarding.screen1.description',
  'onboarding.screen2.description',
  'onboarding.screen3.description',
];

export const OnboardingScreen: FC = () => {
  const styles = useOnboardingScreenStyles();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [step, setStep] = useState(0);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const { width: screenWidth } = Dimensions.get('window');

  useEffect(() => {
    console.warn('[Auth] OnboardingScreen mounted');
  }, []);

  useEffect(() => {
    console.warn('[Auth] OnboardingScreen step', step + 1, '/', ONBOARDING_STEPS);
  }, [step]);

  const goToPinCreate = async () => {
    console.warn('[Auth] Onboarding goToPinCreate (skip or getStarted)');
    try {
      await OnboardingStorageService.setOnboardingCompleted(true);
      console.warn('[Auth] Onboarding completed, navigating to PinCreate');
    } finally {
      navigation.replace(AuthStackScreens.PinCreate);
    }
  };

  const handleNext = () => {
    if (step < ONBOARDING_STEPS - 1) {
      setStep(step + 1);
    } else {
      goToPinCreate();
    }
  };

  // Slider-like transition (Reanimated): fade + slide when step changes
  useEffect(() => {
    opacity.value = 0;
    translateX.value = step * screenWidth * 0.15;
    opacity.value = withTiming(1, { duration: SLIDE_DURATION_MS });
    translateX.value = withTiming(0, { duration: SLIDE_DURATION_MS });
  }, [step, screenWidth, opacity, translateX]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.main}>
          <Animated.View style={[styles.textBlock, animatedContentStyle]}>
            <View style={styles.iconBox}>
              <Text style={styles.iconEmoji}>{STEP_ICONS[step]}</Text>
            </View>
            <Text.H2 style={styles.title}>{t(titles[step])}</Text.H2>
            <Text.Body style={styles.subtitle}>{t(descriptions[step])}</Text.Body>
          </Animated.View>
          <View>
            <PageIndicator currentIndex={step} totalCount={ONBOARDING_STEPS} testID='page-dot' />
          </View>
        </View>

        <View style={styles.buttons}>
          {step < ONBOARDING_STEPS - 1 ? (
            <>
              <Button.Primary fullWidth onPress={handleNext} testID='onboarding-next'>
                {t('onboarding.next')}
              </Button.Primary>
              <Button.Ghost fullWidth onPress={goToPinCreate} testID='onboarding-skip'>
                {t('onboarding.skip')}
              </Button.Ghost>
            </>
          ) : (
            <>
              <Button.Primary fullWidth onPress={handleNext} testID='onboarding-get-started'>
                {t('onboarding.getStarted')}
              </Button.Primary>
              <View style={styles.btnPlaceholder} />
            </>
          )}
        </View>
      </View>
    </GradientBackground>
  );
};
