/**
 * Auth stack: screens shown when user is not authenticated.
 */
export enum AuthStackScreens {
  Onboarding = 'Onboarding',
  PinCreate = 'PinCreate',
  PinLogin = 'PinLogin',
}

export type AuthStackParamList = {
  [AuthStackScreens.Onboarding]: undefined;
  [AuthStackScreens.PinCreate]: undefined;
  [AuthStackScreens.PinLogin]: undefined;
};
