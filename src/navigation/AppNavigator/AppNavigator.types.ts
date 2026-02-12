/**
 * App stack: screens shown when user is authenticated.
 */
export enum AppStackScreens {
  Home = 'Home',
  Settings = 'Settings',
}

export type AppStackParamList = {
  [AppStackScreens.Home]: undefined;
  [AppStackScreens.Settings]: undefined;
};
